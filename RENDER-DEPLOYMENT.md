# Deploy to Render.com - Complete Guide

## Why Render?

✅ Free tier available  
✅ Automatic HTTPS  
✅ Easy deployment from GitHub  
✅ Auto-restart on crashes  
✅ Environment variables management  
✅ Built-in monitoring  

## Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Blessed Handly Bakery Bot"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/bakery-bot.git
   git push -u origin main
   ```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create MongoDB Database

1. In Render Dashboard, click **"New +"**
2. Select **"MongoDB"** (or use MongoDB Atlas free tier)

**Option A: Render MongoDB**
- Name: `bakery-mongodb`
- Region: Choose closest to your users
- Plan: Free tier
- Click **"Create Database"**
- Copy the **Internal Connection String**

**Option B: MongoDB Atlas (Recommended for Free Tier)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0)
5. Get connection string

### Step 4: Deploy Backend Server

1. In Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub repository
4. Configure:

**Basic Settings:**
```
Name: bakery-bot
Region: Choose closest to your users
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

**Instance Type:**
- Free tier (512MB RAM, sleeps after 15 min inactivity)
- Or Starter ($7/month, always on)

**Environment Variables:**
Click **"Add Environment Variable"** and add these:

```
NODE_ENV=production
PORT=10000

# MongoDB (use your connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bakery?retryWrites=true&w=majority

# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.7

# Bakery Info
BAKERY_NAME=Blessed Handly Bakery
BAKERY_PHONE=+256761903887
BAKERY_LOCATION=Kampala, Uganda
BAKERY_WEBSITE=https://your-website.com

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your-telegram-token
TELEGRAM_WEBHOOK_SECRET=your-random-secret

# WhatsApp (optional)
WHATSAPP_PHONE_NUMBER_ID=your-phone-id
WHATSAPP_ACCESS_TOKEN=your-access-token
WHATSAPP_VERIFY_TOKEN=your-verify-token

# Error Handling
MAX_RETRIES=2
AI_TIMEOUT_MS=10000
FALLBACK_MESSAGE=I'm having a moment. Can you try again?

# Logging
LOG_LEVEL=info
```

5. Click **"Create Web Service"**
6. Wait for deployment (2-3 minutes)
7. Your service will be at: `https://bakery-bot.onrender.com`

### Step 5: Configure Webhooks

**Telegram:**
```bash
curl -X POST https://bakery-bot.onrender.com/api/telegram/set-webhook
```

**WhatsApp:**
1. Go to Meta Business Dashboard
2. Set webhook URL: `https://bakery-bot.onrender.com/api/whatsapp/webhook`
3. Set verify token (same as in environment variables)

### Step 6: Update Website

Update `chatbot-client.js`:
```javascript
const chatbot = new BakeryChatbot('https://bakery-bot.onrender.com/api/website');
```

### Step 7: Test Everything

```bash
# Test health
curl https://bakery-bot.onrender.com/api/health

# Test chat
curl -X POST https://bakery-bot.onrender.com/api/website/chat \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","message":"hello"}'
```

## Render-Specific Configuration

### render.yaml (Optional - Infrastructure as Code)

Create `render.yaml` in your root directory:

```yaml
services:
  - type: web
    name: bakery-bot
    env: node
    region: oregon
    plan: free
    buildCommand: cd server && npm install
    startCommand: cd server && node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: OPENAI_MODEL
        value: gpt-4
      - key: BAKERY_PHONE
        value: +256761903887
    healthCheckPath: /api/health
```

### Health Check Configuration

Render automatically monitors `/api/health` endpoint. Our server already has this!

### Auto-Deploy on Push

Render automatically deploys when you push to GitHub:
```bash
git add .
git commit -m "Update bot"
git push
# Render will auto-deploy!
```

## Free Tier Limitations

### What You Get (Free):
✅ 512MB RAM  
✅ Automatic HTTPS  
✅ Custom domain support  
✅ Auto-restart on crash  
✅ GitHub integration  

### Limitations:
⚠️ Sleeps after 15 minutes of inactivity  
⚠️ Takes 30-60 seconds to wake up  
⚠️ 750 hours/month (enough for testing)  

### Solutions:

**Option 1: Keep-Alive Service (Free)**
Use a service like [UptimeRobot](https://uptimerobot.com) to ping your server every 5 minutes:
- URL to monitor: `https://bakery-bot.onrender.com/api/health`
- Interval: 5 minutes
- This keeps your server awake!

**Option 2: Upgrade to Starter ($7/month)**
- Always on (no sleep)
- Better performance
- More RAM

## Monitoring on Render

### View Logs
1. Go to your service in Render Dashboard
2. Click **"Logs"** tab
3. See real-time logs

### Metrics
1. Click **"Metrics"** tab
2. See CPU, Memory, Response time

### Alerts
1. Click **"Settings"**
2. Add notification email
3. Get alerts on crashes

## Environment Variables Management

### Update Variables
1. Go to service in Render Dashboard
2. Click **"Environment"** tab
3. Update variables
4. Service auto-restarts

### Secrets Management
- Never commit `.env` to GitHub
- Use Render's environment variables
- Mark sensitive vars as "secret"

## Custom Domain (Optional)

1. In Render Dashboard, go to your service
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain: `api.blessedhandlybakery.com`
4. Update DNS records as shown
5. Render provides free SSL!

Then update your website:
```javascript
const chatbot = new BakeryChatbot('https://api.blessedhandlybakery.com/api/website');
```

## Troubleshooting

### Service Won't Start
1. Check logs in Render Dashboard
2. Verify all environment variables are set
3. Check MongoDB connection string
4. Ensure `PORT=10000` is set

### Slow First Response
- Free tier sleeps after 15 min
- First request wakes it up (30-60s)
- Use UptimeRobot to keep awake

### Database Connection Failed
1. Check MongoDB connection string
2. Verify database user credentials
3. Ensure IP whitelist includes 0.0.0.0/0
4. Test connection locally first

### Webhook Not Working
1. Verify webhook URL is correct
2. Check webhook secret matches
3. View logs for webhook requests
4. Test with curl first

## Cost Optimization

### Free Setup (Recommended for Testing)
- Render Free Tier: $0
- MongoDB Atlas Free: $0
- OpenAI Pay-as-you-go: ~$5-20/month
- **Total: $5-20/month**

### Production Setup
- Render Starter: $7/month
- MongoDB Atlas Shared: $9/month
- OpenAI: ~$20-50/month
- **Total: $36-66/month**

## Scaling on Render

### Vertical Scaling
Upgrade instance type:
- Free: 512MB RAM
- Starter: 512MB RAM, always on
- Standard: 2GB RAM
- Pro: 4GB RAM

### Horizontal Scaling
Add more instances:
1. Go to service settings
2. Increase instance count
3. Render load balances automatically

## Backup Strategy

### Database Backups
**MongoDB Atlas:**
- Automatic daily backups (free tier)
- Point-in-time recovery (paid)

**Manual Backup:**
```bash
# Install MongoDB tools
brew install mongodb-database-tools

# Backup
mongodump --uri="your-mongodb-uri" --out=./backup

# Restore
mongorestore --uri="your-mongodb-uri" ./backup
```

### Code Backups
- GitHub is your backup
- Tag releases: `git tag v1.0.0`
- Push tags: `git push --tags`

## CI/CD Pipeline

Render automatically:
1. Detects push to GitHub
2. Runs build command
3. Runs tests (if configured)
4. Deploys new version
5. Health checks new deployment
6. Rolls back if health check fails

### Add Tests (Optional)
Update `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "build": "npm install && npm test"
  }
}
```

## Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] MongoDB connection working
- [ ] OpenAI API key valid
- [ ] Health check passing
- [ ] Telegram webhook configured
- [ ] WhatsApp webhook configured
- [ ] Website updated with Render URL
- [ ] Custom domain configured (optional)
- [ ] UptimeRobot monitoring set up
- [ ] Error alerts configured
- [ ] Tested all channels (Website, Telegram, WhatsApp)

## Support

### Render Support
- Docs: [render.com/docs](https://render.com/docs)
- Community: [community.render.com](https://community.render.com)
- Status: [status.render.com](https://status.render.com)

### Your Bot Support
- Health: `https://bakery-bot.onrender.com/api/health`
- Errors: `https://bakery-bot.onrender.com/api/health/errors`
- Logs: Render Dashboard → Logs

## Quick Commands

```bash
# View logs
render logs bakery-bot

# Restart service
render restart bakery-bot

# Deploy manually
git push origin main

# Test health
curl https://bakery-bot.onrender.com/api/health

# Test chat
curl -X POST https://bakery-bot.onrender.com/api/website/chat \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","message":"hello"}'
```

---

**Your bot is now live on Render!** 🚀

Access it at: `https://bakery-bot.onrender.com`
