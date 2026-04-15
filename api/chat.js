const { rooms, getOpenAIClient, createPersonaPrompt, corsHeaders, getFallbackReply } = require('./_shared');

module.exports = async function handler(req, res) {
  // CORS
  Object.entries(corsHeaders()).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, message, chatHistory } = req.body || {};
  const roomData = rooms[userId] || rooms['default'];

  // OpenAI 키가 없으면 폴백 응답
  const openai = getOpenAIClient();
  if (!openai) {
    return res.json({ reply: getFallbackReply() });
  }

  try {
    const systemPrompt = createPersonaPrompt(roomData.aiConfig, 'chat');

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach(msg => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }

    messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 150,
      temperature: 0.8
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('AI 채팅 오류:', error.message);
    // API 오류 시에도 폴백
    res.json({ reply: getFallbackReply() });
  }
};
