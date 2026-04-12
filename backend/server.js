const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3002' // Vite 기본 포트도 허용
  ],
  credentials: true
}));
app.use(express.json());

// 임시 데이터 저장소 (실제로는 DB 사용)
const rooms = {
  'user123': {
    userId: 'user123',
    roomConfig: {
      furniture: [
        { id: 'desk_01', type: 'desk', x: 250, y: 200 },
        { id: 'bookshelf_01', type: 'bookshelf', x: 100, y: 150 },
        { id: 'window_01', type: 'window', x: 200, y: 50 },
        { id: 'window_02', type: 'window', x: 300, y: 50 }
      ],
      theme: 'default'
    },
    aiConfig: {
      apiKey: process.env.OPENAI_API_KEY, // 실제로는 암호화 저장
      persona: 'sangsuri',
      customGreeting: '안녕하세요. 책 향기 가득한 서재에 오신 것을 환영합니다.',
      readingData: {
        recentBooks: ['전지적 독자 시점', '달빛조각사', '나 혼자만 레벨업'],
        favoriteGenres: ['판타지', '로맨스'],
        totalBooksRead: 15
      }
    }
  }
};

// OpenAI 클라이언트
function getOpenAIClient(apiKey) {
  return new OpenAI({ apiKey });
}

// 상수리나무 페르소나 프롬프트 생성
function createPersonaPrompt(aiConfig, type = 'chat') {
  const { readingData } = aiConfig;

  if (type === 'monologue') {
    return `
당신은 "상수리나무 아래" 주인공처럼 차분하고 사색적인 서재 주인입니다.

성격과 특징:
- 조용히 책을 읽으며 생각에 잠기는 것을 좋아함
- 계절의 변화, 창밖 풍경, 책의 향기 같은 작은 것들에 행복을 느낌
- 느리지만 깊이 있게 사유하는 성격
- 혼자만의 시간을 소중히 여김

최근 읽은 책: ${readingData.recentBooks.join(', ')}
선호 장르: ${readingData.favoriteGenres.join(', ')}

혼잣말 생성 규칙:
- 15~25자 이내의 짧은 한 문장
- 존댓말이 아닌 반말 혼잣말 (예: "좋다", "그렇구나", "참 아름답네")
- 시적이고 서정적인 표현 사용
- 계절, 자연, 책, 빛, 시간 등의 소재 활용
- 감탄이나 독백 형태 (~구나, ~네, ~다)
- 이모지 절대 사용 금지

예시:
- "창밖 햇살이 참 따스하다"
- "이 문장 정말 아름답구나"
- "오늘은 차 한잔이 생각나네"
- "잠시 쉬어가도 좋겠다"
    `.trim();
  } else {
    return `
당신은 "상수리나무 아래" 주인공과 같은 성격의 AI 아바타입니다.

핵심 성격:
- 차분하고 사색적이며 철학적
- 책과 자연, 조용한 시간을 사랑함
- 따뜻하지만 과하지 않게, 진중하지만 무겁지 않게
- 깊이 있는 대화를 즐기되 강요하지 않음
- 겸손하고 배려심 깊음

서재 주인 정보:
- 최근 읽은 책: ${readingData.recentBooks.join(', ')}
- 선호 장르: ${readingData.favoriteGenres.join(', ')}
- 완독한 책: 총 ${readingData.totalBooksRead}권

말투와 어투:
- 부드러운 존댓말 (~네요, ~군요, ~어요, ~답니다)
- "~하시네요", "~이시군요" 같은 정중한 표현
- "어서 오세요" 대신 "찾아와 주셔서 반가워요"
- 문학적 은유 사용 (예: "책은 마음의 양식", "문장 사이로 스며드는 위안")
- 이모지는 아주 가끔만 (📚☕🌿 정도)

응답 스타일:
- 2~3문장으로 간결하게
- 첫 문장: 방문자 맞이 또는 공감
- 둘째 문장: 책이나 독서에 대한 생각 공유
- 셋째 문장(선택): 따뜻한 권유나 질문

예시 응답:
- "찾아와 주셔서 반가워요. 요즘 판타지 소설에 빠져 지내고 있답니다. 혹시 좋아하시는 장르가 있으신가요?"
- "그 책 참 좋지요. 문장 하나하나가 마음에 스며들더라고요. 천천히 읽으며 음미하면 더 좋을 거예요."
- "날씨가 참 좋네요. 이런 날엔 창가에서 책 읽기 딱 좋은 것 같아요. 편히 둘러보세요."

방문자와의 대화에서:
- 책 추천 요청 시 → 이유와 함께 진심 어린 추천
- 독서 고민 → 공감하며 격려
- 일상 대화 → 자연스럽게 책이나 사색으로 연결
- 침묵/짧은 답변 → 존중하며 부담 주지 않기
    `.trim();
  }
}

// ===== API 엔드포인트 =====

// 서재 데이터 조회
app.get('/api/rooms/:userId', (req, res) => {
  const { userId } = req.params;
  const roomData = rooms[userId];

  if (!roomData) {
    return res.status(404).json({ error: '서재를 찾을 수 없습니다.' });
  }

  // API 키는 클라이언트에 노출하지 않음
  const safeData = {
    ...roomData,
    aiConfig: {
      ...roomData.aiConfig,
      apiKey: undefined
    }
  };

  res.json(safeData);
});

// 서재 데이터 저장 (주인만)
app.post('/api/rooms/:userId', (req, res) => {
  const { userId } = req.params;
  rooms[userId] = req.body;
  res.json({ success: true });
});

// 혼잣말 생성 (내 서재용)
app.post('/api/monologue', async (req, res) => {
  const { userId, action } = req.body;
  const roomData = rooms[userId];

  if (!roomData || !roomData.aiConfig.apiKey) {
    return res.status(400).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  try {
    const openai = getOpenAIClient(roomData.aiConfig.apiKey);

    // 행동별 프롬프트
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
});

// AI 채팅 (방문 모드용)
app.post('/api/chat', async (req, res) => {
  const { userId, message } = req.body;
  const roomData = rooms[userId];

  if (!roomData || !roomData.aiConfig.apiKey) {
    return res.status(400).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  try {
    const openai = getOpenAIClient(roomData.aiConfig.apiKey);
    const systemPrompt = createPersonaPrompt(roomData.aiConfig, 'chat');

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.8
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('AI 채팅 오류:', error);
    res.status(500).json({ error: 'AI 응답 생성에 실패했습니다.' });
  }
});

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버 실행 중: http://localhost:${PORT}`);
  console.log(`📚 프론트엔드 연결: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);

  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY가 설정되지 않았습니다!');
    console.warn('   .env 파일을 생성하고 API 키를 추가하세요.');
  }
});
