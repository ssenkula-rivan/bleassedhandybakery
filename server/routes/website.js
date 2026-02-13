const express = require('express');
const router = express.Router();
const MessageHandler = require('../services/MessageHandler');
const logger = require('../utils/logger');

// Website chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { userId, message, sessionId } = req.body;

    // Validate required fields
    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: 'userId and message are required'
      });
    }

    // Use sessionId as userId if provided, otherwise use userId
    const effectiveUserId = sessionId || userId;

    // Process message
    const result = await MessageHandler.handleMessage(
      effectiveUserId,
      message,
      'website',
      {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        sessionId
      }
    );

    res.json(result);
  } catch (error) {
    logger.error('Website chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
      errorCode: 8001
    });
  }
});

// Get conversation history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;

    const history = await MessageHandler.getConversationHistory(
      userId,
      'website',
      parseInt(limit) || 50
    );

    res.json({
      success: true,
      history
    });
  } catch (error) {
    logger.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve history'
    });
  }
});

// Update user profile
router.post('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;

    await MessageHandler.updateUserProfile(userId, 'website', profileData);

    res.json({
      success: true,
      message: 'Profile updated'
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not update profile'
    });
  }
});

module.exports = router;
