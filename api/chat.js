const { rooms, getOpenAIClient, createPersonaPrompt, corsHeaders, getFallbackReply } = require('./_shared');

module.exports = async function handler(req, res) {
  // CORS
  Object.entries(corsHeaders()).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, message, chatHistory, persona: reqPersona, context } = req.body || {};
  const roomData = rooms[userId] || rooms['default'];

  // 클라이언트에서 보낸 persona를 우선 사용
  const persona = reqPersona || roomData.aiConfig.persona || 'sangsuri';
  const fallbackEmojis = { sangsuri: '📚', neosokbam: '🌙', betrayer: '🍷', riftan: '⚔️' };

  // OpenAI 키가 없으면 폴백 응답
  const openai = getOpenAIClient();
  if (!openai) {
    return res.json({ reply: getFallbackReply(persona), emoji: fallbackEmojis[persona] || '😊' });
  }

  try {
    const aiConfig = { ...roomData.aiConfig, persona };
    if (context) {
      aiConfig.readingData = context;
    }
    const systemPrompt = createPersonaPrompt(aiConfig, 'chat');

    const messages = [
      { role: 'system', content: systemPrompt + `\n\n중요: 응답의 맨 마지막 줄에 답변의 감정을 나타내는 이모지를 하나만 추가하세요. 반드시 마지막 줄에 이모지 하나만 단독으로 적어주세요.\n예시:\n좋은 질문이네요. 저도 생각해볼게요.\n😊` }
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

    const rawReply = completion.choices[0].message.content.trim();

    // 마지막 줄에서 이모지 추출
    const lines = rawReply.split('\n').filter(l => l.trim());
    let emoji = '😊';
    let reply = rawReply;

    if (lines.length >= 2) {
      const lastLine = lines[lines.length - 1].trim();
      // 이모지만 있는 줄인지 확인 (1~2글자, 이모지 패턴)
      if (lastLine.length <= 4 && /\p{Emoji}/u.test(lastLine)) {
        emoji = lastLine;
        reply = lines.slice(0, -1).join('\n').trim();
      }
    }

    res.json({ reply, emoji });
  } catch (error) {
    console.error('AI 채팅 오류:', error.message);
    res.json({ reply: getFallbackReply(persona), emoji: fallbackEmojis[persona] || '😊' });
  }
};
