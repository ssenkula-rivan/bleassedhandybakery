# 🚀 START HERE - Quick Setup Guide

## ⚠️ SECURITY FIRST!

**Your OpenAI API key was exposed!** Please:
1. Go to https://platform.openai.com/api-keys
2. Revoke the old key
3. Create a NEW key
4. Update `server/.env` with the new key

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Install MongoDB (Using Docker - Easiest)

```bash
# Install Docker if you don't have it
# Then run:
docker run -d -p 27017:27017 --name bakery-mongodb mongo:latest
```

**OR** Install MongoDB locally from https://www.mongodb.com/try/download/community

---

### Step 2: Install Dependencies

```bash
cd server
npm install
```

---

### Step 3: Start the Server

```bash
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 3000
📱 Channels: Website, Telegram, WhatsApp
```

---

### Step 4: Test It!

Open a new terminal and test:

```bash
# Test health
curl http://localhost:3000/api/health

# Test chat
curl -X POST http://localhost:3000/api/website/chat \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","message":"hello"}'
```

You should get a response like:
```json
{
  "success": true,
  "response": "Hey! What can I help you with?",
  "responseTime": 234
}
```

---

## 🌐 Connect Your Website

### Option 1: Update Your Existing Website

Add this to your `index.html` before `</body>`:

```html
<script>
  // Update the API URL in chatbot-client.js
  const chatbot = new BakeryChatbot('http://localhost:3000/api/website');
</script>
<script src="chatbot-client.js"></script>
```

### Option 2: Test with Simple HTML

Create `test.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Chatbot</title>
</head>
<body>
    <h1>Test Chatbot</h1>
    <input type="text" id="message" placeholder="Type a message...">
    <button onclick="sendTest()">Send</button>
    <div id="response"></div>

    <script>
        async function sendTest() {
            const message = document.getElementById('message').value;
            const response = await fetch('http://localhost:3000/api/website/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'test-user',
                    message: message
                })
            });
            const data = await response.json();
            document.getElementById('response').innerHTML = 
                '<p><strong>Bot:</strong> ' + data.response + '</p>';
        }
    </script>
</body>
</html>
```

Open `test.html` in your browser and test!

---

## 📱 Add Telegram (Optional)

### Step 1: Create Bot

1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Follow instructions
5. Copy the token

### Step 2: Add to .env

```env
TELEGRAM_BOT_TOKEN=your-token-here
TELEGRAM_WEBHOOK_SECRET=any-random-string-123
```

### Step 3: Set Webhook (After deploying to server with HTTPS)

```bash
curl -X POST http://localhost:3000/api/telegram/set-webhook
```

---

## 💬 Add WhatsApp (Optional)

### Step 1: Get WhatsApp Business API

1. Go to https://business.facebook.com/
2. Create Meta Business Account
3. Add WhatsApp product
4. Get credentials

### Step 2: Add to .env

```env
WHATSAPP_PHONE_NUMBER_ID=your-phone-id
WHATSAPP_ACCESS_TOKEN=your-token
WHATSAPP_VERIFY_TOKEN=your-verify-token
```

### Step 3: Configure Webhook in Meta Dashboard

- Webhook URL: `https://your-domain.com/api/whatsapp/webhook`
- Verify Token: (same as in .env)

---

## 🔍 Troubleshooting

### Server won't start?

**Check MongoDB:**
```bash
# Is MongoDB running?
docker ps | grep mongo
# or
sudo systemctl status mongodb
```

**Check logs:**
```bash
cd server
cat logs/error.log
```

### "Connection refused" error?

Make sure server is running:
```bash
curl http://localhost:3000/api/health
```

### AI not responding?

Check your OpenAI API key:
1. Go to https://platform.openai.com/api-keys
2. Verify key is active
3. Check you have credits

---

## 📊 Monitor Your Bot

### View Logs
```bash
cd server
tail -f logs/combined.log
```

### Check Health
```bash
curl http://localhost:3000/api/health/detailed
```

### View Errors
```bash
curl http://localhost:3000/api/health/errors?hours=24
```

---

## 🎓 Next Steps

1. ✅ **Test locally** - Make sure everything works
2. 📝 **Customize responses** - Edit `server/services/AIService.js`
3. 🚀 **Deploy to production** - Follow `DEPLOYMENT-GUIDE.md`
4. 📱 **Add channels** - Set up Telegram and WhatsApp
5. 📊 **Monitor** - Set up health checks and alerts

---

## 📚 Documentation

- `SYSTEM-OVERVIEW.md` - Complete system overview
- `DEPLOYMENT-GUIDE.md` - Production deployment
- `server/README.md` - Server documentation
- `server/config/errorCodes.js` - All error codes

---

## 🆘 Need Help?

**Common Issues:**
- MongoDB not running → `docker run -d -p 27017:27017 mongo`
- Port 3000 in use → Change PORT in `.env`
- OpenAI errors → Check API key and credits

**Contact:**
- Phone: +256761903887
- Check logs: `server/logs/error.log`

---

## ✅ Success Checklist

- [ ] MongoDB running
- [ ] Server started (`npm start`)
- [ ] Health check passes
- [ ] Test message works
- [ ] Website connected
- [ ] Telegram configured (optional)
- [ ] WhatsApp configured (optional)

**Once all checked, you're live!** 🎉

---

## 🔒 Security Reminders

1. ✅ Revoke old OpenAI key
2. ✅ Create new OpenAI key
3. ✅ Never commit `.env` to Git
4. ✅ Use HTTPS in production
5. ✅ Keep secrets secret!

**Your chatbot is ready to serve customers!** 🎂
