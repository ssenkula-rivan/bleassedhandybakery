const axios = require('axios');
const logger = require('../utils/logger');
const ERROR_CODES = require('../config/errorCodes');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
    this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS) || 500;
    this.temperature = parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7;
    this.timeout = parseInt(process.env.AI_TIMEOUT_MS) || 10000;
    this.maxRetries = parseInt(process.env.MAX_RETRIES) || 2;
    
    // Bakery knowledge base
    this.bakeryKnowledge = this.loadBakeryKnowledge();
  }

  loadBakeryKnowledge() {
    return {
      products: {
        'cupcakes': { price: '3,000-5,000', time: 'same day', description: 'Delicious mini cakes' },
        'queen cakes': { price: '2,500-4,000', time: 'same day', description: 'Classic queen cakes' },
        'sponge cake': { price: '25,000-80,000', time: '2-3 days', description: 'Light and fluffy' },
        'birthday cake': { price: '50,000-500,000', time: '3-5 days', description: 'Custom birthday designs' },
        'wedding cake': { price: '150,000-500,000', time: '7-14 days', description: 'Elegant multi-tier' },
        'custom cake': { price: '50,000-200,000', time: '5-7 days', description: 'Your unique design' }
      },
      services: {
        delivery: { areas: 'Kampala and surrounding', cost: '7,000-30,000', time: 'Same day before 10AM' },
        pickup: { location: 'Kampala city center', cost: 'Free', hours: 'Mon-Sat 6AM-8PM, Sun 7AM-6PM' },
        wholesale: { minimum: '20 pieces', discount: '15-25%', time: '3-5 days' }
      },
      contact: {
        phone: process.env.BAKERY_PHONE || '+256761903887',
        location: process.env.BAKERY_LOCATION || 'Kampala, Uganda',
        website: process.env.BAKERY_WEBSITE
      }
    };
  }

  // Main method to generate AI response with retry logic
  async generateResponse(userMessage, conversationHistory = [], userProfile = {}) {
    let lastError = null;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        logger.info(`AI attempt ${attempt + 1}/${this.maxRetries + 1} for message: ${userMessage.substring(0, 50)}...`);
        
        // Try instant responses first (no API call)
        const instantResponse = this.getInstantResponse(userMessage);
        if (instantResponse) {
          return { response: instantResponse, source: 'instant' };
        }
        
        // Try bakery knowledge (no API call)
        const knowledgeResponse = this.getKnowledgeResponse(userMessage);
        if (knowledgeResponse) {
          return { response: knowledgeResponse, source: 'knowledge' };
        }
        
        // Call OpenAI with timeout
        const aiResponse = await this.callOpenAIWithTimeout(userMessage, conversationHistory, userProfile);
        return { response: aiResponse, source: 'openai' };
        
      } catch (error) {
        lastError = error;
        logger.warn(`AI attempt ${attempt + 1} failed:`, error.message);
        
        // Don't retry on quota exceeded
        if (error.code === 'insufficient_quota') {
          throw ERROR_CODES.AI_QUOTA_EXCEEDED;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < this.maxRetries) {
          await this.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }
    
    // All retries failed - return fallback
    logger.error('All AI attempts failed:', lastError);
    return { response: this.getFallbackResponse(userMessage), source: 'fallback' };
  }

  // Instant responses for common messages (0ms response time)
  getInstantResponse(message) {
    const lower = message.toLowerCase().trim();
    const instant = {
      'hi': 'Hey! What can I help you with?',
      'hello': 'Hi there! How can I help?',
      'hey': 'Hey! What\'s up?',
      'thanks': 'You\'re welcome! Anything else?',
      'thank you': 'Happy to help! Need anything else?',
      'ok': 'Cool! What else can I do for you?',
      'yes': 'Awesome! What would you like to know?',
      'no': 'No worries! Let me know if you need anything.',
      'bye': 'See you later! Come back anytime!',
      'goodbye': 'Bye! Have a great day!'
    };
    return instant[lower] || null;
  }

  // Knowledge-based responses (instant, no API call)
  getKnowledgeResponse(message) {
    const lower = message.toLowerCase();
    
    // Check for products
    for (const [product, info] of Object.entries(this.bakeryKnowledge.products)) {
      if (lower.includes(product)) {
        return `${product.charAt(0).toUpperCase() + product.slice(1)}! We've got those. They're ${info.description}, priced at UGX ${info.price}, and take about ${info.time} to prepare. Want to order?`;
      }
    }
    
    // Check for pricing questions
    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
      return `Our prices vary! Cupcakes are UGX 3,000-5,000, Queen Cakes UGX 2,500-4,000, Custom Cakes UGX 50,000-200,000, Wedding Cakes UGX 150,000-500,000. What are you interested in?`;
    }
    
    // Check for delivery
    if (lower.includes('deliver')) {
      const delivery = this.bakeryKnowledge.services.delivery;
      return `Yeah, we deliver! We cover ${delivery.areas}, costs UGX ${delivery.cost} depending on location. ${delivery.time} for same-day delivery. Where do you need it?`;
    }
    
    // Check for contact
    if (lower.includes('contact') || lower.includes('phone') || lower.includes('call')) {
      return `You can reach us at ${this.bakeryKnowledge.contact.phone}. We're in ${this.bakeryKnowledge.contact.location}. What do you need help with?`;
    }
    
    return null;
  }

  // Call OpenAI with timeout wrapper
  async callOpenAIWithTimeout(userMessage, conversationHistory, userProfile) {
    return Promise.race([
      this.callOpenAI(userMessage, conversationHistory, userProfile),
      this.timeoutPromise(this.timeout)
    ]);
  }

  // Actual OpenAI API call
  async callOpenAI(userMessage, conversationHistory, userProfile) {
    const systemPrompt = this.buildSystemPrompt(userProfile);
    const messages = this.buildMessages(systemPrompt, conversationHistory, userMessage);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.model,
        messages: messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: this.timeout
      }
    );

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('Invalid AI response structure');
    }

    return response.data.choices[0].message.content.trim();
  }

  // Build system prompt with personality and knowledge
  buildSystemPrompt(userProfile) {
    return `You're Rivan, working at Blessed Handly Bakery in Uganda. You're a real person - friendly, helpful, and great at your job.

**YOUR PERSONALITY:**
- Talk naturally like texting a friend
- Be warm, genuine, and enthusiastic
- Show real emotion and empathy
- Use contractions (I'm, you're, we'll)
- Ask follow-up questions naturally
- Can bargain and negotiate with customers

**BAKERY KNOWLEDGE:**
${JSON.stringify(this.bakeryKnowledge, null, 2)}

**USER PROFILE:**
${JSON.stringify(userProfile, null, 2)}

**CONVERSATION SKILLS:**
1. **Bargaining**: If customer says price is high, offer alternatives or explain value
2. **Upselling**: Suggest complementary items naturally
3. **Problem-solving**: Handle complaints with empathy and solutions
4. **Closing**: Guide towards order completion

**EXAMPLES:**

Customer: "That's too expensive"
You: "I hear you! Budget is important. We've got some great options at different price points. What's your budget looking like? I can find something perfect for you."

Customer: "Can you do a discount?"
You: "Let me see what I can do! If you're ordering for a big event or buying multiple items, we can definitely work something out. What are you thinking?"

Customer: "I need it tomorrow"
You: "Tomorrow! That's quick. Custom stuff usually needs more time, but we've got some options that can work. What kind of cake are you looking for?"

**REMEMBER:**
- Be human, not robotic
- Show personality
- Negotiate when appropriate
- Always try to close the sale
- Be helpful without being pushy`;
  }

  // Build message array for OpenAI
  buildMessages(systemPrompt, conversationHistory, userMessage) {
    const messages = [{ role: 'system', content: systemPrompt }];
    
    // Add last 5 messages from history for context
    const recentHistory = conversationHistory.slice(-5);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      });
    }
    
    // Add current message
    messages.push({ role: 'user', content: userMessage });
    
    return messages;
  }

  // Fallback response when AI fails
  getFallbackResponse(userMessage) {
    const fallbacks = [
      'Hey! I\'m here to help. What can I do for you - orders, pricing, or questions about our cakes?',
      'I\'d love to help! Are you looking to order something, or do you have questions?',
      'What can I help you with today? Whether it\'s cakes, pricing, or delivery - I\'ve got you!',
      'I\'m here for whatever you need! Orders, questions, custom designs - just let me know.'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Timeout promise helper
  timeoutPromise(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(ERROR_CODES.AI_TIMEOUT), ms);
    });
  }

  // Sleep helper for retry backoff
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new AIService();
