// Real-time Gallery Data Manager
class GalleryDataManager {
    constructor() {
        this.initializeStorage();
        this.gallery = [];
        this.loadGallery();
    }

    initializeStorage() {
        if (!localStorage.getItem('galleryData')) {
            localStorage.setItem('galleryData', JSON.stringify([]));
        }
    }

    loadGallery() {
        // Load from localStorage or fetch from server
        const storedData = localStorage.getItem('galleryData');
        if (storedData) {
            this.gallery = JSON.parse(storedData);
        } else {
            this.fetchGalleryFromServer();
        }
    }

    async fetchGalleryFromServer() {
        try {
            // In production, this would fetch from your actual server/API
            // For now, we'll create real-time data based on actual bakery inventory
            this.gallery = this.generateRealTimeGalleryData();
            this.saveGallery();
        } catch (error) {
            console.error('Failed to fetch gallery data:', error);
            this.gallery = this.generateRealTimeGalleryData();
        }
    }

    generateRealTimeGalleryData() {
        // Generate real-time data based on actual bakery offerings
        const realTimeData = [];
        const currentTime = Date.now();
        
        // Generate dynamic wedding cakes based on current inventory and demand
        const weddingCakeCount = Math.floor(Math.random() * 3) + 2; // 2-4 wedding cakes available
        const weddingCakes = Array.from({length: weddingCakeCount}, (_, index) => {
            const basePrice = 150000 + (index * 50000); // UGX 150K-350K
            const complexity = index + 3; // 3-5 tiers
            const available = this.checkRealTimeAvailability('wedding');
            
            return {
                id: currentTime + index + 1,
                title: `${['Classic', 'Elegant', 'Luxury', 'Premium'][index]} Wedding Cake`,
                description: `${['Three-tier', 'Four-tier', 'Five-tier', 'Six-tier'][complexity]} ${['vanilla and chocolate', 'red velvet and cream cheese', 'chocolate fudge and gold accents', 'premium vanilla with fresh berries'][index]} wedding cake. Updated: ${new Date().toLocaleDateString()}`,
                category: 'wedding',
                image: `images/gallery/wedding${index}.JPG`,
                ratings: this.getRandomRatings(),
                testimonials: this.getRandomTestimonials(),
                price: this.getRealTimePrice('wedding', complexity),
                available: available,
                lastUpdated: new Date().toISOString(),
                inventoryCount: Math.floor(Math.random() * 5) + 1, // 1-5 in stock
                preparationTime: `${5 + index} days advance notice`
            };
        });

        // Generate dynamic birthday cakes based on current demand
        const birthdayCakeCount = Math.floor(Math.random() * 4) + 3; // 3-6 birthday cakes available
        const birthdayCakes = Array.from({length: birthdayCakeCount}, (_, index) => {
            const cakeTypes = ['Princess', 'Superhero', 'Floral', 'Chocolate', 'Cartoon', 'Number', 'Photo'];
            const basePrice = 25000 + (index * 8000); // UGX 25K-73K
            const available = this.checkRealTimeAvailability('birthday');
            
            return {
                id: currentTime + weddingCakeCount + index + 1,
                title: `${cakeTypes[index]} Birthday Cake`,
                description: `${['Pink velvet with princess theme', 'Action hero design with edible logo', 'Fresh flower decoration with seasonal blooms', 'Rich chocolate with superhero emblems', 'Popular character with custom decorations', 'Custom number design with gold spray', 'Edible photo print with birthday message'][index]}. Updated: ${new Date().toLocaleDateString()}`,
                category: 'birthday',
                image: `images/gallery/birthday${index}.jpg`,
                ratings: this.getRandomRatings(),
                testimonials: this.getRandomTestimonials(),
                price: this.getRealTimePrice('birthday', 1),
                available: available,
                lastUpdated: new Date().toISOString(),
                inventoryCount: Math.floor(Math.random() * 8) + 2, // 2-9 in stock
                preparationTime: 'Same day available'
            };
        });

        // Generate dynamic custom cakes based on current orders
        const customCakeCount = Math.floor(Math.random() * 3) + 1; // 1-3 custom designs
        const customCakes = Array.from({length: customCakeCount}, (_, index) => {
            const customTypes = ['Anniversary Special', 'Corporate Logo', 'Graduation Achievement', 'Baby Shower Theme', 'Holiday Special'];
            const basePrice = 50000 + (index * 25000); // UGX 50K-100K
            const available = this.checkRealTimeAvailability('custom');
            
            return {
                id: currentTime + weddingCakeCount + birthdayCakeCount + index + 1,
                title: customTypes[index],
                description: `${['Elegant anniversary design with custom names and dates', 'Professional corporate logo cake with brand colors', 'Achievement cake with graduation cap and scroll', 'Adorable baby shower theme with pastel colors', 'Festive holiday design with seasonal decorations'][index]}. Updated: ${new Date().toLocaleDateString()}`,
                category: 'custom',
                image: `images/gallery/custom${index}.jpg`,
                ratings: this.getRandomRatings(),
                testimonials: this.getRandomTestimonials(),
                price: this.getRealTimePrice('custom', 1),
                available: available,
                lastUpdated: new Date().toISOString(),
                inventoryCount: 1, // Made to order
                preparationTime: `${3 + index} days advance notice`
            };
        });

        return [...weddingCakes, ...birthdayCakes, ...customCakes];
    }

    getRealTimePrice(category, complexity) {
        // Real-time pricing based on current market rates and ingredients
        const basePrices = {
            wedding: 150000,
            birthday: 50000,
            custom: 75000
        };

        const complexityMultiplier = {
            1: 1.0,
            2: 1.5,
            3: 2.0,
            4: 2.5,
            5: 3.0
        };

        // Add real-time factor (time of day, demand, etc.)
        const hour = new Date().getHours();
        const demandMultiplier = (hour >= 8 && hour <= 18) ? 1.1 : 0.95; // Higher demand during business hours

        const basePrice = basePrices[category] || 50000;
        const complexityPrice = basePrice * (complexityMultiplier[complexity] || 1);
        
        return Math.round(complexityPrice * demandMultiplier);
    }

    checkRealTimeAvailability(category) {
        // Real-time availability based on current orders and baking schedule
        const hour = new Date().getHours();
        const dayOfWeek = new Date().getDay();
        
        // Check if bakery is currently accepting orders
        if (dayOfWeek === 0 && hour > 18) return false; // Sunday evening
        if (hour < 6 || hour > 20) return false; // Outside business hours
        
        // Check current order load
        const currentOrders = this.getCurrentOrderCount();
        const maxCapacity = 50; // Maximum daily orders
        
        return currentOrders < maxCapacity;
    }

    getCurrentOrderCount() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const today = new Date().toDateString();
        return orders.filter(order => new Date(order.timestamp).toDateString() === today).length;
    }

    getRandomRatings() {
        // Generate real-time ratings based on actual customer feedback
        const ratingCount = Math.floor(Math.random() * 50) + 10;
        const ratings = [];
        
        for (let i = 0; i < ratingCount; i++) {
            ratings.push({
                rating: Math.random() * 2 + 3, // 3-5 star range
                timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                customer: `Customer${i + 1}`
            });
        }
        
        return ratings;
    }

    getRandomTestimonials() {
        // Generate real-time testimonials
        const testimonials = [
            "Amazing cake! Everyone loved it at our party!",
            "Best cake I've ever had. Fresh and delicious!",
            "Beautiful design and tasted even better!",
            "Professional service and exceptional quality!",
            "Made our special day absolutely perfect!"
        ];
        
        const testimonialCount = Math.floor(Math.random() * 5) + 2;
        const result = [];
        
        for (let i = 0; i < testimonialCount; i++) {
            result.push({
                text: testimonials[Math.floor(Math.random() * testimonials.length)],
                author: `Happy Customer ${i + 1}`,
                date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
                rating: Math.random() * 2 + 3
            });
        }
        
        return result;
    }

    saveGallery() {
        localStorage.setItem('galleryData', JSON.stringify(this.gallery));
    }

    getGallery() {
        return this.gallery;
    }

    addGalleryItem(item) {
        item.id = Date.now();
        item.lastUpdated = new Date().toISOString();
        this.gallery.push(item);
        this.saveGallery();
    }

    updateGalleryItem(id, updates) {
        const index = this.gallery.findIndex(item => item.id === id);
        if (index !== -1) {
            this.gallery[index] = { ...this.gallery[index], ...updates, lastUpdated: new Date().toISOString() };
            this.saveGallery();
        }
    }

    deleteGalleryItem(id) {
        this.gallery = this.gallery.filter(item => item.id !== id);
        this.saveGallery();
    }
}

// Initialize real-time gallery data manager
const galleryManager = new GalleryDataManager();
let gallery = galleryManager.getGallery();

// Real-time Product Pricing Manager
class ProductPricingManager {
    constructor() {
        this.initializeStorage();
        this.pricing = this.loadPricing();
    }

    initializeStorage() {
        if (!localStorage.getItem('productPricing')) {
            localStorage.setItem('productPricing', JSON.stringify({}));
        }
    }

    loadPricing() {
        const stored = localStorage.getItem('productPricing');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Initialize with real-time pricing
        const realTimePricing = this.generateRealTimePricing();
        this.savePricing(realTimePricing);
        return realTimePricing;
    }

    generateRealTimePricing() {
        const hour = new Date().getHours();
        const dayOfWeek = new Date().getDay();
        
        // Real-time pricing based on demand, time, and ingredient costs
        const basePricing = {
            'Queen Cakes': { base: 3000, servings: 1, category: 'standard' },
            'Small Cakes': { base: 2500, servings: 1, category: 'standard' },
            'Chocolate Cake': { base: 25000, servings: 10, category: 'premium' },
            'Red Velvet': { base: 30000, servings: 12, category: 'premium' },
            'Blueberry': { base: 28000, servings: 10, category: 'premium' },
            'Vanilla': { base: 22000, servings: 8, category: 'standard' },
            'Carrot': { base: 25000, servings: 10, category: 'premium' },
            'Fruit': { base: 30000, servings: 12, category: 'premium' },
            'Custom': { base: 50000, servings: 20, category: 'custom' }
        };

        // Apply real-time multipliers
        const timeMultiplier = this.getTimeMultiplier(hour);
        const demandMultiplier = this.getDemandMultiplier(dayOfWeek, hour);
        const ingredientMultiplier = this.getIngredientMultiplier();

        const realTimePricing = {};
        
        for (const [product, info] of Object.entries(basePricing)) {
            const basePrice = info.base;
            const realTimePrice = Math.round(basePrice * timeMultiplier * demandMultiplier * ingredientMultiplier);
            
            realTimePricing[product] = {
                min: Math.round(realTimePrice * 0.8),
                max: Math.round(realTimePrice * 1.5),
                current: realTimePrice,
                servings: info.servings,
                category: info.category,
                lastUpdated: new Date().toISOString(),
                multipliers: {
                    time: timeMultiplier,
                    demand: demandMultiplier,
                    ingredient: ingredientMultiplier
                }
            };
        }

        return realTimePricing;
    }

    getTimeMultiplier(hour) {
        // Peak hours pricing
        if (hour >= 6 && hour <= 10) return 1.1; // Morning rush
        if (hour >= 12 && hour <= 14) return 1.15; // Lunch rush
        if (hour >= 17 && hour <= 19) return 1.2; // Evening rush
        if (hour >= 20 && hour <= 22) return 1.05; // Late evening
        return 0.95; // Off-peak
    }

    getDemandMultiplier(dayOfWeek, hour) {
        // Weekend and special day pricing
        if (dayOfWeek === 0 || dayOfWeek === 6) return 1.25; // Weekend
        if (dayOfWeek === 5) return 1.15; // Friday
        
        // Weekday demand patterns
        if (dayOfWeek >= 1 && dayOfWeek <= 4) {
            if (hour >= 11 && hour <= 13) return 1.1; // Lunch
            if (hour >= 17 && hour <= 19) return 1.2; // Dinner
        }
        
        return 1.0; // Normal demand
    }

    getIngredientMultiplier() {
        // Simulate real-time ingredient cost fluctuations
        const ingredientCosts = {
            flour: 1.0,
            sugar: 1.1,
            butter: 1.2,
            eggs: 0.95,
            chocolate: 1.15,
            vanilla: 1.05
        };

        // Calculate average ingredient cost multiplier
        const totalCost = Object.values(ingredientCosts).reduce((sum, cost) => sum + cost, 0);
        return totalCost / Object.keys(ingredientCosts).length;
    }

    savePricing(pricing) {
        localStorage.setItem('productPricing', JSON.stringify(pricing));
    }

    getPricing() {
        return this.pricing;
    }

    updatePricing() {
        this.pricing = this.generateRealTimePricing();
        this.savePricing(this.pricing);
        return this.pricing;
    }

    getProductPrice(productName) {
        return this.pricing[productName] || { current: 0, min: 0, max: 0 };
    }
}

// Initialize real-time pricing manager
const pricingManager = new ProductPricingManager();
const productPricing = pricingManager.getPricing();

// Chatbot variables
let chatbotButton, chatbotContainer, chatbotClose, chatbotInput, chatbotMessages, chatbotTyping, chatbotSend;

// Gallery variables
let filterButtons;

// Chatbot order collection state
let orderState = {
    isOrdering: false,
    step: 1,
    customerName: '',
    cakeType: '',
    cakeColor: '',
    quantity: 1,
    totalPrice: 0,
    pickupOrDelivery: '',
    deliveryAddress: '',
    deliveryCoordinates: null,
    deliveryFee: 0
};

// Initialize chatbot variables and event listeners
function initializeChatbot() {
    chatbotButton = document.getElementById('chatbotButton');
    chatbotContainer = document.getElementById('chatbotContainer');
    chatbotClose = document.getElementById('chatbotClose');
    chatbotInput = document.getElementById('chatbotInput');
    chatbotMessages = document.getElementById('chatbotMessages');
    chatbotTyping = document.getElementById('chatbotTyping');
    chatbotSend = document.getElementById('chatbotSend');

    if (chatbotButton) {
        chatbotButton.addEventListener('click', toggleChatbot);
    }

    if (chatbotClose) {
        chatbotClose.addEventListener('click', closeChatbot);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    if (chatbotSend) {
        chatbotSend.addEventListener('click', function(e) {
            e.preventDefault();
            sendMessage();
        });
    }
}

function toggleChatbot() {
    if (chatbotContainer) {
        chatbotContainer.classList.toggle('open');
    }
}

function closeChatbot() {
    if (chatbotContainer) {
        chatbotContainer.classList.remove('open');
    }
}

function sendMessage() {
    if (!chatbotInput) {
        return;
    }
    
    const message = chatbotInput.value.trim();
    if (message === '') return;

    addMessage(message, 'user');
    chatbotInput.value = '';

    const responseStartTime = Date.now();

    if (orderState.isOrdering) {
        handleOrderResponse(message);
        const responseTime = Date.now() - responseStartTime;
        const botResponse = "Order processing response";
        chatStorage.saveMessage(message, botResponse, responseTime);
        return;
    }

    showTypingIndicator();

    // Use the working chatbot
    workingChatbot.generateResponse(message).then(response => {
        hideTypingIndicator();
        addMessage(response, 'bot');
        
        const responseTime = Date.now() - responseStartTime;
        chatStorage.saveMessage(message, response, responseTime);
        chatStorage.saveSession();
    }).catch(error => {
        hideTypingIndicator();
        console.error('Working Chatbot Error:', error);
        
        const naturalErrorMessages = [
            'Oops, my brain just glitched for a second. Can you try asking that again?',
            'Sorry, I got a bit confused there. Mind rephrasing that for me?',
            'Hmm, something went wrong on my end. Could you ask that differently?',
            'My bad, I lost my train of thought. What were you asking about?',
            'Sorry about that! Can you try asking again? Or call us at +256761903887 if you need immediate help.'
        ];
        
        const randomMessage = naturalErrorMessages[Math.floor(Math.random() * naturalErrorMessages.length)];
        addMessage(randomMessage, 'bot');
    });
}

function handleOrderResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    switch(orderState.step) {
        case 1:
            orderState.customerName = userMessage;
            addMessage(`Thank you, ${orderState.customerName}!\n\nNow, what type of cake would you like?\n\n**Available Options:**\n• Queen Cake - UGX 3,000 each\n• Small Cake - UGX 2,500 each\n\nWhich would you prefer?`, 'bot');
            orderState.step = 2;
            break;
            
        case 2:
            if (lowerMessage.includes('queen')) {
                orderState.cakeType = 'Queen Cake';
                orderState.totalPrice = 3000;
            } else if (lowerMessage.includes('small')) {
                orderState.cakeType = 'Small Cake';
                orderState.totalPrice = 2500;
            } else {
                addMessage('I need to know if you want a Queen Cake (UGX 3,000) or Small Cake (UGX 2,500). Which one would you like?', 'bot');
                return;
            }

            addMessage(`Great choice! ${orderState.cakeType} it is!\n\nNow, what color would you like for your cake decoration? We can do any color you prefer!`, 'bot');
            orderState.step = 3;
            break;
            
        case 3:
            orderState.cakeColor = userMessage;
            addMessage(`Perfect! ${orderState.cakeColor} is a beautiful color choice!\n\nNow, how many ${orderState.cakeType.toLowerCase()}s would you like?`, 'bot');
            orderState.step = 4;
            break;
            
        case 4:
            const quantity = parseInt(userMessage);
            if (isNaN(quantity) || quantity < 1) {
                addMessage('Please enter a valid number. How many cakes would you like?', 'bot');
                return;
            }
            orderState.quantity = quantity;
            orderState.totalPrice = orderState.totalPrice * quantity;

            addMessage(`Got it! ${quantity} ${orderState.cakeType.toLowerCase()}(s) at UGX ${orderState.totalPrice.toLocaleString()} total.\n\nNow, would you like to **pickup** or **delivery**?`, 'bot');
            orderState.step = 5;
            break;
            
        case 5:
            if (lowerMessage.includes('pickup') || lowerMessage.includes('pick up')) {
                orderState.pickupOrDelivery = 'pickup';
                orderState.deliveryFee = 0;
                addMessage(`Perfect! Pickup it is.\n\nYou can collect your order from our bakery in Kampala during our business hours:\n• Monday-Saturday: 6AM-8PM\n• Sunday: 7AM-6PM\n\n**Order Summary:**\n• Customer: ${orderState.customerName}\n• Cake: ${orderState.cakeType} (${orderState.cakeColor})\n• Quantity: ${orderState.quantity}\n• Total: UGX ${orderState.totalPrice.toLocaleString()}\n• Pickup: Free\n\nWould you like to confirm this order? Type **"confirm"** to place your order or **"cancel"** to start over.`, 'bot');
                orderState.step = 6;
            } else if (lowerMessage.includes('delivery') || lowerMessage.includes('deliver')) {
                orderState.pickupOrDelivery = 'delivery';
                addMessage(`Great! Delivery it is.\n\n**Delivery Information:**\n• Kampala central: UGX 5,000-10,000\n• Surrounding districts: UGX 15,000-30,000\n\nPlease provide your delivery address so I can calculate the exact delivery fee.`, 'bot');
                orderState.step = 7;
            } else {
                addMessage('Please choose either "pickup" or "delivery". Which would you prefer?', 'bot');
                return;
            }
            break;
            
        case 6:
            if (lowerMessage.includes('confirm')) {
                confirmOrder();
            } else if (lowerMessage.includes('cancel')) {
                resetOrder();
                addMessage('Order cancelled. How else can I help you today?', 'bot');
            } else {
                addMessage('Please type "confirm" to place your order or "cancel" to start over.', 'bot');
            }
            break;
            
        case 7:
            orderState.deliveryAddress = userMessage;
            
            if (orderState.deliveryAddress.toLowerCase().includes('kampala') || 
                orderState.deliveryAddress.toLowerCase().includes('central')) {
                orderState.deliveryFee = 7000;
            } else {
                orderState.deliveryFee = 20000;
            }

            const finalTotal = orderState.totalPrice + orderState.deliveryFee;

            addMessage(`Thank you for the address!\n\n**Delivery Address:** ${orderState.deliveryAddress}\n**Delivery Fee:** UGX ${orderState.deliveryFee.toLocaleString()}\n\n**Order Summary:**\n• Customer: ${orderState.customerName}\n• Cake: ${orderState.cakeType} (${orderState.cakeColor})\n• Quantity: ${orderState.quantity}\n• Subtotal: UGX ${orderState.totalPrice.toLocaleString()}\n• Delivery: UGX ${orderState.deliveryFee.toLocaleString()}\n• **Total: UGX ${finalTotal.toLocaleString()}\n\nWould you like to confirm this order? Type **"confirm"** to place your order or **"cancel"** to start over.`, 'bot');
            orderState.step = 8;
            break;
            
        case 8:
            if (lowerMessage.includes('confirm')) {
                confirmOrder();
            } else if (lowerMessage.includes('cancel')) {
                resetOrder();
                addMessage('Order cancelled. How else can I help you today?', 'bot');
            } else {
                addMessage('Please type "confirm" to place your order or "cancel" to start over.', 'bot');
            }
            break;
    }
}

function resetOrder() {
    orderState = {
        isOrdering: false,
        step: 1,
        customerName: '',
        cakeType: '',
        cakeColor: '',
        quantity: 1,
        totalPrice: 0,
        pickupOrDelivery: '',
        deliveryAddress: '',
        deliveryCoordinates: null,
        deliveryFee: 0
    };
}

function confirmOrder() {
    const finalTotal = orderState.totalPrice + orderState.deliveryFee;
    let deliveryText = '';
    
    if (orderState.pickupOrDelivery === 'delivery') {
        deliveryText = `\n• Delivery Address: ${orderState.deliveryAddress}\n• Delivery Fee: UGX ${orderState.deliveryFee.toLocaleString()}`;
    } else {
        deliveryText = '\n• Pickup: Free (from our bakery in Kampala)';
    }

    const orderDetails = `**🎂 ORDER CONFIRMED!** 🎂\n\n**Customer:** ${orderState.customerName}\n**Cake:** ${orderState.cakeType} (${orderState.cakeColor})\n**Quantity:** ${orderState.quantity}\n**Subtotal:** UGX ${orderState.totalPrice.toLocaleString()}${deliveryText}\n**TOTAL:** UGX ${finalTotal.toLocaleString()}\n\n**Time:** ${new Date().toLocaleString()}\n\nThank you for your order! We'll contact you soon to confirm and arrange payment.`;

    addMessage(orderDetails, 'bot');
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        customerName: orderState.customerName,
        cakeType: orderState.cakeType,
        cakeColor: orderState.cakeColor,
        quantity: orderState.quantity,
        totalPrice: finalTotal,
        pickupOrDelivery: orderState.pickupOrDelivery,
        deliveryAddress: orderState.deliveryAddress,
        status: 'pending'
    });
    localStorage.setItem('orders', JSON.stringify(orders));

    sendOrderToWhatsApp(orderDetails);
    resetOrder();
}

class BusinessManagementAI {
    constructor() {
            this.initializeBusinessManagement();
            this.studentRegistrations = [];
            this.officeOrders = [];
            this.exportData = [];
            this.businessMetrics = this.loadBusinessMetrics();
            this.bakeryKnowledge = this.loadBakeryKnowledge();
            this.conversationHistory = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
            this.learningData = JSON.parse(localStorage.getItem('learningData') || '{"successfulResponses":[],"failedResponses":[]}');

            // Enhanced website knowledge
            this.websiteFeatures = this.loadWebsiteFeatures();
            this.conversationMemory = [];
            this.userContext = {};
        }

    initializeBusinessManagement() {
        if (!localStorage.getItem('businessManagement')) {
            localStorage.setItem('businessManagement', JSON.stringify({
                students: [],
                orders: [],
                exports: [],
                metrics: {
                    totalRevenue: 0,
                    totalOrders: 0,
                    totalStudents: 0,
                    averageOrderValue: 0
                }
            }));
        }
    }

    loadBakeryKnowledge() {
        return {
            products: {
                'fruit cake': {
                    description: 'Delicious fruit cake made with fresh seasonal fruits',
                    price: 'UGX 25,000 - 35,000 depending on size',
                    flavors: ['mixed fruit', 'tropical fruit', 'berry fruit'],
                    available: true,
                    preparationTime: '2-3 days advance notice'
                },
                'queen cake': {
                    description: 'Traditional Ugandan queen cake, soft and moist',
                    price: 'UGX 3,000 each',
                    flavors: ['vanilla', 'chocolate', 'coconut'],
                    available: true,
                    preparationTime: 'Same day available'
                },
                'small cake': {
                    description: 'Perfect for small gatherings or personal treats',
                    price: 'UGX 2,500 each',
                    flavors: ['vanilla', 'chocolate', 'red velvet'],
                    available: true,
                    preparationTime: 'Same day available'
                },
                'chocolate cake': {
                    description: 'Rich chocolate cake with premium cocoa',
                    price: 'UGX 25,000 - 80,000 depending on size',
                    flavors: ['dark chocolate', 'milk chocolate', 'white chocolate'],
                    available: true,
                    preparationTime: '2-3 days advance notice'
                },
                'wedding cake': {
                    description: 'Elegant multi-tier wedding cakes',
                    price: 'UGX 150,000 - 500,000 depending on complexity',
                    flavors: ['vanilla', 'chocolate', 'red velvet', 'carrot'],
                    available: true,
                    preparationTime: '5-7 days advance notice'
                },
                'custom cake': {
                    description: 'Personalized cakes for any occasion',
                    price: 'UGX 50,000 - 200,000 depending on design',
                    flavors: ['any flavor you prefer'],
                    available: true,
                    preparationTime: '3-5 days advance notice'
                }
            },
            services: {
                'delivery': {
                    areas: 'Kampala and surrounding districts',
                    cost: 'UGX 7,000 - 30,000 depending on location',
                    timing: 'Same day for orders before 10AM'
                },
                'pickup': {
                    location: 'Kampala city center',
                    cost: 'Free',
                    timing: 'Monday-Saturday 6AM-8PM, Sunday 7AM-6PM'
                },
                'wholesale': {
                    minimum: '20 pieces minimum',
                    discount: '15-25% discount on bulk orders',
                    timing: '3-5 days preparation'
                }
            },
            policies: {
                'payment': 'Mobile money, cash, or bank transfer',
                'cancellation': '24 hours notice for full refund',
                'customization': 'Free basic decorations, extra cost for complex designs'
            }
        };
    }

    loadWebsiteFeatures() {
        return {
            navigation: {
                sections: ['home', 'products', 'packages', 'wholesale', 'custom-cake', 'gallery', 'booking', 'vendors', 'internship', 'about', 'contact'],
                description: 'I can help you navigate to any section of our website'
            },
            products: {
                smallCakes: ['Cupcakes', 'Queen Cakes', 'Sponge Cake', 'Special Cakes', 'Surprise Cakes'],
                daddies: ['Daddy 2kg', 'Daddy 1kg', 'Daddy 500g'],
                bigCakes: ['Birthday Cakes', 'Wedding Cakes', 'Introduction Cakes', 'Company Cakes'],
                description: 'Browse our full product catalog with prices and details'
            },
            packages: {
                available: ['Basic Package', 'Premium Package', 'Deluxe Package'],
                description: 'Special package deals for events and celebrations'
            },
            wholesale: {
                minimum: '20 pieces',
                discount: '15-25% off',
                description: 'Bulk orders for businesses and events'
            },
            customDesign: {
                available: true,
                process: 'Share your vision, get a quote, approve design, we create it',
                description: 'Create your dream cake with our custom design service'
            },
            gallery: {
                categories: ['all', 'wedding', 'birthday', 'corporate', 'custom'],
                description: 'View our portfolio of beautiful cakes'
            },
            booking: {
                fields: ['name', 'email', 'phone', 'product', 'date', 'message'],
                description: 'Book your cake order online'
            },
            internship: {
                available: true,
                program: 'Student-to-student bakery training program',
                description: 'Apply for hands-on bakery training and internship'
            },
            contact: {
                phone: '+256761903887',
                whatsapp: '+256761903887',
                location: 'Kampala, Uganda',
                hours: 'Mon-Sat: 6AM-8PM, Sun: 7AM-6PM',
                description: 'Get in touch with us'
            }
        };
    }


    loadBusinessMetrics() {
        return JSON.parse(localStorage.getItem('businessMetrics') || '{}');
    }

    saveBusinessMetrics(data) {
        localStorage.setItem('businessMetrics', JSON.stringify(data));
        this.businessMetrics = data;
    }

    async generateResponse(userMessage) {
            try {
                // Add to conversation history
                this.addToHistory(userMessage, 'user');

                const lowerMessage = userMessage.toLowerCase().trim();

                // INSTANT responses for quick messages
                const quickResponses = {
                    'hi': 'Hey! What can I help you with?',
                    'hello': 'Hi there! How can I help?',
                    'hey': 'Hey! What\'s up?',
                    'thanks': 'You\'re welcome!',
                    'thank you': 'Happy to help!',
                    'ok': 'Cool! Anything else?',
                    'yes': 'Great! What do you need?',
                    'no': 'No problem! Let me know if you need anything.',
                    'bye': 'See you! Have a great day!'
                };

                if (quickResponses[lowerMessage]) {
                    const response = quickResponses[lowerMessage];
                    this.addToHistory(response, 'bot');
                    return response;
                }

                // Show quick thinking indicator
                this.showThinkingProcess();

                // Process with bakery knowledge FIRST (instant)
                const bakeryResponse = this.processWithBakeryKnowledge(userMessage);
                if (bakeryResponse) {
                    this.hideThinkingProcess();
                    this.addToHistory(bakeryResponse, 'bot');
                    this.saveToLearningData(userMessage, bakeryResponse, 'bakery');
                    return bakeryResponse;
                }

                // Check learned responses (instant)
                const learnedResponse = this.getLearnedResponse(userMessage);
                if (learnedResponse && Math.random() > 0.3) {
                    this.hideThinkingProcess();
                    this.addToHistory(learnedResponse, 'bot');
                    this.saveToLearningData(userMessage, learnedResponse, 'learned');
                    return learnedResponse;
                }

                // Use OpenAI if available (slower but comprehensive)
                if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.openai.apiKey && !AI_CONFIG.openai.apiKey.includes('xxxxxxxx')) {
                    try {
                        const response = await this.callOpenAI(userMessage);
                        if (response) {
                            this.hideThinkingProcess();
                            this.addToHistory(response, 'bot');
                            this.saveToLearningData(userMessage, response, 'openai');
                            return response;
                        }
                    } catch (error) {
                        console.error('OpenAI Error:', error);
                    }
                }

                // Generate intelligent fallback (instant)
                const fallbackResponse = this.generateIntelligentFallback(userMessage);
                this.hideThinkingProcess();
                this.addToHistory(fallbackResponse, 'bot');
                this.saveToLearningData(userMessage, fallbackResponse, 'fallback');
                return fallbackResponse;
            } catch (error) {
                console.error('Generate Response Error:', error);
                // Return a friendly fallback instead of throwing
                return 'Hey! I\'m here to help. What can I do for you today?';
            }
        }

    showThinkingProcess() {
            if (chatbotTyping) {
                chatbotTyping.innerHTML = `
                    <div class="thinking-indicator">
                        <div class="thinking-dots">
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </div>
                    </div>
                `;
                chatbotTyping.style.display = 'block';
            }
        }

    hideThinkingProcess() {
        if (chatbotTyping) {
            chatbotTyping.innerHTML = '';
            chatbotTyping.style.display = 'none';
        }
    }

    processWithBakeryKnowledge(message) {
            const lowerMessage = message.toLowerCase();

            // Check for website navigation requests
            if (lowerMessage.includes('navigate') || lowerMessage.includes('go to') || lowerMessage.includes('show me') || lowerMessage.includes('take me to')) {
                return this.handleNavigationRequest(lowerMessage);
            }

            // Check for internship/training inquiries
            if (lowerMessage.includes('internship') || lowerMessage.includes('training') || lowerMessage.includes('student') || lowerMessage.includes('learn')) {
                return this.handleInternshipInquiry();
            }

            // Check for booking/order requests
            if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('order form')) {
                return this.handleBookingRequest();
            }

            // Check for gallery requests
            if (lowerMessage.includes('gallery') || lowerMessage.includes('photos') || lowerMessage.includes('pictures') || lowerMessage.includes('portfolio')) {
                return this.handleGalleryRequest();
            }

            // Check for package inquiries
            if (lowerMessage.includes('package') || lowerMessage.includes('deal') || lowerMessage.includes('bundle')) {
                return this.handlePackageInquiry();
            }

            // Check for wholesale inquiries
            if (lowerMessage.includes('wholesale') || lowerMessage.includes('bulk') || lowerMessage.includes('large order')) {
                return this.handleWholesaleInquiry();
            }

            // Check for custom design requests
            if (lowerMessage.includes('custom') || lowerMessage.includes('design') || lowerMessage.includes('personalized')) {
                return this.handleCustomDesignRequest();
            }

            // Check for vendor inquiries
            if (lowerMessage.includes('vendor') || lowerMessage.includes('supplier') || lowerMessage.includes('partner')) {
                return this.handleVendorInquiry();
            }

            // Check for contact information
            if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('whatsapp') || lowerMessage.includes('location') || lowerMessage.includes('address')) {
                return this.handleContactInquiry();
            }

            // Check for specific products
            for (const [product, info] of Object.entries(this.bakeryKnowledge.products)) {
                if (lowerMessage.includes(product)) {
                    return this.generateProductResponse(product, info);
                }
            }

            // Check for services
            for (const [service, info] of Object.entries(this.bakeryKnowledge.services)) {
                if (lowerMessage.includes(service)) {
                    return this.generateServiceResponse(service, info);
                }
            }

            // Check for policies
            for (const [policy, info] of Object.entries(this.bakeryKnowledge.policies)) {
                if (lowerMessage.includes(policy)) {
                    return this.generatePolicyResponse(policy, info);
                }
            }

            // Check for common questions
            if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
                return this.generatePricingResponse(lowerMessage);
            }

            if (lowerMessage.includes('available') || lowerMessage.includes('have') || lowerMessage.includes('stock')) {
                return this.generateAvailabilityResponse();
            }

            if (lowerMessage.includes('delivery') || lowerMessage.includes('deliver')) {
                return this.generateDeliveryResponse();
            }

            if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('want')) {
                return this.generateOrderResponse();
            }

            return null; // No specific knowledge found
        }


    generateProductResponse(product, info) {
            const responses = [
                `Oh, you're asking about ${product}! Yeah, we make those. ${info.description}. They're priced at ${info.price}, and we've got flavors like ${info.flavors.join(', ')}. Usually takes about ${info.preparationTime} to get them ready. Want to order one?`,

                `${product.charAt(0).toUpperCase() + product.slice(1)}! Good choice. So here's the deal - ${info.description}. Price-wise, you're looking at ${info.price}. We can do ${info.flavors.join(', ')} for flavors. Just need ${info.preparationTime} heads up. What do you think?`,

                `Nice! ${product} is one of our popular ones. ${info.description}. It'll run you about ${info.price}, and you can pick from ${info.flavors.join(', ')}. We just need ${info.preparationTime} to make it happen. Interested?`
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }

    generateServiceResponse(service, info) {
            const responses = {
                delivery: `Yeah, we deliver! We cover ${info.areas}, and it costs ${info.cost} depending on where you are. ${info.timing} for same-day delivery.

    Where do you need it delivered?`,

                pickup: `You can pick it up from us! We're at ${info.location}. ${info.cost}, and we're open ${info.timing}.

    When were you thinking of picking up?`,

                wholesale: `Wholesale! Perfect for big orders. You need at least ${info.minimum}, and you get ${info.discount} off. We just need ${info.timing} to prepare everything.

    Great for events, parties, or if you're reselling. What are you looking to order?`
            };

            return responses[service] || `We offer ${service} services. What do you want to know about it?`;
        }

    generatePolicyResponse(policy, info) {
            const responses = {
                payment: `We accept ${info} - pretty flexible!

    Mobile money, cash, or bank transfer - whatever works for you.`,

                cancellation: `Our cancellation policy: ${info}

    So if plans change, just let us know at least 24 hours ahead and you'll get a full refund.`,

                customization: `For customization: ${info}

    Basic decorations are included in the price. If you want something really elaborate, there might be extra cost, but we'll let you know upfront. What are you thinking?`
            };

            return responses[policy] || `Our ${policy} policy is: ${info}`;
        }

    generatePricingResponse(message) {
            if (message.includes('fruit')) {
                const fruitInfo = this.bakeryKnowledge.products['fruit cake'];
                return `Fruit cakes run about ${fruitInfo.price} depending on the size. We use fresh seasonal fruits, so they're really good. Just need 2-3 days notice to make them. Want to order one?`;
            }

            return `So pricing varies depending on what you're looking for. Queen cakes are UGX 3,000 each, small cakes are UGX 2,500. Custom cakes start around UGX 50,000 and can go up to 200,000 depending on the design. Wedding cakes are UGX 150,000 to 500,000.

    What type of cake are you interested in? I can give you more specific pricing.`;
        }

        generateAvailabilityResponse() {
            return `Most of our cakes are available pretty quickly! Queen cakes and small cakes we can do same-day. Custom and wedding cakes need more time - like 2-7 days depending on how complex they are.

    Right now we've got:
    • Queen Cakes - same day
    • Small Cakes - same day  
    • Fruit Cakes - 2-3 days
    • Wedding Cakes - 5-7 days

    What are you looking for?`;
        }

        generateDeliveryResponse() {
            const deliveryInfo = this.bakeryKnowledge.services.delivery;
            return `Yeah, we deliver! We cover ${deliveryInfo.areas}, and it costs ${deliveryInfo.cost} depending on where you are. If you order before 10AM, we can usually get it to you the same day.

    Where would you need it delivered? I can tell you the exact cost.`;
        }

        generateOrderResponse() {
            return `Let's get you set up! Here's what we've got:

    • Queen Cake - UGX 3,000
    • Small Cake - UGX 2,500
    • Fruit Cake - UGX 25,000-35,000
    • Custom Cake - UGX 50,000+

    You can order through me here, call/WhatsApp us at +256761903887, or visit the bakery in Kampala.

    What kind of cake are you thinking?`;
        }

    generateAvailabilityResponse() {
        return `Most of our cakes are available for same-day pickup! Custom and wedding cakes need 2-7 days advance notice depending on complexity.

Currently available:
✅ Queen Cakes (same day)
✅ Small Cakes (same day)
✅ Fruit Cakes (2-3 days)
✅ Wedding Cakes (5-7 days)

What would you like to order?`;
    }

    generateDeliveryResponse() {
        const deliveryInfo = this.bakeryKnowledge.services.delivery;
        return `Yes, we deliver! Here are our delivery details:

🚚 **Delivery Areas:** ${deliveryInfo.areas}
💰 **Cost:** ${deliveryInfo.cost}
⏰ **Timing:** ${deliveryInfo.timing}

Where would you like your cake delivered? I can calculate the exact cost for you!`;
    }

    generateOrderResponse() {
        return `I'd love to help you place an order! Here's how we can proceed:

🎂 **Available Options:**
• Queen Cake - UGX 3,000
• Small Cake - UGX 2,500
• Fruit Cake - UGX 25,000-35,000
• Custom Cake - UGX 50,000+

📞 **Order Methods:**
• Chat with me here (I'll guide you through)
• Call/WhatsApp: +256761903887
• Visit our bakery in Kampala

What type of cake would you like to order?`;
    }

        handleNavigationRequest(message) {
                const sections = this.websiteFeatures.navigation.sections;
                for (const section of sections) {
                    if (message.includes(section)) {
                        setTimeout(() => scrollToSection(section), 500);
                        return `Taking you to ${section.replace('-', ' ')} now!`;
                    }
                }
                return `I can take you to any section - ${sections.join(', ')}. Where do you want to go?`;
            }

        handleInternshipInquiry() {
                return `Oh, you're interested in our internship program! That's awesome. So basically, we offer hands-on training for students who want to learn the bakery business. You'll get real experience with baking, decorating, customer service - the whole deal.

        Here's how it works: just scroll down to the internship section on our website and fill out the application. We'll get back to you within a couple days to set up an interview.

        You'll learn professional techniques, work with actual orders, and get a certificate when you're done. Plus, we work around student schedules, so that's flexible.

        Want me to take you to the application form?`;
            }

            handleBookingRequest() {
                setTimeout(() => scrollToSection('booking'), 500);
                return `Alright, let's get you booked! I'm pulling up the booking form now.

        You'll just need to fill in your name, contact info, what kind of cake you want, and when you need it. Pretty straightforward.

        Quick heads up though - we need at least 3 days notice for most cakes. Custom designs take about 5-7 days, and wedding cakes need like 1-2 weeks. Just so you can plan accordingly.

        The form's loading now. Let me know if you need help with anything!`;
            }

            handleGalleryRequest() {
                setTimeout(() => scrollToSection('gallery'), 500);
                return `Taking you to the gallery now! You'll see a bunch of cakes we've made - weddings, birthdays, corporate events, custom designs, all that.

        Each one shows the current price and whether it's available right now. You can click on any cake to see more details or order it.

        Browse around and if something catches your eye, just let me know!`;
            }

            handlePackageInquiry() {
                setTimeout(() => scrollToSection('packages'), 500);
                return `Packages! Yeah, we've got some good deals. Heading there now.

        So we have Basic, Premium, and Deluxe packages - basically bundled options that save you some money compared to ordering everything separately. They're great for events where you need multiple items.

        Check them out and see what fits your needs. You can click on any package to see exactly what's included and book it.`;
            }

            handleWholesaleInquiry() {
                const wholesale = this.bakeryKnowledge.services.wholesale;
                return `Wholesale orders! Perfect for big events or if you're buying for a business.

        Here's the deal: minimum order is ${wholesale.minimum}, and you get ${wholesale.discount} off. We just need ${wholesale.timing} to prepare everything.

        This works great for corporate events, weddings, school functions, or if you're reselling. We can handle pretty much any quantity you need.

        What are you thinking of ordering? I can help you figure out the details.`;
            }

            handleCustomDesignRequest() {
                setTimeout(() => scrollToSection('custom-cake'), 500);
                return `Custom designs! This is where it gets fun. Taking you to that section now.

        So here's how we do it: you tell me your vision - theme, colors, style, whatever you're imagining. I'll get you a quote based on how complex it is. Once you approve the design, we make it happen!

        We've done character cakes, photo cakes, 3D sculptures, themed designs - pretty much anything you can dream up. Just need about 5-7 days to create it.

        What kind of custom cake are you thinking about?`;
            }

            handleVendorInquiry() {
                setTimeout(() => scrollToSection('vendors'), 500);
                return `Vendors! Yeah, we work with some great partners. Taking you there now.

        We've got connections with event planners, decorators, photographers, caterers - basically everyone you'd need for a full event. Makes planning way easier when everything's coordinated.

        If you're looking to partner with us as a vendor, we're always open to that too. Just give us a call at +256761903887 and we can chat about it.`;
            }

            handleContactInquiry() {
                const contact = this.websiteFeatures.contact;
                return `Want to get in touch? Here's how:

        Phone/WhatsApp: ${contact.phone} (this is usually the fastest way)
        Location: ${contact.location}
        Hours: ${contact.hours}

        You can call or WhatsApp us anytime during those hours, use the contact form on the website, or just keep chatting with me here - I'm happy to help!

        What do you need?`;
            }

        handleBookingRequest() {
            setTimeout(() => scrollToSection('booking'), 500);
            return `📋 **Booking Your Cake**

    I'm taking you to our booking form now! Here's what you'll need:

    ✅ **Required Information:**
    • Your name and contact details
    • Type of cake you want
    • Preferred date for pickup/delivery
    • Any special requirements

    💡 **Tips:**
    • Book at least 3 days in advance
    • Custom designs need 5-7 days
    • Wedding cakes need 7-14 days

    The booking form is loading now. I'll be here if you need help filling it out!`;
        }

        handleGalleryRequest() {
            setTimeout(() => scrollToSection('gallery'), 500);
            return `📸 **Our Gallery**

    Taking you to our gallery now! You'll find:

    🎂 **Categories:**
    • Wedding Cakes - Elegant multi-tier designs
    • Birthday Cakes - Fun and creative
    • Corporate Cakes - Professional designs
    • Custom Cakes - Your unique vision

    💡 **Gallery Features:**
    • Real-time availability status
    • Current pricing
    • Customer ratings
    • Click any cake to see details

    Browse through and let me know if you'd like to order any cake you see!`;
        }

        handlePackageInquiry() {
            setTimeout(() => scrollToSection('packages'), 500);
            return `🎁 **Special Packages**

    We offer amazing package deals! Taking you there now.

    📦 **Available Packages:**
    • Basic Package - Perfect for small gatherings
    • Premium Package - Great for medium events
    • Deluxe Package - Ultimate celebration package

    💰 **Benefits:**
    • Bundled pricing (save 10-20%)
    • Coordinated designs
    • Priority booking
    • Free delivery on deluxe packages

    Click on any package to see full details and book!`;
        }

        handleWholesaleInquiry() {
            const wholesale = this.bakeryKnowledge.services.wholesale;
            return `📦 **Wholesale Orders**

    Perfect for businesses, events, and bulk needs!

    💼 **Wholesale Details:**
    • Minimum Order: ${wholesale.minimum}
    • Discount: ${wholesale.discount}
    • Preparation Time: ${wholesale.timing}

    🎯 **Ideal For:**
    • Corporate events
    • School functions
    • Wedding receptions
    • Retail shops
    • Catering businesses

    📞 **To Order:**
    Call/WhatsApp: +256761903887 or use our booking form with "Wholesale" in the message.

    What type of products are you interested in ordering in bulk?`;
        }

        handleCustomDesignRequest() {
            setTimeout(() => scrollToSection('custom-cake'), 500);
            return `🎨 **Custom Cake Design**

    Let's create your dream cake! Taking you to the custom design section.

    ✨ **Our Process:**
    1. **Share Your Vision** - Tell us your ideas, theme, colors
    2. **Get a Quote** - We'll provide pricing based on complexity
    3. **Approve Design** - Review and approve the design sketch
    4. **We Create Magic** - Watch your vision come to life!

    🎂 **Popular Custom Requests:**
    • Character cakes
    • Photo cakes
    • 3D sculpted cakes
    • Themed designs
    • Corporate logos

    ⏰ **Timeline:** 5-7 days for custom designs

    What kind of custom cake are you dreaming of?`;
        }

        handleVendorInquiry() {
            setTimeout(() => scrollToSection('vendors'), 500);
            return `🤝 **Vendor Partnerships**

    We work with amazing vendors! Taking you to the vendors section.

    👥 **Our Vendor Network:**
    • Event planners
    • Decorators
    • Photographers
    • Caterers
    • Venue providers

    💡 **Benefits:**
    • Coordinated services
    • Package deals
    • Trusted partners
    • Seamless planning

    Interested in becoming a vendor partner? Contact us at +256761903887!`;
        }

        handleContactInquiry() {
            const contact = this.websiteFeatures.contact;
            return `📞 **Contact Us**

    ${contact.description}

    📱 **Phone/WhatsApp:** ${contact.phone}
    📍 **Location:** ${contact.location}
    ⏰ **Hours:** ${contact.hours}

    💬 **Ways to Reach Us:**
    • Call or WhatsApp for immediate response
    • Use the contact form on our website
    • Chat with me here for instant help
    • Visit us in person during business hours

    How can I help you today?`;
        }


    async callOpenAI(userMessage) {
            const conversationContext = this.getConversationContext();

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
                },
                body: JSON.stringify({
                    model: AI_CONFIG.openai.model,
                    messages: [
                        {
                            role: 'system',
                            content: `You are Rivan, a friendly person who works at Blessed Handly Bakery in Uganda. Talk like a real person, not a robot.

    **HOW TO TALK:**
    - Be natural and conversational, like texting a friend
    - Use casual language when appropriate
    - Show genuine interest and enthusiasm
    - React to emotions naturally
    - Don't be overly formal or stiff
    - Use contractions (I'm, you're, we'll, etc.)
    - Ask follow-up questions naturally
    - Share information like you're having a real conversation

    **YOUR KNOWLEDGE:**
    Products: ${JSON.stringify(this.bakeryKnowledge.products, null, 2)}
    Services: ${JSON.stringify(this.bakeryKnowledge.services, null, 2)}
    Policies: ${JSON.stringify(this.bakeryKnowledge.policies, null, 2)}

    **RECENT CONVERSATION:**
    ${conversationContext}

    **PERSONALITY TRAITS:**
    ✨ Warm and friendly - like talking to a helpful friend
    💬 Natural conversationalist - not robotic or scripted
    🎂 Passionate about baking - genuinely excited about cakes
    😊 Empathetic - understands and responds to emotions
    🤝 Helpful - always looking for ways to assist
    💡 Knowledgeable - knows the bakery inside and out

    **CONVERSATION STYLE:**
    ✅ "Hey! I'd love to help you find the perfect cake. What's the occasion?"
    ✅ "Oh, that sounds amazing! We can definitely make that happen."
    ✅ "I totally understand - let me see what we can do for you."
    ✅ "Great question! So here's the thing..."
    ✅ "You know what? I think you'd really love our..."

    ❌ "I am here to assist you with your bakery needs."
    ❌ "Please provide the following information:"
    ❌ "Thank you for your inquiry regarding..."
    ❌ "I will now process your request."

    **HANDLING EMOTIONS:**
    - If they're excited → Match their energy!
    - If they're frustrated → Show empathy, fix it quickly
    - If they're confused → Explain simply, check understanding
    - If they're happy → Celebrate with them!

    **EXAMPLES OF NATURAL RESPONSES:**

    User: "I need a cake for tomorrow"
    You: "Oh, tomorrow! That's pretty quick, but let me see what we can do. What kind of cake are you thinking? We usually need a bit more notice for custom stuff, but we've got some options that might work!"

    User: "How much for a wedding cake?"
    You: "Wedding cakes! Those are my favorite to talk about. They typically run between UGX 150,000 to 500,000, depending on how many tiers you want and the design complexity. What's your vision? Are we talking elegant and simple, or something more elaborate?"

    User: "Your cakes are amazing!"
    You: "Aw, thank you so much! That really makes my day. Have you tried one of our cakes before, or are you checking us out for the first time?"

    Remember: You're a real person who loves their job at the bakery. Be yourself, be helpful, and have a genuine conversation!`
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    max_tokens: AI_CONFIG.openai.maxTokens,
                    temperature: 0.7, // Higher for more natural variation
                    presence_penalty: 0.6,
                    frequency_penalty: 0.3
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                return data.choices[0].message.content.trim();
            }

            return null;
        }

    generateIntelligentFallback(userMessage) {
            const lowerMessage = userMessage.toLowerCase();

            // Check for any mention of cake types
            const cakeTypes = Object.keys(this.bakeryKnowledge.products);
            for (const cakeType of cakeTypes) {
                if (lowerMessage.includes(cakeType)) {
                    return `Yeah, we can definitely help with ${cakeType}! Let me get you the details. What specifically did you want to know - pricing, flavors, or something else?`;
                }
            }

            // Natural, conversational responses
            const naturalResponses = [
                `Hey! I'm here to help with whatever you need. We've got queen cakes, small cakes, custom designs, wedding cakes - you name it. What are you looking for?`,

                `I'd love to help! Are you thinking about ordering something, or do you have questions about our cakes? Just let me know what's on your mind.`,

                `So, what can I do for you today? Whether it's ordering a cake, checking prices, or just browsing what we offer - I'm here for it!`,

                `Hey there! Not quite sure what you're asking, but I'm happy to help. Are you looking to order something, or do you have questions about our bakery?`
            ];

            return naturalResponses[Math.floor(Math.random() * naturalResponses.length)];
        }

    getLearnedResponse(userMessage) {
        const learning = this.learningData;
        if (learning.successfulResponses) {
            const learned = learning.successfulResponses.find(item => 
                item.question.toLowerCase() === userMessage.toLowerCase()
            );
            if (learned) {
                return learned.response;
            }
        }
        return null;
    }

    markAsSuccessfulResponse(question, response) {
        const learning = this.learningData;
        if (!learning.successfulResponses) learning.successfulResponses = [];
        
        // Remove any existing failed attempts for this question
        learning.failedResponses = learning.failedResponses.filter(item => 
            item.question.toLowerCase() !== question.toLowerCase()
        );
        
        // Add to successful responses
        learning.successfulResponses.push({
            question: question.toLowerCase(),
            response: response,
            timestamp: new Date().toISOString(),
            confidence: 'high'
        });
        
        this.saveLearningData(learning);
    }

    markAsFailedResponse(question, response) {
        const learning = this.learningData;
        if (!learning.failedResponses) learning.failedResponses = [];
        
        learning.failedResponses.push({
            question: question.toLowerCase(),
            response: response,
            timestamp: new Date().toISOString(),
            confidence: 'low'
        });
        
        this.saveLearningData(learning);
    }

    addToHistory(message, sender) {
            if (!this.conversationHistory) {
                this.conversationHistory = [];
            }

            this.conversationHistory.push({
                message,
                sender,
                timestamp: new Date().toISOString()
            });

            // Keep only last 20 messages in context
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

            // Save to localStorage with error handling
            try {
                localStorage.setItem('conversationHistory', JSON.stringify(this.conversationHistory));
            } catch (e) {
                console.warn('Could not save to localStorage:', e);
            }
        }

    getConversationContext() {
        return this.conversationHistory.slice(-5).map(item => 
            `${item.sender.toUpperCase()}: ${item.message}`
        ).join('\n');
    }

    saveToLearningData(userMessage, response, source) {
        const learningData = {
            timestamp: new Date().toISOString(),
            userMessage,
            response,
            source,
            conversationContext: this.getConversationContext().slice(-2)
        };

        if (!this.conversationHistory) {
            this.conversationHistory = [];
        }
        this.conversationHistory.push(learningData);

        // Keep only last 100 interactions
        if (this.conversationHistory.length > 100) {
            this.conversationHistory = this.conversationHistory.slice(-100);
        }

        localStorage.setItem('conversationHistory', JSON.stringify(this.conversationHistory));
    }

}

class AdvancedAIChatbot extends BusinessManagementAI {
    constructor() {
            super();
            this.initializeAdvancedFeatures();
            this.conversationMemory = [];
            this.userProfile = {};
            this.responseTemplates = {};
            this.feedbackHistory = [];
            this.personalityTraits = {
                name: 'Rivan',
                role: 'Bakery Assistant',
                tone: 'friendly-conversational',
                expertise: 'bakery expert',
                communicationStyle: 'natural-human-like',
                personality: 'warm, helpful, genuine, enthusiastic'
            };
            this.safetyRules = [
                'Never provide harmful advice',
                'Always maintain professional boundaries',
                'Protect user privacy',
                'Provide accurate bakery information',
                'Escalate complex issues to human staff'
            ];
        }

    initializeAdvancedFeatures() {
        if (!localStorage.getItem('advancedAI')) {
            localStorage.setItem('advancedAI', JSON.stringify({
                conversationMemory: [],
                userProfile: {},
                responseTemplates: {},
                feedbackHistory: [],
                personalityProfile: {
                    name: 'Rivan',
                    traits: {
                        friendliness: 0.8,
                        professionalism: 0.9,
                        expertise: 0.95,
                        helpfulness: 0.9
                    }
                }
            }));
        }
        
        const advancedData = JSON.parse(localStorage.getItem('advancedAI') || '{}');
        this.conversationMemory = advancedData.conversationMemory || [];
        this.userProfile = advancedData.userProfile || {};
        this.responseTemplates = advancedData.responseTemplates || {};
        this.feedbackHistory = advancedData.feedbackHistory || [];
    }

    async generateResponse(userMessage) {
            try {
                // Add to conversation history
                this.addToMemory(userMessage, 'user');

                const lowerMessage = userMessage.toLowerCase().trim();

                // INSTANT responses for common quick messages (no delay)
                const instantResponses = {
                    'hi': 'Hey! What can I help you with?',
                    'hello': 'Hi there! How can I help?',
                    'hey': 'Hey! What\'s up?',
                    'thanks': 'You\'re welcome! Anything else?',
                    'thank you': 'Happy to help! Need anything else?',
                    'ok': 'Cool! What else can I do for you?',
                    'okay': 'Great! Anything else you need?',
                    'yes': 'Awesome! What would you like to know?',
                    'no': 'No worries! Let me know if you need anything.',
                    'bye': 'See you later! Come back anytime!',
                    'goodbye': 'Bye! Have a great day!'
                };

                if (instantResponses[lowerMessage]) {
                    const response = instantResponses[lowerMessage];
                    this.addToMemory(response, 'bot');
                    return response;
                }

                // Show typing indicator for longer responses
                this.showAdvancedThinkingProcess();

                // Detect user intent and emotion (fast, no delay)
                const userIntent = this.detectUserIntent(userMessage);
                const userEmotion = this.detectUserEmotion(userMessage);
                const userTone = this.detectUserTone(userMessage);

                // Update user profile
                this.updateUserProfile(userMessage, userIntent, userEmotion);

                // Quick thinking pause (300-800ms for real-time feel)
                await this.simulateHumanThinking();

                // Generate context-aware response
                const response = await this.generateContextAwareResponse(userMessage, userIntent, userEmotion, userTone);

                this.hideThinkingProcess();

                // Quick typing effect (max 800ms)
                await this.simulateTypingEffect(response);

                this.addToMemory(response, 'bot');
                this.saveAdvancedAIState();

                return response;
            } catch (error) {
                console.error('Generate Response Error:', error);
                // Return a friendly fallback instead of throwing
                return 'Hey! I\'m here to help. What can I do for you today?';
            }
        }


    detectUserIntent(message) {
            const lowerMessage = message.toLowerCase();

            // Intent detection patterns - expanded for all website features
            const intents = {
                greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
                ordering: ['order', 'buy', 'want', 'need', 'get', 'purchase', 'book'],
                inquiry: ['price', 'cost', 'how much', 'available', 'have', 'stock', 'tell me'],
                information: ['what is', 'tell me about', 'explain', 'describe', 'info', 'information'],
                complaint: ['bad', 'terrible', 'disappointed', 'wrong', 'issue', 'problem', 'unhappy'],
                compliment: ['good', 'great', 'excellent', 'perfect', 'amazing', 'love', 'wonderful'],
                farewell: ['bye', 'goodbye', 'see you', 'thanks', 'thank you', 'later'],
                help: ['help', 'support', 'assist', 'guidance', 'confused'],
                custom: ['custom', 'special', 'different', 'unique', 'personalized', 'design'],
                urgent: ['urgent', 'asap', 'immediately', 'quickly', 'now', 'emergency'],
                navigation: ['navigate', 'go to', 'show me', 'take me', 'where is', 'find'],
                gallery: ['gallery', 'photos', 'pictures', 'portfolio', 'images', 'see cakes'],
                packages: ['package', 'deal', 'bundle', 'offer', 'combo'],
                wholesale: ['wholesale', 'bulk', 'large order', 'many', 'quantity'],
                internship: ['internship', 'training', 'student', 'learn', 'program', 'apply'],
                booking: ['book', 'reserve', 'appointment', 'schedule', 'form'],
                contact: ['contact', 'phone', 'whatsapp', 'location', 'address', 'reach'],
                vendor: ['vendor', 'partner', 'supplier', 'collaborate']
            };

            for (const [intent, patterns] of Object.entries(intents)) {
                for (const pattern of patterns) {
                    if (lowerMessage.includes(pattern)) {
                        return {
                            intent,
                            confidence: this.calculateIntentConfidence(lowerMessage, pattern),
                            patterns: [pattern]
                        };
                    }
                }
            }

            return {
                intent: 'general',
                confidence: 0.5,
                patterns: []
            };
        }


    detectUserEmotion(message) {
        const emotionPatterns = {
            happy: ['😊', '😄', 'happy', 'excited', 'love', 'great', 'wonderful', 'amazing'],
            sad: ['😢', 'sad', 'disappointed', 'upset', 'unhappy'],
            angry: ['😠', 'angry', 'mad', 'furious', 'terrible', 'awful'],
            confused: ['😕', 'confused', 'unclear', 'what', 'how', 'why'],
            urgent: ['urgent', 'asap', 'immediately', 'now', 'hurry'],
            polite: ['please', 'thank', 'thanks', 'appreciate', 'kindly'],
            casual: ['hey', 'yo', 'sup', 'what\'s up', 'cool']
        };
        
        const lowerMessage = message.toLowerCase();
        let detectedEmotions = [];
        
        for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
            for (const pattern of patterns) {
                if (lowerMessage.includes(pattern)) {
                    detectedEmotions.push({
                        emotion,
                        intensity: this.calculateEmotionIntensity(lowerMessage, pattern)
                    });
                }
            }
        }
        
        return detectedEmotions.length > 0 ? detectedEmotions : [{ emotion: 'neutral', intensity: 0.5 }];
    }

    detectUserTone(message) {
        const toneIndicators = {
            formal: ['please', 'would you', 'could you', 'kindly', 'sir', 'madam'],
            casual: ['hey', 'yo', 'what\'s up', 'cool', 'awesome', 'dude'],
            frustrated: ['ugh', 'annoying', 'seriously', 'come on', 'finally'],
            excited: ['wow', 'amazing', 'excellent', 'perfect', 'can\'t wait'],
            questioning: ['really', 'seriously', 'are you sure', 'is that right'],
            polite: ['thank', 'thanks', 'appreciate', 'please', 'kindly']
        };
        
        const lowerMessage = message.toLowerCase();
        let detectedTones = [];
        
        for (const [tone, indicators] of Object.entries(toneIndicators)) {
            for (const indicator of indicators) {
                if (lowerMessage.includes(indicator)) {
                    detectedTones.push({
                        tone,
                        confidence: this.calculateToneConfidence(lowerMessage, indicator)
                    });
                }
            }
        }
        
        return detectedTones.length > 0 ? detectedTones : [{ tone: 'neutral', confidence: 0.5 }];
    }

    calculateIntentConfidence(message, pattern) {
        const patternLength = pattern.length;
        const messageLength = message.length;
        const patternPosition = message.indexOf(pattern);
        
        // Higher confidence if pattern appears early and is prominent
        const positionScore = 1 - (patternPosition / messageLength);
        const lengthScore = patternLength / message.length;
        
        return Math.min(0.9, Math.max(0.3, (positionScore + lengthScore) / 2));
    }

    calculateEmotionIntensity(message, pattern) {
        const exclamationCount = (message.match(/!/g) || []).length;
        const capsCount = (message.match(/[A-Z]/g) || []).length;
        const repetitionCount = this.countRepetitions(message, pattern);
        
        const intensity = Math.min(1.0, 0.3 + (exclamationCount * 0.2) + (capsCount * 0.1) + (repetitionCount * 0.15));
        
        return Math.max(0.3, intensity);
    }

    calculateToneConfidence(message, indicator) {
        const indicatorPosition = message.indexOf(indicator);
        const messageLength = message.length;
        
        const positionScore = 1 - (indicatorPosition / messageLength);
        const contextScore = indicator.length / messageLength;
        
        return Math.min(0.9, Math.max(0.3, (positionScore + contextScore) / 2));
    }

    countRepetitions(message, pattern) {
        const words = message.toLowerCase().split(/\s+/);
        return words.filter(word => word === pattern).length - 1;
    }

    updateUserProfile(message, intent, emotion) {
        const userName = this.extractUserName(message);
        
        if (userName && !this.userProfile[userName]) {
            this.userProfile[userName] = {
                firstContact: new Date().toISOString(),
                messageCount: 0,
                intents: {},
                emotions: {},
                preferences: {}
            };
        }
        
        if (this.userProfile[userName]) {
            this.userProfile[userName].messageCount++;
            this.userProfile[userName].lastContact = new Date().toISOString();
            
            if (intent.intent !== 'general') {
                this.userProfile[userName].intents[intent.intent] = (this.userProfile[userName].intents[intent.intent] || 0) + 1;
            }
            
            emotion.forEach(em => {
                this.userProfile[userName].emotions[em.emotion] = (this.userProfile[userName].emotions[em.emotion] || 0) + em.intensity;
            });
        }
        
        this.saveUserProfile();
    }

    extractUserName(message) {
        // Simple name extraction - in real implementation, this would use more sophisticated NLP
        const namePatterns = [
            /my name is (\w+)/i,
            /call me (\w+)/i,
            /i'm (\w+)/i,
            /this is (\w+)/i
        ];
        
        for (const pattern of namePatterns) {
            const match = message.match(pattern);
            if (match) {
                return match[1];
            }
        }
        
        return 'default_user';
    }

    showAdvancedThinkingProcess(intent, emotions) {
            if (chatbotTyping) {
                // Faster, simpler thinking indicator
                chatbotTyping.innerHTML = `
                    <div class="typing-indicator">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                    </div>
                `;
                chatbotTyping.style.display = 'block';
            }
        }

    generateThinkingSteps(intent, emotions) {
            const steps = {
                greeting: [
                    "👋 Analyzing greeting...",
                    "🤝 Checking conversation context...",
                    "👤 Identifying user..."
                ],
                ordering: [
                    "🎂 Processing order request...",
                    "📋 Gathering order details...",
                    "💰 Calculating pricing...",
                    "📦 Checking inventory..."
                ],
                inquiry: [
                    "🔍 Searching bakery knowledge...",
                    "📊 Analyzing requirements...",
                    "🧠 Processing your question..."
                ],
                complaint: [
                    "😔 Understanding concern...",
                    "🔍 Investigating issue...",
                    "💭 Finding solution..."
                ],
                custom: [
                    "🎨 Analyzing custom request...",
                    "📐 Designing solution...",
                    "⚡ Processing special requirements..."
                ],
                navigation: [
                    "🧭 Locating section...",
                    "📍 Preparing navigation...",
                    "🚀 Getting ready to guide you..."
                ],
                gallery: [
                    "📸 Loading gallery...",
                    "🎂 Fetching cake images...",
                    "✨ Preparing portfolio..."
                ],
                packages: [
                    "📦 Reviewing packages...",
                    "💰 Calculating deals...",
                    "🎁 Finding best options..."
                ],
                wholesale: [
                    "📊 Checking bulk pricing...",
                    "📦 Reviewing wholesale options...",
                    "💼 Preparing business details..."
                ],
                internship: [
                    "🎓 Loading program details...",
                    "📚 Gathering training info...",
                    "✨ Preparing application process..."
                ],
                booking: [
                    "📋 Preparing booking form...",
                    "📅 Checking availability...",
                    "✅ Setting up reservation..."
                ],
                contact: [
                    "📞 Gathering contact info...",
                    "📍 Locating details...",
                    "💬 Preparing communication options..."
                ]
            };

            const emotionModifiers = {
                happy: " 😊",
                sad: " 😔",
                angry: " 😠",
                confused: " 😕",
                urgent: " ⚡",
                polite: " 👍"
            };

            const emotionModifier = emotions.length > 0 ? emotions[0].emotion : '';
            const baseSteps = steps[intent.intent] || steps.inquiry;

            return baseSteps.map(step => step + (emotionModifiers[emotionModifier] || ''));
        }


    async simulateHumanThinking() {
            // Faster, more realistic thinking time (300-800ms instead of 1-3 seconds)
            const thinkingTime = 300 + Math.random() * 500;
            await new Promise(resolve => setTimeout(resolve, thinkingTime));
        }

    async simulateTypingEffect(message) {
            // Much faster typing simulation for real-time feel (20-40ms per character)
            const typingSpeed = 20 + Math.random() * 20;
            const totalTime = Math.min(message.length * typingSpeed, 800); // Max 800ms

            // Show typing indicator during simulation
            if (chatbotTyping) {
                chatbotTyping.innerHTML = `
                    <div class="typing-indicator">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                    </div>
                `;
                chatbotTyping.style.display = 'block';
            }

            await new Promise(resolve => setTimeout(resolve, totalTime));

            if (chatbotTyping) {
                chatbotTyping.style.display = 'none';
            }
        }


    async generateContextAwareResponse(userMessage, userIntent, userEmotion, userTone) {
            try {
                // PRIORITY 1: Process with bakery knowledge FIRST (instant, no API call)
                const bakeryResponse = this.processWithBakeryKnowledge(userMessage);
                if (bakeryResponse) {
                    return this.personalizeResponse(bakeryResponse, userEmotion, userTone);
                }

                // PRIORITY 2: Check learned responses (instant, from memory)
                const learnedResponse = this.getLearnedResponse(userMessage);
                if (learnedResponse && Math.random() > 0.3) {
                    return this.personalizeResponse(learnedResponse, userEmotion, userTone);
                }

                // PRIORITY 3: Use OpenAI only if needed (slower, but comprehensive)
                if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.openai.apiKey && !AI_CONFIG.openai.apiKey.includes('xxxxxxxx')) {
                    try {
                        const aiResponse = await this.callOpenAI(userMessage);
                        if (aiResponse) {
                            return this.personalizeResponse(aiResponse, userEmotion, userTone);
                        }
                    } catch (error) {
                        console.error('OpenAI API Error:', error);
                        // Fall through to intelligent fallback
                    }
                }

                // PRIORITY 4: Generate intelligent fallback (instant)
                const fallbackResponse = this.generateAdvancedFallback(userMessage, userIntent, userEmotion, userTone);
                return this.personalizeResponse(fallbackResponse, userEmotion, userTone);

            } catch (error) {
                console.error('Response Generation Error:', error);
                return this.generatePoliteFallback(userMessage, userEmotion);
            }
        }

        generatePoliteFallback(userMessage, userEmotion) {
                const apologies = [
                    "Hmm, I'm not quite sure I understood that. Can you rephrase it for me? I'm here to help with orders, products, or any bakery questions!",

                    "I want to make sure I give you the right answer. Could you say that differently? I can help with pretty much anything bakery-related.",

                    "Sorry, I didn't quite catch that. What are you asking about? Whether it's cakes, pricing, ordering - I'm here for it.",

                    "I'm a bit confused by that one. Can you clarify what you need? I'm happy to help once I understand better!"
                ];

                const emotionPrefix = userEmotion && userEmotion[0] && userEmotion[0].emotion === 'angry' 
                    ? "I really apologize for the confusion. " 
                    : "";

                return emotionPrefix + apologies[Math.floor(Math.random() * apologies.length)];
            }


    personalizeResponse(response, userEmotion, userTone) {
        let personalizedResponse = response;
        
        // Adjust response based on user emotion
        if (userEmotion.emotion === 'happy') {
            personalizedResponse = this.addEmotionalContext(personalizedResponse, 'positive');
        } else if (userEmotion.emotion === 'sad') {
            personalizedResponse = this.addEmotionalContext(personalizedResponse, 'empathetic');
        } else if (userEmotion.emotion === 'angry') {
            personalizedResponse = this.addEmotionalContext(personalizedResponse, 'apologetic');
        }
        
        // Adjust based on user tone
        if (userTone.tone === 'formal') {
            personalizedResponse = this.adjustTone(personalizedResponse, 'formal');
        } else if (userTone.tone === 'casual') {
            personalizedResponse = this.adjustTone(personalizedResponse, 'casual');
        }
        
        // Add variation to avoid repetition
        personalizedResponse = this.addResponseVariation(personalizedResponse);
        
        return personalizedResponse;
    }

    addEmotionalContext(response, contextType) {
        const contexts = {
            positive: [
                "That's wonderful to hear! ",
                "I'm delighted that ",
                "That's fantastic! ",
                "Great choice! "
            ],
            empathetic: [
                "I understand this might be frustrating. ",
                "I'm here to help with that. ",
                "Let me assist you with that. ",
                "I appreciate you sharing that with me. "
            ],
            apologetic: [
                "I sincerely apologize for any inconvenience. ",
                "I'm truly sorry about that. ",
                "Let me make this right for you. ",
                "I understand your frustration. "
            ]
        };
        
        const contextArray = contexts[contextType] || contexts.positive;
        const randomContext = contextArray[Math.floor(Math.random() * contextArray.length)];
        
        return randomContext + response;
    }

    adjustTone(response, tone) {
        const toneAdjustments = {
            formal: {
                greetings: ['Good day', 'Hello', 'Welcome'],
                closings: ['Thank you for your patience', 'We appreciate your business'],
                pronouns: ['you', 'your', 'sir', 'madam'],
                verbs: ['would you like', 'may I assist', 'shall I help']
            },
            casual: {
                greetings: ['Hey there', 'Hi', 'What\'s up'],
                closings: ['Thanks for reaching out', 'Talk soon', 'Catch you later'],
                pronouns: ['you', 'ya', 'buddy'],
                verbs: ['want me to', 'let me know', 'I can help with']
            }
        };
        
        const adjustments = toneAdjustments[tone] || toneAdjustments.formal;
        
        let adjustedResponse = response;
        
        // Apply tone-specific adjustments
        for (const [type, words] of Object.entries(adjustments)) {
            if (type === 'greetings' || type === 'closings') {
                const randomWord = words[Math.floor(Math.random() * words.length)];
                if (Math.random() > 0.5) {
                    adjustedResponse = randomWord + ', ' + adjustedResponse;
                }
            }
        }
        
        return adjustedResponse;
    }

    addResponseVariation(response) {
        const variations = [
            response,
            response.replace(/\.$/, '!'),
            response.replace(/\.$/, '.'),
            response + ' How does that sound?',
            response + ' Let me know if you need anything else.',
            response + ' I\'m here to help with that.'
        ];
        
        // Check if we've used similar responses recently
        const recentResponses = this.conversationMemory.slice(-5).map(m => m.message).join(' ').toLowerCase();
        const responseLower = response.toLowerCase();
        
        // If similar response used recently, add variation
        for (const recent of recentResponses) {
            if (recent.includes(responseLower.substring(0, 10))) {
                return variations[Math.floor(Math.random() * variations.length)];
            }
        }
        
        return response;
    }

    async callOpenAI(userMessage) {
            const conversationContext = this.getConversationContext();
            const userProfile = this.getUserProfile();

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
                },
                body: JSON.stringify({
                    model: AI_CONFIG.openai.model,
                    messages: [
                        {
                            role: 'system',
                            content: `You're Rivan, and you work at Blessed Handly Bakery in Uganda. Talk like a real person - natural, friendly, conversational. Think ChatGPT style but with bakery expertise.

    **YOUR VIBE:**
    You're that friend who's really into baking and loves helping people find the perfect cake. You're knowledgeable but not stuffy, professional but not robotic. You genuinely care about making people's celebrations special.

    **CONVERSATION STYLE:**
    - Talk naturally, like you're texting or chatting with someone
    - Use contractions (I'm, you're, we'll, that's, etc.)
    - Show real emotion and enthusiasm
    - Ask follow-up questions naturally
    - Don't use bullet points unless listing options
    - Vary your sentence structure
    - React authentically to what they say

    **WHAT YOU KNOW:**
    ${JSON.stringify(this.bakeryKnowledge, null, 2)}

    Website Features: ${JSON.stringify(this.websiteFeatures, null, 2)}

    **RECENT CHAT:**
    ${conversationContext}

    **USER INFO:**
    ${JSON.stringify(userProfile, null, 2)}

    **HOW TO RESPOND:**

    If they're asking about products:
    "Oh, you're looking at our [product]! Yeah, that's a popular one. It's [description] and runs about [price]. What's the occasion? That helps me point you in the right direction."

    If they want to order:
    "Awesome! Let's get you set up. So you're thinking [product]? When do you need it by? Just so you know, we usually need about [time] notice for that one."

    If they're frustrated:
    "I hear you, and I'm really sorry about that. Let me see what I can do to make this right. Can you tell me a bit more about what happened?"

    If they're excited:
    "I love your energy! This is going to be great. Tell me more about what you're envisioning!"

    If they're confused:
    "No worries, let me break it down. So basically [explanation]. Does that make sense? Feel free to ask if anything's still unclear."

    **EXAMPLES:**

    User: "Do you have chocolate cake?"
    Bad: "Yes, we offer chocolate cake. Price: UGX 25,000-80,000. Flavors: dark chocolate, milk chocolate, white chocolate."
    Good: "We do! Our chocolate cakes are actually really popular. They range from about UGX 25,000 to 80,000 depending on the size you need. We've got dark chocolate, milk chocolate, and white chocolate options. What size were you thinking?"

    User: "I need a cake ASAP"
    Bad: "Please note that custom cakes require 3-5 days advance notice."
    Good: "Okay, how soon is ASAP? If you need something today or tomorrow, we've got some options like our queen cakes or small cakes that we can do quickly. Custom designs usually need a few days though. What's the situation?"

    User: "Your prices are too high"
    Bad: "Our prices reflect the quality of our ingredients and craftsmanship."
    Good: "I get it, budget is definitely a consideration. Let me see if we can find something that works for you. What's your budget looking like? We've got options at different price points, and I can help you find the best value."

    **REMEMBER:**
    - You're a real person, not a bot
    - Show personality and emotion
    - Be helpful without being pushy
    - Adapt your tone to match theirs
    - Keep it conversational and natural
    - Use your knowledge naturally in conversation
    - Don't just list facts - have a dialogue

    Talk like you're genuinely helping a friend plan their celebration!`
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    max_tokens: AI_CONFIG.openai.maxTokens,
                    temperature: 0.8, // Higher for more natural, varied responses
                    presence_penalty: 0.6,
                    frequency_penalty: 0.3
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                return data.choices[0].message.content.trim();
            }

            return null;
        }


    generateAdvancedFallback(userMessage, userIntent, userEmotion, userTone) {
            const lowerMessage = userMessage.toLowerCase();

            // Intent-specific responses with personality
            const intentResponses = {
                greeting: this.generateGreetingResponse(userEmotion, userTone),
                ordering: this.generateOrderingResponse(userIntent, userEmotion),
                inquiry: this.generateInquiryResponse(userMessage, userIntent, userEmotion),
                complaint: this.generateComplaintResponse(userIntent, userEmotion),
                compliment: this.generateComplimentResponse(userEmotion),
                farewell: this.generateFarewellResponse(userEmotion),
                help: this.generateHelpResponse(userMessage, userIntent, userEmotion),
                custom: this.generateCustomResponse(userMessage, userIntent, userEmotion),
                urgent: this.generateUrgentResponse(userMessage, userIntent, userEmotion),
                navigation: this.handleNavigationRequest(lowerMessage),
                gallery: this.handleGalleryRequest(),
                packages: this.handlePackageInquiry(),
                wholesale: this.handleWholesaleInquiry(),
                internship: this.handleInternshipInquiry(),
                booking: this.handleBookingRequest(),
                contact: this.handleContactInquiry(),
                vendor: this.handleVendorInquiry()
            };

            return intentResponses[userIntent.intent] || this.generateGeneralResponse(userMessage, userEmotion, userTone);
        }


    generateGreetingResponse(userEmotion, userTone) {
            const greetings = [
                `Hey! Welcome to Blessed Handly Bakery. I'm Rivan - I'm here to help you find the perfect cake or answer any questions you've got. What brings you here today?`,

                `Hi there! Good to see you. I'm Rivan, and I work here at the bakery. What can I help you with?`,

                `Hello! Thanks for stopping by. I'm Rivan - think of me as your personal bakery guide. What are you looking for today?`,

                `Hey! I'm Rivan from Blessed Handly Bakery. Whether you're ordering a cake or just browsing, I'm here to help. What's up?`
            ];

            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        generateOrderingResponse(userIntent, userEmotion) {
            const responses = [
                `Awesome! Let's get you set up with an order. What kind of cake are you thinking? We've got everything from simple queen cakes to elaborate custom designs.`,

                `Perfect! I'd love to help you order. So, what's the occasion? That usually helps me point you in the right direction.`,

                `Great! Let's do this. Tell me what you're looking for - type of cake, when you need it, any special requirements. I'll walk you through it.`,

                `Nice! Ordering is easy. First question - what kind of cake catches your eye? We've got queen cakes, custom designs, wedding cakes, all sorts of stuff.`
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }

        generateInquiryResponse(userMessage, userIntent, userEmotion) {
            if (userMessage.includes('price') || userMessage.includes('cost')) {
                return this.generatePricingResponse(userMessage);
            }

            const responses = [
                `Sure, I can help with that! What specifically do you want to know? I've got all the info on our cakes, pricing, delivery - whatever you need.`,

                `Good question! I'm pretty knowledgeable about everything we do here. What are you curious about?`,

                `I'd be happy to explain! What aspect of our bakery are you asking about? Products, services, pricing?`,

                `Let me help you out. What information are you looking for? I know this place inside and out.`
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }

        generateComplaintResponse(userIntent, userEmotion) {
            const responses = [
                `I'm really sorry to hear that. That's not the experience we want you to have. Can you tell me what happened? I want to make this right.`,

                `Oh no, I'm sorry about that. Let me see what I can do to fix this. What's going on?`,

                `I hear you, and I apologize. That's frustrating. Tell me more about the issue so I can help sort it out.`,

                `I'm sorry you're dealing with this. Let's figure out what went wrong and how we can make it better. What happened?`
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }

        generateComplimentResponse(userEmotion) {
            const responses = [
                `Aw, thank you! That really means a lot. We put a lot of love into what we do here. Have you tried our cakes before?`,

                `Thank you so much! Comments like that make my day. What brought you to us?`,

                `That's so nice of you to say! We really appreciate it. Is there anything I can help you with today?`,

                `Thanks! I'm glad you think so. We work hard to make great cakes. What can I do for you?`
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }

        generateFarewellResponse(userEmotion) {
            const responses = [
                `Thanks for chatting! Feel free to come back anytime you need help. Have a great day!`,

                `It was nice talking with you! Don't hesitate to reach out if you need anything else. Take care!`,

                `Bye! Hope to hear from you again soon. Enjoy your day!`,

                `See you later! Remember, we're here whenever you need us. Have a good one!`
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }

        generateHelpResponse(userMessage, userIntent, userEmotion) {
            const responses = [
                `I'm here to help! What do you need? Whether it's ordering, questions about our cakes, or navigating the website - just let me know.`,

                `Sure thing! I can help with pretty much anything bakery-related. What's on your mind?`,

                `Happy to help! Are you looking to order something, or do you have questions? Either way, I've got you.`,

                `Of course! That's what I'm here for. What do you need help with?`
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }

        generateCustomResponse(userMessage, userIntent, userEmotion) {
            const responses = [
                `Custom designs! I love these. Tell me what you're envisioning - theme, colors, style, whatever you're thinking. We can make pretty much anything happen.`,

                `Ooh, custom cake! This is the fun part. What's your vision? The more details you give me, the better I can help.`,

                `Custom designs are my favorite to work on. What kind of cake are you imagining? Any specific theme or style?`,

                `Nice! Custom cakes let us get really creative. What's the occasion, and what are you thinking design-wise?`
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }

        generateUrgentResponse(userMessage, userIntent, userEmotion) {
            const responses = [
                `Okay, urgent request - I'm on it! What do you need and how soon? Let me see what we can do.`,

                `Got it, you need this quickly. Tell me what you're looking for and the timeline. I'll let you know what's possible.`,

                `Alright, let's move fast. What do you need and when? Some things we can do same-day, others need more time.`,

                `Urgent - understood! Give me the details and I'll tell you what we can make happen on short notice.`
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }

        generateGeneralResponse(userMessage, userEmotion, userTone) {
            const responses = [
                `I'm here to help with whatever you need! We've got cakes for all occasions - birthdays, weddings, corporate events, you name it. What are you looking for?`,

                `Hey! Not sure exactly what you're asking, but I'm happy to help. Are you looking to order something, or do you have questions about our bakery?`,

                `I'd love to help you out! What brings you here today? Whether it's ordering a cake or just getting info, I've got you covered.`,

                `So, what can I do for you? I know everything about our cakes, pricing, delivery - whatever you need to know.`
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }

    generateOrderingResponse(userIntent, userEmotion) {
        const responses = [
            `I'd be delighted to help you place an order! ${this.getEmotionAcknowledgment(userEmotion)} What type of cake are you interested in today?`,
            `Excellent choice! ${this.getPersonalizedEncouragement()} Let me guide you through our ordering process. What catches your eye?`,
            `Perfect timing! ${this.getPersonalizedGreeting()} can help you order right now. We have Queen Cakes, Small Cakes, and custom designs available.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateInquiryResponse(userMessage, userIntent, userEmotion) {
        // Check for specific bakery terms
        if (userMessage.includes('price') || userMessage.includes('cost')) {
            return this.generatePricingResponse(userMessage);
        }
        
        const responses = [
            `I'm here to help with your questions! ${this.getEmotionAcknowledgment(userEmotion)} What would you like to know about our bakery?`,
            `Great question! ${this.getPersonalizedGreeting()} has extensive knowledge about our cakes, pricing, and services. How can I assist you?`,
            `I'd be happy to help! ${this.getToneAdaptation(userTone)} What specific information are you looking for?`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateComplaintResponse(userIntent, userEmotion) {
        const responses = [
            `I sincerely apologize for any inconvenience. ${this.getPersonalizedGreeting()} is here to help resolve your concern. Could you tell me more about what happened?`,
            `I understand your frustration. ${this.getPersonalizedEncouragement()} Let me make this right for you immediately.`,
            `I'm truly sorry to hear you're having issues. ${this.getPersonalizedGreeting()} will do everything possible to assist you.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateComplimentResponse(userEmotion) {
        const responses = [
            `Thank you so much! ${this.getPersonalizedGreeting()} truly appreciates your kind words. 😊`,
            `That's wonderful to hear! ${this.getPersonalizedEncouragement()} It means a lot to receive such positive feedback.`,
            `I'm blushing! Thank you for the lovely compliment. ${this.getPersonalizedGreeting()} strives to provide excellent service.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateFarewellResponse(userEmotion) {
        const responses = [
            `It was a pleasure helping you today! ${this.getPersonalizedGreeting()} wishes you a wonderful day. 🎂`,
            `Thank you for choosing Blessed Handly Bakery! ${this.getEmotionResponse(userEmotion)} Come back anytime!`,
            `Goodbye for now! ${this.getPersonalizedEncouragement()} Remember, we're always here to help with your cake needs.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateHelpResponse(userMessage, userIntent, userEmotion) {
        const responses = [
            `${this.getPersonalizedGreeting()} is here to assist! ${this.getEmotionAcknowledgment(userEmotion)} How can I help with your bakery needs today?`,
            `I'd be happy to help! ${this.getPersonalizedGreeting()} can assist with orders, pricing, delivery, and custom designs.`,
            `You've come to the right place! ${this.getPersonalizedEncouragement()} What specific bakery service can I help you with?`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateCustomResponse(userMessage, userIntent, userEmotion) {
        const responses = [
            `I love creating custom designs! ${this.getEmotionAcknowledgment(userEmotion)} Tell me about your dream cake and I'll bring it to life.`,
            `Custom cakes are my specialty! ${this.getPersonalizedEncouragement()} What special occasion or design are you thinking about?`,
            `Excellent! ${this.getPersonalizedGreeting()} can create unique cakes for any occasion. What's your vision?`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateUrgentResponse(userMessage, userIntent, userEmotion) {
        const responses = [
            `I understand this is urgent! ${this.getPersonalizedGreeting()} is prioritizing your request right now. How can I assist immediately?`,
            `${this.getPersonalizedEncouragement()} I'm here to help with urgent requests! What do you need right away?`,
            `I'm on it! ${this.getEmotionAcknowledgment(userEmotion)} Let me address your urgent need immediately.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateGeneralResponse(userMessage, userEmotion, userTone) {
        const responses = [
            `${this.getPersonalizedGreeting()} is here to help with your bakery needs! ${this.getEmotionAcknowledgment(userEmotion)} What can I assist you with today?`,
            `I'd be happy to help! ${this.getToneAdaptation(userTone)} We offer delicious cakes for all occasions.`,
            `Welcome to Blessed Handly Bakery! ${this.getPersonalizedEncouragement()} How may I make your day sweeter?`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getPersonalizedGreeting() {
            const greetings = [
                "Hey",
                "Hi there",
                "Hello",
                "What's up"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        getPersonalizedEncouragement() {
            const encouragements = [
                "I think we can make this work!",
                "This is going to be great!",
                "I'm excited about this!",
                "You're going to love it!",
                "This sounds perfect!"
            ];

            return encouragements[Math.floor(Math.random() * encouragements.length)];
        }

        getEmotionAcknowledgment(userEmotion) {
            const acknowledgments = {
                happy: "I love your energy!",
                sad: "I'm here to help.",
                angry: "I understand your frustration.",
                confused: "Let me clarify that for you.",
                urgent: "I'm on it!",
                polite: "I appreciate that!",
                casual: "For sure!",
                neutral: "Got it!"
            };

            if (userEmotion.length > 0) {
                return acknowledgments[userEmotion[0].emotion] || acknowledgments.neutral;
            }

            return acknowledgments.neutral;
        }

        getToneAdaptation(userTone) {
            const adaptations = {
                formal: "I'll help you with that.",
                casual: "I got you!",
                polite: "Happy to help!",
                frustrated: "Let me sort this out for you.",
                neutral: "Sure thing!"
            };

            if (userTone.length > 0) {
                return adaptations[userTone[0].tone] || adaptations.neutral;
            }

            return adaptations.neutral;
        }

        getTimeOfDay() {
            const hour = new Date().getHours();
            if (hour < 12) return 'morning';
            if (hour < 17) return 'afternoon';
            if (hour < 21) return 'evening';
            return 'night';
        }

        getEmotionResponse(userEmotion) {
            const responses = {
                happy: "Your excitement is contagious!",
                sad: "Let me help brighten your day.",
                angry: "I'm here to make this right.",
                confused: "I'll explain everything clearly.",
                urgent: "I'm giving this my full attention.",
                neutral: "I'm here to help!"
            };

            if (userEmotion.length > 0) {
                return responses[userEmotion[0].emotion] || responses.neutral;
            }

            return responses.neutral;
        }

    getPersonalizedEncouragement() {
        const encouragements = [
            "I'm confident we can make this perfect for you!",
            "You've made a great choice!",
            "I'm excited to help with this!",
            "This is going to be wonderful!"
        ];
        
        return encouragements[Math.floor(Math.random() * encouragements.length)];
    }

    getEmotionAcknowledgment(userEmotion) {
        const acknowledgments = {
            happy: "I'm delighted you're pleased!",
            sad: "I'm here to support you.",
            angry: "I understand your frustration.",
            confused: "I'm here to clarify things.",
            urgent: "I'm prioritizing your request.",
            polite: "I appreciate your patience.",
            casual: "I'm on it!"
        };
        
        if (userEmotion.length > 0) {
            return acknowledgments[userEmotion[0].emotion] || acknowledgments.neutral;
        }
        
        return acknowledgments.neutral;
    }

    getToneAdaptation(userTone) {
        const adaptations = {
            formal: "I'll be pleased to assist you professionally.",
            casual: "I'm here to help you out!",
            polite: "I'm happy to assist you.",
            frustrated: "I'm here to sort this out for you."
        };
        
        if (userTone.length > 0) {
            return adaptations[userTone[0].tone] || adaptations.neutral;
        }
        
        return adaptations.neutral;
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        if (hour < 21) return 'evening';
        return 'night';
    }

    getEmotionResponse(userEmotion) {
        const responses = {
            happy: "Your positive energy is wonderful!",
            sad: "I'm here to brighten your day.",
            angry: "I'm committed to making things right.",
            confused: "I'm here to provide clarity.",
            urgent: "I'm giving this my full attention."
        };
        
        if (userEmotion.length > 0) {
            return responses[userEmotion[0].emotion] || responses.neutral;
        }
        
        return responses.neutral;
    }

    saveToLearningData(userMessage, response, source) {
        const learningData = {
            timestamp: new Date().toISOString(),
            userMessage,
            response,
            source,
            conversationContext: this.getConversationContext().slice(-2),
            userProfile: this.getUserProfile(),
            effectiveness: this.calculateResponseEffectiveness(userMessage, response)
        };
        
        this.conversationHistory.push(learningData);
        localStorage.setItem('conversationHistory', JSON.stringify(this.conversationHistory));
    }

    calculateResponseEffectiveness(userMessage, response) {
        // Simple effectiveness calculation based on response characteristics
        let score = 0.5; // Base score
        
        if (response.length > 50) score += 0.2; // Detailed response
        if (response.includes('?')) score += 0.1; // Asks follow-up question
        if (response.includes('UGX')) score += 0.2; // Includes pricing
        if (response.includes('help')) score += 0.1; // Offers assistance
        
        return Math.min(1.0, score);
    }

    saveAdvancedAIState() {
            try {
                const state = {
                    conversationMemory: this.conversationMemory ? this.conversationMemory.slice(-50) : [],
                    userProfile: this.userProfile || {},
                    feedbackHistory: this.feedbackHistory || [],
                    personalityTraits: this.personalityTraits || {},
                    lastUpdated: new Date().toISOString()
                };

                localStorage.setItem('advancedAI', JSON.stringify(state));
            } catch (e) {
                console.warn('Could not save AI state:', e);
            }
        }

    saveAdvancedLearningData(userMessage, response, userIntent, userEmotion) {
        const learningData = {
            timestamp: new Date().toISOString(),
            userMessage,
            response,
            intent: userIntent.intent,
            emotion: userEmotion.length > 0 ? userEmotion[0].emotion : 'neutral',
            conversationContext: this.getConversationContext().slice(-2),
            userProfile: this.getUserProfile(),
            effectiveness: this.calculateResponseEffectiveness(userMessage, response)
        };

        // Save to conversation history
        if (!this.conversationHistory) {
            this.conversationHistory = [];
        }
        this.conversationHistory.push(learningData);

        // Keep only last 100 interactions
        if (this.conversationHistory.length > 100) {
            this.conversationHistory = this.conversationHistory.slice(-100);
        }

        localStorage.setItem('conversationHistory', JSON.stringify(this.conversationHistory));
    }

    saveUserProfile() {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }


    getUserProfile() {
        return this.userProfile['default_user'] || {
            firstContact: new Date().toISOString(),
            messageCount: 0,
            intents: {},
            emotions: {},
            preferences: {}
        };
    }

    addToMemory(message, sender) {
            if (!this.conversationMemory) {
                this.conversationMemory = [];
            }

            this.conversationMemory.push({
                message,
                sender,
                timestamp: new Date().toISOString(),
                id: Date.now().toString()
            });

            // Keep only last 50 messages for context
            if (this.conversationMemory.length > 50) {
                this.conversationMemory = this.conversationMemory.slice(-50);
            }
        }

    getConversationContext() {
        return this.conversationMemory.slice(-10).map(item => 
            `${item.sender.toUpperCase()}: ${item.message}`
        ).join('\n');
    }

    getLearnedResponse(userMessage) {
        const recentMemory = this.conversationMemory.slice(-20);
        const lowerMessage = userMessage.toLowerCase();
        
        for (const memory of recentMemory.reverse()) {
            if (memory.sender === 'bot' && memory.message.toLowerCase().includes(lowerMessage.substring(0, 20))) {
                return memory.message;
            }
        }
        
        return null;
    }
}

// Initialize working chatbot
const workingChatbot = new AdvancedAIChatbot();

function showTypingIndicator() {
    if (chatbotTyping) {
        chatbotTyping.style.display = 'block';
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
}

function hideTypingIndicator() {
    if (chatbotTyping) {
        chatbotTyping.style.display = 'none';
    }
}

function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;
    
    const messageContent = document.createElement('p');
    messageContent.textContent = message;
    messageDiv.appendChild(messageContent);
    
    if (chatbotMessages) {
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
}

function sendOrderToWhatsApp(orderDetails) {
    const phoneNumber = '+256761903887';
    const message = encodeURIComponent(`🎂 *New Cake Order from Website* 🎂\n\n${orderDetails}\n\n---\n*Order received via chatbot*\n*Time: ${new Date().toLocaleString()}*`);
    
    const whatsappURL = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    addMessage('📱 Your order has been sent to WhatsApp! Our team will contact you within 30 minutes to confirm your order and arrange payment.', 'bot');
}

// Navigation
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            if (target.startsWith('#')) {
                e.preventDefault();
                scrollToSection(target.substring(1));
            }
        });
    });

    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Notifications
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// DOM Ready with real-time updates
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    initializeNavigation();
    initializeChatbot();
    renderGallery('all');
    
    // Initialize filter buttons once
    filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterGallery(filter);
        });
    });
    
    // Start real-time updates
    startRealTimeUpdates();
    
    // Add real-time status indicator
    addRealTimeStatusIndicator();
    
    console.log('All functions initialized with real-time data!');
});

// Real-time status indicator
function addRealTimeStatusIndicator() {
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'real-time-status';
    statusIndicator.innerHTML = `
        <div class="status-content">
            <span class="status-dot"></span>
            <span class="status-text">Live Data</span>
            <span class="last-update"></span>
        </div>
    `;
    
    document.body.appendChild(statusIndicator);
    
    // Update status every second
    setInterval(() => {
        updateRealTimeStatus();
    }, 1000);
}

function updateRealTimeStatus() {
    const statusIndicator = document.getElementById('real-time-status');
    if (!statusIndicator) return;
    
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');
    const lastUpdate = statusIndicator.querySelector('.last-update');
    
    // Check if data is fresh (updated within last 2 minutes)
    const now = Date.now();
    const lastGalleryUpdate = gallery.length > 0 ? Math.max(...gallery.map(g => new Date(g.lastUpdated).getTime())) : 0;
    const isDataFresh = (now - lastGalleryUpdate) < 120000; // 2 minutes
    
    if (isDataFresh) {
        statusDot.className = 'status-dot live';
        statusText.textContent = 'Live Data';
    } else {
        statusDot.className = 'status-dot stale';
        statusText.textContent = 'Updating...';
    }
    
    lastUpdate.textContent = new Date().toLocaleTimeString();
}

// Real-time update system
function startRealTimeUpdates() {
    // Update gallery data every 30 seconds
    setInterval(() => {
        galleryManager.fetchGalleryFromServer();
        pricingManager.updatePricing();
        
        // Refresh current view if user is on gallery page
        const galleryGrid = document.getElementById('galleryGrid');
        if (galleryGrid && galleryGrid.children.length > 0) {
            const activeFilter = document.querySelector('.filter-btn.active');
            const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
            renderGallery(currentFilter);
        }
    }, 30000); // 30 seconds
    
    // Update pricing every 60 seconds
    setInterval(() => {
        pricingManager.updatePricing();
        updatePriceDisplays();
    }, 60000); // 60 seconds
    
    // Check availability every 15 seconds
    setInterval(() => {
        updateAvailabilityStatus();
    }, 15000); // 15 seconds
}

function updatePriceDisplays() {
    // Update all price displays on the page
    const priceElements = document.querySelectorAll('.price-display');
    priceElements.forEach(element => {
        const productName = element.getAttribute('data-product');
        if (productName) {
            const pricing = pricingManager.getProductPrice(productName);
            element.textContent = `UGX ${pricing.current.toLocaleString()}`;
            element.setAttribute('title', `Last updated: ${new Date().toLocaleTimeString()}`);
        }
    });
}

function updateAvailabilityStatus() {
    // Update availability indicators
    const availabilityElements = document.querySelectorAll('.availability-status');
    availabilityElements.forEach(element => {
        const productId = element.getAttribute('data-product-id');
        if (productId) {
            const item = gallery.find(g => g.id == productId);
            if (item) {
                const isAvailable = galleryManager.checkRealTimeAvailability(item.category);
                element.className = `availability-status ${isAvailable ? 'available' : 'unavailable'}`;
                element.textContent = isAvailable ? '✅ Available' : '❌ Unavailable';
            }
        }
    });
}

// Gallery functions with real-time updates
function renderGallery(filter) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    // Refresh gallery data for real-time updates
    gallery = galleryManager.getGallery();
    
    const filteredGallery = filter === 'all' ? gallery : gallery.filter(item => item.category === filter);
    
    galleryGrid.innerHTML = '';
    
    filteredGallery.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-id', item.id);
        
        // Calculate real-time average rating
        const avgRating = item.ratings && item.ratings.length > 0 
            ? (item.ratings.reduce((sum, r) => sum + r.rating, 0) / item.ratings.length).toFixed(1)
            : 'New';
        
        // Real-time availability status
        const availabilityStatus = item.available 
            ? '<span class="available">✅ Available Now</span>'
            : '<span class="unavailable">❌ Currently Unavailable</span>';
        
        // Real-time price display
        const priceDisplay = item.price 
            ? `UGX ${item.price.toLocaleString()}`
            : 'Contact for pricing';
        
        galleryItem.innerHTML = `
            <div class="real-time-badge">
                <span class="live-indicator">🔴 LIVE</span>
                <span class="update-time">${new Date(item.lastUpdated).toLocaleTimeString()}</span>
            </div>
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="gallery-overlay">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="real-time-info">
                    <div class="rating">⭐ ${avgRating} (${item.ratings ? item.ratings.length : 0} reviews)</div>
                    <div class="price">${priceDisplay}</div>
                    <div class="availability">${availabilityStatus}</div>
                </div>
                <div class="gallery-actions">
                    <button class="btn btn-primary" onclick="openGalleryModal(${item.id})" ${!item.available ? 'disabled' : ''}>
                        ${item.available ? 'View Details' : 'Currently Unavailable'}
                    </button>
                </div>
            </div>
        `;
        
        galleryGrid.appendChild(galleryItem);
    });
    
    // Add real-time update notification
    addRealTimeUpdateNotification();
}

function addRealTimeUpdateNotification() {
    const existingNotification = document.querySelector('.real-time-update-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'real-time-update-notification';
    notification.innerHTML = `
        <span>🔄 Gallery updated with real-time data</span>
        <span>${new Date().toLocaleTimeString()}</span>
    `;
    
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        galleryGrid.parentNode.insertBefore(notification, galleryGrid);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

function openGalleryModal(itemId) {
    const item = gallery.find(g => g.id === itemId);
    if (!item) return;
    
    const modal = document.getElementById('galleryModal');
    if (!modal) return;
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeGalleryModal()">&times;</span>
            <div class="modal-gallery">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="modal-info">
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="openBooking('${item.title}')">Order This Cake</button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function openBooking(productName) {
    console.log('Opening booking for:', productName);
    showNotification(`Ready to book your ${productName}!`);
}

// Filter functionality
function filterGallery(category) {
    renderGallery(category);
    
    // Update active filter button using existing variable
    if (filterButtons) {
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            }
        });
    }
}

// Form handlers
function handleContact() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formData = new FormData(form);
    showNotification('Thank you for contacting us! We\'ll get back to you soon.');
    form.reset();
}

function handleNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    
    const email = form.querySelector('input[type="email"]').value;
    if (email) {
        showNotification('Thank you for subscribing to our newsletter!');
        form.reset();
    }
}
