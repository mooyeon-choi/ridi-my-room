# 개발 환경 설정 가이드

## 🎉 설치 완료된 항목

### ✅ 프론트엔드
- React + Vite 프로젝트 초기화
- 필수 라이브러리 설치 완료
  - react, react-dom
  - react-router-dom (라우팅)
  - phaser (게임 엔진)
  - qrcode (QR 코드 생성)
- 기본 컴포넌트 생성
  - Home.jsx (홈 화면)
  - MyRoom.jsx (내 서재)
  - VisitorRoom.jsx (방문 모드)
  - PhaserGame.jsx (Phaser 통합)
  - ChatBox.jsx (채팅 UI)
  - QRCodeModal.jsx (QR 코드 모달)
- LibraryScene.js (Phaser 게임 Scene)

### ✅ 백엔드
- Express 서버 초기화
- 필수 라이브러리 설치 완료
  - express
  - cors
  - dotenv
  - openai
- API 엔드포인트 구현
  - GET /api/rooms/:userId (서재 데이터 조회)
  - POST /api/rooms/:userId (서재 데이터 저장)
  - POST /api/monologue (혼잣말 생성)
  - POST /api/chat (AI 채팅)

---

## 🔧 직접 해야 할 작업 (중요!)

### 1. OpenAI API 키 설정 ⭐⭐⭐

```bash
# 1. backend/.env 파일 생성
cd backend
cp .env.example .env

# 2. .env 파일 편집
# OPENAI_API_KEY=sk-your-actual-api-key-here 로 수정
```

**API 키 발급:**
1. https://platform.openai.com 접속
2. 로그인 후 API Keys 메뉴
3. "Create new secret key" 클릭
4. 생성된 키를 복사하여 `.env` 파일에 붙여넣기

### 2. 픽셀 아트 에셋 제작 ⭐⭐⭐

**필요한 에셋:**
- [ ] 바닥 타일 (16x16px) → `public/assets/sprites/floor_tile.png`
- [ ] 벽 타일 (16x16px) → `public/assets/sprites/wall_tile.png`
- [ ] 책장 (16x32px) → `public/assets/sprites/bookshelf.png`
- [ ] 책상 (32x16px) → `public/assets/sprites/desk.png`
- [ ] 창문 (16x16px) → `public/assets/sprites/window.png`
- [ ] 아바타 스프라이트 시트 → `public/assets/sprites/avatar_spritesheet.png`

**툴:**
- Aseprite (유료): https://www.aseprite.org/
- Piskel (무료): https://www.piskelapp.com/

**에셋 제작 후:**
- `src/scenes/LibraryScene.js`의 `preload()` 메서드에서 주석 해제
- 실제 에셋 로드 코드 활성화

---

## 🚀 개발 서버 실행

### 터미널 1: 프론트엔드
```bash
cd /Users/moo/Documents/projects/tavern-sim-game
npm run dev
```
→ http://localhost:3000 에서 실행

### 터미널 2: 백엔드
```bash
cd /Users/moo/Documents/projects/tavern-sim-game/backend
npm run dev
```
→ http://localhost:3001 에서 실행

---

## 📁 프로젝트 구조

```
tavern-sim-game/
├── src/
│   ├── components/
│   │   ├── Home.jsx              ✅ 홈 화면
│   │   ├── MyRoom.jsx            ✅ 내 서재
│   │   ├── VisitorRoom.jsx       ✅ 방문 모드
│   │   ├── PhaserGame.jsx        ✅ Phaser 통합
│   │   ├── ChatBox.jsx           ✅ 채팅 UI
│   │   └── QRCodeModal.jsx       ✅ QR 모달
│   ├── scenes/
│   │   └── LibraryScene.js       ✅ Phaser Scene
│   ├── App.jsx                   ✅ 라우팅
│   ├── main.jsx                  ✅ 엔트리
│   └── index.css                 ✅ 스타일
├── backend/
│   ├── server.js                 ✅ Express API
│   ├── .env.example              ✅ 환경변수 예시
│   └── .env                      ⚠️  직접 생성 필요!
├── public/
│   └── assets/
│       └── sprites/              ⚠️  에셋 제작 필요!
├── docs/                         ✅ 기획 문서
├── TODO.md                       ✅ 작업 목록
├── index.html                    ✅ HTML
├── vite.config.js                ✅ Vite 설정
└── package.json                  ✅ 의존성
```

---

## 🧪 테스트

### 1. 프론트엔드 테스트
1. http://localhost:3000 접속
2. "내 서재 시작하기" 클릭
3. `/my-room`으로 이동
4. 화살표 키로 아바타 이동
5. "QR 공유" 클릭 → QR 코드 표시 확인

### 2. 백엔드 API 테스트
```bash
# 헬스 체크
curl http://localhost:3001/health

# 서재 데이터 조회
curl http://localhost:3001/api/rooms/user123
```

### 3. AI 기능 테스트 (API 키 설정 후)
```bash
# 혼잣말 생성
curl -X POST http://localhost:3001/api/monologue \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","action":"reading"}'

# AI 채팅
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","message":"안녕하세요"}'
```

---

## 🐛 트러블슈팅

### CORS 에러
```
Access to fetch at 'http://localhost:3001' blocked by CORS
```
→ 백엔드 서버가 실행 중인지 확인
→ `backend/server.js`의 CORS 설정 확인

### OpenAI API 에러
```
Error: Invalid API key
```
→ `backend/.env` 파일의 OPENAI_API_KEY 확인
→ API 키 형식: `sk-...`

### Phaser 로딩 오류
```
Failed to load texture
```
→ 에셋 파일이 `public/assets/sprites/`에 있는지 확인
→ 파일명 일치 확인

---

## 📝 다음 단계

### Day 1-2: 에셋 제작
- [ ] Piskel/Aseprite로 픽셀 아트 제작
- [ ] `public/assets/sprites/` 폴더에 저장
- [ ] LibraryScene.js에서 에셋 로드 활성화

### Day 3-4: 기능 개선
- [ ] 실제 에셋으로 교체
- [ ] 애니메이션 추가
- [ ] UI 스타일링

### Day 5-6: AI 연동
- [ ] OpenAI API 키 설정
- [ ] 혼잣말 생성 테스트
- [ ] 채팅 응답 테스트

### Day 7: 배포
- [ ] Vercel (프론트엔드)
- [ ] Railway/Render (백엔드)

---

## 📞 도움이 필요하면

- `docs/QUICK_START.md` - 빠른 시작 가이드
- `docs/my-room-vs-visitor-mode.md` - 모드별 차이점
- `docs/daily-checklist.md` - 일별 체크리스트
- `TODO.md` - 직접 해야 할 작업 목록

---

**작성일**: 2026-04-13
**프로젝트**: 리디 마이룸 1주일 프로토타입
