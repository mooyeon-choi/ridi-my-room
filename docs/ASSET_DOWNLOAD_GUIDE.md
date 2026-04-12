# 픽셀 아트 에셋 다운로드 가이드

## 📦 추천 에셋: LimeZu - Modern Interiors (무료 버전)

### 다운로드 방법

1. **웹사이트 방문**
   - https://limezu.itch.io/moderninteriors

2. **무료 버전 다운로드**
   - "Download Now" 클릭
   - 가격 입력란에 **$0** 입력 (또는 원하는 만큼 지불)
   - "No thanks, just take me to the downloads" 클릭
   - ZIP 파일 다운로드

3. **압축 해제**
   - 다운로드한 ZIP 파일 압축 해제
   - `Modern_Interiors_Free` 폴더 확인

4. **필요한 파일 확인**
   - `Tileset/` - 타일셋 이미지
   - `Characters/` - 캐릭터 스프라이트
   - `Floors/` - 바닥 타일
   - `Walls/` - 벽 타일
   - `Furniture/` - 가구 스프라이트

---

## 📁 에셋 파일 배치

### 1. 프로젝트에 복사

다운로드한 에셋을 프로젝트 폴더로 복사:

```bash
# LimeZu 에셋을 프로젝트로 복사
cp -r ~/Downloads/Modern_Interiors_Free/* /Users/moo/Documents/projects/tavern-sim-game/public/assets/
```

### 2. 폴더 구조

```
public/assets/
├── characters/
│   ├── character1.png
│   └── ...
├── floors/
│   ├── floor_wood.png
│   └── ...
├── walls/
│   ├── wall_cream.png
│   └── ...
└── furniture/
    ├── desk.png
    ├── bookshelf.png
    └── ...
```

---

## 🎨 필요한 에셋 목록

### 서재 공간 구성에 필요한 파일:

#### 1. 바닥 (Floors)
- [x] 나무 마루 타일
- 파일명: `floor_wood.png` 또는 유사

#### 2. 벽 (Walls)
- [x] 크림색/베이지 벽
- 파일명: `wall_cream.png` 또는 유사

#### 3. 가구 (Furniture)
- [x] **책상** - `desk.png`
- [x] **책장** - `bookshelf.png` 또는 `shelf.png`
- [x] **창문** - `window.png`
- [x] (선택) 의자 - `chair.png`
- [x] (선택) 러그 - `rug.png`

#### 4. 캐릭터 (Characters)
- [x] 기본 아바타 스프라이트 시트
- 파일명: `character_spritesheet.png`

---

## ⚙️ LibraryScene.js 설정

에셋 다운로드 후 `src/scenes/LibraryScene.js`를 수정해야 합니다.

### preload() 메서드 수정

```javascript
preload() {
  // 바닥 타일
  this.load.image('floor', '/assets/floors/floor_wood.png');

  // 벽 타일
  this.load.image('wall', '/assets/walls/wall_cream.png');

  // 가구
  this.load.image('desk', '/assets/furniture/desk.png');
  this.load.image('bookshelf', '/assets/furniture/bookshelf.png');
  this.load.image('window', '/assets/furniture/window.png');

  // 아바타 (스프라이트 시트)
  this.load.spritesheet('avatar', '/assets/characters/character_spritesheet.png', {
    frameWidth: 16,
    frameHeight: 16
  });
}
```

---

## 🔄 대안 에셋 (완전 무료)

LimeZu 외에 다른 옵션들:

### 1. OpenGameArt - Liberated Pixel Cup
- URL: https://opengameart.org/content/lpc-base-assets
- 라이선스: CC-BY-SA 3.0 / GPL 3.0
- 특징: 대규모 커뮤니티 에셋

### 2. Kenney Assets
- URL: https://kenney.nl/assets
- 라이선스: CC0 (퍼블릭 도메인)
- 특징: 완전 무료, 상업적 사용 가능

### 3. itch.io 무료 에셋
- URL: https://itch.io/game-assets/free/tag-pixel-art/tag-16x16
- 라이선스: 각 에셋마다 다름
- 특징: 다양한 스타일

---

## 📝 다운로드 후 체크리스트

에셋 다운로드 완료 후:

- [ ] ZIP 파일 압축 해제
- [ ] 필요한 파일 `public/assets/`로 복사
- [ ] 파일명 확인 (경로와 일치하는지)
- [ ] `src/scenes/LibraryScene.js` 수정
- [ ] 개발 서버 재시작
- [ ] 브라우저에서 확인

---

## 🐛 문제 해결

### 이미지가 안 보여요
1. 파일 경로 확인
   - `public/assets/` 폴더에 파일이 있는지
   - 파일명이 정확한지 (대소문자 구분)

2. 개발 서버 재시작
   ```bash
   # Ctrl+C로 중지 후 다시 실행
   npm run dev
   ```

3. 브라우저 콘솔 확인
   - F12 → Console 탭
   - 404 에러 메시지 확인

### 스프라이트 시트가 잘못 나와요
- frameWidth, frameHeight 확인
- 실제 스프라이트 크기와 일치하는지 확인
- LimeZu는 16x16, 32x32, 48x48 버전 제공

---

## 🎯 빠른 시작 (요약)

```bash
# 1. LimeZu 에셋 다운로드
# https://limezu.itch.io/moderninteriors

# 2. 압축 해제 후 파일 복사
cp -r ~/Downloads/Modern_Interiors_Free/* ./public/assets/

# 3. LibraryScene.js 수정 (preload 메서드)

# 4. 서버 재시작
npm run dev
```

---

**작성일**: 2026-04-13
**업데이트**: 2026-04-13
