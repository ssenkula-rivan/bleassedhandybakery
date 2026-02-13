#!/bin/bash

# Quick Start Script for Blessed Handly Bakery Bot
# This script sets up everything you need to get started

set -e

echo "🎂 Blessed Handly Bakery Bot - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if MongoDB is running
if ! command -v mongo &> /dev/null && ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not detected. Installing via Docker..."
    if command -v docker &> /dev/null; then
        docker run -d -p 27017:27017 --name bakery-mongodb mongo:latest
        echo "✅ MongoDB started in Docker"
    else
        echo "❌ Please install MongoDB or Docker first"
        exit 1
    fi
else
    echo "✅ MongoDB detected"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✅ .env created - PLEASE EDIT IT WITH YOUR CREDENTIALS!"
    echo ""
    echo "Required credentials:"
    echo "  - OPENAI_API_KEY (get from https://platform.openai.com/)"
    echo "  - TELEGRAM_BOT_TOKEN (get from @BotFather)"
    echo "  - WHATSAPP credentials (get from Meta Business)"
    echo ""
    read -p "Press Enter after you've edited .env..."
fi

# Create logs directory
mkdir -p logs

# Test database connection
echo ""
echo "🔍 Testing database connection..."
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blessed_handly_bakery')
  .then(() => { console.log('✅ Database connected'); process.exit(0); })
  .catch((err) => { console.log('❌ Database connection failed:', err.message); process.exit(1); });
"

# Start server
echo ""
echo "🚀 Starting server..."
echo ""

if command -v pm2 &> /dev/null; then
    pm2 start server.js --name bakery-bot
    pm2 logs bakery-bot
else
    echo "💡 Tip: Install PM2 for production (npm install -g pm2)"
    echo ""
    npm start
fi
