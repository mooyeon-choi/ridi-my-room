# 🔧 직접 해야 할 작업 (TODO List)

> 개발자가 직접 설정하거나 확인해야 하는 작업들입니다.

---

## 🔑 필수 설정 (개발 시작 전)

### 1. OpenAI API 키 설정
- [ ] OpenAI 계정 생성 (https://platform.openai.com)
- [ ] API 키 발급
- [ ] 백엔드 `.env` 파일에 추가
  ```bash
  # backend/.env
  OPENAI_API_KEY=sk-your-api-key-here
  SECRET_KEY=your-secret-encryption-key
  PORT=3001
  ```
- [ ] 비용 한도 설정 (OpenAI 대시보드)
- [ ] 사용량 모니터링 알림 설정

### 2. 개발 환경 설치
- [ ] Node.js 설치 확인 (v18 이상 권장)
  ```bash
  node --version
  npm --version
  ```
- [ ] Git 설치 확인
  ```bash
  git --version
  ```

### 3. 픽셀 아트 툴 설치
- [ ] Aseprite 설치 (유료, $19.99) 또는
- [ ] Piskel 사용 (무료, 웹 기반)
  - https://www.piskelapp.com/

---

## 🎨 에셋 제작 (Day 1-2)

### 픽셀 아트 스프라이트 제작
- [ ] **바닥 타일** (16x16px)
  - 나무 마루 느낌
  - 따뜻한 갈색 톤
  - 저장: `assets/sprites/floor_tile.png`

- [ ] **벽 타일** (16x16px)
  - 크림색/베이지
  - 저장: `assets/sprites/wall_tile.png`

- [ ] **책장** (16x32px)
  - 나무 책장
  - 더미 책 5-7권 표시
  - 저장: `assets/sprites/bookshelf.png`

- [ ] **책상** (32x16px)
  - 작은 책상 + 찻잔
  - 저장: `assets/sprites/desk.png`

- [ ] **창문** (16x16px)
  - 2개 버전 (다른 디자인)
  - 저장: `assets/sprites/window.png`

- [ ] **아바타 스프라이트 시트** (각 프레임 16x16px)
  - 걷기 아래 (3프레임)
  - 걷기 위 (3프레임)
  - 걷기 왼쪽 (3프레임)
  - 걷기 오른쪽 (3프레임)
  - Idle: 책 읽기 (2프레임)
  - 저장: `assets/sprites/avatar_spritesheet.png`

**참고:**
- 16x16px 기본 사이즈
- 일관된 색상 팔레트 사용
- 투명 배경 (PNG)

---

## 🚀 배포 설정 (Day 7)

### 프론트엔드 배포 (Vercel)
- [ ] Vercel 계정 생성
- [ ] GitHub 저장소 연결
- [ ] 환경 변수 설정
  ```
  REACT_APP_API_URL=https://your-backend.railway.app
  ```
- [ ] 배포 확인

### 백엔드 배포 (Railway/Render)
- [ ] Railway 또는 Render 계정 생성
- [ ] 새 프로젝트 생성
- [ ] 환경 변수 설정
  ```
  OPENAI_API_KEY=sk-...
  SECRET_KEY=...
  PORT=3001
  ```
- [ ] 배포 확인
- [ ] API 엔드포인트 테스트

---

## 🧪 테스트 (Day 7)

### 내 서재 테스트
- [ ] `/my-room` 접속 확인
- [ ] 아바타 이동 (화살표 키)
- [ ] 책상 근처 → 혼잣말 생성 확인
- [ ] 창문 근처 → 혼잣말 생성 확인
- [ ] 말풍선 표시 확인 (3초 후 사라짐)
- [ ] QR 코드 생성 확인

### 방문 모드 테스트
- [ ] QR 스캔 (또는 URL 직접 입력)
- [ ] `/user123/room` 접속 확인
- [ ] 주인 AI 아바타 자율 이동 확인
- [ ] 내 방문자 아바타 조종 확인
- [ ] 두 아바타 동시 표시 확인
- [ ] 채팅 입력 → AI 응답 확인
- [ ] 상수리나무 톤 확인

### 모바일 테스트
- [ ] QR 스캔 (실제 스마트폰)
- [ ] 반응형 레이아웃 확인
- [ ] 터치 조작 (또는 가상 키패드)

---

## 🔒 보안 체크

### API 키 보안
- [ ] `.env` 파일이 `.gitignore`에 포함되었는지 확인
- [ ] GitHub에 API 키가 노출되지 않았는지 확인
- [ ] 프론트엔드 코드에 API 키 하드코딩 안 했는지 확인

### Rate Limiting 확인
- [ ] 빠르게 연속 채팅 → 제한 확인
- [ ] 100회 이상 요청 → 일일 한도 확인

---

## 📊 모니터링 (배포 후)

### OpenAI 사용량 체크
- [ ] OpenAI 대시보드에서 일일 사용량 확인
- [ ] 비용 알림 설정 ($5, $10 등)

### 서버 상태 체크
- [ ] 백엔드 API 응답 시간 확인
- [ ] 에러 로그 확인

---

## 🎨 선택사항 (시간 여유 시)

### UI 개선
- [ ] 픽셀 폰트 적용 (Press Start 2P)
- [ ] 리디 브랜드 컬러 적용
- [ ] 로딩 애니메이션
- [ ] 버튼 호버 효과

### 추가 기능
- [ ] 방명록 기능
- [ ] 좋아요/리액션
- [ ] 방문자 알림
- [ ] 배경 음악 (선택)

---

## 🐛 문제 해결

### 자주 발생하는 문제

#### 1. OpenAI API 오류
```
Error: Invalid API key
```
→ `.env` 파일 확인, API 키 재발급

#### 2. CORS 에러
```
Access to fetch blocked by CORS policy
```
→ 백엔드 `server.js`에서 CORS 설정 확인

#### 3. Phaser 로딩 오류
```
Failed to load texture
```
→ 에셋 파일 경로 확인, `public/assets/` 폴더 확인

#### 4. 아바타 안 움직임
→ 키보드 이벤트 리스너 확인
→ `cursors` 변수 초기화 확인

---

## 📝 일일 체크리스트

### 작업 시작 전
- [ ] `docs/daily-checklist.md`에서 오늘 Day 확인
- [ ] 오늘의 목표 파악
- [ ] 필요한 도구/라이브러리 설치

### 작업 중
- [ ] 30분마다 Git 커밋
- [ ] 주요 기능 완성 시 테스트
- [ ] 막히면 문서 다시 확인

### 작업 종료 전
- [ ] 오늘 완료한 작업 체크
- [ ] Git 커밋 & 푸시
- [ ] 내일 작업 메모

---

## 🎯 긴급 연락처 / 참고 링크

### 공식 문서
- Phaser 3: https://phaser.io/docs
- OpenAI API: https://platform.openai.com/docs
- React Router: https://reactrouter.com/

### 픽셀 아트 참고
- Lospec (색상 팔레트): https://lospec.com/palette-list
- itch.io 픽셀 에셋: https://itch.io/game-assets/free/tag-pixel-art

### 배포 가이드
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app/

---

**최종 업데이트**: 2026-04-13
**프로젝트**: 리디 마이룸 1주일 프로토타입
