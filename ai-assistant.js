// ============================================
// BLESSED HANDLY BAKERY AI ASSISTANT
// Complete AI System with Advanced Features
// ============================================

class BakeryAIAssistant {
    constructor() {
        // AI Personality & Tone Configuration
        this.personality = {
            name: "Rivan",
            role: "Professional Bakery Assistant",
            tone: "warm, friendly, professional, helpful",
            traits: ["knowledgeable", "patient", "enthusiastic", "detail-oriented"],
            language: "English with Ugandan context",
            emoji_usage: "moderate"
        };

        // Conversation Memory (Short-term Context)
        this.conversationMemory = {
            messages: [],
            userPreferences: {},
            currentIntent: null,
            lastEmotion: "neutral",
            sessionStartTime: Date.now(),
            maxMemoryLength: 20
        };

        // Emotion & Sentiment Detection
        this.emotionPatterns = {
            happy: ["thank", "great", "awesome", "love", "perfect", "excellent", "amazing"],
            frustrated: ["not working", "broken", "error", "problem", "issue", "help", "stuck"],
            confused: ["don't understand", "what", "how", "confused", "unclear", "?"],
            urgent: ["urgent", "asap", "quickly", "now", "emergency", "rush"],
            excited: ["!", "wow", "omg", "can't wait", "excited"],
            disappointed: ["disappointed", "sad", "unfortunately", "bad", "terrible"]
        };

        // Intent Detection Patterns
        this.intentPatterns = {
            order: ["order", "buy", "purchase", "get", "want", "need cake"],
            pricing: ["price", "cost", "how much", "expensive", "cheap", "budget"],
            delivery: ["deliver", "delivery", "shipping", "send", "location"],
            custom: ["custom", "design", "personalize", "special", "unique"],
            wedding: ["wedding", "marriage", "bride", "groom"],
            birthday: ["birthday", "bday", "celebration", "party"],
            inquiry: ["available", "do you have", "can you", "is it possible"],
            booking: ["book", "reserve", "appointment", "schedule"],
            contact: ["contact", "phone", "email", "reach", "call"],
            gallery: ["see", "show", "pictures", "photos", "gallery", "examples"],
            internship: ["internship", "training", "learn", "student", "apply"]
        };

        // Complete Bakery Knowledge Base
        this.knowledgeBase = {
            products: {
                cupcakes: {
                    name: "Cupcakes",
                    price: "UGX 3,000 - 5,000 each",
                    description: "Delicious mini cakes perfect for any occasion",
                    category: "Small Cakes",
                    available: true,
                    customizable: true
                },
                queenCakes: {
                    name: "Queen Cakes",
                    price: "UGX 2,500 - 4,000 each",
                    description: "Classic queen cakes with rich flavor",
                    category: "Small Cakes",
                    available: true
                },
                spongeCake: {
                    name: "Sponge Cake",
                    price: "UGX 25,000 - 80,000",
                    description: "Light and fluffy sponge perfection",
                    category: "Small Cakes",
                    available: true
                },
                surpriseCakes: {
                    name: "Surprise Cakes",
                    price: "UGX 28,000 - 95,000",
                    description: "Amazing surprise cake designs",
                    category: "Small Cakes",
                    available: true
                },
                daddyTin2kg: {
                    name: "Daddy Tin - 2kg",
                    price: "UGX 45,000",
                    description: "Large tin of assorted treats",
                    category: "Daddies",
                    available: true
                },
                daddyTin1kg: {
                    name: "Daddy Tin - 1kg",
                    price: "UGX 25,000",
                    description: "Medium tin of delicious goodies",
                    category: "Daddies",
                    available: true
                },
                daddyTin500g: {
                    name: "Daddy Tin - 500g",
                    price: "UGX 15,000",
                    description: "Small tin perfect for gifts",
                    category: "Daddies",
                    available: true
                },
                birthdayCakes: {
                    name: "Birthday Cakes",
                    price: "UGX 50,000 - 500,000",
                    description: "Custom designs for memorable birthdays",
                    category: "Big Cakes",
                    available: true,
                    customizable: true
                },
                weddingCakes: {
                    name: "Wedding Cakes",
                    price: "UGX 200,000 - 2,000,000",
                    description: "Elegant tiered cakes for your special day",
                    category: "Big Cakes",
                    available: true,
                    customizable: true,
                    advanceOrder: "2-4 weeks recommended"
                },
                introCakes: {
                    name: "Introduction Cakes",
                    price: "UGX 150,000 - 1,500,000",
                    description: "Traditional ceremony masterpieces",
                    category: "Big Cakes",
                    available: true,
                    customizable: true
                },
                companyCakes: {
                    name: "Company Event Cakes",
                    price: "UGX 100,000 - 800,000",
                    description: "Professional cakes for corporate events",
                    category: "Big Cakes",
                    available: true,
                    customizable: true
                }
            },
            packages: {
                starter: {
                    name: "Starter Package",
                    price: "UGX 50,000 - 150,000",
                    features: ["1 Small to Medium Cake", "Basic Decoration", "Serves 10-20 People", "Standard Flavors", "24hrs Advance Order"]
                },
                premium: {
                    name: "Premium Package",
                    price: "UGX 200,000 - 500,000",
                    features: ["1 Large Custom Cake", "Premium Decoration", "Serves 30-60 People", "Any Flavor", "Custom Design", "Free Delivery (Kampala)"],
                    popular: true
                },
                deluxe: {
                    name: "Deluxe Package",
                    price: "UGX 600,000 - 2,000,000",
                    features: ["Multi-Tier Cake", "Luxury Decoration", "Serves 80+ People", "Premium Flavors", "Edible Flowers/Gold", "Free Delivery & Setup", "Dedicated Consultant"]
                },
                cupcakeParty: {
                    name: "Cupcake Party Package",
                    price: "UGX 80,000 - 300,000",
                    features: ["24-100 Cupcakes", "Custom Toppers", "Assorted Flavors", "Display Stand Included", "Perfect for Events"]
                }
            },
            services: {
                customDesign: "We create custom cake designs for any occasion",
                delivery: "Free delivery within Kampala for orders above UGX 100,000",
                consultation: "Free consultation for wedding and large event cakes",
                tasting: "Cake tasting available by appointment",
                urgentOrders: "Rush orders available with 24-hour notice (additional fee applies)"
            },
            contact: {
                phone: "+256 XXX XXXXXX",
                email: "info@blessedhandlybakery.com",
                location: "Kampala, Uganda",
                hours: "Mon - Sat: 8:00 AM - 6:00 PM, Sunday: Closed"
            },
            policies: {
                orderAdvance: "Minimum 24 hours for small cakes, 2-4 weeks for wedding cakes",
                payment: "50% deposit required for custom orders",
                cancellation: "48 hours notice required for cancellations",
                delivery: "Delivery available within Kampala and surrounding areas"
            },
            internship: {
                available: true,
                duration: "3-6 months",
                schedule: "Flexible (Morning or Afternoon shifts)",
                requirements: "Age 16+ and passion for baking",
                skills: "Cake decoration, baking techniques, food safety",
                certificate: "Certificate of completion provided"
            }
        };

        // Response Templates with Variations
        this.responseTemplates = {
            greeting: [
                "Hello! 👋 Welcome to Blessed Handly Bakery! I'm {name}, your personal bakery assistant. How can I help you today?",
                "Hi there! 🎂 I'm {name} from Blessed Handly Bakery. What delicious creation can I help you with?",
                "Welcome! ✨ I'm {name}, here to help you find the perfect cake. What are you looking for?"
            ],
            orderConfirmation: [
                "Great choice! 🎉 I'll help you order {product}. Let me guide you through the booking process.",
                "Excellent! I'd love to help you get {product}. Shall we proceed with the booking?",
                "Perfect! {product} is a wonderful choice. Let's get your order started!"
            ],
            priceInfo: [
                "The {product} is priced at {price}. {description}",
                "For {product}, we charge {price}. {description}",
                "{product} costs {price}. {description}"
            ],
            notAvailable: [
                "I apologize, but I don't have information about that specific item. However, I can show you our available products!",
                "I'm not sure about that one, but let me show you what we have available that might interest you!",
                "That's not in our current catalog, but I have some great alternatives to suggest!"
            ],
            thankYou: [
                "Thank you so much! 🙏 Is there anything else I can help you with?",
                "You're very welcome! 😊 Feel free to ask if you need anything else!",
                "My pleasure! Let me know if you have any other questions!"
            ]
        };

        // Initialize UI
        this.initializeUI();
        this.startSession();
    }

    // ============================================
    // CONVERSATION MEMORY MANAGEMENT
    // ============================================
    
    addToMemory(role, message, metadata = {}) {
        this.conversationMemory.messages.push({
            role,
            message,
            timestamp: Date.now(),
            emotion: metadata.emotion || "neutral",
            intent: metadata.intent || null
        });

        // Keep only last N messages
        if (this.conversationMemory.messages.length > this.conversationMemory.maxMemoryLength) {
            this.conversationMemory.messages.shift();
        }
    }

    getConversationContext() {
        return this.conversationMemory.messages
            .slice(-5)
            .map(m => `${m.role}: ${m.message}`)
            .join('\n');
    }

    // ============================================
    // EMOTION & SENTIMENT DETECTION
    // ============================================
    
    detectEmotion(message) {
        const lowerMessage = message.toLowerCase();
        let detectedEmotion = "neutral";
        let maxScore = 0;

        for (const [emotion, patterns] of Object.entries(this.emotionPatterns)) {
            const score = patterns.filter(pattern => lowerMessage.includes(pattern)).length;
            if (score > maxScore) {
                maxScore = score;
                detectedEmotion = emotion;
            }
        }

        this.conversationMemory.lastEmotion = detectedEmotion;
        return detectedEmotion;
    }

    // ============================================
    // INTENT DETECTION
    // ============================================
    
    detectIntent(message) {
        const lowerMessage = message.toLowerCase();
        let detectedIntent = "general";
        let maxScore = 0;

        for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
            const score = patterns.filter(pattern => lowerMessage.includes(pattern)).length;
            if (score > maxScore) {
                maxScore = score;
                detectedIntent = intent;
            }
        }

        this.conversationMemory.currentIntent = detectedIntent;
        return detectedIntent;
    }

    // ============================================
    // CONTEXT-AWARE RESPONSE LOGIC
    // ============================================
    
    async generateResponse(userMessage) {
        // Detect emotion and intent
        const emotion = this.detectEmotion(userMessage);
        const intent = this.detectIntent(userMessage);

        // Add to memory
        this.addToMemory('user', userMessage, { emotion, intent });

        // Generate context-aware response
        let response = "";

        switch (intent) {
            case "order":
                response = await this.handleOrderIntent(userMessage);
                break;
            case "pricing":
                response = await this.handlePricingIntent(userMessage);
                break;
            case "delivery":
                response = await this.handleDeliveryIntent(userMessage);
                break;
            case "wedding":
            case "birthday":
            case "custom":
                response = await this.handleEventIntent(intent, userMessage);
                break;
            case "booking":
                response = await this.handleBookingIntent(userMessage);
                break;
            case "contact":
                response = await this.handleContactIntent();
                break;
            case "gallery":
                response = await this.handleGalleryIntent();
                break;
            case "internship":
                response = await this.handleInternshipIntent();
                break;
            default:
                response = await this.handleGeneralIntent(userMessage);
        }

        // Adjust response based on emotion
        response = this.adjustResponseForEmotion(response, emotion);

        // Add to memory
        this.addToMemory('assistant', response, { emotion, intent });

        return response;
    }

    // ============================================
    // INTENT HANDLERS
    // ============================================
    
    async handleOrderIntent(message) {
        // Extract product mentions
        const products = this.extractProductMentions(message);
        
        if (products.length > 0) {
            const product = products[0];
            const productInfo = this.findProduct(product);
            
            if (productInfo) {
                // Auto-fill booking form
                this.autoFillBookingForm(productInfo.name);
                
                return this.getRandomTemplate('orderConfirmation')
                    .replace('{product}', productInfo.name) +
                    `\n\n📋 I've prepared the booking form for you. The ${productInfo.name} costs ${productInfo.price}.\n\n` +
                    `Would you like me to scroll to the booking section so you can complete your order?`;
            }
        }

        return `I'd love to help you place an order! 🎂\n\nWe have:\n` +
            `• Small Cakes (Cupcakes, Queen Cakes, Sponge Cakes)\n` +
            `• Daddy Tins (500g, 1kg, 2kg)\n` +
            `• Big Cakes (Birthday, Wedding, Introduction, Company Events)\n\n` +
            `Which type interests you?`;
    }

    async handlePricingIntent(message) {
        const products = this.extractProductMentions(message);
        
        if (products.length > 0) {
            const product = products[0];
            const productInfo = this.findProduct(product);
            
            if (productInfo) {
                return this.getRandomTemplate('priceInfo')
                    .replace('{product}', productInfo.name)
                    .replace('{price}', productInfo.price)
                    .replace('{description}', productInfo.description) +
                    `\n\nWould you like to order this?`;
            }
        }

        return `Here's our pricing overview:\n\n` +
            `🧁 Small Cakes: UGX 2,500 - 5,000\n` +
            `🎁 Daddy Tins: UGX 15,000 - 45,000\n` +
            `🎂 Birthday Cakes: UGX 50,000 - 500,000\n` +
            `💒 Wedding Cakes: UGX 200,000 - 2,000,000\n\n` +
            `Which category would you like to know more about?`;
    }

    async handleDeliveryIntent(userMessage) {
        return `🚚 Delivery Information:\n\n` +
            `• Free delivery within Kampala for orders above UGX 100,000\n` +
            `• Delivery available to surrounding areas (charges apply)\n` +
            `• Same-day delivery for orders placed before 10 AM\n` +
            `• We ensure your cake arrives fresh and beautiful!\n\n` +
            `Where would you like your cake delivered?`;
    }

    async handleEventIntent(eventType, message) {
        const eventMap = {
            wedding: "weddingCakes",
            birthday: "birthdayCakes",
            custom: "birthdayCakes"
        };

        const productKey = eventMap[eventType];
        const product = this.knowledgeBase.products[productKey];

        if (product) {
            return `${product.name} are our specialty! 🎉\n\n` +
                `💰 Price: ${product.price}\n` +
                `📝 ${product.description}\n` +
                `${product.advanceOrder ? `⏰ ${product.advanceOrder}\n` : ''}` +
                `${product.customizable ? `✨ Fully customizable to your preferences\n` : ''}\n` +
                `Would you like to see our gallery or start booking?`;
        }

        return this.handleGeneralIntent(message);
    }

    async handleBookingIntent(message) {
        // Scroll to booking section
        if (typeof scrollToSection === 'function') {
            scrollToSection('booking');
        }

        return `📋 Perfect! I'm taking you to our booking form now.\n\n` +
            `Please fill in:\n` +
            `• Your name and contact details\n` +
            `• Event date\n` +
            `• Cake preferences\n` +
            `• Budget\n\n` +
            `I'll be here if you need any help! 😊`;
    }

    async handleContactIntent() {
        return `📞 Contact Information:\n\n` +
            `Phone: ${this.knowledgeBase.contact.phone}\n` +
            `Email: ${this.knowledgeBase.contact.email}\n` +
            `Location: ${this.knowledgeBase.contact.location}\n` +
            `Hours: ${this.knowledgeBase.contact.hours}\n\n` +
            `You can also use the contact form on our website. How else can I assist you?`;
    }

    async handleGalleryIntent() {
        // Scroll to gallery
        if (typeof scrollToSection === 'function') {
            scrollToSection('gallery');
        }

        return `🖼️ Let me show you our beautiful cake gallery!\n\n` +
            `You can browse by category:\n` +
            `• Wedding Cakes\n` +
            `• Birthday Cakes\n` +
            `• Corporate Cakes\n` +
            `• Custom Designs\n\n` +
            `Click on any image to see details, rate, and leave testimonials!`;
    }

    async handleInternshipIntent() {
        const info = this.knowledgeBase.internship;
        
        // Scroll to internship section
        if (typeof scrollToSection === 'function') {
            scrollToSection('internship');
        }

        return `🎓 Student Internship Program:\n\n` +
            `Duration: ${info.duration}\n` +
            `Schedule: ${info.schedule}\n` +
            `Requirements: ${info.requirements}\n` +
            `Skills Covered: ${info.skills}\n` +
            `Certificate: ${info.certificate}\n\n` +
            `Ready to apply? I've scrolled to the application form for you!`;
    }

    async handleGeneralIntent(message) {
        // Check if it's a greeting
        if (this.isGreeting(message)) {
            return this.getRandomTemplate('greeting').replace('{name}', this.personality.name);
        }

        // Check if it's a thank you
        if (this.isThankYou(message)) {
            return this.getRandomTemplate('thankYou');
        }

        // General helpful response
        return `I'm here to help with anything related to Blessed Handly Bakery! 🎂\n\n` +
            `I can assist you with:\n` +
            `• Ordering cakes and treats\n` +
            `• Pricing information\n` +
            `• Delivery details\n` +
            `• Custom designs\n` +
            `• Viewing our gallery\n` +
            `• Booking consultations\n` +
            `• Internship applications\n\n` +
            `What would you like to know?`;
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    extractProductMentions(message) {
        const lowerMessage = message.toLowerCase();
        const mentions = [];

        for (const [key, product] of Object.entries(this.knowledgeBase.products)) {
            if (lowerMessage.includes(product.name.toLowerCase()) ||
                lowerMessage.includes(key.toLowerCase())) {
                mentions.push(product.name);
            }
        }

        return mentions;
    }

    findProduct(productName) {
        const lowerName = productName.toLowerCase();
        
        for (const product of Object.values(this.knowledgeBase.products)) {
            if (product.name.toLowerCase().includes(lowerName) ||
                lowerName.includes(product.name.toLowerCase())) {
                return product;
            }
        }

        return null;
    }

    autoFillBookingForm(productName) {
        const bookingProduct = document.getElementById('bookingProduct');
        if (bookingProduct) {
            bookingProduct.value = productName;
        }
    }

    adjustResponseForEmotion(response, emotion) {
        const emotionPrefixes = {
            happy: "😊 ",
            frustrated: "I understand your concern. ",
            confused: "Let me clarify that for you. ",
            urgent: "I'll help you right away! ",
            excited: "🎉 ",
            disappointed: "I'm sorry to hear that. "
        };

        const prefix = emotionPrefixes[emotion] || "";
        return prefix + response;
    }

    isGreeting(message) {
        const greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"];
        return greetings.some(g => message.toLowerCase().includes(g));
    }

    isThankYou(message) {
        const thanks = ["thank", "thanks", "appreciate"];
        return thanks.some(t => message.toLowerCase().includes(t));
    }

    getRandomTemplate(templateKey) {
        const templates = this.responseTemplates[templateKey];
        if (!templates || templates.length === 0) return "";
        return templates[Math.floor(Math.random() * templates.length)];
    }

    // ============================================
    // UI INITIALIZATION
    // ============================================
    
    initializeUI() {
        // Create chat widget HTML
        const chatHTML = `
            <div id="ai-chat-widget" class="ai-chat-widget">
                <button id="ai-chat-toggle" class="ai-chat-toggle">
                    <i class="fas fa-comments"></i>
                    <span class="ai-chat-badge">AI</span>
                </button>
                
                <div id="ai-chat-window" class="ai-chat-window">
                    <div class="ai-chat-header">
                        <div class="ai-chat-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="ai-chat-info">
                            <h4>${this.personality.name}</h4>
                            <p>Bakery Assistant • Online</p>
                        </div>
                        <button id="ai-chat-close" class="ai-chat-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div id="ai-chat-messages" class="ai-chat-messages">
                        <div class="ai-message">
                            <div class="ai-message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="ai-message-content">
                                ${this.getRandomTemplate('greeting').replace('{name}', this.personality.name)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="ai-chat-typing" id="ai-chat-typing" style="display: none;">
                        <span></span><span></span><span></span>
                    </div>
                    
                    <div class="ai-chat-input">
                        <input type="text" id="ai-chat-input-field" placeholder="Type your message...">
                        <button id="ai-chat-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add to page
        document.body.insertAdjacentHTML('beforeend', chatHTML);

        // Add event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        const toggle = document.getElementById('ai-chat-toggle');
        const close = document.getElementById('ai-chat-close');
        const send = document.getElementById('ai-chat-send');
        const input = document.getElementById('ai-chat-input-field');
        const window = document.getElementById('ai-chat-window');

        toggle.addEventListener('click', () => {
            window.classList.toggle('active');
        });

        close.addEventListener('click', () => {
            window.classList.remove('active');
        });

        send.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const input = document.getElementById('ai-chat-input-field');
        const message = input.value.trim();

        if (!message) return;

        // Display user message
        this.displayMessage('user', message);
        input.value = '';

        // Show typing indicator
        this.showTyping();

        // Simulate human-like delay
        await this.simulateTypingDelay(message.length);

        // Generate response
        const response = await this.generateResponse(message);

        // Hide typing indicator
        this.hideTyping();

        // Display AI response
        this.displayMessage('assistant', response);
    }

    displayMessage(role, message) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageClass = role === 'user' ? 'user-message' : 'ai-message';
        
        const messageHTML = role === 'user' ? `
            <div class="${messageClass}">
                <div class="user-message-content">${this.formatMessage(message)}</div>
            </div>
        ` : `
            <div class="${messageClass}">
                <div class="ai-message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="ai-message-content">${this.formatMessage(message)}</div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatMessage(message) {
        // Convert markdown-style formatting
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '•');
    }

    showTyping() {
        document.getElementById('ai-chat-typing').style.display = 'flex';
        const messagesContainer = document.getElementById('ai-chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        document.getElementById('ai-chat-typing').style.display = 'none';
    }

    async simulateTypingDelay(messageLength) {
        // Simulate human-like typing speed (50-150ms per character)
        const baseDelay = 800;
        const charDelay = Math.min(messageLength * 30, 2000);
        await new Promise(resolve => setTimeout(resolve, baseDelay + charDelay));
    }

    startSession() {
        console.log(`🤖 ${this.personality.name} AI Assistant initialized`);
        console.log(`📊 Session started at ${new Date().toLocaleString()}`);
    }
}

// Initialize AI Assistant when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bakeryAI = new BakeryAIAssistant();
    console.log('✅ Bakery AI Assistant is ready!');
});
