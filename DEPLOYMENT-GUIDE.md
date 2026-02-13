# Complete Deployment Guide - Blessed Handly Bakery AI Chatbot

## Overview

This system provides a professional AI chatbot that works across:
- ✅ Website (live chat)
- ✅ Telegram
- ✅ WhatsApp Business API

## Architecture

```
Frontend (Website) → Backend Server → AI Service (OpenAI)
                   ↓
Telegram Bot API → Backend Server → Database (MongoDB)
                   ↓
WhatsApp API → Backend Server → Error Logging
```

## Step-by-Step Deployment

### Step 1: Server Setup

#### Option A: Using Docker (Recommended)

```bash
# 1. Clone/upload your code to server
cd /var/www/bakery-bot

# 2. Configure environment
cp server/.env.example server/.env
nano server/.env  # Edit with your credentials

# 3. Start services
cd server
docker-compose up -d

# 4. Check status
docker-compose ps
docker-compose logs -f bot-server
```

#### Option B: Manual Setup

```bash
# 1. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install MongoDB
sudo apt-get install -y mongodb

# 3. Install dependencies
cd server
npm install

# 4. Configure environment
cp .env.example .env
nano .env

# 5. Start with PM2
npm install -g pm2
pm2 start server.js --name bakery-bot
pm2 startup
pm2 save
```

### Step 2: Configure OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create API key
3. Add to `.env`:
```env
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4
```

### Step 3: Setup Telegram Bot

1. **Create Bot**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot`
   - Follow instructions
   - Copy bot token

2. **Configure**
   ```env
   TELEGRAM_BOT_TOKEN=your-bot-token-here
   TELEGRAM_WEBHOOK_SECRET=your-random-secret-here
   ```

3. **Set Webhook**
   ```bash
   curl -X POST https://your-domain.com/api/telegram/set-webhook
   ```

4. **Test**
   - Open your bot on Telegram
   - Send "hello"
   - Should get instant response

### Step 4: Setup WhatsApp Business API

1. **Create Meta Business Account**
   - Go to [Meta Business Suite](https://business.facebook.com/)
   - Create business account
   - Add WhatsApp product

2. **Get Credentials**
   - Phone Number ID
   - Access Token
   - Verify Token (create your own)

3. **Configure**
   ```env
   WHATSAPP_PHONE_NUMBER_ID=your-phone-id
   WHATSAPP_ACCESS_TOKEN=your-access-token
   WHATSAPP_VERIFY_TOKEN=your-verify-token
   ```

4. **Set Webhook in Meta Dashboard**
   - Webhook URL: `https://your-domain.com/api/whatsapp/webhook`
   - Verify Token: (same as in .env)
   - Subscribe to: `messages`

5. **Test**
   - Send WhatsApp message to your business number
   - Should get AI response

### Step 5: Configure Website

1. **Update Frontend**
   ```html
   <!-- Add to index.html before </body> -->
   <script src="chatbot-client.js"></script>
   ```

2. **Configure API URL**
   ```javascript
   // In chatbot-client.js
   const chatbot = new BakeryChatbot('https://your-domain.com/api/website');
   ```

3. **Test**
   - Open website
   - Click chat button
   - Send message
   - Should get AI response

### Step 6: SSL/HTTPS Setup

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Step 7: Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Website files
    location / {
        root /var/www/bakery-website;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Testing Checklist

### ✅ Basic Tests

```bash
# 1. Health check
curl https://your-domain.com/api/health

# 2. Website chat
curl -X POST https://your-domain.com/api/website/chat \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","message":"hello"}'

# 3. Check logs
pm2 logs bakery-bot
# or
docker-compose logs -f bot-server
```

### ✅ Error Scenarios

1. **No Internet**
   - Disconnect server network
   - Send message
   - Should get fallback response

2. **Invalid API Key**
   - Set wrong OPENAI_API_KEY
   - Restart server
   - Should use fallback responses

3. **Database Down**
   - Stop MongoDB
   - Send message
   - Should still respond (without saving)

4. **High Traffic**
   ```bash
   # Install Apache Bench
   sudo apt-get install apache2-utils
   
   # Test 1000 requests, 100 concurrent
   ab -n 1000 -c 100 -p test.json -T application/json \
     https://your-domain.com/api/website/chat
   ```

## Monitoring

### View Logs

```bash
# Application logs
tail -f server/logs/combined.log
tail -f server/logs/error.log

# PM2 logs
pm2 logs bakery-bot

# Docker logs
docker-compose logs -f
```

### Health Dashboard

```bash
# Detailed health
curl https://your-domain.com/api/health/detailed

# Error monitoring
curl https://your-domain.com/api/health/errors?hours=24
```

### Set Up Alerts

```bash
# Create monitoring script
nano /usr/local/bin/check-bot-health.sh
```

```bash
#!/bin/bash
HEALTH=$(curl -s https://your-domain.com/api/health/detailed | jq -r '.status')

if [ "$HEALTH" != "healthy" ]; then
    # Send alert (email, SMS, Slack, etc.)
    echo "Bot unhealthy!" | mail -s "Alert: Bakery Bot Down" admin@example.com
fi
```

```bash
# Make executable
chmod +x /usr/local/bin/check-bot-health.sh

# Add to crontab (check every 5 minutes)
crontab -e
*/5 * * * * /usr/local/bin/check-bot-health.sh
```

## Backup Strategy

### Database Backup

```bash
# Create backup script
nano /usr/local/bin/backup-bot-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/bakery-bot"
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --db blessed_handly_bakery --out $BACKUP_DIR/mongo_$DATE

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

```bash
# Schedule daily backup at 2 AM
crontab -e
0 2 * * * /usr/local/bin/backup-bot-db.sh
```

## Scaling

### Horizontal Scaling

```yaml
# docker-compose-scaled.yml
version: '3.8'

services:
  bot-server:
    build: .
    deploy:
      replicas: 3
    # ... rest of config

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### Load Balancer Config

```nginx
upstream bot_servers {
    least_conn;
    server bot-server-1:3000;
    server bot-server-2:3000;
    server bot-server-3:3000;
}

server {
    location /api/ {
        proxy_pass http://bot_servers;
    }
}
```

## Troubleshooting

### Bot Not Responding

1. Check server status
   ```bash
   pm2 status
   # or
   docker-compose ps
   ```

2. Check logs
   ```bash
   pm2 logs bakery-bot --lines 100
   ```

3. Check health
   ```bash
   curl http://localhost:3000/api/health/detailed
   ```

4. Restart if needed
   ```bash
   pm2 restart bakery-bot
   # or
   docker-compose restart bot-server
   ```

### High Error Rate

1. Check error logs
   ```bash
   curl http://localhost:3000/api/health/errors?hours=1
   ```

2. Check OpenAI quota
   - Go to OpenAI dashboard
   - Check usage limits

3. Check database
   ```bash
   mongo
   use blessed_handly_bakery
   db.errorlogs.find().sort({timestamp:-1}).limit(10)
   ```

### Slow Responses

1. Check AI timeout
   ```env
   AI_TIMEOUT_MS=10000  # Increase if needed
   ```

2. Monitor server resources
   ```bash
   htop
   df -h
   free -m
   ```

3. Check database performance
   ```bash
   mongo
   db.conversations.stats()
   ```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Firewall configured (only 80, 443, 22 open)
- [ ] SSH key authentication only
- [ ] Environment variables secured
- [ ] Rate limiting active
- [ ] Webhook secrets set
- [ ] Database access restricted
- [ ] Regular backups enabled
- [ ] Monitoring alerts configured
- [ ] Logs reviewed regularly

## Maintenance

### Weekly Tasks
- Review error logs
- Check disk space
- Verify backups
- Test all channels

### Monthly Tasks
- Update dependencies
- Review security patches
- Analyze usage patterns
- Optimize database

### Quarterly Tasks
- Full system audit
- Performance testing
- Disaster recovery drill
- Update documentation

## Support

For deployment issues:
- Email: tech@blessedhandlybakery.com
- Phone: +256761903887
- Documentation: https://docs.blessedhandlybakery.com

## Version Control

```bash
# Tag releases
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0

# Rollback if needed
git checkout v1.0.0
pm2 restart bakery-bot
```

---

**Congratulations!** Your AI chatbot is now live and ready to handle customers across all channels! 🎉
