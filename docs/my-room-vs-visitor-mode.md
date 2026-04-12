# 내 서재 vs 방문 모드 차이점

## 개요

리디 마이룸은 두 가지 모드로 작동합니다:
1. **내 서재 모드** - 내가 내 서재를 볼 때
2. **방문 모드** - 다른 사람의 서재를 방문할 때

---

## 모드별 차이점 비교

| 구분 | 내 서재 모드 | 방문 모드 |
|------|-------------|----------|
| **URL** | `/my-room` | `/:userId/room` |
| **아바타** | 내 아바타 (키보드 조종) | 내 아바타 (키보드 조종) + 주인 AI 아바타 (자율) |
| **AI 동작** | **내 행동에 따라 대사 출력** | 주인 AI가 자율 이동 + 채팅 응답 |
| **채팅** | 내 행동 → AI 대사 생성 | 채팅창으로 주인 AI와 대화 |
| **편집** | 가구 배치/편집 가능 | 읽기 전용 (편집 불가) |
| **QR 공유** | 내 QR 생성 가능 | 공유 불가 |

---

## 1. 내 서재 모드 (My Room Mode)

### URL
```
https://ridi-myroom.com/my-room
```

### 화면 구성
```
┌─────────────────────────────────────┐
│  내 서재               ⚙️ [QR 공유]  │
├─────────────────────────────────────┤
│                                     │
│      [Phaser 게임 화면]             │
│      🟢 내 아바타 (초록색)          │
│      (키보드로 조종)                 │
│                                     │
│      [말풍선] "오늘은 좋은 날이네"   │
│                                     │
├─────────────────────────────────────┤
│  💬 내 행동에 따른 AI 대사           │
│  ┌─────────────────────────────┐   │
│  │ 🚶 걷기: "산책하는 기분이야" │   │
│  │ 📚 책 읽기: "이 책 정말..."  │   │
│  │ 🪟 창문: "날씨 좋네"        │   │
│  └─────────────────────────────┘   │
│                                     │
│  [편집 모드] [가구 추가]            │
└─────────────────────────────────────┘
```

### 핵심 기능

#### 1. 내 아바타 조종
- 키보드로 자유롭게 이동
- 상호작용 가능 (책상, 책장, 창문 등)

#### 2. 행동 기반 AI 대사 생성
내가 하는 행동에 따라 AI가 내 아바타의 대사를 생성:

**예시:**
```javascript
// 행동별 AI 대사 생성
const actions = {
  walking: "걷기 중",
  reading: "책 읽기",
  lookingWindow: "창문 보기",
  organizing: "책장 정리",
  sitting: "의자에 앉기"
};

// AI 프롬프트
"당신은 서재 주인입니다. 현재 {action} 중입니다.
이 상황에서 혼잣말로 할 법한 대사를 1문장으로 생성하세요.
상수리나무 주인공처럼 따뜻하고 지적인 톤으로."

// 생성 예시
걷기: "오늘은 산책하기 좋은 날이네."
책 읽기: "이 구절이 참 마음에 와닿는군."
창문 보기: "저 구름이 마치 책 속 장면 같아."
책장 정리: "읽었던 책들을 보니 추억이 새록새록."
```

#### 3. 말풍선 표시
- 내 아바타 위에 말풍선으로 AI 대사 표시
- 2-3초 후 자동 사라짐
- 다음 행동 시 새로운 대사 생성

#### 4. 편집 모드
- 가구 배치/이동
- 테마 변경
- AI 페르소나 설정

---

## 2. 방문 모드 (Visitor Mode)

### URL
```
https://ridi-myroom.com/user123/room
```

### 화면 구성
```
┌─────────────────────────────────────┐
│  user123님의 서재           [나가기] │
├─────────────────────────────────────┤
│                                     │
│      [Phaser 게임 화면]             │
│      ⬜ 주인 AI 아바타 (자율)       │
│         [말풍선] "환영합니다"       │
│      🔵 내 방문자 아바타 (조종)     │
│                                     │
├─────────────────────────────────────┤
│  💬 AI 아바타와 대화하기            │
│  ┌─────────────────────────────┐   │
│  │ 방문자: 안녕하세요!         │   │
│  │ AI: 환영합니다. 편히...     │   │
│  │ 방문자: 책 추천해주세요     │   │
│  │ AI: 판타지를 좋아하신다면.. │   │
│  └─────────────────────────────┘   │
│  [메시지 입력...] [전송]           │
│                                     │
│  [방명록 남기기]                    │
└─────────────────────────────────────┘
```

### 핵심 기능

#### 1. 두 아바타 표시
- **주인 AI 아바타**: 자율 이동, 말풍선으로 간헐적 혼잣말
- **내 방문자 아바타**: 키보드로 조종 가능

#### 2. AI와 채팅
- 채팅창으로 AI와 실시간 대화
- 주인의 GPT API 사용
- 상수리나무 페르소나

#### 3. 읽기 전용
- 가구 이동/편집 불가
- 서재 구경만 가능

---

## 데이터 구조

### 내 서재 데이터
```json
{
  "userId": "user123",
  "roomConfig": {
    "furniture": [...],
    "theme": "default"
  },
  "aiConfig": {
    "apiKey": "sk-...",
    "persona": "sangsuri",
    "monologueEnabled": true,  // ⭐ 혼잣말 기능 ON/OFF
    "chatEnabled": true         // ⭐ 방문자 채팅 ON/OFF
  },
  "myActions": {
    "lastAction": "reading",
    "lastMonologue": "이 책 정말 재미있네",
    "timestamp": "2026-04-15T10:30:00Z"
  }
}
```

---

## 구현 상세

### 1. 라우팅 구조

```javascript
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 내 서재 */}
        <Route path="/my-room" element={<MyRoom />} />

        {/* 다른 사람 서재 방문 */}
        <Route path="/:userId/room" element={<VisitorRoom />} />

        {/* 홈 (로그인 후 /my-room으로 리다이렉트) */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. 내 서재 컴포넌트

```javascript
// MyRoom.jsx
import { useState, useEffect } from 'react';
import PhaserGame from './PhaserGame';
import MonologuePanel from './MonologuePanel';

function MyRoom() {
  const userId = getCurrentUser(); // 로그인한 사용자
  const [currentAction, setCurrentAction] = useState('idle');
  const [monologue, setMonologue] = useState('');
  const [showQR, setShowQR] = useState(false);

  // 행동 변경 시 AI 대사 생성
  useEffect(() => {
    if (currentAction !== 'idle') {
      generateMonologue(currentAction);
    }
  }, [currentAction]);

  async function generateMonologue(action) {
    const response = await fetch('/api/monologue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        action,
        persona: 'sangsuri'
      })
    });

    const data = await response.json();
    setMonologue(data.monologue);

    // 3초 후 말풍선 숨김
    setTimeout(() => setMonologue(''), 3000);
  }

  return (
    <div className="my-room">
      <header>
        <h1>내 서재</h1>
        <button onClick={() => setShowQR(true)}>QR 공유</button>
      </header>

      <PhaserGame
        mode="owner"
        userId={userId}
        onActionChange={setCurrentAction}
      />

      {monologue && (
        <MonologuePanel monologue={monologue} />
      )}

      {showQR && (
        <QRCodeModal
          url={`${window.location.origin}/${userId}/room`}
          onClose={() => setShowQR(false)}
        />
      )}

      <div className="controls">
        <button>편집 모드</button>
        <button>AI 설정</button>
      </div>
    </div>
  );
}
```

### 3. 방문 모드 컴포넌트

```javascript
// VisitorRoom.jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PhaserGame from './PhaserGame';
import ChatBox from './ChatBox';

function VisitorRoom() {
  const { userId } = useParams(); // URL에서 주인 ID
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    // 주인의 서재 데이터 로드
    fetch(`/api/rooms/${userId}`)
      .then(res => res.json())
      .then(data => setRoomData(data));
  }, [userId]);

  if (!roomData) return <div>로딩 중...</div>;

  return (
    <div className="visitor-room">
      <header>
        <h1>{userId}님의 서재</h1>
        <button onClick={() => window.location.href = '/my-room'}>
          나가기
        </button>
      </header>

      <PhaserGame
        mode="visitor"
        hostUserId={userId}
        roomConfig={roomData.roomConfig}
        aiConfig={roomData.aiConfig}
      />

      <ChatBox
        hostUserId={userId}
        aiConfig={roomData.aiConfig}
      />

      <div className="guestbook">
        <button>방명록 남기기</button>
      </div>
    </div>
  );
}
```

### 4. Phaser Scene (모드별 분기)

```javascript
// LibraryScene.js
class LibraryScene extends Phaser.Scene {
  init(data) {
    this.mode = data.mode; // 'owner' or 'visitor'
    this.userId = data.userId;
    this.roomConfig = data.roomConfig;
    this.aiConfig = data.aiConfig;
  }

  create() {
    // 서재 렌더링 (동일)
    this.renderRoom(this.roomConfig);

    if (this.mode === 'owner') {
      // 내 서재 모드
      this.createOwnerMode();
    } else {
      // 방문 모드
      this.createVisitorMode();
    }
  }

  createOwnerMode() {
    // 내 아바타만 생성 (초록색)
    this.myAvatar = this.physics.add.sprite(200, 250, 'avatar');
    this.myAvatar.setTint(0x88ff88); // 초록

    // 키보드 조종
    this.cursors = this.input.keyboard.createCursorKeys();

    // 상호작용 지점 설정
    this.setupInteractions();

    // 현재 행동 추적
    this.currentAction = 'idle';
  }

  createVisitorMode() {
    // 1. 주인 AI 아바타 (자율 이동)
    this.hostAvatar = this.physics.add.sprite(200, 250, 'avatar');
    this.hostAvatar.setTint(0xffffff); // 흰색
    this.startAutoMove(this.hostAvatar);
    this.startRandomMonologue(this.hostAvatar);

    // 2. 내 방문자 아바타 (키보드 조종)
    this.visitorAvatar = this.physics.add.sprite(300, 250, 'avatar');
    this.visitorAvatar.setTint(0x88ccff); // 파랑
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  setupInteractions() {
    // 책상과의 충돌 감지
    this.physics.add.overlap(
      this.myAvatar,
      this.desk,
      () => this.onInteraction('reading')
    );

    // 책장과의 충돌 감지
    this.physics.add.overlap(
      this.myAvatar,
      this.bookshelf,
      () => this.onInteraction('organizing')
    );

    // 창문과의 충돌 감지
    this.physics.add.overlap(
      this.myAvatar,
      this.window,
      () => this.onInteraction('lookingWindow')
    );
  }

  onInteraction(action) {
    if (this.currentAction !== action) {
      this.currentAction = action;

      // React 컴포넌트에 행동 변경 알림
      if (this.scene.game.events) {
        this.scene.game.events.emit('actionChange', action);
      }
    }
  }

  update() {
    if (this.mode === 'owner') {
      this.updateOwnerMode();
    } else {
      this.updateVisitorMode();
    }
  }

  updateOwnerMode() {
    // 내 아바타 이동
    if (this.cursors.left.isDown) {
      this.myAvatar.setVelocityX(-100);
      this.myAvatar.play('walk_left', true);
      this.currentAction = 'walking';
    } else if (this.cursors.right.isDown) {
      this.myAvatar.setVelocityX(100);
      this.myAvatar.play('walk_right', true);
      this.currentAction = 'walking';
    } else {
      this.myAvatar.setVelocity(0);
      this.myAvatar.play('idle', true);
      if (this.currentAction === 'walking') {
        this.currentAction = 'idle';
      }
    }
  }

  updateVisitorMode() {
    // 방문자 아바타 이동 (위와 동일)
    // ... (키보드 조종 로직)

    // 주인 AI 아바타는 자율 이동 (타이머로 처리)
  }

  startRandomMonologue(avatar) {
    // 주인 AI 아바타가 가끔 혼잣말
    this.time.addEvent({
      delay: 10000, // 10초마다
      callback: () => {
        const monologues = [
          "오늘도 좋은 책을 읽어야지",
          "이 책장에 책이 점점 늘어나네",
          "창밖 풍경이 참 좋구나"
        ];
        const text = Phaser.Math.RND.pick(monologues);
        this.showSpeechBubble(avatar, text);
      },
      loop: true
    });
  }

  showSpeechBubble(avatar, text) {
    // 말풍선 표시 로직
    const bubble = this.add.text(
      avatar.x,
      avatar.y - 50,
      text,
      { fontSize: '12px', backgroundColor: '#fff', padding: 5 }
    );

    // 3초 후 제거
    this.time.delayedCall(3000, () => bubble.destroy());
  }
}
```

---

## 백엔드 API (추가)

### 1. 혼잣말 생성 API

```javascript
// server.js

// 내 서재: 행동에 따른 혼잣말 생성
app.post('/api/monologue', async (req, res) => {
  const { userId, action, persona } = req.body;
  const roomData = rooms[userId];

  if (!roomData || !roomData.aiConfig.apiKey) {
    return res.status(400).json({ error: 'API 키 없음' });
  }

  try {
    const openai = new OpenAI({
      apiKey: decryptApiKey(roomData.aiConfig.apiKey)
    });

    // 행동별 프롬프트
    const actionPrompts = {
      walking: "서재를 걷고 있을 때 할 법한 혼잣말",
      reading: "책을 읽고 있을 때 할 법한 혼잣말",
      lookingWindow: "창문을 바라보고 있을 때 할 법한 혼잣말",
      organizing: "책장을 정리하고 있을 때 할 법한 혼잣말",
      sitting: "의자에 앉아 있을 때 할 법한 혼잣말"
    };

    const systemPrompt = `
당신은 서재 주인입니다. 상수리나무 주인공처럼 따뜻하고 지적입니다.
현재 ${actionPrompts[action]}을 1문장으로 생성하세요.

최근 읽은 책: ${roomData.aiConfig.readingData.recentBooks.join(', ')}

조건:
- 1문장만 (20자 이내)
- 혼잣말 느낌
- 따뜻하고 서정적인 톤
- 이모지 없음
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `현재 행동: ${action}` }
      ],
      max_tokens: 50,
      temperature: 0.9
    });

    const monologue = completion.choices[0].message.content;
    res.json({ monologue });

  } catch (error) {
    console.error('혼잣말 생성 오류:', error);
    res.status(500).json({ error: '생성 실패' });
  }
});
```

### 2. 기존 채팅 API (방문 모드용)

```javascript
// 방문자와 AI 채팅 (기존과 동일)
app.post('/api/chat', async (req, res) => {
  const { userId, message } = req.body;
  // ... (기존 코드 유지)
});
```

---

## UI 디자인

### 내 서재: 말풍선 스타일

```css
/* 내 아바타 위 말풍선 */
.speech-bubble {
  position: absolute;
  background: white;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  max-width: 200px;
  animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: white;
  transform: translateX(-50%);
}
```

### 방문 모드: 채팅창 스타일

```css
/* 하단 채팅창 */
.chat-box {
  position: fixed;
  bottom: 0;
  width: 400px;
  height: 300px;
  background: #f5f5f5;
  border: 2px solid #333;
  border-radius: 8px 8px 0 0;
}

.messages {
  height: 240px;
  overflow-y: auto;
  padding: 10px;
}

.message.user {
  text-align: right;
  color: #0066cc;
}

.message.assistant {
  text-align: left;
  color: #333;
}
```

---

## 혼잣말 생성 예시

### 행동별 AI 혼잣말

```javascript
// 걷기
"오늘은 산책하기 좋은 날이네."
"이 서재를 걷고 있으면 마음이 편안해져."

// 책 읽기
"이 구절이 참 마음에 와닿는군."
"역시 이 책은 읽을 때마다 새롭네."

// 창문 보기
"저 구름이 마치 책 속 장면 같아."
"창밖 풍경을 보니 영감이 떠오르는걸."

// 책장 정리
"읽었던 책들을 보니 추억이 새록새록."
"이 책들과 함께한 시간이 참 소중해."

// 앉기
"여기 앉아 있으니 차분해지네."
"잠시 쉬면서 생각을 정리해볼까."
```

---

## 데모 시나리오 (업데이트)

### 시나리오 1: 내 서재 체험
1. `/my-room` 접속
2. 키보드로 아바타 이동
3. 책상 근처 → 말풍선 "이 책 정말 재미있네"
4. 창문 근처 → 말풍선 "날씨 좋은데"
5. "QR 공유" 클릭 → QR 코드 생성

### 시나리오 2: QR 공유 & 방문
1. QR 스캔 (또는 URL 복사)
2. `/user123/room` 접속
3. 주인 AI 아바타가 돌아다니며 가끔 혼잣말
4. 내 파란 아바타로 서재 탐험

### 시나리오 3: 방문자 AI 채팅
1. 채팅창에 "안녕하세요" 입력
2. AI: "안녕하세요. 환영합니다..."
3. "책 추천해주세요" 입력
4. AI가 주인의 독서 취향 기반 추천

---

## 완료 조건 (업데이트)

### 내 서재 모드
- [ ] 내 아바타 키보드 조종
- [ ] 행동 감지 (책상, 책장, 창문 근처)
- [ ] 행동별 AI 혼잣말 생성
- [ ] 말풍선 표시 (3초 후 사라짐)
- [ ] QR 코드 생성
- [ ] 편집 모드 (가구 배치)

### 방문 모드
- [ ] QR 스캔 → 입장
- [ ] 주인 AI 아바타 자율 이동
- [ ] 내 방문자 아바타 조종
- [ ] 두 아바타 동시 표시
- [ ] AI와 채팅 (주인의 API)
- [ ] 방명록 기능

---

**버전**: 2.0 (내 서재/방문 모드 분리)
**업데이트**: 2026-04-13
