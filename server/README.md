# Blessed Handly Bakery - Professional AI Chatbot System

Complete backend server for managing AI chatbot across Website, Telegram, and WhatsApp.

## Features

✅ **Centralized Bot Logic** - All AI logic in one service  
✅ **Multi-Channel Support** - Website, Telegram, WhatsApp  
✅ **Error Handling** - Fixed error codes, comprehensive logging  
✅ **AI Integration** - OpenAI with retry logic and fallbacks  
✅ **Security** - HTTPS, rate limiting, input sanitization  
✅ **Database** - MongoDB for conversations and error logs  
✅ **Monitoring** - Health checks and error tracking  
✅ **Human-like AI** - Natural conversation, bargaining, upselling  

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
```

### 4. Run Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
GET /api/health/detailed
GET /api/health/errors
```

### Website Chat
```
POST /api/website/chat
Body: { userId, message, sessionId }

GET /api/website/history/:userId
POST /api/website/profile/:userId
```

### Telegram
```
POST /api/telegram/webhook
POST /api/telegram/set-webhook
GET /api/telegram/webhook-info
```

### WhatsApp
```
GET /api/whatsapp/webhook (verification)
POST /api/whatsapp/webhook (messages)
POST /api/whatsapp/send (test)
```

## Error Codes

| Code | Category | Description |
|------|----------|-------------|
| 1001-1099 | Input Validation | Invalid input, too long, unsupported language |
| 2001-2099 | AI Service | Timeout, quota exceeded, unavailable |
| 3001-3099 | Network | Connection errors, timeouts |
| 4001-4099 | Database | Connection, query, save errors |
| 5001-5099 | Authentication | Unauthorized, rate limit |
| 6001-6099 | WhatsApp | Session expired, delivery failed |
| 7001-7099 | Telegram | Bot blocked, send failed |
| 8001-8099 | Server | Internal errors, overload |
| 9001-9099 | Business Logic | Product not found, invalid order |

## Configuration

### Required Environment Variables

```env
# Server
NODE_ENV=production
PORT=3000
SERVER_URL=https://your-domain.com

# OpenAI
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4

# Database
MONGODB_URI=mongodb://localhost:27017/bakery

# Telegram
TELEGRAM_BOT_TOKEN=your-token
TELEGRAM_WEBHOOK_SECRET=your-secret

# WhatsApp
WHATSAPP_PHONE_NUMBER_ID=your-id
WHATSAPP_ACCESS_TOKEN=your-token
WHATSAPP_VERIFY_TOKEN=your-verify-token
```

## Telegram Setup

1. Create bot with [@BotFather](https://t.me/botfather)
2. Get bot token
3. Set webhook:
```bash
curl -X POST http://localhost:3000/api/telegram/set-webhook
```

## WhatsApp Setup

1. Create [Meta Business Account](https://business.facebook.com/)
2. Set up WhatsApp Business API
3. Get Phone Number ID and Access Token
4. Configure webhook URL in Meta dashboard
5. Verify webhook with GET request

## Testing

### Test Without Internet
```bash
# Disconnect network and test fallback responses
npm test
```

### Test Invalid API Key
```bash
# Set invalid OPENAI_API_KEY in .env
# Should use fallback responses
```

### Test AI Down
```bash
# Block OpenAI API in firewall
# Should retry and use fallback
```

### Test Database Down
```bash
# Stop MongoDB
# Should handle gracefully and still respond
```

### Test High Traffic
```bash
# Use load testing tool
ab -n 1000 -c 100 http://localhost:3000/api/website/chat
```

## Deployment

### Using Docker

```bash
# Build image
docker build -t bakery-bot .

# Run container
docker run -d \
  --name bakery-bot \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  bakery-bot
```

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name bakery-bot

# Enable auto-restart on system boot
pm2 startup
pm2 save
```

### Using Systemd

```bash
# Create service file
sudo nano /etc/systemd/system/bakery-bot.service

# Add configuration (see below)
# Enable and start
sudo systemctl enable bakery-bot
sudo systemctl start bakery-bot
```

## Monitoring

### View Logs
```bash
# Application logs
tail -f logs/combined.log
tail -f logs/error.log

# PM2 logs
pm2 logs bakery-bot
```

### Health Check
```bash
curl http://localhost:3000/api/health/detailed
```

### Error Monitoring
```bash
curl http://localhost:3000/api/health/errors?hours=24
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] Webhook secrets set
- [ ] Input sanitization active
- [ ] Database access restricted
- [ ] Firewall configured
- [ ] Logs monitored

## Troubleshooting

### Bot not responding
1. Check health endpoint
2. Check error logs
3. Verify API keys
4. Check database connection

### High error rate
1. Check `/api/health/errors`
2. Review error logs
3. Check AI quota
4. Verify network connectivity

### Slow responses
1. Check AI timeout settings
2. Monitor database performance
3. Review server resources
4. Check network latency

## Support

For issues or questions:
- Email: support@blessedhandlybakery.com
- Phone: +256761903887

## License

Proprietary - Blessed Handly Bakery
