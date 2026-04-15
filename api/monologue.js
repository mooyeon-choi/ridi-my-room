const { rooms, getOpenAIClient, createPersonaPrompt, corsHeaders } = require('./_shared');

module.exports = async function handler(req, res) {
  Object.entries(corsHeaders()).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, action } = req.body || {};
  const roomData = rooms[userId] || rooms['default'];

  const openai = getOpenAIClient();
  if (!openai) {
    const fallbacks = [
      '창밖 햇살이 참 따스하다',
      '이 문장 정말 아름답구나',
      '오늘은 차 한잔이 생각나네',
      '잠시 쉬어가도 좋겠다',
    ];
    return res.json({ monologue: fallbacks[Math.floor(Math.random() * fallbacks.length)] });
  }

  try {
    const systemPrompt = createPersonaPrompt(roomData.aiConfig, 'monologue');
    const actionPrompts = {
      walking: '서재를 걷고 있을 때',
      reading: '책을 읽고 있을 때',
      lookingWindow: '창문을 바라보고 있을 때',
      organizing: '책장을 정리하고 있을 때',
      sitting: '의자에 앉아 있을 때',
    };
    const userPrompt = `${actionPrompts[action] || '대기 중일 때'} 할 법한 혼잣말을 생성하세요.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 50,
      temperature: 0.9,
    });

    res.json({ monologue: completion.choices[0].message.content });
  } catch (error) {
    console.error('혼잣말 생성 오류:', error.message);
    res.json({ monologue: '조용한 오후가 좋구나' });
  }
};
