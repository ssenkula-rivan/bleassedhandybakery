// AI Configuration for Blessed Handly Bakery Chatbot
// Replace the placeholder API key below with your actual OpenAI API key

const AI_CONFIG = {
    // OpenAI API Configuration
    openai: {
        apiKey: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // REPLACE WITH YOUR ACTUAL API KEY
        model: 'gpt-4', // Upgraded to GPT-4 for better understanding
        maxTokens: 500, // Increased tokens for detailed responses
        temperature: 0.3, // Lower temperature for more consistent bakery responses
        presencePenalty: 0.1, // Reduce repetition
        frequencyPenalty: 0.1 // Reduce repetition
    },
    
    // Learning Configuration
    learning: {
        enabled: true,
        maxHistoryLength: 20, // Keep last 20 messages for context
        saveSuccessfulResponses: true, // Learn from good responses
        saveFailedResponses: true, // Learn from mistakes
        confidenceThreshold: 0.7 // Minimum confidence to save as learned
    },
    
    // Bakery Knowledge Base
    bakery: {
        name: 'Blessed Handly Bakery',
        location: 'Kampala, Uganda',
        phone: '+256761903887',
        whatsapp: '+256761903887',
        hours: {
            weekday: '6AM-8PM',
            sunday: '7AM-6PM'
        },
        specialties: ['Queen Cakes', 'Small Cakes', 'Fruit Cakes', 'Custom Cakes', 'Wedding Cakes'],
        delivery: {
            areas: 'Kampala and surrounding districts',
            timing: 'Same day for orders before 10AM'
        }
    },
    
    // Alternative: Local AI Configuration (if you want to use a local AI model)
    local: {
        enabled: false,
        endpoint: 'http://localhost:8080/chat', // Your local AI endpoint
        model: 'llama-2-7b-chat'
    }
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_CONFIG;
} else {
    window.AI_CONFIG = AI_CONFIG;
}
