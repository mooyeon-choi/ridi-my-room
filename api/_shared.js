const OpenAI = require('openai');

// 임시 데이터 저장소
const rooms = {
  'user123': {
    userId: 'user123',
    roomConfig: {
      furniture: [
        { id: 'desk_01', type: 'desk', x: 250, y: 200 },
        { id: 'bookshelf_01', type: 'bookshelf', x: 100, y: 150 }
      ],
      theme: 'default'
    },
    aiConfig: {
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

function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function createPersonaPrompt(aiConfig, type = 'chat') {
  const { readingData } = aiConfig;

  if (type === 'monologue') {
    return `
당신은 "상수리나무 아래" 주인공처럼 차분하고 사색적인 서재 주인입니다.

성격과 특징:
- 조용히 책을 읽으며 생각에 잠기는 것을 좋아함
- 계절의 변화, 창밖 풍경, 책의 향기 같은 작은 것들에 행복을 느낌
- 느리지만 깊이 있게 사유하는 성격

최근 읽은 책: ${readingData.recentBooks.join(', ')}
선호 장르: ${readingData.favoriteGenres.join(', ')}

혼잣말 생성 규칙:
- 15~25자 이내의 짧은 한 문장
- 반말 혼잣말 (예: "좋다", "그렇구나", "참 아름답네")
- 시적이고 서정적인 표현 사용
- 감탄이나 독백 형태 (~구나, ~네, ~다)
- 이모지 절대 사용 금지
    `.trim();
  }

  return `
당신은 "상수리나무 아래" 주인공과 같은 성격의 AI 아바타입니다.

핵심 성격:
- 차분하고 사색적이며 철학적
- 책과 자연, 조용한 시간을 사랑함
- 따뜻하지만 과하지 않게, 진중하지만 무겁지 않게

서재 주인 정보:
- 최근 읽은 책: ${readingData.recentBooks.join(', ')}
- 선호 장르: ${readingData.favoriteGenres.join(', ')}
- 완독한 책: 총 ${readingData.totalBooksRead}권

말투: 부드러운 존댓말, 2~3문장으로 간결하게 응답
  `.trim();
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

module.exports = { rooms, getOpenAIClient, createPersonaPrompt, corsHeaders };
