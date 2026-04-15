let OpenAI;
try {
  OpenAI = require('openai');
} catch (e) {
  OpenAI = null;
}

// 방 데이터
const rooms = {
  default: {
    aiConfig: {
      persona: 'sangsuri',
      hostName: '루스',
      readingData: {
        recentBooks: ['전지적 독자 시점', '달빛조각사', '나 혼자만 레벨업'],
        favoriteGenres: ['판타지', '로맨스'],
        totalBooksRead: 15,
      },
    },
  },
  sangsuri_user: {
    aiConfig: {
      persona: 'sangsuri',
      hostName: '루스',
      readingData: {
        recentBooks: ['상수리나무 아래', '전지적 독자 시점', '달빛조각사'],
        favoriteGenres: ['판타지', '로맨스'],
        totalBooksRead: 15,
      },
    },
  },
  neosokbam_user: {
    aiConfig: {
      persona: 'neosokbam',
      hostName: '여주인공',
      readingData: {
        recentBooks: ['너를 속이는 밤', '안개를 삼킨 나비', '메리 사이코'],
        favoriteGenres: ['로맨스', '스릴러'],
        totalBooksRead: 12,
      },
    },
  },
  betrayer_user: {
    aiConfig: {
      persona: 'betrayer',
      hostName: '남주인공',
      readingData: {
        recentBooks: ['품격을 배반한다', '데페이즈망', '폐하의 밤'],
        favoriteGenres: ['로맨스', '드라마'],
        totalBooksRead: 20,
      },
    },
  },
};

// 폴백 응답 (API 키 없을 때)
const FALLBACK_REPLIES = [
  '반가워요. 천천히 둘러보세요.',
  '좋은 질문이네요. 저도 생각해 볼게요.',
  '책 한 권의 여운이 오래가는 날이에요.',
  '오늘은 조용히 책 읽기 좋은 날이네요.',
  '편하게 이야기 나눠요.',
  '그 이야기, 참 흥미롭네요.',
  '함께 이야기 나눌 수 있어서 기쁘네요.',
  '이런 대화가 참 좋네요.',
  '좋은 하루 보내고 계신가요?',
];

function getOpenAIClient() {
  if (!OpenAI || !process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function createPersonaPrompt(aiConfig, type = 'chat') {
  const { readingData, hostName } = aiConfig;

  if (type === 'monologue') {
    return `
당신은 "${hostName || '서재 주인'}"입니다. 차분하고 사색적인 서재 주인입니다.
최근 읽은 책: ${readingData.recentBooks.join(', ')}
선호 장르: ${readingData.favoriteGenres.join(', ')}
혼잣말 생성 규칙: 15~25자 이내 짧은 반말 혼잣말. 시적이고 서정적. 이모지 금지.
    `.trim();
  }

  return `
당신은 "${hostName || '서재 주인'}"이라는 이름의 AI 아바타입니다.
차분하고 사색적이며 책과 조용한 시간을 사랑합니다.
최근 읽은 책: ${readingData.recentBooks.join(', ')}
선호 장르: ${readingData.favoriteGenres.join(', ')}
완독한 책: 총 ${readingData.totalBooksRead}권
말투: 부드러운 존댓말, 2~3문장으로 간결하게 응답
  `.trim();
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function getFallbackReply() {
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
}

module.exports = { rooms, getOpenAIClient, createPersonaPrompt, corsHeaders, getFallbackReply };
