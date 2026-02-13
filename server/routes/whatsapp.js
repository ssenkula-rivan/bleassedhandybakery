const express = require('express');
const router = express.Router();
const axios = require('axios');
const MessageHandler = require('../services/MessageHandler');
const logger = require('../utils/logger');
const ERROR_CODES = require('../config/errorCodes');

// WhatsApp Business API configuration
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Webhook verification (required by WhatsApp)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    logger.info('✅ WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    logger.warn('❌ WhatsApp webhook verification failed');
    res.sendStatus(403);
  }
});

// Webhook endpoint for incoming WhatsApp messages
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    // Validate webhook payload
    if (!body.object || body.object !== 'whatsapp_business_account') {
      return res.sendStatus(404);
    }

    // Process each entry
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== 'messages') continue;

        const value = change.value;
        if (!value.messages) continue;

        for (const message of value.messages) {
          // Only process text messages
          if (message.type !== 'text') continue;

          const from = message.from; // Phone number
          const text = message.text.body;
          const messageId = message.id;
          const userId = `whatsapp_${from}`;

          // Check if message is within 24-hour window
          const messageTimestamp = parseInt(message.timestamp) * 1000;
          const now = Date.now();
          const hoursSinceMessage = (now - messageTimestamp) / (1000 * 60 * 60);

          if (hoursSinceMessage > 24) {
            logger.warn(`Message from ${from} is outside 24-hour window`);
            await MessageHandler.handleError(
              ERROR_CODES.WHATSAPP_SESSION_EXPIRED,
              userId,
              'whatsapp',
              messageId,
              text
            );
            continue;
          }

          // Process message
          const result = await MessageHandler.handleMessage(
            userId,
            text,
            'whatsapp',
            {
              phoneNumber: from,
              messageId,
              timestamp: messageTimestamp
            }
          );

          // Send response back to WhatsApp
          await sendWhatsAppMessage(from, result.response);
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    logger.error('WhatsApp webhook error:', error);
    res.sendStatus(500);
  }
});

// Send WhatsApp message
async function sendWhatsAppMessage(to, text) {
  try {
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      logger.error('WhatsApp credentials not configured');
      return;
    }

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: text }
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    logger.info(`WhatsApp message sent to ${to}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to send WhatsApp message:', error.response?.data || error.message);
    
    // Log delivery failure
    await MessageHandler.handleError(
      ERROR_CODES.WHATSAPP_DELIVERY_FAILED,
      `whatsapp_${to}`,
      'whatsapp',
      null,
      text
    );
    
    throw error;
  }
}

// Send WhatsApp template message (for messages outside 24-hour window)
async function sendWhatsAppTemplate(to, templateName, languageCode = 'en') {
  try {
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      logger.error('WhatsApp credentials not configured');
      return;
    }

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    logger.info(`WhatsApp template sent to ${to}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to send WhatsApp template:', error.response?.data || error.message);
    throw error;
  }
}

// Test endpoint to send a message
router.post('/send', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        message: 'to and message are required'
      });
    }

    await sendWhatsAppMessage(to, message);

    res.json({
      success: true,
      message: 'Message sent'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
