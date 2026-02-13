#!/bin/bash

echo "🎂 Setting up Blessed Handly Bakery Bot for Render"
echo "=================================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Bakery Bot"
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "Next steps:"
echo "1. Create GitHub repository"
echo "2. Push code: git remote add origin YOUR-REPO-URL"
echo "3. Push code: git push -u origin main"
echo "4. Go to render.com and connect your GitHub repo"
echo "5. Render will auto-deploy using render.yaml"
echo ""
echo "Your bot will be live at: https://bakery-bot.onrender.com"
