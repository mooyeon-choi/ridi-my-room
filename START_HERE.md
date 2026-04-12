# 🚀 리디 마이룸 - 시작 가이드

## ✅ 프로젝트 설정 완료!

모든 기본 설정이 완료되었습니다. 바로 실행할 수 있습니다!

---

## 🎮 지금 바로 실행하기

### 1단계: 터미널 2개 열기

**터미널 1 - 프론트엔드:**
```bash
cd /Users/moo/Documents/projects/tavern-sim-game
npm run dev
```
→ 자동으로 http://localhost:3000 이 열립니다

**터미널 2 - 백엔드:**
```bash
cd /Users/moo/Documents/projects/tavern-sim-game/backend
npm run dev
```
→ http://localhost:3001 에서 실행됩니다

### 2단계: 브라우저에서 확인

1. http://localhost:3000 접속
2. "내 서재 시작하기" 클릭
3. **화살표 키(↑↓←→)로 초록색 아바타 조종**
4. 가구 근처로 이동하면 혼잣말 생성 (더미 데이터)
5. "QR 공유" 클릭 → QR 코드 확인
6. "다른 사람 서재 방문해보기" 클릭 → 방문 모드 체험

---

## 🎨 현재 상태

### ✅ 작동하는 기능
- ✅ **서재 공간 렌더링** (플레이스홀더 그래픽)
  - 나무 마루 바닥
  - 책상 (책 + 찻잔)
  - 책장 (컬러풀한 책들)
  - 창문 2개 (구름 효과)
- ✅ **내 서재 모드** (`/my-room`)
  - 초록색 아바타 조종
  - 가구 근처 가면 행동 감지
  - 혼잣말 생성 (더미 데이터)
- ✅ **방문 모드** (`/user123/room`)
  - AI 아바타 자율 이동 + 혼잣말
  - 파란색 방문자 아바타 조종
  - 채팅 UI (더미 응답)
- ✅ **QR 코드 생성**
- ✅ **라우팅** (/, /my-room, /:userId/room)

### ⚠️ 아직 설정 안 된 기능
- ⚠️ **OpenAI API 연동** (API 키 필요)
- ⚠️ **실제 픽셀 아트 에셋** (LimeZu 다운로드 후 교체 가능)

---

## 🔑 OpenAI API 설정 (선택사항)

AI 혼잣말 & 채팅 기능을 사용하려면:

### 1. API 키 발급
1. https://platform.openai.com 접속
2. 로그인 후 "API Keys" 메뉴
3. "Create new secret key" 클릭
4. 생성된 키 복사

### 2. 백엔드 설정
```bash
cd backend
cp .env.example .env
nano .env
```

`.env` 파일 내용:
```
OPENAI_API_KEY=sk-여기에-발급받은-키-붙여넣기
SECRET_KEY=random-secret-key-123
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. 백엔드 재시작
```bash
# Ctrl+C로 중지 후
npm run dev
```

---

## 🎨 픽셀 아트 에셋 교체 (선택사항)

더 예쁜 그래픽을 원하시면:

### 1. LimeZu 에셋 다운로드
- https://limezu.itch.io/moderninteriors
- "Download Now" → $0 입력 → 다운로드

### 2. 파일 배치
```bash
# 다운로드한 ZIP 압축 해제 후
cp -r ~/Downloads/Modern_Interiors_Free/* ./public/assets/
```

### 3. LibraryScene.js 수정
`src/scenes/LibraryScene.js` 파일 열기
→ `preload()` 메서드의 주석 해제

자세한 내용: `docs/ASSET_DOWNLOAD_GUIDE.md`

---

## 🎯 주요 조작법

### 내 서재 모드
- **화살표 키**: 아바타 이동
- **책상 근처**: "이 책 정말 재미있어" 혼잣말
- **책장 근처**: "읽었던 책들이 추억이네" 혼잣말
- **창문 근처**: "창밖 풍경이 참 좋구나" 혼잣말
- **QR 공유 버튼**: QR 코드 생성

### 방문 모드
- **화살표 키**: 내 아바타 이동 (파란색)
- **AI 아바타**: 자동으로 돌아다니며 혼잣말
- **채팅창**: AI와 대화 (더미 응답 또는 OpenAI 연동 시 실제 응답)

---

## 📁 프로젝트 구조

```
tavern-sim-game/
├── src/
│   ├── components/         # React 컴포넌트
│   │   ├── Home.jsx        # 홈 화면
│   │   ├── MyRoom.jsx      # 내 서재
│   │   ├── VisitorRoom.jsx # 방문 모드
│   │   ├── ChatBox.jsx     # 채팅
│   │   └── ...
│   ├── scenes/
│   │   └── LibraryScene.js # Phaser 게임 Scene
│   └── App.jsx             # 라우팅
├── backend/
│   ├── server.js           # Express API
│   └── .env                # 환경변수 (직접 생성)
├── docs/                   # 기획 문서
│   ├── QUICK_START.md
│   ├── daily-checklist.md
│   └── ...
└── public/assets/          # 에셋 (LimeZu 다운로드 시)
```

---

## 📖 추가 문서

- **`TODO.md`** - 직접 해야 할 작업 목록
- **`DEVELOPMENT_SETUP.md`** - 개발 환경 상세 가이드
- **`docs/QUICK_START.md`** - 빠른 시작 가이드
- **`docs/ASSET_DOWNLOAD_GUIDE.md`** - 에셋 다운로드 방법
- **`docs/my-room-vs-visitor-mode.md`** - 모드별 차이점 상세
- **`docs/daily-checklist.md`** - 7일 개발 일정

---

## 🐛 문제 해결

### 서버가 안 열려요
```bash
# 포트가 이미 사용 중일 수 있음
# 다른 터미널 확인 또는 포트 변경
```

### 아바타가 안 움직여요
- 화살표 키를 눌러보세요 (↑↓←→)
- 브라우저 창이 포커스되어 있는지 확인

### 혼잣말이 안 나와요
- 더미 데이터로 동작 중입니다
- OpenAI API 키 설정 시 실제 AI 응답 생성됩니다

### 그래픽이 너무 단순해요
- 플레이스홀더 그래픽입니다
- LimeZu 에셋 다운로드 시 교체 가능
- `docs/ASSET_DOWNLOAD_GUIDE.md` 참고

---

## 🎉 축하합니다!

프로젝트가 정상적으로 실행되고 있습니다!

### 다음 단계:
1. ✅ 서버 실행 → **지금 완료!**
2. 🔲 OpenAI API 키 설정 (선택)
3. 🔲 LimeZu 에셋 다운로드 (선택)
4. 🔲 `docs/daily-checklist.md` 참고하여 개발 진행

---

**프로젝트**: 리디 마이룸
**버전**: 0.1 (프로토타입)
**날짜**: 2026-04-13
