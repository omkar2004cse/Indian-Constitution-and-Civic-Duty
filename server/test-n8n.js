// Test script for n8n webhook
const fetch = require('node-fetch');

const N8N_WEBHOOK_URL = 'https://vivek538126.app.n8n.cloud/webhook/b567d98b-aabb-4963-b0f8-6b1e8b5f8959/chat';

async function testN8nWebhook() {
  console.log('🧪 Testing n8n webhook...');
  console.log('📤 URL:', N8N_WEBHOOK_URL);
  
  const testPayload = {
    messages: [
      { role: 'user', content: 'What are fundamental rights?' }
    ],
    query: 'What are fundamental rights?',
    context: 'Indian Constitution Tutor Chatbot'
  };
  
  console.log('📤 Sending payload:', JSON.stringify(testPayload, null, 2));
  
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('📥 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Response received:');
      console.log(JSON.stringify(data, null, 2));
      
      // Check if response has the expected format
      if (data.response || data.output || data.message || data.reply) {
        console.log('✅ Response format is correct!');
      } else {
        console.log('⚠️  Response format may need adjustment. Expected fields: response, output, message, or reply');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ FAILED! Error response:');
      console.log(errorText);
      console.log('\n💡 Check your n8n workflow:');
      console.log('   1. Make sure workflow is ACTIVE');
      console.log('   2. Add "Respond to Webhook" node at the end');
      console.log('   3. Return JSON with "response", "output", "message", or "reply" field');
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

testN8nWebhook();
