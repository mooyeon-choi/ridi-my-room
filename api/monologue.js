const { rooms, getOpenAIClient, createPersonaPrompt, corsHeaders } = require('./_shared');

module.exports = async function handler(req, res) {
  Object.entries(corsHeaders()).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, action } = req.body;
  const roomData = rooms[userId];

  if (!roomData) {
    return res.status(404).json({ error: '서재를 찾을 수 없습니다.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  try {
    const openai = getOpenAIClient();

    const actionPrompts = {
      walking: '서재를 걷고 있을 때',
      reading: '책을 읽고 있을 때',
      lookingWindow: '창문을 바라보고 있을 때',
      organizing: '책장을 정리하고 있을 때',
      sitting: '의자에 앉아 있을 때'
    };

    const systemPrompt = createPersonaPrompt(roomData.aiConfig, 'monologue');
    const userPrompt = `${actionPrompts[action] || '대기 중일 때'} 할 법한 혼잣말을 생성하세요.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 50,
      temperature: 0.9
    });

    const monologue = completion.choices[0].message.content;
    res.json({ monologue });
  } catch (error) {
    console.error('혼잣말 생성 오류:', error);
    res.status(500).json({ error: '혼잣말 생성에 실패했습니다.' });
  }
};
