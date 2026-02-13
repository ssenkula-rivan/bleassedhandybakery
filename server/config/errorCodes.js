// Fixed Error Codes for Blessed Handly Bakery Bot
// Never change these codes - they're used for monitoring and debugging

const ERROR_CODES = {
  // Input Validation Errors (1000-1099)
  INVALID_INPUT: {
    code: 1001,
    message: 'Hmm, I didn\'t quite get that. Can you rephrase?',
    internal: 'Invalid or empty input received'
  },
  MESSAGE_TOO_LONG: {
    code: 1002,
    message: 'That\'s a bit long! Can you break it down for me?',
    internal: 'Message exceeds maximum length'
  },
  UNSUPPORTED_LANGUAGE: {
    code: 1003,
    message: 'I currently only understand English. Can you try in English?',
    internal: 'Message in unsupported language'
  },
  INVALID_FORMAT: {
    code: 1004,
    message: 'I\'m not sure what format that is. Can you try differently?',
    internal: 'Message format not recognized'
  },

  // AI Service Errors (2000-2099)
  AI_TIMEOUT: {
    code: 2001,
    message: 'Sorry, I\'m thinking a bit slow right now. Try again?',
    internal: 'AI service timeout exceeded'
  },
  AI_QUOTA_EXCEEDED: {
    code: 2002,
    message: 'I\'m a bit overwhelmed right now. Call us at +256761903887?',
    internal: 'AI API quota exceeded'
  },
  AI_UNAVAILABLE: {
    code: 2003,
    message: 'My brain\'s taking a break. Can you try in a minute?',
    internal: 'AI service unavailable'
  },
  AI_INVALID_RESPONSE: {
    code: 2004,
    message: 'I got confused there. Let me try again - what do you need?',
    internal: 'AI returned invalid response'
  },

  // Network Errors (3000-3099)
  NETWORK_ERROR: {
    code: 3001,
    message: 'Connection hiccup! Can you send that again?',
    internal: 'Network request failed'
  },
  TIMEOUT_ERROR: {
    code: 3002,
    message: 'That took too long. Let\'s try again?',
    internal: 'Request timeout'
  },
  DNS_ERROR: {
    code: 3003,
    message: 'Can\'t reach my servers. Try again in a moment?',
    internal: 'DNS resolution failed'
  },

  // Database Errors (4000-4099)
  DB_CONNECTION_ERROR: {
    code: 4001,
    message: 'Having trouble saving that. But I\'m still here to help!',
    internal: 'Database connection failed'
  },
  DB_QUERY_ERROR: {
    code: 4002,
    message: 'Quick glitch on my end. What were you asking?',
    internal: 'Database query failed'
  },
  DB_SAVE_ERROR: {
    code: 4003,
    message: 'Couldn\'t save that, but I remember! What\'s next?',
    internal: 'Failed to save to database'
  },

  // Authentication Errors (5000-5099)
  UNAUTHORIZED: {
    code: 5001,
    message: 'I don\'t recognize you. Are you sure you\'re chatting from the right place?',
    internal: 'Unauthorized access attempt'
  },
  INVALID_TOKEN: {
    code: 5002,
    message: 'Session expired. Can you start a new chat?',
    internal: 'Invalid or expired token'
  },
  RATE_LIMIT_EXCEEDED: {
    code: 5003,
    message: 'Whoa, slow down! Give me a second to catch up.',
    internal: 'Rate limit exceeded'
  },

  // WhatsApp Specific Errors (6000-6099)
  WHATSAPP_SESSION_EXPIRED: {
    code: 6001,
    message: 'Our WhatsApp session expired. Send a message to restart!',
    internal: 'WhatsApp 24-hour window expired'
  },
  WHATSAPP_TEMPLATE_FAILED: {
    code: 6002,
    message: 'Message couldn\'t be sent. Call us at +256761903887?',
    internal: 'WhatsApp template message failed'
  },
  WHATSAPP_DELIVERY_FAILED: {
    code: 6003,
    message: 'Message didn\'t go through. Are you connected to internet?',
    internal: 'WhatsApp delivery failed'
  },
  WHATSAPP_INVALID_NUMBER: {
    code: 6004,
    message: 'This number doesn\'t seem right. Check and try again?',
    internal: 'Invalid WhatsApp number'
  },

  // Telegram Specific Errors (7000-7099)
  TELEGRAM_BOT_BLOCKED: {
    code: 7001,
    message: 'Looks like you blocked me. Unblock to continue chatting!',
    internal: 'User blocked the Telegram bot'
  },
  TELEGRAM_SEND_FAILED: {
    code: 7002,
    message: 'Couldn\'t send that message. Try again?',
    internal: 'Telegram message send failed'
  },
  TELEGRAM_INVALID_WEBHOOK: {
    code: 7003,
    message: 'Something\'s wrong with the connection. We\'re fixing it!',
    internal: 'Invalid Telegram webhook payload'
  },

  // Server Errors (8000-8099)
  SERVER_ERROR: {
    code: 8001,
    message: 'Oops, something broke on my end. Try again?',
    internal: 'Internal server error'
  },
  SERVER_OVERLOAD: {
    code: 8002,
    message: 'I\'m handling a lot right now. Give me a moment?',
    internal: 'Server overloaded'
  },
  SERVER_CRASH: {
    code: 8003,
    message: 'I just restarted. What were we talking about?',
    internal: 'Server crashed and restarted'
  },

  // Business Logic Errors (9000-9099)
  PRODUCT_NOT_FOUND: {
    code: 9001,
    message: 'I don\'t think we have that. Want to see what we do have?',
    internal: 'Requested product not found'
  },
  INVALID_ORDER: {
    code: 9002,
    message: 'Something\'s off with that order. Let\'s go through it again?',
    internal: 'Order validation failed'
  },
  PRICE_CALCULATION_ERROR: {
    code: 9003,
    message: 'Having trouble calculating that. Let me check and get back to you?',
    internal: 'Price calculation failed'
  },

  // Unknown Error
  UNKNOWN_ERROR: {
    code: 9999,
    message: 'Something unexpected happened. Can you try again? Or call +256761903887',
    internal: 'Unknown error occurred'
  }
};

module.exports = ERROR_CODES;
