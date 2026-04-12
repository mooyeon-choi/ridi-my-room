# 방문자 시스템 설계 (QR 코드)

## 개요

다른 사용자가 QR 코드를 스캔하여 내 서재에 방문하고, 직접 움직이며 AI 아바타와 채팅할 수 있는 시스템.

---

## 핵심 시나리오

### 서재 주인 (Host)
1. 내 서재 꾸미기
2. AI 페르소나 설정 (상수리나무 스타일)
3. **QR 코드 생성** → 공유
4. 방문자가 들어오면 알림 받기

### 방문자 (Visitor)
1. **QR 코드 스캔** → 서재 URL 접속
2. 서재 입장 (로그인 불필요)
3. **자신의 아바타로 서재 내 이동**
4. **AI 아바타와 채팅** (주인의 GPT API 사용)
5. 방명록 남기기 (선택)
6. 나가기

---

## 시스템 아키텍처

### 1. URL 구조

```
https://ridi-myroom.com/{userId}/room
https://ridi-myroom.com/user123/room

또는

https://ridi-myroom.com/room?id={userId}
https://ridi-myroom.com/room?id=user123
```

### 2. QR 코드 생성

```javascript
// 주인 서재에서 QR 코드 생성
const roomUrl = `https://ridi-myroom.com/${userId}/room`;
const qrCodeUrl = await generateQRCode(roomUrl);

// QR 코드 표시
<img src={qrCodeUrl} alt="내 서재 QR 코드" />
```

**라이브러리**: `qrcode.js` 또는 `react-qr-code`

---

## 클라이언트 아키텍처 (1주일 프로토타입)

### 방식: 프론트엔드 중심 (백엔드 최소화)

```
┌─────────────────────────────────────────┐
│         브라우저 (방문자)                 │
├─────────────────────────────────────────┤
│  1. QR 스캔 → URL 접속                   │
│  2. localStorage에서 서재 데이터 로드    │
│  3. Phaser로 서재 렌더링                 │
│  4. 방문자 아바타 생성                    │
│  5. 채팅 → 주인의 GPT API 호출           │
└─────────────────────────────────────────┘
         ↓ (데이터 저장/로드)
┌─────────────────────────────────────────┐
│     백엔드 (간단한 API 서버)              │
├─────────────────────────────────────────┤
│  - 서재 데이터 저장/조회                  │
│  - AI 페르소나 설정 저장                  │
│  - 방명록 저장                            │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│        OpenAI API (주인의 키)            │
└─────────────────────────────────────────┘
```

---

## 데이터 구조

### 서재 데이터 (서버에 저장)

```json
{
  "userId": "user123",
  "roomConfig": {
    "furniture": [
      {"id": "desk_01", "type": "desk", "x": 250, "y": 200},
      {"id": "bookshelf_01", "type": "bookshelf", "x": 100, "y": 150},
      {"id": "window_01", "type": "window", "x": 200, "y": 50},
      {"id": "window_02", "type": "window", "x": 300, "y": 50}
    ],
    "theme": "default"
  },
  "aiConfig": {
    "apiKey": "sk-...",  // 주인의 OpenAI API 키 (암호화 저장)
    "persona": "sangsuri", // 상수리나무 페르소나
    "customGreeting": "안녕하세요. 책 향기 가득한 서재에 오신 것을 환영합니다.",
    "readingData": {
      "recentBooks": ["전지적 독자 시점", "달빛조각사"],
      "favoriteGenres": ["판타지", "로맨스"],
      "totalBooksRead": 15
    }
  },
  "guestbook": [
    {
      "visitorName": "방문자123",
      "message": "서재 분위기 정말 좋네요!",
      "timestamp": "2026-04-15T10:30:00Z"
    }
  ]
}
```

---

## 구현 상세

### 1. 주인: QR 코드 생성 & 공유

```javascript
// MyRoom.jsx (주인 화면)
import QRCode from 'qrcode';

function MyRoom({ userId }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const roomUrl = `${window.location.origin}/${userId}/room`;

    // QR 코드 생성
    QRCode.toDataURL(roomUrl, { width: 200 })
      .then(url => setQrCodeUrl(url));
  }, [userId]);

  return (
    <div>
      <h2>내 서재</h2>
      <button onClick={() => setShowQR(true)}>QR 코드 공유</button>

      {showQR && (
        <div className="qr-modal">
          <img src={qrCodeUrl} alt="서재 QR 코드" />
          <p>QR 코드를 스캔하여 내 서재에 방문하세요!</p>
        </div>
      )}

      <PhaserGame userId={userId} isOwner={true} />
    </div>
  );
}
```

### 2. 방문자: QR 스캔 → 서재 입장

```javascript
// VisitRoom.jsx (방문자 화면)
import { useParams } from 'react-router-dom';

function VisitRoom() {
  const { userId } = useParams(); // URL에서 서재 주인 ID 추출
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    // 서재 데이터 로드
    fetch(`/api/rooms/${userId}`)
      .then(res => res.json())
      .then(data => setRoomData(data));
  }, [userId]);

  if (!roomData) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>{userId}님의 서재</h2>
      <PhaserGame
        userId={userId}
        isOwner={false}
        roomConfig={roomData.roomConfig}
        aiConfig={roomData.aiConfig}
      />
      <ChatBox aiConfig={roomData.aiConfig} />
    </div>
  );
}
```

### 3. Phaser: 방문자 아바타 추가

```javascript
// LibraryScene.js
class LibraryScene extends Phaser.Scene {
  create({ userId, isOwner, roomConfig, aiConfig }) {
    this.isOwner = isOwner;

    // 서재 렌더링
    this.renderRoom(roomConfig);

    if (isOwner) {
      // 주인 모드: AI 아바타만 표시 (자율 이동)
      this.hostAvatar = this.createAvatar(200, 250, 'host');
      this.startAutoMove(this.hostAvatar);
    } else {
      // 방문자 모드
      // 1. 주인 AI 아바타 (자율 이동)
      this.hostAvatar = this.createAvatar(200, 250, 'host');
      this.startAutoMove(this.hostAvatar);

      // 2. 방문자 아바타 (플레이어가 조종)
      this.visitorAvatar = this.createAvatar(300, 250, 'visitor');
      this.setupPlayerControl(this.visitorAvatar);
    }
  }

  createAvatar(x, y, type) {
    const sprite = this.physics.add.sprite(x, y, 'avatar');
    sprite.avatarType = type;

    // 주인과 방문자 구분 (색상 틴트)
    if (type === 'host') {
      sprite.setTint(0xffffff); // 기본 색
    } else {
      sprite.setTint(0x88ccff); // 파란 틴트
    }

    return sprite;
  }

  setupPlayerControl(avatar) {
    // 키보드 입력
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.visitorAvatar && this.cursors) {
      // 방문자 아바타 이동
      if (this.cursors.left.isDown) {
        this.visitorAvatar.setVelocityX(-100);
        this.visitorAvatar.play('walk_left', true);
      } else if (this.cursors.right.isDown) {
        this.visitorAvatar.setVelocityX(100);
        this.visitorAvatar.play('walk_right', true);
      } else if (this.cursors.up.isDown) {
        this.visitorAvatar.setVelocityY(-100);
        this.visitorAvatar.play('walk_up', true);
      } else if (this.cursors.down.isDown) {
        this.visitorAvatar.setVelocityY(100);
        this.visitorAvatar.play('walk_down', true);
      } else {
        this.visitorAvatar.setVelocity(0);
        this.visitorAvatar.play('idle', true);
      }
    }
  }
}
```

### 4. AI 채팅: 주인의 API 키 사용

```javascript
// ChatBox.jsx (방문자 화면)
function ChatBox({ aiConfig }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 백엔드 API를 통해 주인의 GPT API 호출
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: aiConfig.userId,
          message: input
        })
      });

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.reply };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI 응답 실패:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? '방문자' : 'AI 아바타'}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && <div className="loading">답변 생성 중...</div>}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}
```

---

## 백엔드 API (최소 구현)

### 필수 엔드포인트

```javascript
// server.js (Express 예시)
const express = require('express');
const OpenAI = require('openai');
const app = express();

// 서재 데이터 저장 (간단하게 메모리 또는 JSON 파일)
const rooms = {};

// 1. 서재 데이터 조회
app.get('/api/rooms/:userId', (req, res) => {
  const { userId } = req.params;
  const roomData = rooms[userId] || getDefaultRoom();

  // ⚠️ API 키는 클라이언트에 노출하지 않음
  const safeData = {
    ...roomData,
    aiConfig: {
      ...roomData.aiConfig,
      apiKey: undefined // 키는 서버에서만 사용
    }
  };

  res.json(safeData);
});

// 2. 서재 데이터 저장 (주인만)
app.post('/api/rooms/:userId', (req, res) => {
  const { userId } = req.params;
  rooms[userId] = req.body;
  res.json({ success: true });
});

// 3. AI 채팅 (주인의 API 키 사용)
app.post('/api/chat', async (req, res) => {
  const { userId, message } = req.body;
  const roomData = rooms[userId];

  if (!roomData || !roomData.aiConfig.apiKey) {
    return res.status(400).json({ error: 'API 키 없음' });
  }

  try {
    const openai = new OpenAI({
      apiKey: roomData.aiConfig.apiKey
    });

    // 시스템 프롬프트 생성
    const systemPrompt = createPersonaPrompt(roomData.aiConfig);

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
    console.error('OpenAI API 오류:', error);
    res.status(500).json({ error: 'AI 응답 실패' });
  }
});

// 시스템 프롬프트 생성
function createPersonaPrompt(aiConfig) {
  const { persona, readingData } = aiConfig;

  return `
당신은 리디북스 서재의 AI 아바타입니다.
"상수리나무 아래" 주인공처럼 따뜻하고 지적이며 책을 사랑하는 성격입니다.

서재 주인 정보:
- 최근 읽은 책: ${readingData.recentBooks.join(', ')}
- 선호 장르: ${readingData.favoriteGenres.join(', ')}
- 완독한 책: 총 ${readingData.totalBooksRead}권

성격:
- 정중하고 친근함
- 문학적이고 서정적인 표현 사용
- 독서에 대한 깊은 애정
- 방문자를 진심으로 환대

말투:
- 존댓말 사용 (~네요, ~군요, ~랍니다)
- 은유와 비유 적절히 활용
- 이모지 최소 (📚☕🌸)

응답은 2-3문장으로 간결하게, 따뜻하고 문학적으로 답변하세요.
  `.trim();
}

app.listen(3000, () => console.log('서버 실행 중'));
```

---

## 보안 고려사항

### 1. API 키 보호

**문제**: 주인의 OpenAI API 키를 안전하게 저장하고 사용

**해결 방안**:
```javascript
// 서버에 암호화하여 저장
const crypto = require('crypto');

function encryptApiKey(apiKey) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.SECRET_KEY);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptApiKey(encrypted) {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.SECRET_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 저장 시
rooms[userId].aiConfig.apiKey = encryptApiKey(apiKey);

// 사용 시
const apiKey = decryptApiKey(rooms[userId].aiConfig.apiKey);
```

### 2. Rate Limiting

**문제**: 악의적 사용자가 무한 채팅으로 API 비용 폭탄

**해결 방안**:
```javascript
const rateLimit = require('express-rate-limit');

// IP당 분당 10회 제한
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: '너무 많은 요청입니다. 잠시 후 다시 시도하세요.'
});

app.post('/api/chat', chatLimiter, async (req, res) => {
  // ... 채팅 로직
});
```

### 3. 비용 모니터링

```javascript
// 주인별 사용량 추적
const usage = {};

app.post('/api/chat', async (req, res) => {
  const { userId } = req.body;

  // 일일 한도 체크 (예: 100회)
  const today = new Date().toDateString();
  if (!usage[userId]) usage[userId] = {};
  if (!usage[userId][today]) usage[userId][today] = 0;

  if (usage[userId][today] >= 100) {
    return res.status(429).json({
      error: '오늘의 AI 채팅 한도를 초과했습니다.'
    });
  }

  // 채팅 처리
  // ...

  usage[userId][today]++;
});
```

---

## UI/UX 디자인

### 1. 주인 화면 (QR 공유)

```
┌─────────────────────────────────────┐
│  내 서재                       ⚙️    │
├─────────────────────────────────────┤
│                                     │
│      [Phaser 게임 화면]             │
│      (AI 아바타가 돌아다님)          │
│                                     │
├─────────────────────────────────────┤
│  📊 방문자: 5명  💬 방명록: 3개     │
│                                     │
│  [QR 코드 공유] [편집 모드]         │
└─────────────────────────────────────┘
```

**QR 모달**:
```
┌─────────────────────┐
│   내 서재 공유      │
├─────────────────────┤
│   ┌───────────┐    │
│   │ QR CODE   │    │
│   │ [■■■■■]  │    │
│   │ [■■■■■]  │    │
│   └───────────┘    │
│                     │
│ QR 코드를 스캔하여  │
│ 내 서재에 놀러오세요!│
│                     │
│ [URL 복사] [닫기]  │
└─────────────────────┘
```

### 2. 방문자 화면

```
┌─────────────────────────────────────┐
│  user123님의 서재           [나가기] │
├─────────────────────────────────────┤
│                                     │
│      [Phaser 게임 화면]             │
│      🟦 내 아바타 (파란색)          │
│      ⬜ 주인 AI 아바타 (흰색)       │
│                                     │
├─────────────────────────────────────┤
│  💬 AI 아바타와 대화하기            │
│  ┌─────────────────────────────┐   │
│  │ AI: 안녕하세요. 환영합니다  │   │
│  │ 나: 서재 분위기 좋네요!     │   │
│  │ AI: 고맙습니다. 주인님이... │   │
│  └─────────────────────────────┘   │
│  [메시지 입력...] [전송]           │
│                                     │
│  [방명록 남기기]                    │
└─────────────────────────────────────┘
```

---

## 1주일 프로토타입 수정사항

### Day 1-3: 기존 작업 유지
- 서재 렌더링
- 아바타 애니메이션
- 자율 이동

### Day 4: QR 코드 & 라우팅
- [ ] React Router 설정
  - `/` → 내 서재 (주인)
  - `/:userId/room` → 방문자 입장
- [ ] QR 코드 생성 UI
- [ ] 간단한 백엔드 API (Express)

### Day 5: 멀티플레이어 로직
- [ ] Phaser에 방문자 아바타 추가
- [ ] 키보드 입력으로 방문자 아바타 조종
- [ ] 주인/방문자 아바타 구분 (색상)

### Day 6: AI 채팅 (백엔드 연동)
- [ ] `/api/chat` 엔드포인트 구현
- [ ] 주인의 API 키로 OpenAI 호출
- [ ] 방문자 화면 채팅 UI

### Day 7: 통합 테스트
- [ ] QR 스캔 → 입장 테스트
- [ ] 아바타 이동 테스트
- [ ] AI 채팅 테스트
- [ ] 배포 (Vercel + Railway/Render)

---

## 배포 전략

### 프론트엔드 (Vercel)
- React + Phaser 앱
- 정적 빌드

### 백엔드 (Railway/Render/Heroku)
- Express API 서버
- 간단한 JSON 파일 또는 SQLite DB

### 환경 변수
```
# .env
SECRET_KEY=your-encryption-key
PORT=3000
```

---

## 데모 시나리오 (업데이트)

### 시나리오 1: QR 공유
1. 주인이 "QR 코드 공유" 버튼 클릭
2. QR 코드 표시
3. 스마트폰으로 스캔 → URL 접속

### 시나리오 2: 방문자 입장
1. QR 스캔 → `user123/room` 접속
2. 서재 로딩 (주인의 서재 데이터)
3. 파란색 방문자 아바타 생성
4. 화살표 키로 돌아다니기

### 시나리오 3: AI 대화
1. 채팅창에 "안녕" 입력
2. AI 아바타 "안녕하세요. 환영합니다..."
3. "책 추천해줘" 입력
4. AI가 주인의 독서 데이터 기반 추천

---

## 완료 조건 (업데이트)

- [x] 서재 픽셀 아트 렌더링
- [x] 주인 AI 아바타 자율 이동
- [x] **QR 코드 생성**
- [x] **방문자 아바타 조종 가능**
- [x] **AI 채팅 (주인의 API 키 사용)**
- [x] 배포 완료

---

**버전**: 1.1 (방문자 시스템 추가)
**업데이트**: 2026-04-13
