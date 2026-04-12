# 빠른 시작 가이드

## 🎯 핵심 개념 (30초 요약)

리디 마이룸은 **두 가지 모드**로 작동합니다:

### 1️⃣ 내 서재 모드 (`/my-room`)
- 내 아바타 조종
- 행동에 따라 **AI 혼잣말** 자동 생성
- QR 코드 공유

### 2️⃣ 방문 모드 (`/:userId/room`)
- 다른 사람의 서재 방문
- 주인 AI 아바타 + 내 아바타
- **AI와 채팅** 가능

---

## 🚀 개발 시작 (5분 세팅)

### 1. 필수 문서 읽기

```bash
# 모드 차이점 (가장 중요!)
cat docs/my-room-vs-visitor-mode.md

# 일일 작업 체크리스트
cat docs/daily-checklist.md
```

### 2. 프로젝트 초기화

```bash
# 프론트엔드
cd tavern-sim-game
npm init -y
npm install react react-dom react-router-dom phaser qrcode

# 백엔드
cd backend
npm init -y
npm install express cors dotenv openai
```

### 3. 폴더 구조 생성

```bash
tavern-sim-game/
├── src/
│   ├── components/
│   │   ├── MyRoom.jsx          # 내 서재
│   │   ├── VisitorRoom.jsx     # 방문 모드
│   │   ├── PhaserGame.jsx      # Phaser 통합
│   │   └── ChatBox.jsx         # 채팅 UI
│   ├── scenes/
│   │   └── LibraryScene.js     # Phaser Scene
│   └── App.jsx
├── backend/
│   └── server.js               # Express API
└── assets/
    └── sprites/                # 픽셀 아트
```

---

## 📋 Day-by-Day 체크리스트

### Day 1-3: 기본 구현 (Phaser + 픽셀 아트)
→ 자세한 내용: `docs/daily-checklist.md` Day 1-3

### Day 4: QR + 백엔드
→ 자세한 내용: `docs/daily-checklist.md` Day 4

### Day 5: 멀티플레이어
→ 자세한 내용: `docs/daily-checklist.md` Day 5

### Day 6: ⭐ AI 시스템 (핵심!)
→ 자세한 내용: `docs/daily-checklist.md` Day 6

**구현 내용:**
- `/api/monologue` - 내 서재 혼잣말 생성
- `/api/chat` - 방문자 채팅 응답

### Day 7: 배포
→ 자세한 내용: `docs/daily-checklist.md` Day 7

---

## 🎮 핵심 기능별 구현 가이드

### 1. 내 서재: AI 혼잣말

#### 프론트엔드 (MyRoom.jsx)
```javascript
// 행동 변경 → AI 혼잣말 요청
async function generateMonologue(action) {
  const res = await fetch('/api/monologue', {
    method: 'POST',
    body: JSON.stringify({ userId, action })
  });
  const { monologue } = await res.json();
  showSpeechBubble(monologue); // 말풍선 표시
}
```

#### 백엔드 (server.js)
```javascript
app.post('/api/monologue', async (req, res) => {
  const { userId, action } = req.body;

  // OpenAI 호출
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: '혼잣말 생성 프롬프트...' },
      { role: 'user', content: `행동: ${action}` }
    ]
  });

  res.json({ monologue: completion.choices[0].message.content });
});
```

### 2. 방문 모드: AI 채팅

#### 프론트엔드 (ChatBox.jsx)
```javascript
async function sendMessage(message) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ userId: hostUserId, message })
  });
  const { reply } = await res.json();
  addMessage('assistant', reply);
}
```

#### 백엔드 (server.js)
```javascript
app.post('/api/chat', async (req, res) => {
  const { userId, message } = req.body;

  // 주인의 API 키로 호출
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: '상수리나무 페르소나...' },
      { role: 'user', content: message }
    ]
  });

  res.json({ reply: completion.choices[0].message.content });
});
```

---

## 🔑 핵심 차이점 한눈에 보기

| 기능 | 내 서재 | 방문 모드 |
|------|---------|----------|
| URL | `/my-room` | `/:userId/room` |
| 아바타 수 | 1개 (내 것) | 2개 (주인 AI + 나) |
| AI 동작 | 혼잣말 (말풍선) | 채팅 (채팅창) |
| API | `/api/monologue` | `/api/chat` |
| 키보드 조종 | 내 아바타 | 내 방문자 아바타 |
| 편집 | 가능 | 불가 |

---

## 🎯 오늘 할 일

### Day 1이라면:
1. `docs/daily-checklist.md` Day 1 열기
2. Phaser 프로젝트 초기화
3. 기본 에셋 5종 제작

### Day 4라면:
1. `docs/my-room-vs-visitor-mode.md` 정독
2. React Router 설정
3. QR 코드 생성 UI

### Day 6이라면:
1. `/api/monologue` 엔드포인트 구현
2. `/api/chat` 엔드포인트 구현
3. 프론트엔드 통합

---

## 📖 막힐 때 참고할 문서

| 문제 | 문서 |
|------|------|
| 내 서재 vs 방문 모드 차이 | `my-room-vs-visitor-mode.md` ⭐⭐⭐ |
| AI 페르소나 응답 스타일 | `ai-persona-guide.md` |
| QR 코드 시스템 | `multiplayer-visitor-system.md` |
| 전체 일정 | `1-week-prototype.md` |
| 오늘 할 일 | `daily-checklist.md` |

---

## ✅ 데모 시나리오

### 시나리오 1: 내 서재 체험
1. `/my-room` 접속
2. 아바타 이동 → 책상 근처
3. 말풍선: "이 책 정말 재미있네"
4. 창문 근처 → "날씨 좋은데"

### 시나리오 2: 방문
1. QR 스캔 → `/user123/room`
2. 주인 AI 아바타 돌아다님
3. 내 파란 아바타로 탐험
4. 채팅: "안녕하세요" → AI 응답

---

## 🚨 자주 묻는 질문

### Q: 내 서재에서 채팅은 안 되나요?
A: 네, 내 서재는 혼잣말만 가능합니다. 채팅은 방문 모드에서만 작동합니다.

### Q: 방문자도 혼잣말이 생성되나요?
A: 아니요, 혼잣말은 주인(내 서재 모드)만 가능합니다. 방문자는 채팅으로 AI와 대화합니다.

### Q: AI API 키는 누구 것을 쓰나요?
A: 서재 주인의 API 키를 사용합니다. 방문자는 주인의 API 비용을 소비합니다.

---

**작성**: 2026-04-13
**최종 업데이트**: 2026-04-13
