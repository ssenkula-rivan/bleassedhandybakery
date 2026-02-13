// Frontend client for Blessed Handly Bakery Chatbot
// Connects to backend server for AI responses

class BakeryChatbot {
  constructor(apiUrl = '/api/website') {
    this.apiUrl = apiUrl;
    this.userId = this.getUserId();
    this.sessionId = this.getSessionId();
  }

  // Get or create user ID
  getUserId() {
    let userId = localStorage.getItem('bakery_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('bakery_user_id', userId);
    }
    return userId;
  }

  // Get or create session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('bakery_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('bakery_session_id', sessionId);
    }
    return sessionId;
  }

  // Send message to backend
  async sendMessage(message) {
    try {
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: this.userId,
          sessionId: this.sessionId,
          message: message
        })
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Chat error:', data);
        return {
          response: data.response || 'Sorry, something went wrong. Please try again.',
          error: true
        };
      }

      return {
        response: data.response,
        requestId: data.requestId,
        responseTime: data.responseTime,
        source: data.source,
        error: false
      };
    } catch (error) {
      console.error('Network error:', error);
      return {
        response: 'Connection issue. Please check your internet and try again.',
        error: true
      };
    }
  }

  // Get conversation history
  async getHistory(limit = 50) {
    try {
      const response = await fetch(`${this.apiUrl}/history/${this.userId}?limit=${limit}`);
      const data = await response.json();
      return data.history || [];
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      await fetch(`${this.apiUrl}/profile/${this.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }
}

// Initialize chatbot
const chatbot = new BakeryChatbot();

// Replace the existing sendMessage function in app.js
async function sendMessage() {
  if (!chatbotInput) {
    return;
  }
  
  const message = chatbotInput.value.trim();
  if (message === '') return;

  addMessage(message, 'user');
  chatbotInput.value = '';

  showTypingIndicator();

  try {
    const result = await chatbot.sendMessage(message);
    hideTypingIndicator();
    addMessage(result.response, 'bot');
    
    // Log response time for monitoring
    if (result.responseTime) {
      console.log(`Response time: ${result.responseTime}ms from ${result.source}`);
    }
  } catch (error) {
    hideTypingIndicator();
    addMessage('Oops! Something went wrong. Can you try again?', 'bot');
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BakeryChatbot;
}
