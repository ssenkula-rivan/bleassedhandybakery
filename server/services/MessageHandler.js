const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const ERROR_CODES = require('../config/errorCodes');
const AIService = require('./AIService');
const Conversation = require('../models/Conversation');
const ErrorLog = require('../models/ErrorLog');

class MessageHandler {
  constructor() {
    this.maxMessageLength = 2000;
    this.supportedLanguages = ['en']; // Expand as needed
  }

  // Main handler - processes all messages from all channels
  async handleMessage(userId, message, channel, metadata = {}) {
    const requestId = uuidv4();
    const startTime = Date.now();
    
    logger.info(`[${requestId}] New message from ${userId} via ${channel}: ${message.substring(0, 50)}...`);
    
    try {
      // Step 1: Validate input
      const validation = this.validateMessage(message);
      if (!validation.valid) {
        return await this.handleError(validation.error, userId, channel, requestId, message);
      }

      // Step 2: Normalize message
      const normalizedMessage = this.normalizeMessage(message);

      // Step 3: Get or create conversation
      const conversation = await this.getOrCreateConversation(userId, channel);

      // Step 4: Save user message
      await this.saveMessage(conversation, requestId, 'user', normalizedMessage, metadata);

      // Step 5: Generate AI response
      const aiResult = await AIService.generateResponse(
        normalizedMessage,
        conversation.messages,
        conversation.userProfile
      );

      // Step 6: Save bot response
      await this.saveMessage(conversation, requestId, 'bot', aiResult.response, {
        source: aiResult.source
      });

      // Step 7: Log success
      const responseTime = Date.now() - startTime;
      logger.info(`[${requestId}] Response generated in ${responseTime}ms from ${aiResult.source}`);

      return {
        success: true,
        requestId,
        response: aiResult.response,
        responseTime,
        source: aiResult.source
      };

    } catch (error) {
      logger.error(`[${requestId}] Error handling message:`, error);
      return await this.handleError(error, userId, channel, requestId, message);
    }
  }

  // Validate incoming message
  validateMessage(message) {
    // Check if message exists
    if (!message || typeof message !== 'string') {
      return { valid: false, error: ERROR_CODES.INVALID_INPUT };
    }

    // Check if message is empty after trim
    const trimmed = message.trim();
    if (trimmed.length === 0) {
      return { valid: false, error: ERROR_CODES.INVALID_INPUT };
    }

    // Check message length
    if (trimmed.length > this.maxMessageLength) {
      return { valid: false, error: ERROR_CODES.MESSAGE_TOO_LONG };
    }

    // Basic language detection (simple check for now)
    const hasEnglishChars = /[a-zA-Z]/.test(trimmed);
    if (!hasEnglishChars && trimmed.length > 10) {
      return { valid: false, error: ERROR_CODES.UNSUPPORTED_LANGUAGE };
    }

    return { valid: true };
  }

  // Normalize message text
  normalizeMessage(message) {
    return message
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\x00-\x7F]/g, (char) => char) // Keep unicode but log it
      .substring(0, this.maxMessageLength);
  }

  // Get existing conversation or create new one
  async getOrCreateConversation(userId, channel) {
    try {
      let conversation = await Conversation.findOne({
        userId,
        channel,
        status: 'active'
      }).sort({ updatedAt: -1 });

      if (!conversation) {
        conversation = new Conversation({
          userId,
          channel,
          messages: [],
          userProfile: {},
          status: 'active'
        });
        await conversation.save();
        logger.info(`Created new conversation for ${userId} on ${channel}`);
      }

      return conversation;
    } catch (error) {
      logger.error('Error getting/creating conversation:', error);
      throw ERROR_CODES.DB_QUERY_ERROR;
    }
  }

  // Save message to conversation
  async saveMessage(conversation, requestId, sender, message, metadata = {}) {
    try {
      conversation.messages.push({
        requestId,
        sender,
        message,
        timestamp: new Date(),
        metadata
      });

      // Keep only last 100 messages
      if (conversation.messages.length > 100) {
        conversation.messages = conversation.messages.slice(-100);
      }

      await conversation.save();
    } catch (error) {
      logger.error('Error saving message:', error);
      // Don't throw - message saving failure shouldn't stop the response
    }
  }

  // Handle errors and log them
  async handleError(error, userId, channel, requestId, userMessage) {
    const errorCode = error.code || ERROR_CODES.UNKNOWN_ERROR.code;
    const errorData = error.message ? error : ERROR_CODES.UNKNOWN_ERROR;

    // Log error to database
    try {
      await ErrorLog.create({
        errorCode: errorData.code,
        errorMessage: errorData.message,
        internalMessage: errorData.internal || error.message,
        userId,
        channel,
        requestId,
        userMessage,
        stackTrace: error.stack,
        metadata: { originalError: error },
        timestamp: new Date()
      });
    } catch (dbError) {
      logger.error('Failed to log error to database:', dbError);
    }

    // Log to file
    logger.error(`[${requestId}] Error ${errorData.code}: ${errorData.internal}`, {
      userId,
      channel,
      userMessage,
      error
    });

    // Return user-friendly error message
    return {
      success: false,
      requestId,
      response: errorData.message,
      errorCode: errorData.code
    };
  }

  // Get conversation history for a user
  async getConversationHistory(userId, channel, limit = 50) {
    try {
      const conversation = await Conversation.findOne({
        userId,
        channel,
        status: 'active'
      }).sort({ updatedAt: -1 });

      if (!conversation) {
        return [];
      }

      return conversation.messages.slice(-limit);
    } catch (error) {
      logger.error('Error getting conversation history:', error);
      return [];
    }
  }

  // Update user profile
  async updateUserProfile(userId, channel, profileData) {
    try {
      const conversation = await this.getOrCreateConversation(userId, channel);
      conversation.userProfile = {
        ...conversation.userProfile,
        ...profileData
      };
      await conversation.save();
      logger.info(`Updated profile for ${userId}`);
    } catch (error) {
      logger.error('Error updating user profile:', error);
    }
  }
}

module.exports = new MessageHandler();
