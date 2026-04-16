const express = require('express');
const router = express.Router();

// Check if ChatGPT is configured
router.get('/api/chat/status', (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
  const ENABLE_GPT_5_1_CODEX_MAX = process.env.ENABLE_GPT_5_1_CODEX_MAX === 'true';
  
  const isOpenAIConfigured = OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here';
  const isN8NConfigured = N8N_WEBHOOK_URL && N8N_WEBHOOK_URL.length > 0;
  
  let mode = 'Basic Knowledge Base';
  if (isN8NConfigured) {
    mode = ENABLE_GPT_5_1_CODEX_MAX ? 'n8n Workflow (GPT-5.1-Codex-Max)' : 'n8n Workflow';
  } else if (isOpenAIConfigured) {
    mode = 'ChatGPT (GPT-3.5-turbo)';
  }
  
  res.json({
    chatgpt_enabled: isOpenAIConfigured || isN8NConfigured,
    n8n_enabled: isN8NConfigured,
    gpt_5_1_enabled: ENABLE_GPT_5_1_CODEX_MAX,
    mode: mode
  });
});

// n8n Webhook Integration for Indian Constitution chatbot
router.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) {
      return res.status(400).json({ error: 'No user message found' });
    }

    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

    // Check if n8n webhook is configured
    if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.length === 0) {
      return res.status(503).json({ 
        error: 'n8n webhook is not configured. Please set N8N_WEBHOOK_URL in .env file.' 
      });
    }

    console.log('🔗 Using n8n webhook for response...');
    console.log('📤 Sending to:', N8N_WEBHOOK_URL);
    console.log('📤 Payload:', JSON.stringify({
      messages: messages,
      query: lastUserMessage.content,
      context: 'Indian Constitution Tutor Chatbot'
    }));
    
    // Send request to n8n webhook ONLY
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
        query: lastUserMessage.content,
        context: 'Indian Constitution Tutor Chatbot'
      })
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`❌ n8n webhook returned status: ${n8nResponse.status}`);
      console.error(`❌ Error response:`, errorText);
      return res.status(502).json({ 
        error: `n8n webhook returned error ${n8nResponse.status}. Your n8n workflow may have an issue. Check n8n workflow logs.`,
        details: errorText.substring(0, 200)
      });
    }

    const n8nData = await n8nResponse.json();
    console.log('✅ n8n webhook response received successfully');
    console.log('📥 Response data:', JSON.stringify(n8nData).substring(0, 100) + '...');

    // Handle different response formats from n8n
    let assistantMessage = '';
    if (n8nData.response) {
      assistantMessage = n8nData.response;
    } else if (n8nData.output) {
      assistantMessage = n8nData.output;
    } else if (n8nData.message) {
      assistantMessage = n8nData.message;
    } else if (typeof n8nData === 'string') {
      assistantMessage = n8nData;
    } else if (n8nData.reply) {
      assistantMessage = n8nData.reply;
    } else {
      // If none of the expected fields exist, stringify the response
      assistantMessage = JSON.stringify(n8nData);
    }

    return res.json({
      reply: {
        role: 'assistant',
        content: assistantMessage
      }
    });

  } catch (error) {
    console.error('❌ Error in chat endpoint:', error.message);
    return res.status(500).json({ 
      error: 'Failed to get response from n8n webhook. Please check server logs and n8n workflow configuration.',
      details: error.message
    });
  }
});

module.exports = router;
