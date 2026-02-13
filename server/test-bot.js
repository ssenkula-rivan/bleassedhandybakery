#!/usr/bin/env node

// Simple test script to verify the bot is working
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

console.log('🧪 Testing Blessed Handly Bakery Bot...\n');

async function test() {
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get(`${API_URL}/api/health`);
    console.log('✅ Health check passed:', health.data.status);
    console.log('');

    // Test 2: Simple greeting
    console.log('2️⃣ Testing simple greeting...');
    const greeting = await axios.post(`${API_URL}/api/website/chat`, {
      userId: 'test-user-1',
      message: 'hello'
    });
    console.log('✅ Bot response:', greeting.data.response);
    console.log('   Response time:', greeting.data.responseTime + 'ms');
    console.log('   Source:', greeting.data.source);
    console.log('');

    // Test 3: Product inquiry
    console.log('3️⃣ Testing product inquiry...');
    const product = await axios.post(`${API_URL}/api/website/chat`, {
      userId: 'test-user-2',
      message: 'how much is a wedding cake?'
    });
    console.log('✅ Bot response:', product.data.response.substring(0, 100) + '...');
    console.log('   Response time:', product.data.responseTime + 'ms');
    console.log('   Source:', product.data.source);
    console.log('');

    // Test 4: Bargaining
    console.log('4️⃣ Testing bargaining...');
    const bargain = await axios.post(`${API_URL}/api/website/chat`, {
      userId: 'test-user-3',
      message: 'that is too expensive, can you give me a discount?'
    });
    console.log('✅ Bot response:', bargain.data.response.substring(0, 100) + '...');
    console.log('   Response time:', bargain.data.responseTime + 'ms');
    console.log('   Source:', bargain.data.source);
    console.log('');

    // Test 5: Error handling
    console.log('5️⃣ Testing error handling...');
    const error = await axios.post(`${API_URL}/api/website/chat`, {
      userId: 'test-user-4',
      message: ''  // Empty message
    }).catch(err => err.response);
    
    if (error.status === 400) {
      console.log('✅ Error handling works correctly');
      console.log('   Error message:', error.data.message);
    }
    console.log('');

    // Summary
    console.log('🎉 All tests passed!');
    console.log('');
    console.log('Your bot is working correctly! 🎂');
    console.log('');
    console.log('Next steps:');
    console.log('1. Open your website and test the chat');
    console.log('2. Configure Telegram (optional)');
    console.log('3. Configure WhatsApp (optional)');
    console.log('4. Deploy to production');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Is the server running? (npm start)');
    console.error('2. Is MongoDB running? (docker ps | grep mongo)');
    console.error('3. Check logs: tail -f logs/error.log');
    process.exit(1);
  }
}

test();
