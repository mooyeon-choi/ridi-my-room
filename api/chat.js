const { rooms, getOpenAIClient, createPersonaPrompt, corsHeaders } = require('./_shared');

module.exports = async function handler(req, res) {
  // CORS
  Object.entries(corsHeaders()).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, message, chatHistory } = req.body;
  const roomData = rooms[userId];

  if (!roomData) {
    return res.status(404).json({ error: '서재를 찾을 수 없습니다.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  try {
    const openai = getOpenAIClient();
    const systemPrompt = createPersonaPrompt(roomData.aiConfig, 'chat');

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // 이전 대화 히스토리 추가
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
    console.error('AI 채팅 오류:', error);
    res.status(500).json({ error: 'AI 응답 생성에 실패했습니다.' });
  }
};
