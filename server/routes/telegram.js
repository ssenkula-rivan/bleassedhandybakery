const express = require('express');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');
const MessageHandler = require('../services/MessageHandler');
const logger = require('../utils/logger');
const ERROR_CODES = require('../config/errorCodes');

// Initialize Telegram Bot
let bot = null;
if (process.env.TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
  logger.info('✅ Telegram bot initialized');
} else {
  logger.warn('⚠️  Telegram bot token not configured');
}

// Webhook endpoint for Telegram
router.post('/webhook', async (req, res) => {
  try {
    // Verify webhook secret
    const secret = req.headers['x-telegram-bot-api-secret-token'];
    if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      logger.warn('Invalid Telegram webhook secret');
      return res.status(403).json({ success: false });
    }

    const update = req.body;

    // Validate webhook payload
    if (!update || !update.message) {
      logger.warn('Invalid Telegram webhook payload');
      return res.status(400).json({ success: false });
    }

    const message = update.message;
    const chatId = message.chat.id;
    const userId = `telegram_${message.from.id}`;
    const text = message.text;

    if (!text) {
      return res.json({ success: true }); // Ignore non-text messages
    }

    // Process message
    const result = await MessageHandler.handleMessage(
      userId,
      text,
      'telegram',
      {
        chatId,
        username: message.from.username,
        firstName: message.from.first_name,
        lastName: message.from.last_name
      }
    );

    // Send response back to Telegram
    if (bot) {
      try {
        await bot.sendMessage(chatId, result.response, {
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        });
      } catch (sendError) {
        logger.error('Failed to send Telegram message:', sendError);
        
        // Handle bot blocked error
        if (sendError.response && sendError.response.statusCode === 403) {
          await MessageHandler.handleError(
            ERROR_CODES.TELEGRAM_BOT_BLOCKED,
            userId,
            'telegram',
            result.requestId,
            text
          );
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('Telegram webhook error:', error);
    res.status(500).json({ success: false });
  }
});

// Set webhook (call this once to configure)
router.post('/set-webhook', async (req, res) => {
  try {
    if (!bot) {
      return res.status(400).json({
        success: false,
        message: 'Telegram bot not configured'
      });
    }

    const webhookUrl = `${process.env.SERVER_URL}/api/telegram/webhook`;
    
    await bot.setWebHook(webhookUrl, {
      secret_token: process.env.TELEGRAM_WEBHOOK_SECRET
    });

    logger.info(`Telegram webhook set to: ${webhookUrl}`);

    res.json({
      success: true,
      message: 'Webhook configured',
      url: webhookUrl
    });
  } catch (error) {
    logger.error('Failed to set Telegram webhook:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get webhook info
router.get('/webhook-info', async (req, res) => {
  try {
    if (!bot) {
      return res.status(400).json({
        success: false,
        message: 'Telegram bot not configured'
      });
    }

    const info = await bot.getWebHookInfo();
    res.json({
      success: true,
      info
    });
  } catch (error) {
    logger.error('Failed to get webhook info:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
