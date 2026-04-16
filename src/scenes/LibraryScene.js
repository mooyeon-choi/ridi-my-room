import * as Phaser from 'phaser';

// 배경 이미지 원본 크기: 2048 x 1193
// 장애물 영역 정의 (원본 픽셀 기준)
const OBSTACLE_MAPS = {
  // 상수리나무 아래 / 맥시방
  sangsuri: [
    { x: 0,    y: 0,    w: 2048, h: 500 },   // 상단벽 (-20)
    { x: 0,    y: 0,    w: 70,   h: 1193 },   // 좌벽 (-20)
    { x: 1978, y: 0,    w: 70,   h: 1193 },   // 우벽 (+20, -20)
    { x: 0,    y: 1051, w: 390,  h: 142 },    // 하단벽 (문 왼쪽)
    { x: 390,  y: 1101, w: 160,  h: 92 },     // 하단벽 (문 바닥)
    { x: 550,  y: 1051, w: 1498, h: 142 },    // 하단벽 (문 오른쪽~끝)
    { x: 265,  y: 270,  w: 350,  h: 300 },    // 벽난로
    { x: 680,  y: 260,  w: 170,  h: 320 },    // 거울
    { x: 920,  y: 230,  w: 270,  h: 315 },    // 책장
    { x: 1450, y: 340,  w: 380,  h: 380 },    // 침대 (+10w, +30h)
    { x: 2230, y: 280,  w: 110,  h: 220 },    // 화분
    { x: 70,   y: 720,  w: 140,  h: 340 },    // 촛대 (+30y, +30w)
    { x: 630,  y: 630,  w: 400,  h: 170 },    // 책상
    { x: 940,  y: 565,  w: 100,  h: 125 },    // 수정구
    { x: 1150, y: 850,  w: 140,  h: 120 },    // 꽃병(탁자) (+30y, +30w)
    { x: 1500, y: 860,  w: 290,  h: 160 },    // 상자 (+10x, +20y, -10w left cut)
  ],
  // 너를 속이는 밤
  neosokbam: [
    { x: 0,    y: 0,    w: 2048, h: 380 },  // 상단 벽 + 지붕
    { x: 0,    y: 0,    w: 120,  h: 1244 }, // 좌측 벽
    { x: 1928, y: 0,    w: 120,  h: 1244 }, // 우측 벽
    { x: 0,    y: 1020, w: 380,  h: 224 },  // 하단벽(문좌)
    { x: 540,  y: 1020, w: 1508, h: 224 },  // 하단벽(문우)
    { x: 380,  y: 1208, w: 160,  h: 36 },   // 하단벽(문바닥)
    { x: 190,  y: 300,  w: 180,  h: 250 },  // 석등
    { x: 400,  y: 140,  w: 250,  h: 280 },  // 병풍/족자
    { x: 930,  y: 250,  w: 250,  h: 200 },  // 선반
    { x: 1575, y: 150,  w: 600,  h: 400 },  // 나무 + 제단 영역
    { x: 175,  y: 600,  w: 150,  h: 200 },  // 항아리 (좌하)
    { x: 300,  y: 860,  w: 100,  h: 60 },   // 양동이
    { x: 874,  y: 520,  w: 250,  h: 200 },  // 책상/의자
    { x: 1250, y: 500,  w: 350,  h: 300 },  // 제단 + 촛대
    { x: 1400, y: 700,  w: 400,  h: 250 },  // 다다미 + 병풍
  ],
  // 배덕한 타인
  betrayer: [
    { x: 0,    y: 0,    w: 2048, h: 350 },  // 상단 벽
    { x: 0,    y: 0,    w: 80,   h: 1194 }, // 좌측 벽
    { x: 1968, y: 0,    w: 80,   h: 1194 }, // 우측 벽
    { x: 0,    y: 1072, w: 2048, h: 122 },  // 하단 벽
    { x: 0,    y: 972,  w: 400,  h: 222 },  // 좌하 계단
    { x: 80,   y: 300,  w: 250,  h: 250 },  // 축음기/선반
    { x: 400,  y: 280,  w: 400,  h: 280 },  // TV + 스탠드
    { x: 870,  y: 280,  w: 250,  h: 280 },  // 책장
    { x: 1200, y: 280,  w: 200,  h: 200 },  // 그림 + 스탠드
    { x: 1500, y: 280,  w: 250,  h: 200 },  // 와인바
    { x: 1800, y: 250,  w: 170,  h: 170 },  // 시계
    { x: 80,   y: 700,  w: 200,  h: 200 },  // 화분
    { x: 350,  y: 550,  w: 350,  h: 300 },  // 의자 + 러그
    { x: 800,  y: 550,  w: 400,  h: 200 },  // 소파
    { x: 800,  y: 780,  w: 300,  h: 150 },  // 테이블
    { x: 1250, y: 650,  w: 120,  h: 250 },  // 공기청정기
    { x: 1400, y: 800,  w: 150,  h: 150 },  // 의자 (우하)
    { x: 1800, y: 350,  w: 170,  h: 400 },  // 와인셀러
  ],
};

// 방문 모드 전용 장애물 맵
const VISITOR_OBSTACLE_MAPS = {
  // 루스의 방 (상수리 방문) - 2048x1193
  sangsuri: [
    { x: 0,    y: 0,    w: 2048, h: 380,  name: '상단 벽' },
    { x: 0,    y: 0,    w: 70,   h: 1193, name: '좌측 벽' },
    { x: 1978, y: 0,    w: 70,   h: 1193, name: '우측 벽' },
    { x: 0,    y: 1051, w: 390,  h: 142,  name: '하단벽(문좌)' },
    { x: 550,  y: 1051, w: 1498, h: 142,  name: '하단벽(문우)' },
    { x: 525,  y: 240,  w: 380,  h: 320,  name: '약품선반' },
    { x: 70,   y: 300,  w: 440,  h: 300,  name: '문+벽면' },
    { x: 920,  y: 320,  w: 220,  h: 200,  name: '책' },
    { x: 1160, y: 350,  w: 300,  h: 250,  name: '책상+의자' },
    { x: 1470, y: 380,  w: 120,  h: 180,  name: '지구본' },
    { x: 1513, y: 750,  w: 187,  h: 125,  name: '가마솥' },
    { x: 1600, y: 425,  w: 300,  h: 250,  name: '지도대' },
    { x: 70,   y: 750,  w: 167,  h: 250,  name: '책더미(좌하)' },
    // 마법진은 장애물이 아닌 상호작용 영역 (별도 처리)
  ],
  // 너를 속이는 밤 방문 - 2048x1244
  neosokbam: [
    { x: 0,    y: 0,    w: 2048, h: 380,  name: '상단 벽' },
    { x: 0,    y: 0,    w: 100,  h: 1244, name: '좌측 벽' },
    { x: 1948, y: 0,    w: 100,  h: 1244, name: '우측 벽' },
    { x: 0,    y: 985,  w: 380,  h: 259,  name: '하단벽(문좌)' },
    { x: 540,  y: 985,  w: 1508, h: 259,  name: '하단벽(문우)' },
    { x: 380,  y: 1208, w: 160,  h: 36,   name: '하단벽(문바닥)' },
    { x: 190,  y: 300,  w: 150,  h: 250,  name: '석등' },
    { x: 400,  y: 140,  w: 250,  h: 280,  name: '병풍/족자' },
    { x: 930,  y: 250,  w: 250,  h: 200,  name: '선반' },
    { x: 1575, y: 150,  w: 550,  h: 450,  name: '나무+바위' },
    { x: 175,  y: 600,  w: 150,  h: 200,  name: '항아리' },
    { x: 280,  y: 860,  w: 100,  h: 60,   name: '양동이' },
    { x: 934,  y: 593,  w: 190,  h: 147,  name: '궤짝' },
    { x: 1250, y: 500,  w: 300,  h: 320,  name: '제단+촛대' },
  ],
  // 배덕한 타인 방문 - 2048x1194
  betrayer: [
    { x: 0,    y: 0,    w: 2048, h: 380,  name: '상단 벽' },
    { x: 0,    y: 0,    w: 80,   h: 1194, name: '좌측 벽' },
    { x: 1968, y: 0,    w: 80,   h: 1194, name: '우측 벽' },
    { x: 0,    y: 1050, w: 340,  h: 144,  name: '하단벽(문좌)' },
    { x: 540,  y: 1050, w: 1508, h: 144,  name: '하단벽(문우)' },
    { x: 340,  y: 1164, w: 200,  h: 30,   name: '하단벽(문바닥)' },
    { x: 280,  y: 260,  w: 480,  h: 120,  name: 'TV' },
    { x: 800,  y: 200,  w: 300,  h: 340,  name: '책장' },
  ],
};

// 기본 장애물 (owner 모드 / sangsuri)
const OBSTACLES = OBSTACLE_MAPS.sangsuri;

const FORTUNES = [
  { quote: '"온기를 나눈다는게 이런 거구나."', source: '상수리나무 아래', fortune: '소중한 사람과의 관계가 더 깊어지는 하루가 될 거예요.' },
  { quote: '"너를 바라면 바랄수록, 허무해지고, 비참해지기만 하는데도… 그만둘 수가 없었어."', source: '상수리나무 아래', fortune: '오늘은 결단의 날! 미루던 일을 시작하기 좋은 운세입니다.' },
  { quote: '"…뭐. 아프고 좋네. 더 아프게 해줘봐."', source: '배덕한 타인에게', fortune: '틀을 깨는 용기가 행운을 가져다 줍니다.' },
  { quote: '"그냥, 오늘부터 1일인걸로 할까? 그간의 앙금은 다 잊고."', source: '배덕한 타인에게', fortune: '과거의 기억에서 벗어나세요. 새로운 미래가 당신을 기다리고 있습니다.' },
  { quote: '"정말 고맙지만, 세실리아. 네 제안은 내가 성적이 떨어지면 생각해 볼게."', source: '안개를 삼킨 나비', fortune: '불확실한 상황에서도 당신의 빛이 길을 밝힐 거예요.' },
  { quote: '"…후회하지마. 이건, 네가 먼저 시작한거야."', source: '안개를 삼킨 나비', fortune: '힘들었던 경험이 오늘 당신의 강점이 됩니다.' },
  { quote: '"서령아. 사랑한다고 해 줘. 거짓말이라도, 상관, 없어."', source: '메리 사이코', fortune: '강렬한 감정이 밀려오는 날. 직감을 믿으세요!' },
  { quote: '"절대 내 곁을 떠나지 못하게 할래요. 만약 떠난다면, 다시 잡아오고, 도망치면 또 잡아 와서 내 곁에만 있게 할 거에요."', source: '메리 사이코', fortune: '오늘은 솔직해져도 괜찮은 날입니다.' },
  { quote: '"변태는 고유주씨 아닌가? 언니인척하고 나랑 자니까 좋았어?"', source: '너를 속이는 밤', fortune: '감춰진 진실이 드러나는 날. 좋은 소식이 있을 수 있어요.' },
  { quote: '"이 남자는 나를 욕망한다."', source: '너를 속이는 밤', fortune: '오해가 풀리고 관계가 회복되는 운세입니다.' },
  { quote: '"저도 그림을 그리다보면 저만의 천사를 만날 수 있을까요?"', source: '데페이즈망', fortune: '예상치 못한 곳에서 영감을 얻게 될 거예요.' },
  { quote: '"그 그림 말인데, 그쪽 눈엔 내가 그렇게 보입니까?"', source: '데페이즈망', fortune: '새로운 시각으로 문제를 바라보면 해답이 보입니다.' },
  { quote: '"공작을 하루빨리 제국민과 결혼시켜야 내 마음이 편해질텐데. 그놈의 \'하자\' 때문에 도망치지 않는 영애가 없어!"', source: '남편에게 쫓기고 있습니다', fortune: '지금은 물러서는 것이 현명한 선택일 수 있어요.' },
  { quote: '"후회 안할 자신 있나?"\n"물론이죠! 운명의 상대를 드디어 만났는데!"\n"내 이름은 알고?"\n"음… 마요네즈 공작님?"\n"요하네스."', source: '남편에게 쫓기고 있습니다', fortune: '어려운 상황에서도 유머를 잃지 마세요. 행운이 따릅니다.' },
  { quote: '"그러니까 내가… 당신을 사고 싶어, 리버 로스."', source: '오월의 정원에서', fortune: '새로운 시작과 성장의 기운이 가득한 날입니다.' },
  { quote: '"안됩,니다… 거긴…"\n"괜찮아. 내가… 기분 좋게 해줄게-"', source: '폐하의 밤', fortune: '인내가 곧 보상으로 돌아옵니다. 조금만 더 버텨보세요.' },
];

const SPEED = 80; // px/s
const STEP = 4;   // 1프레임당 이동 픽셀

class LibraryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LibraryScene' });
  }

  init(data) {
    this.mode = data.mode;
    this.userId = data.userId;
    this.roomConfig = data.roomConfig;
    this.aiConfig = data.aiConfig;
    this.onActionChange = data.onActionChange;
    this.onAvatarMove = data.onAvatarMove;
    this.onBookshelfClick = data.onBookshelfClick;
    this.onDoorClick = data.onDoorClick;
    this.onPointsEarned = data.onPointsEarned;
    this.currentAction = 'idle';
    this.lastDir = 'down';
  }

  preload() {
    const bg = this.roomConfig?.background || '/assets/backgrounds/maxy_room_x.webp';
    this.load.image('background', bg);
    this.load.image('bg_maxy_room', '/assets/backgrounds/maxy_room.webp');
    this.load.image('bg_maxy_room_crystal', '/assets/backgrounds/maxy_room_crystal.webp');

    // 맥시 모션 개별 이미지 (owner 아바타)
    const maxyDir = '/assets/maxy_motion';
    ['F1','F2','B1','B2','L1','L2','L3','L4','R1','R2','R3','R4'].forEach(name => {
      this.load.image(`maxy_${name}`, `${maxyDir}/CM_${name}.png`);
    });

    // 고양이
    this.load.image('cat_white', '/assets/pets/cat_white.png');
    this.load.image('cat_black', '/assets/pets/cat_black.png');
    this.load.image('cat_gray',  '/assets/pets/cat_gray.png');

    // 운세 배경 (테마별)
    this.load.image('fortune_bg_sangsuri', '/assets/backgrounds/fortune/sangsuri.webp');
    this.load.image('fortune_bg_neosokbam', '/assets/backgrounds/fortune/neosokbam.webp');
    this.load.image('fortune_bg_betrayer', '/assets/backgrounds/fortune/betrayer.webp');

    // 리프탄
    this.load.spritesheet('raptan', '/assets/characters/raptan_sprite.webp', {
      frameWidth: 343, frameHeight: 440
    });

    // visitor모드: 방 주인 커스텀 스프라이트 로드
    if (this.roomConfig?.hostSprite) {
      this.load.spritesheet('host_custom', this.roomConfig.hostSprite, {
        frameWidth: this.roomConfig.spriteWidth || 512,
        frameHeight: this.roomConfig.spriteHeight || 571,
      });
    }

    this.load.spritesheet('character_08', '/assets/characters/Premade_Character_48x48_08.png', {
      frameWidth: 48, frameHeight: 96
    });
    this.load.spritesheet('character_12', '/assets/characters/Premade_Character_48x48_12.png', {
      frameWidth: 48, frameHeight: 96
    });
  }

  create() {
    const { width, height } = this.scale;

    this.bgW = width;
    this.bgH = height;
    this.scaleX = width / 2048;

    // 테마별 원본 높이
    const themeHeights = { sangsuri: 1193, neosokbam: 1244, betrayer: 1194 };
    this._theme = this.roomConfig?.theme || 'sangsuri';
    this.scaleY = height / (themeHeights[this._theme] || 1193);

    // 배경
    this.bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.bg.setDisplaySize(width, height);
    this.bg.setDepth(-10);

    // 장애물 물리 그룹 생성
    this.obstacleGroup = this.physics.add.staticGroup();

    // 테마에 맞는 장애물 맵 선택 (방문 모드는 별도 맵)
    const theme = this.roomConfig?.theme || 'sangsuri';
    if (this.mode === 'visitor' && VISITOR_OBSTACLE_MAPS[theme]) {
      this.currentObstacles = VISITOR_OBSTACLE_MAPS[theme];
    } else {
      this.currentObstacles = OBSTACLE_MAPS[theme] || OBSTACLE_MAPS.sangsuri;
    }

    // 장애물 영역 (디버그 표시)
    const debugGfx = this.add.graphics().setDepth(999);

    const showDebug = true;

    this.currentObstacles.forEach(({ x, y, w, h, name }, idx) => {
      const rx = x * this.scaleX;
      const ry = y * this.scaleY;
      const rw = w * this.scaleX;
      const rh = h * this.scaleY;
      const zone = this.add.zone(rx + rw / 2, ry + rh / 2, rw, rh);
      this.physics.add.existing(zone, true);
      this.obstacleGroup.add(zone);

      // [디버그] 장애물 시각화 + 명칭
      if (showDebug) {
        debugGfx.lineStyle(1, 0xff0000, 0.8);
        debugGfx.fillStyle(0xff0000, 0.25);
        debugGfx.fillRect(rx, ry, rw, rh);
        debugGfx.strokeRect(rx, ry, rw, rh);
        const label = name || `#${idx}`;
        this.add.text(rx + 2, ry + 2, label, {
          fontSize: '8px', color: '#ffff00', backgroundColor: 'rgba(0,0,0,0.6)',
          padding: { x: 2, y: 1 },
        }).setDepth(1000);
      }
    });

    // 키보드 입력
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.createAnimations();

    // 거울 클릭 영역 (owner/sangsuri만) — 아래쪽으로 확장
    const mirrorObs = this.currentObstacles[7]; // 거울
    if (mirrorObs) {
      const mx = mirrorObs.x * this.scaleX;
      const my = mirrorObs.y * this.scaleY;
      const mw = mirrorObs.w * this.scaleX;
      const mh = mirrorObs.h * this.scaleY + 30;
      this.mirrorZone = this.add.zone(mx + mw / 2, my + mh / 2, mw, mh)
        .setInteractive({ useHandCursor: true })
        .setDepth(50);
      this.mirrorZone.on('pointerdown', () => {
        if (this.themeApplied && !this.dialogueActive) this.onMirrorClick();
      });
    }

    // 책장 클릭 영역 (owner/sangsuri만) — 아래쪽으로 확장
    const bookshelfObs = this.currentObstacles[8]; // 책장
    if (bookshelfObs) {
      const bx = bookshelfObs.x * this.scaleX;
      const by = bookshelfObs.y * this.scaleY;
      const bw = bookshelfObs.w * this.scaleX;
      const bh = bookshelfObs.h * this.scaleY + 30;
      this.bookshelfZone = this.add.zone(bx + bw / 2, by + bh / 2, bw, bh)
        .setInteractive({ useHandCursor: true })
        .setDepth(50);
      this.bookshelfZone.on('pointerdown', () => {
        if (!this.dialogueActive && this.onBookshelfClick) this.onBookshelfClick();
      });
    }

    // 수정구 클릭 영역 (owner/sangsuri만) — 아래쪽으로 확장
    const crystalObs = this.currentObstacles[13]; // 수정구
    if (crystalObs) {
      const cx = crystalObs.x * this.scaleX;
      const cy = crystalObs.y * this.scaleY;
      const cw = crystalObs.w * this.scaleX;
      const ch = crystalObs.h * this.scaleY + 30;
      this.crystalZone = this.add.zone(cx + cw / 2, cy + ch / 2, cw, ch)
        .setInteractive({ useHandCursor: true })
        .setDepth(50);
      this.crystalZone.on('pointerdown', () => {
        if (this.crystalAdded && !this.dialogueActive) this.onCrystalClick();
      });
    }

    // 테마 적용 여부 (적용 전에는 가구 장애물·인터랙션 비활성화, 벽+책장만 유지)
    this.themeApplied = false;
    this.setObstaclesForTheme(false);

    // 대화 시스템 초기화
    this.dialogueActive = false;
    this.modalActive = false;
    this.dialogueContainer = null;

    // 상호작용 시스템 초기화
    this.interactTarget = null; // 현재 상호작용 가능한 대상
    this.interactBubble = null; // 상호작용 힌트 말풍선
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.spaceJustPressed = false;

    // ESC로 대화/운세 강제 종료
    this.escKey.on('down', () => {
      if (this.dialogueActive) {
        this.endDialogue();
      }
    });

    // 상호작용 가능 오브젝트 정의
    this.interactables = [];

    if (this.mode === 'owner') {
      this.createOwnerMode();
    } else {
      this.createVisitorMode();
    }

    // 상호작용 오브젝트 등록 (sangsuri 테마)
    if (theme === 'sangsuri') {
      const mirrorOb = this.currentObstacles[7];
      if (mirrorOb) this.interactables.push({
        name: 'mirror', emoji: '🪞',
        cx: mirrorOb.x * this.scaleX,
        cy: (mirrorOb.y + mirrorOb.h + 20) * this.scaleY,
        range: 50, action: () => this.onMirrorClick(),
      });
      const bookOb = this.currentObstacles[8];
      if (bookOb) this.interactables.push({
        name: 'bookshelf', emoji: '📚',
        cx: (bookOb.x + bookOb.w / 2) * this.scaleX,
        cy: (bookOb.y + bookOb.h) * this.scaleY,
        range: 40, action: () => { if (this.onBookshelfClick) this.onBookshelfClick(); },
      });
      const crystalOb = this.currentObstacles[13];
      if (crystalOb) this.interactables.push({
        name: 'crystal', emoji: '🔮',
        cx: (crystalOb.x + crystalOb.w / 2) * this.scaleX,
        cy: (crystalOb.y + crystalOb.h) * this.scaleY,
        range: 40, action: () => this.onCrystalClick(),
      });
    }

    // 상호작용 오브젝트 등록 (betrayer 테마)
    if (theme === 'betrayer') {
      // 책장 → 서재 (방문 모드: 인덱스 6, 오너 모드: 인덱스 7)
      const bookIdx = this.mode === 'visitor' ? 6 : 7;
      const bookOb = this.currentObstacles[bookIdx];
      if (bookOb) this.interactables.push({
        name: 'bookshelf', emoji: '📚',
        cx: (bookOb.x + bookOb.w / 2) * this.scaleX,
        cy: (bookOb.y + bookOb.h) * this.scaleY,
        range: 50, action: () => { if (this.onBookshelfClick) this.onBookshelfClick(); },
      });
      // TV → 운세 (방문 모드: 인덱스 5, 오너 모드: 인덱스 6)
      const tvIdx = this.mode === 'visitor' ? 5 : 6;
      const tvOb = this.currentObstacles[tvIdx];
      if (tvOb) this.interactables.push({
        name: 'tv', emoji: '📺',
        cx: (tvOb.x + tvOb.w / 2) * this.scaleX,
        cy: (tvOb.y + tvOb.h + 20) * this.scaleY,
        range: 50, action: () => this.onTvFortuneClick(),
      });
    }

    // 상호작용 오브젝트 등록 (neosokbam 테마)
    if (theme === 'neosokbam') {
      // 제단+촛대 → 운세 (인덱스 13)
      const altarOb = this.currentObstacles[13];
      if (altarOb) this.interactables.push({
        name: 'altar', emoji: '🔮',
        cx: (altarOb.x + altarOb.w / 2) * this.scaleX,
        cy: (altarOb.y + altarOb.h) * this.scaleY,
        range: 50, action: () => this.onAltarFortuneClick(),
      });
      // 나무+바위 → 추천작품 (인덱스 9)
      const treeOb = this.currentObstacles[9];
      if (treeOb) this.interactables.push({
        name: 'tree', emoji: '📚',
        cx: (treeOb.x + treeOb.w / 2) * this.scaleX,
        cy: (treeOb.y + treeOb.h) * this.scaleY,
        range: 50, action: () => this.onTreeRecommendClick(),
      });
    }

    // 방문 모드 전용 상호작용
    if (this.mode === 'visitor' && theme === 'sangsuri') {
      // 마법진 상호작용 영역
      const mcX = 920, mcY = 740, mcW = 187, mcH = 180;
      this.interactables.push({
        name: 'magic_circle', emoji: '🔯',
        cx: (mcX + mcW / 2) * this.scaleX,
        cy: (mcY + mcH / 2) * this.scaleY,
        range: 80,
        action: () => this.onMagicCircleInteract(),
      });

      // [디버그] 마법진 영역 시각화 (비활성화)
      // const mcDebug = this.add.graphics().setDepth(999);
      // mcDebug.lineStyle(2, 0x00ffff, 0.8);
      // mcDebug.strokeRect(mcX * this.scaleX, mcY * this.scaleY, mcW * this.scaleX, mcH * this.scaleY);
      // mcDebug.fillStyle(0x00ffff, 0.15);
      // mcDebug.fillRect(mcX * this.scaleX, mcY * this.scaleY, mcW * this.scaleX, mcH * this.scaleY);
      // this.add.text(mcX * this.scaleX + 2, mcY * this.scaleY + 2, '마법진 (상호작용)', {
      //   fontSize: '8px', color: '#00ffff', backgroundColor: 'rgba(0,0,0,0.6)',
      //   padding: { x: 2, y: 1 },
      // }).setDepth(1000);
    }

    // 문 인터랙션 (하단 벽 움푹 파인 부분)
    if (this.mode === 'owner') {
      const doorPositions = {
        sangsuri:  { x: 462, y: 1111 },
        neosokbam: { x: 460, y: 1050 },
      };
      const doorPos = doorPositions[theme] || doorPositions.sangsuri;
      const doorRange = 50;

      this.interactables.push({
        name: 'door', emoji: '🚪',
        cx: doorPos.x * this.scaleX,
        cy: doorPos.y * this.scaleY,
        range: doorRange,
        action: () => { if (this.onDoorClick) this.onDoorClick(); },
      });
    }
  }

  createAnimations() {
    const characters = ['character_08', 'character_12'];
    characters.forEach(charKey => {
      const defs = [
        { key: 'walk_right', start: 112, end: 115 },
        { key: 'walk_up',    start: 118, end: 121 },
        { key: 'walk_left',  start: 124, end: 127 },
        { key: 'walk_down',  start: 130, end: 133 },
        { key: 'idle_right', start: 56,  end: 61  },
        { key: 'idle_up',    start: 62,  end: 67  },
        { key: 'idle_left',  start: 68,  end: 73  },
        { key: 'idle_down',  start: 74,  end: 79  },
        { key: 'idle',       start: 74,  end: 79  },
      ];
      defs.forEach(({ key, start, end }) => {
        this.anims.create({
          key: `${charKey}_${key}`,
          frames: this.anims.generateFrameNumbers(charKey, { start, end }),
          frameRate: key.startsWith('walk') ? 8 : 6,
          repeat: -1
        });
      });
    });

    // 맥시 모션 애니메이션 (개별 이미지 기반)
    const maxyDefs = [
      { key: 'maxy_walk_down',  frames: ['maxy_F1', 'maxy_F2'] },
      { key: 'maxy_walk_up',    frames: ['maxy_B1', 'maxy_B2'] },
      { key: 'maxy_walk_left',  frames: ['maxy_L1', 'maxy_L2', 'maxy_L3', 'maxy_L4'] },
      { key: 'maxy_walk_right', frames: ['maxy_R1', 'maxy_R2', 'maxy_R3', 'maxy_R4'] },
      { key: 'maxy_idle_down',  frames: ['maxy_F1'] },
      { key: 'maxy_idle_up',    frames: ['maxy_B1'] },
      { key: 'maxy_idle_left',  frames: ['maxy_L1'] },
      { key: 'maxy_idle_right', frames: ['maxy_R1'] },
      { key: 'maxy_idle',       frames: ['maxy_F1'] },
    ];
    maxyDefs.forEach(({ key, frames }) => {
      this.anims.create({
        key,
        frames: frames.map(f => ({ key: f })),
        frameRate: frames.length > 1 ? 8 : 1,
        repeat: -1,
      });
    });

    // 커스텀 호스트 스프라이트 애니메이션 (8프레임: 1,2=아래 3,4=위 5,6=오른쪽 7,8=왼쪽)
    if (this.textures.exists('host_custom')) {
      const hc = 'host_custom';
      const hostTheme = this.roomConfig?.theme;

      let animDefs;
      if (hostTheme === 'betrayer') {
        // 배덕한 주인공: 프레임 5,6이 바뀌어 있고 위/아래는 1프레임만 존재
        animDefs = [
          { key: `${hc}_walk_down`,  frames: [0] },
          { key: `${hc}_walk_up`,    frames: [1] },
          { key: `${hc}_walk_right`, frames: [5, 7] },
          { key: `${hc}_walk_left`,  frames: [4, 6] },
          { key: `${hc}_idle_down`,  frames: [0] },
          { key: `${hc}_idle_up`,    frames: [1] },
          { key: `${hc}_idle_right`, frames: [5] },
          { key: `${hc}_idle_left`,  frames: [4] },
          { key: `${hc}_idle`,       frames: [0] },
        ];
      } else {
        // 루스, 너속밤 등 기본 구조
        // 왼쪽 걷기: 오른쪽 프레임을 flipX로 재활용 (프레임 7이 방향 오류)
        animDefs = [
          { key: `${hc}_walk_down`,  frames: [0, 1] },
          { key: `${hc}_walk_up`,    frames: [2, 3] },
          { key: `${hc}_walk_right`, frames: [4, 5] },
          { key: `${hc}_walk_left`,  frames: [4, 5] },
          { key: `${hc}_idle_down`,  frames: [0] },
          { key: `${hc}_idle_up`,    frames: [2] },
          { key: `${hc}_idle_right`, frames: [4] },
          { key: `${hc}_idle_left`,  frames: [4] },
          { key: `${hc}_idle`,       frames: [0] },
        ];
      }

      animDefs.forEach(({ key, frames }) => {
        this.anims.create({
          key,
          frames: frames.map(f => ({ key: hc, frame: f })),
          frameRate: frames.length > 1 ? 6 : 1,
          repeat: -1,
        });
      });

      // 왼쪽 걷기에서 flipX가 필요한 캐릭터 기록
      this._hostNeedsFlipOnLeft = (hostTheme === 'sangsuri' || hostTheme === 'neosokbam');
      // 배덕한 주인공: 위/아래 이동 시 실제 이동 없이 자세만 변경
      this._hostNoVerticalMove = (hostTheme === 'betrayer');
    }
  }

  // 특정 위치가 장애물과 겹치는지 확인
  // 벽 인덱스: 0~6, 책장 인덱스: 9, 수정구 인덱스: 14
  isBlocked(x, y, margin = 10) {
    const obstacles = this.currentObstacles || OBSTACLES;
    const wallAndBookshelf = [0, 1, 2, 3, 4, 5, 8];
    const crystalIndex = 13;
    for (let i = 0; i < obstacles.length; i++) {
      // owner 모드에서 테마 미적용 시 벽+책장만 충돌 체크
      if (this.mode === 'owner' && !this.themeApplied && !wallAndBookshelf.includes(i)) continue;
      // 수정구는 활성화 시에만 충돌 체크
      if (i === crystalIndex && !this.crystalAdded) continue;

      const { x: ox, y: oy, w, h } = obstacles[i];
      const rx = ox * this.scaleX;
      const ry = oy * this.scaleY;
      const rw = w * this.scaleX;
      const rh = h * this.scaleY;
      if (x + margin > rx && x - margin < rx + rw &&
          y + margin > ry && y - margin < ry + rh) {
        return true;
      }
    }
    return false;
  }

  // 장애물이 없는 랜덤 위치 반환
  getWalkablePoint(minX, maxX, minY, maxY, tries = 20) {
    for (let i = 0; i < tries; i++) {
      const x = Phaser.Math.Between(minX, maxX);
      const y = Phaser.Math.Between(minY, maxY);
      if (!this.isBlocked(x, y)) return { x, y };
    }
    return { x: this.bgW * 0.5, y: this.bgH * 0.8 };
  }

  createOwnerMode() {
    const startX = this.bgW * 0.5;
    const startY = this.bgH * 0.78;

    this.myAvatarShadow = this.drawPixelShadow(startX, startY + 2, startY - 0.1, 10);

    this.myAvatar = this.add.sprite(startX, startY, 'maxy_F1').setOrigin(0.5, 1);
    this.myAvatar.setScale(0.15);
    this.myAvatar.play('maxy_idle_down');
    this.myAvatar.setDepth(startY);
    this.ownerCharKey = 'maxy';

    this.showGreetingBubble(this.myAvatar);

    this.myAvatarLabel = this.add.text(startX, startY + 4, '맥시', {
      fontSize: '10px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(startY + 0.1);
  }

  createVisitorMode() {
    const avatarY = this.bgH * 0.78;
    const useCustomHost = this.textures.exists('host_custom');
    const hostCharKey = useCustomHost ? 'host_custom' : 'character_08';
    const hostName = this.roomConfig?.hostName || '맥시';

    this.hostAvatarShadow = this.drawPixelShadow(this.bgW * 0.35, avatarY + 2, avatarY - 0.1, 10);

    if (useCustomHost) {
      const spriteH = this.roomConfig.spriteHeight || 571;
      const hostScale = (98 / spriteH);
      this.hostAvatar = this.add.sprite(this.bgW * 0.35, avatarY, 'host_custom', 0).setOrigin(0.5, 1);
      this.hostAvatar.setScale(hostScale);
    } else {
      this.hostAvatar = this.add.sprite(this.bgW * 0.35, avatarY, 'character_08').setOrigin(0.5);
      this.hostAvatar.setScale(0.75);
    }
    this.hostAvatar.play(`${hostCharKey}_idle_down`);
    this.hostAvatar.setDepth(avatarY);

    const labelY = useCustomHost ? avatarY + 4 : this.hostAvatar.y + 56;
    this.hostAvatarLabel = this.add.text(this.hostAvatar.x, labelY, hostName, {
      fontSize: '10px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(avatarY + 0.1);

    // 방문자 (맥시) — 키보드로 이동 가능
    this.myAvatarShadow = this.drawPixelShadow(this.bgW * 0.65, avatarY + 2, avatarY - 0.1, 10);

    this.myAvatar = this.add.sprite(this.bgW * 0.65, avatarY, 'maxy_F1').setOrigin(0.5, 1);
    this.myAvatar.setScale(0.15);
    this.myAvatar.play('maxy_idle_down');
    this.myAvatar.setDepth(avatarY);
    this.ownerCharKey = 'maxy';

    this.myAvatarLabel = this.add.text(this.myAvatar.x, avatarY + 4, '맥시', {
      fontSize: '10px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(avatarY + 0.1);

    this.hostCharKey = hostCharKey;
    this.startAutoMovement(this.hostAvatar, hostCharKey);
    this.showGreetingBubble(this.hostAvatar);

    // 호스트 아바타 상호작용 등록
    const persona = this.roomConfig?.theme || 'sangsuri';
    const hostInteractLines = {
      sangsuri: [
        '마나를 흘리는 방식이 엉망입니다. 그 상태로는 유지도 못 합니다.',
        '대마법사 루스가 왔노라고 고래고래 소리라도 질러야 하나...',
        '요즘 읽고 있는 책이 정말 좋아요. 추천해드릴까요?',
        '미끈하게 잘 빠진 몸매와 수려한 미모와 명석한 두뇌가 남는데요!',
        '원정을 나가기 전에 저도 꼭 데려가야 한다고 일러주세요.',
      ],
      neosokbam: [
        '왜 그렇게 쳐다보는 거예요...?',
        '... 거짓말을 하고 있네요.',
        '책이라... 요즘 \'자유의 기술\'이라는 책을 읽고 있어요. 다른 책도 추천 해드릴까요?',
        '취향이 나쁘진 않네요. 도승한씨는... 아니에요.',
        '신어머니가 그러셨어요. 뭐든지 읽고 배워두라고.',
      ],
      betrayer: [
        '...뭐요.',
        '할 말이 있으면 빨리 하세요.',
        '꽤 괜찮은 와인이군요. 땅콩 냄새가 좀 나지만....',
        '...당신, 취향이 나쁘지 않군요.',
        '조용히 있어주면 감사하겠는데... 농담이에요^^.',
      ],
    };
    this.hostInteractLines = hostInteractLines[persona] || hostInteractLines.sangsuri;

    this.interactables.push({
      name: 'host', emoji: '💬',
      getPos: () => ({ cx: this.hostAvatar.x, cy: this.hostAvatar.y }),
      range: 50,
      action: () => this.onHostInteract(),
    });
  }

  onHostInteract() {
    if (this.dialogueActive) return;
    this.dialogueActive = true;
    const hostName = this.roomConfig?.hostName || '맥시';
    const line = this.hostInteractLines[Math.floor(Math.random() * this.hostInteractLines.length)];
    this.showDialogue(hostName, line, () => this.endDialogue());
  }

  showGreetingBubble(avatar) {
    const bw = 52;
    const bh = 42;
    const r  = 18;
    const tailH = 10;
    const offsetY = 95;

    const drawBubble = (g) => {
      g.clear();
      g.fillStyle(0xffffff, 0.96);
      // 둥근 사각형 (중앙 기준, 위쪽으로)
      g.fillRoundedRect(-bw / 2, -bh - tailH - 2, bw, bh, r);
      // 아래 중앙 뾰족한 꼬리
      g.fillTriangle(
        0,          -2,         // 꼬리 끝 (아래 중앙)
        -10, -tailH - 2,        // 왼쪽
         10, -tailH - 2         // 오른쪽
      );
    };

    const bubble = this.add.graphics().setDepth(20);
    drawBubble(bubble);
    bubble.setPosition(avatar.x, avatar.y - offsetY);

    const emoji = this.add.text(avatar.x, avatar.y - offsetY - tailH - bh / 2, '👋', {
      fontSize: '16px',
      padding: { top: 4, bottom: 4 },
    }).setOrigin(0.5).setDepth(21);

    // 매 프레임 아바타 위치 추적
    const followKey = `greetingBubble_${avatar === this.myAvatar ? 'my' : 'host'}`;
    this[followKey] = { bubble, emoji, avatar, offsetY, tailH, bh };

    // 3초 후 페이드 아웃
    this.time.delayedCall(2500, () => {
      this[followKey] = null;
      this.tweens.add({
        targets: [bubble, emoji],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          bubble.destroy();
          emoji.destroy();
        }
      });
    });
  }

  showTypingBubble(show) {
    const avatar = this.myAvatar;
    if (!avatar || !avatar.active) return;

    // 제거
    if (!show) {
      if (this.typingBubbleData) {
        const { bubble, text, timer } = this.typingBubbleData;
        if (timer) timer.remove();
        if (bubble) bubble.destroy();
        if (text) text.destroy();
        this.typingBubbleData = null;
      }
      return;
    }

    // 이미 표시 중이면 무시
    if (this.typingBubbleData) return;

    const bw = 52;
    const bh = 36;
    const r  = 16;
    const tailH = 8;
    const offsetY = 95;

    const bubble = this.add.graphics().setDepth(20);
    bubble.fillStyle(0xffffff, 0.92);
    bubble.fillRoundedRect(-bw / 2, -bh - tailH - 2, bw, bh, r);
    bubble.fillTriangle(0, -2, -6, -tailH - 2, 6, -tailH - 2);
    bubble.setPosition(avatar.x, avatar.y - offsetY);

    const dots = this.add.text(avatar.x, avatar.y - offsetY - tailH - bh / 2, '.', {
      fontSize: '18px', fontWeight: 'bold', color: '#5c3a1e',
    }).setOrigin(0.5).setDepth(21);

    let dotCount = 1;
    const timer = this.time.addEvent({
      delay: 400,
      callback: () => {
        dotCount = (dotCount % 3) + 1;
        dots.setText('.'.repeat(dotCount));
      },
      loop: true,
    });

    this.typingBubbleData = { bubble, text: dots, avatar, offsetY, tailH, bh, timer };
  }

  showChatBubble(avatarType, emojiChar) {
    // 채팅 말풍선 표시 시 타이핑 말풍선 해제
    if (avatarType === 'my') this.showTypingBubble(false);

    const avatar = avatarType === 'host' ? (this.hostAvatar || this.raptan) : this.myAvatar;
    if (!avatar || !avatar.active) return;

    const bw = 52;
    const bh = 42;
    const r  = 18;
    const tailH = 10;
    const offsetY = 95;
    const followKey = `chatBubble_${avatarType}`;

    // 기존 말풍선 제거
    if (this[followKey]) {
      const old = this[followKey];
      if (old.bubble) old.bubble.destroy();
      if (old.emoji) old.emoji.destroy();
      this[followKey] = null;
    }

    const bubble = this.add.graphics().setDepth(20);
    bubble.fillStyle(0xffffff, 0.96);
    bubble.fillRoundedRect(-bw / 2, -bh - tailH - 2, bw, bh, r);
    bubble.fillTriangle(0, -2, -8, -tailH - 2, 8, -tailH - 2);
    bubble.setPosition(avatar.x, avatar.y - offsetY);

    const emojiText = this.add.text(avatar.x, avatar.y - offsetY - tailH - bh / 2, emojiChar || '💬', {
      fontSize: '14px',
      padding: { top: 4, bottom: 4 },
    }).setOrigin(0.5).setDepth(21);

    this[followKey] = { bubble, emoji: emojiText, avatar, offsetY, tailH, bh };

    // 3초 후 페이드 아웃
    this.time.delayedCall(3000, () => {
      this[followKey] = null;
      this.tweens.add({
        targets: [bubble, emojiText],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          bubble.destroy();
          emojiText.destroy();
        }
      });
    });
  }

  updateGreetingBubbles() {
    ['greetingBubble_my', 'greetingBubble_host', 'chatBubble_host', 'chatBubble_my'].forEach(key => {
      const data = this[key];
      if (!data) return;
      const { bubble, emoji, avatar, offsetY, tailH, bh } = data;
      if (!avatar || !avatar.active) return;
      bubble.setPosition(avatar.x, avatar.y - offsetY);
      emoji.setPosition(avatar.x, avatar.y - offsetY - tailH - bh / 2);
    });

    // 타이핑 말풍선 추적
    if (this.typingBubbleData) {
      const { bubble, text, avatar, offsetY, tailH, bh } = this.typingBubbleData;
      if (avatar && avatar.active) {
        bubble.setPosition(avatar.x, avatar.y - offsetY);
        text.setPosition(avatar.x, avatar.y - offsetY - tailH - bh / 2);
      }
    }

    // 상호작용 힌트 말풍선 추적
    if (this.interactHintData) {
      const { bubble, emoji, spaceHint, avatar, offsetY, tailH, bh } = this.interactHintData;
      if (avatar && avatar.active) {
        bubble.setPosition(avatar.x, avatar.y - offsetY);
        emoji.setPosition(avatar.x, avatar.y - offsetY - tailH - bh / 2);
        spaceHint.setPosition(avatar.x, avatar.y - offsetY + 8);
      }
    }
  }

  startAutoMovement(avatar, charKey) {
    const baseX = avatar.x;
    const baseY = avatar.y;
    const rangeX = this.bgW * 0.08;
    const rangeY = this.bgH * 0.04;
    const isCustom = (avatar === this.hostAvatar && this.textures.exists('host_custom'));
    const needsFlipOnLeft = this._hostNeedsFlipOnLeft && avatar === this.hostAvatar;
    const noVerticalMove = this._hostNoVerticalMove && avatar === this.hostAvatar;

    const applyFlip = (dir) => {
      if (!needsFlipOnLeft) return;
      avatar.setFlipX(dir === 'left');
    };

    const doMove = () => {
      if (!avatar || !avatar.active) return;

      // 일정 확률로 제자리에서 방향만 바꾸고 대기
      if (Math.random() < 0.4) {
        const idleDirs = ['down', 'left', 'right'];
        const idleDir = idleDirs[Math.floor(Math.random() * idleDirs.length)];
        avatar.play(`${charKey}_idle_${idleDir}`, true);
        applyFlip(idleDir);
        this.time.delayedCall(Phaser.Math.Between(4000, 8000), doMove);
        return;
      }

      // 이동 방향 선택 (배덕한 주인공은 좌우만)
      const dirs = noVerticalMove ? ['left', 'right'] : ['up', 'down', 'left', 'right'];
      const dir = dirs[Math.floor(Math.random() * dirs.length)];

      let targetX = avatar.x;
      let targetY = avatar.y;
      const moveAmount = Phaser.Math.Between(10, 30);

      if (dir === 'up') targetY = Math.max(baseY - rangeY, avatar.y - moveAmount);
      else if (dir === 'down') targetY = Math.min(baseY + rangeY, avatar.y + moveAmount);
      else if (dir === 'left') targetX = Math.max(baseX - rangeX, avatar.x - moveAmount);
      else if (dir === 'right') targetX = Math.min(baseX + rangeX, avatar.x + moveAmount);

      // 장애물 체크 — 막혀있으면 이동 취소하고 재시도
      if (this.isBlocked(targetX, targetY - 15)) {
        this.time.delayedCall(Phaser.Math.Between(3000, 6000), doMove);
        return;
      }

      const distance = Math.abs(targetX - avatar.x) + Math.abs(targetY - avatar.y);
      const duration = (distance / 15) * 1000;

      avatar.play(`${charKey}_walk_${dir}`, true);
      applyFlip(dir);

      this.tweens.add({
        targets: avatar,
        x: targetX,
        y: targetY,
        duration,
        ease: 'Sine.easeInOut',
        onUpdate: () => {
          const label = avatar === this.hostAvatar ? this.hostAvatarLabel : this.visitorAvatarLabel;
          if (label) {
            label.setPosition(avatar.x, avatar.y + (isCustom ? 4 : 22));
            label.setDepth(avatar.y + 0.1);
          }
          avatar.setDepth(avatar.y);
          if (this.hostAvatarShadow && avatar === this.hostAvatar) {
            this.hostAvatarShadow.setPosition(avatar.x, avatar.y + 2);
            this.hostAvatarShadow.setDepth(avatar.y - 0.1);
          }
        },
        onComplete: () => {
          if (!avatar || !avatar.active) return;
          avatar.play(`${charKey}_idle_${dir}`, true);
          applyFlip(dir);
          this.time.delayedCall(Phaser.Math.Between(5000, 10000), doMove);
        }
      });
    };

    this.time.delayedCall(3000, doMove);
  }

  // 벽 인덱스: 0(상단), 1(좌측), 2(우측), 3~6(하단)
  // 책장 인덱스: 9, 수정구 인덱스: 14
  setObstaclesForTheme(enabled) {
    const wallIndices = [0, 1, 2, 3, 4, 5];
    const bookshelfIndex = 8;
    const crystalIndex = 13;
    if (this.obstacleGroup) {
      this.obstacleGroup.getChildren().forEach((zone, i) => {
        if (wallIndices.includes(i) || i === bookshelfIndex) {
          zone.body.enable = true;
        } else if (i === crystalIndex) {
          zone.body.enable = !!this.crystalAdded;
        } else {
          zone.body.enable = enabled;
        }
      });
    }
    // 거울·수정구: 테마 적용 시에만 활성화
    if (this.mirrorZone) {
      if (enabled) this.mirrorZone.setInteractive({ useHandCursor: true });
      else this.mirrorZone.disableInteractive();
    }
    if (this.crystalZone) {
      if (this.crystalAdded) this.crystalZone.setInteractive({ useHandCursor: true });
      else this.crystalZone.disableInteractive();
    }
    // 책장: 항상 활성화
    if (this.bookshelfZone) {
      this.bookshelfZone.setInteractive({ useHandCursor: true });
    }
  }

  changeBackground(textureKey) {
    if (!this.bg) return;
    if (this.textures.exists(textureKey)) {
      this.bg.setTexture(textureKey);
      this.bg.setDisplaySize(this.bgW, this.bgH);
    }
    this.themeApplied = true;
    this.setObstaclesForTheme(true);
  }

  addCrystal() {
    if (!this.bg || !this.themeApplied) return;
    this.crystalAdded = true;
    this.bg.setTexture('bg_maxy_room_crystal');
    this.bg.setDisplaySize(this.bgW, this.bgH);
    // 수정구 장애물 활성화
    const zone = this.obstacleGroup?.getChildren()[13];
    if (zone?.body) zone.body.enable = true;
    // 수정구 클릭 영역 활성화
    if (this.crystalZone) this.crystalZone.setInteractive({ useHandCursor: true });
  }

  removeCrystal() {
    if (!this.bg) return;
    this.crystalAdded = false;
    if (this.themeApplied) {
      this.bg.setTexture('bg_maxy_room');
      this.bg.setDisplaySize(this.bgW, this.bgH);
    }
    // 수정구 장애물 비활성화
    const zone = this.obstacleGroup?.getChildren()[13];
    if (zone?.body) zone.body.enable = false;
    // 수정구 클릭 영역 비활성화
    if (this.crystalZone) this.crystalZone.disableInteractive();
  }

  restoreBackground() {
    if (!this.bg) return;
    this.crystalAdded = false;
    this.bg.setTexture('background');
    this.bg.setDisplaySize(this.bgW, this.bgH);
    this.themeApplied = false;
    this.setObstaclesForTheme(false);
  }

  addCats() {
    if (this.catsAdded) return;
    this.catsAdded = true;
    this.catClicksRemaining = 2; // 2회 포인트 획득 가능

    const catPositions = [
      { type: 'white', key: 'cat_white', name: '로라',  x: this.bgW * 0.3,           y: this.bgH * 0.75 },  // 바닥
      { type: 'black', key: 'cat_black', name: '리프',  x: 850 * this.scaleX + 22,   y: 650 * this.scaleY + 26 }, // 책상 위
      { type: 'gray',  key: 'cat_gray',  name: '탄이',  x: 1600 * this.scaleX - 8,   y: 400 * this.scaleY + 90 }, // 침대 위
    ];

    this.catSprites = [];
    catPositions.forEach(({ type, key, name, x, y }) => {
      // 픽셀 그림자
      this.drawPixelShadow(x, y + 2, y - 0.1, 8);

      const cat = this.add.sprite(x, y, key).setOrigin(0.5, 1);
      cat.setScale(0.4);
      cat.setDepth(y);
      cat.setInteractive({ useHandCursor: true });
      cat.catType = type;
      cat.catName = name;
      cat.on('pointerdown', () => this.onCatClick(name));
      this.catSprites.push(cat);

      // 상호작용 등록
      this.interactables.push({
        name: `cat_${type}`, emoji: '🐱',
        getPos: () => ({ cx: cat.x, cy: cat.y }),
        range: 40,
        action: () => this.onCatClick(name),
      });
    });
  }

  removeCats() {
    if (!this.catsAdded) return;
    if (this.catSprites) {
      this.catSprites.forEach(cat => cat.destroy());
      this.catSprites = [];
    }
    this.interactables = this.interactables.filter(i => !i.name.startsWith('cat_'));
    this.catsAdded = false;
  }

  // 개별 고양이 추가
  addSingleCat(catType) {
    if (!this.catSprites) this.catSprites = [];
    if (!this.catClicksRemaining) this.catClicksRemaining = 0;

    const catMap = {
      white: { key: 'cat_white', name: '로라', x: this.bgW * 0.3, y: this.bgH * 0.75 },
      black: { key: 'cat_black', name: '리프', x: 850 * this.scaleX + 22, y: 650 * this.scaleY + 26 },
      gray:  { key: 'cat_gray',  name: '탄이', x: 1600 * this.scaleX - 8, y: 400 * this.scaleY + 90 },
    };
    const info = catMap[catType];
    if (!info) return;

    // 이미 추가된 경우 무시 (catType으로 식별)
    if (this.catSprites.some(c => c.catType === catType)) return;

    this.catClicksRemaining++;
    this.drawPixelShadow(info.x, info.y + 2, info.y - 0.1, 8);
    const cat = this.add.sprite(info.x, info.y, info.key).setOrigin(0.5, 1);
    cat.setScale(0.4);
    cat.setDepth(info.y);
    cat.setInteractive({ useHandCursor: true });
    cat.catType = catType;
    cat.catName = info.name;
    cat.on('pointerdown', () => this.onCatClick(info.name));
    this.catSprites.push(cat);

    this.interactables.push({
      name: `cat_${catType}`, emoji: '🐱',
      getPos: () => ({ cx: cat.x, cy: cat.y }),
      range: 40,
      action: () => this.onCatClick(info.name),
    });
  }

  // 개별 고양이 제거
  removeSingleCat(catType) {
    if (!this.catSprites) return;

    const idx = this.catSprites.findIndex(c => c.catType === catType);
    if (idx !== -1) {
      this.catSprites[idx].destroy();
      this.catSprites.splice(idx, 1);
    }
    this.interactables = this.interactables.filter(i => i.name !== `cat_${catType}`);
  }

  onCatClick(catName) {
    if (this.dialogueActive) return;
    this.dialogueActive = true;
    const name = catName || '로라';

    if (this.catClicksRemaining > 0) {
      const points = Phaser.Math.Between(1, 5);
      this.catClicksRemaining--;

      this.showDialogue(name, '그르릉..', () => {
        this.showDialogue('맥시', `${name}의 기, 기분이 좋은가봐요. ${points} 포인트를 물어왔어요!`, () => {
          if (this.onPointsEarned) this.onPointsEarned(points);
          this.endDialogue();
        });
      });
    } else {
      this.showDialogue(name, 'zZz..', () => {
        this.showDialogue('맥시', `오, 오늘은 ${name}가 졸린 것 같네요...`, () => {
          this.endDialogue();
        });
      });
    }
  }

  addRaptan() {
    if (this.raptanAdded) return;
    this.raptanAdded = true;

    // 리프탄 애니메이션: 프레임 0,1 = 아래, 2,3 = 위
    this.anims.create({
      key: 'raptan_idle_down',
      frames: [{ key: 'raptan', frame: Math.random() < 0.5 ? 0 : 1 }],
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: 'raptan_walk_down',
      frames: this.anims.generateFrameNumbers('raptan', { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: 'raptan_walk_up',
      frames: this.anims.generateFrameNumbers('raptan', { start: 2, end: 3 }),
      frameRate: 4,
      repeat: -1,
    });

    const x = this.bgW * 0.15;
    const y = this.bgH * 0.65;
    this.raptanShadow = this.drawPixelShadow(x, y + 2, y - 0.1, 10);

    this.raptan = this.add.sprite(x, y, 'raptan', 0).setOrigin(0.5, 1);
    this.raptan.setScale(0.27);
    this.raptan.setDepth(y);
    this.raptan.play('raptan_idle_down');

    this.raptanLabel = this.add.text(x, y + 4, '리프탄', {
      fontSize: '10px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(y + 0.1);

    this.startRaptanMovement();

    // 리프탄 상호작용 등록
    this.interactables.push({
      name: 'raptan', emoji: '💬',
      getPos: () => ({ cx: this.raptan.x, cy: this.raptan.y }),
      range: 50,
      action: () => this.onRaptanInteract(),
    });
  }

  removeRaptan() {
    if (!this.raptanAdded) return;
    if (this.raptan) { this.raptan.destroy(); this.raptan = null; }
    if (this.raptanLabel) { this.raptanLabel.destroy(); this.raptanLabel = null; }
    if (this.raptanShadow) { this.raptanShadow.destroy(); this.raptanShadow = null; }
    if (this.raptanMoveTimer) { this.raptanMoveTimer.remove(); this.raptanMoveTimer = null; }
    this.interactables = this.interactables.filter(i => i.name !== 'raptan');
    this.raptanAdded = false;
  }

  onRaptanInteract() {
    if (this.dialogueActive) return;
    this.dialogueActive = true;
    const lines = [
      '맥시, 오늘은 어떤 하루를 보냈지?',
      '오늘 읽은 책은 어떤 내용이었는지 궁금하군.',
      '나랑 책 같이 읽기는 싫으려나...',
      '맥시, 너는 참 좋은 사람이야.',
      '나는 다시 태어나면 맥시 네 머리카락이 되고 싶어.',
    ];
    const line = lines[Math.floor(Math.random() * lines.length)];
    this.showDialogue('리프탄', line, () => this.endDialogue());
  }

  startRaptanMovement() {
    const raptan = this.raptan;
    const label = this.raptanLabel;
    const baseY = this.bgH * 0.65;
    const range = this.bgH * 0.08; // 위아래 이동 범위

    const doMove = () => {
      if (!raptan || !raptan.active) return;

      // 70% 확률로 아래, 30% 확률로 위
      const goDown = Math.random() < 0.7;
      const targetY = goDown
        ? baseY + Phaser.Math.Between(0, Math.round(range))
        : baseY - Phaser.Math.Between(0, Math.round(range * 0.5));

      const distance = Math.abs(targetY - raptan.y);
      const duration = (distance / 20) * 1000;

      raptan.play(goDown ? 'raptan_walk_down' : 'raptan_walk_up', true);

      this.tweens.add({
        targets: raptan,
        y: targetY,
        duration,
        ease: 'Linear',
        onUpdate: () => {
          raptan.setDepth(raptan.y);
          if (this.raptanShadow) {
            this.raptanShadow.setPosition(raptan.x, raptan.y + 2);
            this.raptanShadow.setDepth(raptan.y - 0.1);
          }
          if (label) {
            label.setPosition(raptan.x, raptan.y + 4);
            label.setDepth(raptan.y + 0.1);
          }
        },
        onComplete: () => {
          if (!raptan || !raptan.active) return;
          raptan.play('raptan_idle_down', true);
          this.time.delayedCall(Phaser.Math.Between(3000, 7000), doMove);
        }
      });
    };

    this.time.delayedCall(2000, doMove);
  }

  // ── 수정구 클릭 → 오늘의 운세 ──
  onCrystalClick() {
    if (this.dialogueActive) return;
    this.dialogueActive = true;

    const { width, height } = this.scale;
    const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];

    this.clearDialogueUI();
    this.dialogueContainer = this.add.container(0, 0).setDepth(1000);

    // 어두운 오버레이
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.5);
    overlay.fillRect(0, 0, width, height);
    this.dialogueContainer.add(overlay);

    // 운세 카드
    // 배경 이미지 비율 (2048:1075) 유지
    const imgRatio = 2048 / 1075;
    let cardW = width * 0.85;
    let cardH = cardW / imgRatio;
    if (cardH > height * 0.75) {
      cardH = height * 0.75;
      cardW = cardH * imgRatio;
    }
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;

    // 테마별 운세 배경 이미지
    const theme = this.roomConfig?.theme || 'sangsuri';
    const fortuneBgKey = `fortune_bg_${theme}`;
    if (this.textures.exists(fortuneBgKey)) {
      const bgImg = this.add.image(width / 2, height / 2, fortuneBgKey);
      bgImg.setDisplaySize(cardW, cardH);
      bgImg.setDepth(0);
      this.dialogueContainer.add(bgImg);
    } else {
      const cardBg = this.add.graphics();
      cardBg.fillStyle(0x1a0a2e, 0.95);
      cardBg.fillRoundedRect(cardX, cardY, cardW, cardH, 14);
      cardBg.lineStyle(3, 0x8b5cf6, 1);
      cardBg.strokeRoundedRect(cardX, cardY, cardW, cardH, 14);
      this.dialogueContainer.add(cardBg);
    }

    // 제목
    const topPad = cardH * 0.15;
    const titleText = this.add.text(width / 2, cardY + topPad, '🔮 오늘의 운세', {
      fontSize: '16px', fontStyle: 'bold', color: '#c4b5fd',
    }).setOrigin(0.5, 0);
    this.dialogueContainer.add(titleText);

    // 구분선
    const line = this.add.graphics();
    line.lineStyle(1, 0x8b5cf6, 0.4);
    line.lineBetween(cardX + 20, cardY + topPad + 30, cardX + cardW - 20, cardY + topPad + 30);
    this.dialogueContainer.add(line);

    // 명대사
    const quoteY = cardY + topPad + 46;
    const quoteText = this.add.text(width / 2, quoteY, fortune.quote, {
      fontSize: '14px', fontStyle: 'italic', color: '#e9d5ff',
      wordWrap: { width: cardW - 48 }, lineSpacing: 6, align: 'center',
    }).setOrigin(0.5, 0);
    this.dialogueContainer.add(quoteText);

    // 출처
    const sourceText = this.add.text(width / 2, quoteY + quoteText.height + 10, `— ${fortune.source}`, {
      fontSize: '11px', color: '#a78bfa',
    }).setOrigin(0.5, 0);
    this.dialogueContainer.add(sourceText);

    // 구분선 2
    const line2Y = quoteY + quoteText.height + 10 + sourceText.height + 14;
    const line2 = this.add.graphics();
    line2.lineStyle(1, 0x8b5cf6, 0.3);
    line2.lineBetween(cardX + 40, line2Y, cardX + cardW - 40, line2Y);
    this.dialogueContainer.add(line2);

    // 운세 내용
    const fortuneText = this.add.text(width / 2, line2Y + 14, fortune.fortune, {
      fontSize: '13px', color: '#fde68a',
      wordWrap: { width: cardW - 48 }, lineSpacing: 6, align: 'center',
    }).setOrigin(0.5, 0);
    this.dialogueContainer.add(fortuneText);

    // 닫기 안내
    const closeText = this.add.text(width / 2, cardY + cardH - 20, '터치 / Space / ESC 로 닫기', {
      fontSize: '10px', color: '#7c7c9c',
    }).setOrigin(0.5, 1);
    this.dialogueContainer.add(closeText);

    // 클릭으로 닫기
    const clickZone = this.add.zone(width / 2, height / 2, width, height)
      .setInteractive().setDepth(1001);
    this.dialogueContainer.add(clickZone);
    clickZone.once('pointerdown', () => {
      this.endDialogue();
    });
  }

  // ── 제사상 운세 (너를 속이는 밤) ──
  onAltarFortuneClick() {
    if (this.dialogueActive) return;
    this.dialogueActive = true;

    const lines = [
      '…향이 피어오르고 있어. 무언가 알려주려는 걸까.',
      '제사상 위의 촛불이 흔들리고 있어… 점괘를 봐도 될까?',
      '오래된 기운이 느껴져. 오늘의 운세를 알려줄지도 몰라.',
    ];
    const picked = lines[Math.floor(Math.random() * lines.length)];

    this.showDialogue('제사상', picked, () => {
      this.endDialogue();
      this.time.delayedCall(200, () => {
        this.onCrystalClick();
      });
    });
  }

  // ── TV 운세 (배덕한 타인) ──
  onTvFortuneClick() {
    if (this.dialogueActive) return;
    this.dialogueActive = true;

    const lines = [
      'TV 화면에 무언가 떠오르고 있어… 오늘의 운세일까?',
      '화면이 갑자기 바뀌더니 의미심장한 문구가 나타났어.',
      '누군가 TV에 메시지를 남겨둔 것 같아…',
    ];
    const picked = lines[Math.floor(Math.random() * lines.length)];

    this.showDialogue('TV', picked, () => {
      this.endDialogue();
      this.time.delayedCall(200, () => {
        this.onCrystalClick();
      });
    });
  }

  // ── 나무 추천작품 (너를 속이는 밤) ──
  onTreeRecommendClick() {
    if (this.dialogueActive) return;
    this.dialogueActive = true;

    const lines = [
      '오래된 나무에 누군가 좋아하는 책 제목을 새겨놓았어…',
      '나무 아래 바위에 책 목록이 적혀 있어. 누가 남긴 걸까?',
      '바람에 실려 책 이야기가 들려오는 것 같아…',
    ];
    const picked = lines[Math.floor(Math.random() * lines.length)];

    this.showDialogue('나무', picked, () => {
      this.endDialogue();
      this.time.delayedCall(200, () => {
        if (this.onBookshelfClick) this.onBookshelfClick();
      });
    });
  }

  // ── 마법진 상호작용 (루스방 방문) ──
  onMagicCircleInteract() {
    if (this.dialogueActive) return;
    this.dialogueActive = true;

    // 빛 퍼져나가는 효과
    const avatar = this.myAvatar;
    if (avatar) {
      const cx = avatar.x;
      const cy = avatar.y - 30;

      // 중심 빛
      const glow = this.add.graphics().setDepth(900);
      glow.fillStyle(0xffffff, 0.6);
      glow.fillCircle(cx, cy, 5);
      glow.setAlpha(1);

      // 퍼져나가는 원 3개 (시차)
      for (let i = 0; i < 3; i++) {
        const ring = this.add.graphics().setDepth(899);
        ring.lineStyle(2, 0xc4b5fd, 0.8);
        ring.strokeCircle(0, 0, 10);
        ring.setPosition(cx, cy);
        ring.setAlpha(0);

        this.time.delayedCall(i * 200, () => {
          ring.setAlpha(1);
          this.tweens.add({
            targets: ring,
            scaleX: 12 + i * 3,
            scaleY: 12 + i * 3,
            alpha: 0,
            duration: 1200,
            ease: 'Cubic.easeOut',
            onComplete: () => ring.destroy(),
          });
        });
      }

      // 파티클 빛 입자
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const particle = this.add.graphics().setDepth(900);
        const colors = [0xc4b5fd, 0xe9d5ff, 0xfde68a, 0xffffff];
        particle.fillStyle(colors[i % colors.length], 1);
        particle.fillCircle(0, 0, 2);
        particle.setPosition(cx, cy);

        this.tweens.add({
          targets: particle,
          x: cx + Math.cos(angle) * 80,
          y: cy + Math.sin(angle) * 80,
          alpha: 0,
          duration: 800,
          delay: 100,
          ease: 'Cubic.easeOut',
          onComplete: () => particle.destroy(),
        });
      }

      // 중심 빛 페이드아웃
      this.tweens.add({
        targets: glow,
        alpha: 0,
        scaleX: 3,
        scaleY: 3,
        duration: 600,
        delay: 300,
        onComplete: () => glow.destroy(),
      });
    }

    const lines = [
      { speaker: '맥시', text: '이, 이건 루스가 연구하던 마법진이잖아...! 빛이 나고 있어!' },
      { speaker: '맥시', text: '루, 루스의 마법이 이런 거였구나... 대단해.' },
      { speaker: '맥시', text: '상수리나무 아래에서 본 문양이랑 비슷한 것 같아...' },
      { speaker: '맥시', text: '이 마법진... 루스가 밤마다 여기서 연구하는 거였구나.' },
      { speaker: '맥시', text: '따, 따뜻한 기운이 느껴져... 루스의 마법은 늘 이런 느낌이야.' },
    ];
    const picked = lines[Math.floor(Math.random() * lines.length)];

    this.time.delayedCall(500, () => {
      this.showDialogue(picked.speaker, picked.text, () => this.endDialogue());
    });
  }

  // ── 문 밖 이탈 → 마법진 소환 (상수리 방문 모드) ──
  onDoorEscapeSummon() {
    if (this.dialogueActive) return;
    this.dialogueActive = true;

    const avatar = this.myAvatar;
    const label = this.myAvatarLabel;
    if (!avatar) return;

    // 마법진 중심 좌표
    const mcCenterX = (920 + 187 / 2) * this.scaleX;
    const mcCenterY = (740 + 180 / 2) * this.scaleY;

    // 화면 암전
    const blackout = this.add.graphics().setDepth(1500);
    blackout.fillStyle(0x000000, 1);
    blackout.fillRect(0, 0, this.bgW, this.bgH);
    blackout.setAlpha(0);

    this.tweens.add({
      targets: blackout,
      alpha: 1,
      duration: 300,
      onComplete: () => {
        // 아바타를 마법진 위치로 이동
        avatar.x = mcCenterX;
        avatar.y = mcCenterY;
        avatar.setDepth(mcCenterY);
        if (label) {
          label.setPosition(avatar.x, avatar.y + 4);
          label.setDepth(mcCenterY + 0.1);
        }
        if (this.myAvatarShadow) {
          this.myAvatarShadow.setPosition(avatar.x, avatar.y + 2);
          this.myAvatarShadow.setDepth(mcCenterY - 0.1);
        }

        // 암전 해제
        this.tweens.add({
          targets: blackout,
          alpha: 0,
          duration: 400,
          delay: 200,
          onComplete: () => {
            blackout.destroy();

            // 마법진 소환 이펙트 (빛 + 파티클)
            const cx = avatar.x;
            const cy = avatar.y - 30;

            const glow = this.add.graphics().setDepth(900);
            glow.fillStyle(0xc4b5fd, 0.8);
            glow.fillCircle(cx, cy, 8);

            for (let i = 0; i < 4; i++) {
              const ring = this.add.graphics().setDepth(899);
              ring.lineStyle(3, 0xc4b5fd, 0.9);
              ring.strokeCircle(0, 0, 10);
              ring.setPosition(cx, cy);
              ring.setAlpha(0);

              this.time.delayedCall(i * 180, () => {
                ring.setAlpha(1);
                this.tweens.add({
                  targets: ring,
                  scaleX: 10 + i * 3,
                  scaleY: 10 + i * 3,
                  alpha: 0,
                  duration: 1000,
                  ease: 'Cubic.easeOut',
                  onComplete: () => ring.destroy(),
                });
              });
            }

            for (let i = 0; i < 16; i++) {
              const angle = (Math.PI * 2 * i) / 16;
              const particle = this.add.graphics().setDepth(900);
              const colors = [0xc4b5fd, 0xe9d5ff, 0xfde68a, 0xffffff];
              particle.fillStyle(colors[i % colors.length], 1);
              particle.fillCircle(0, 0, 2.5);
              particle.setPosition(cx, cy);

              this.tweens.add({
                targets: particle,
                x: cx + Math.cos(angle) * 100,
                y: cy + Math.sin(angle) * 100,
                alpha: 0,
                duration: 900,
                delay: 50,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy(),
              });
            }

            this.tweens.add({
              targets: glow,
              alpha: 0,
              scaleX: 4,
              scaleY: 4,
              duration: 700,
              delay: 200,
              onComplete: () => glow.destroy(),
            });

            // 루스 대사 (성격 반영)
            const hostName = this.roomConfig?.hostName || '루스';
            const lines = [
              '...문 밖은 위험합니다. 제가 보호 마법진으로 소환한 겁니다.',
              '어딜 가시려고요? 이 방의 결계 밖은 아직 안전하지 않아요.',
              '허락 없이 나가시면 곤란합니다. 마법진이 작동해서 다행이군요.',
              '밖에 나가면 큰일 납니다. 소환 마법진을 설치해둔 보람이 있군요.',
              '위험한 곳에 가려 하셨군요. 다행히 마법진이 제때 반응했습니다.',
            ];
            const picked = lines[Math.floor(Math.random() * lines.length)];

            this.time.delayedCall(600, () => {
              this.showDialogue(hostName, picked, () => this.endDialogue());
            });
          },
        });
      },
    });
  }

  // ── 거울 클릭 → 대화 시스템 ──
  onMirrorClick() {
    if (this.dialogueActive) return;
    this.dialogueActive = true;

    const books = ['상수리나무 아래', '배덕한 타인에게', '안개를 삼킨 나비', '메리 사이코', '너를 속이는 밤', '데페이즈망', '은행원도 용꿈을 꾸나요?', '폐하의 밤'];
    const bookName = books[Math.floor(Math.random() * books.length)];

    this.showDialogue('거울', `맥시, 오늘은 <${bookName}>을 읽어 볼래요?`, () => {
      this.showChoices([
        {
          text: '조, 좋아!',
          onSelect: () => {
            this.showDialogue('거울', '좋아요! 3회차를 읽고 오면 특별한 존재가 당신을 찾아올거에요.', () => {
              this.endDialogue();
            });
          }
        },
        {
          text: '오, 오늘은 조, 조금 피곤해서...',
          onSelect: () => {
            this.showDialogue('맥시', '오, 오늘은 조, 조금 피곤해서...', () => {
              this.showDialogue('거울', '괜찮아요! 리프탄이 당신을 자꾸 귀찮게 한다고 들었어요.', () => {
                this.showDialogue('맥시', '그, 그런 건 아, 아니지만...', () => {
                  this.endDialogue();
                });
              });
            });
          }
        }
      ]);
    });
  }

  showDialogue(speaker, text, onComplete) {
    this.clearDialogueUI();

    const { width, height } = this.scale;
    const boxW = width * 0.8;
    const boxH = 80;
    const boxX = (width - boxW) / 2;
    const boxY = height - boxH - 20;

    this.dialogueContainer = this.add.container(0, 0).setDepth(1000);

    // 배경 박스
    const bg = this.add.graphics();
    bg.fillStyle(0x3d2210, 0.92);
    bg.fillRoundedRect(boxX, boxY, boxW, boxH, 10);
    bg.lineStyle(3, 0x753F22, 1);
    bg.strokeRoundedRect(boxX, boxY, boxW, boxH, 10);
    this.dialogueContainer.add(bg);

    // 화자 이름
    const hostName = this.roomConfig?.hostName;
    const catNames = ['로라', '리프', '탄이'];
    const nameColor = speaker === '리프탄' ? '#7ec8e3'
      : speaker === '거울' ? '#c0e0ff'
      : catNames.includes(speaker) ? '#f0a0c0'
      : speaker === '맥시' ? '#f0c060'
      : (hostName && speaker === hostName) ? '#a0d8a0'
      : '#f0c060';
    const nameText = this.add.text(boxX + 16, boxY + 10, speaker, {
      fontSize: '13px', fontStyle: 'bold', color: nameColor,
    });
    this.dialogueContainer.add(nameText);

    // 대사 텍스트 (타이핑 효과)
    const msgText = this.add.text(boxX + 16, boxY + 32, '', {
      fontSize: '14px', color: '#f5e6c8', wordWrap: { width: boxW - 32 }, lineSpacing: 4,
    });
    this.dialogueContainer.add(msgText);

    let i = 0;
    const interval = this.time.addEvent({
      delay: 40,
      callback: () => {
        i++;
        msgText.setText(text.slice(0, i));
        if (i >= text.length) {
          interval.remove();
          // 터치/클릭 또는 스페이스바로 다음 진행
          const clickZone = this.add.zone(width / 2, height / 2, width, height)
            .setInteractive().setDepth(1001);
          this.dialogueContainer.add(clickZone);
          let advanced = false;
          const advance = () => {
            if (advanced) return;
            advanced = true;
            if (this._dialogueSpaceHandler) {
              this.spaceKey.off('down', this._dialogueSpaceHandler);
              this.escKey.off('down', this._dialogueSpaceHandler);
              this._dialogueSpaceHandler = null;
            }
            if (onComplete) onComplete();
          };
          clickZone.once('pointerdown', advance);
          this._dialogueSpaceHandler = advance;
          this.spaceKey.on('down', advance);
          this.escKey.on('down', advance);
        }
      },
      loop: true,
    });
  }

  showChoices(choices) {
    this.clearDialogueUI();

    const { width, height } = this.scale;
    const boxW = width * 0.6;
    const btnH = 40;
    const gap = 10;
    const totalH = choices.length * btnH + (choices.length - 1) * gap + 24;
    const boxX = (width - boxW) / 2;
    const boxY = height - totalH - 30;

    this.dialogueContainer = this.add.container(0, 0).setDepth(1000);

    // 배경
    const bg = this.add.graphics();
    bg.fillStyle(0x3d2210, 0.92);
    bg.fillRoundedRect(boxX, boxY, boxW, totalH, 10);
    bg.lineStyle(3, 0x753F22, 1);
    bg.strokeRoundedRect(boxX, boxY, boxW, totalH, 10);
    this.dialogueContainer.add(bg);

    let selectedIdx = 0;
    const btnBgs = [];
    const btnTexts = [];

    const drawBtn = (idx, highlighted) => {
      const btnBg = btnBgs[idx];
      const bY = boxY + 12 + idx * (btnH + gap);
      btnBg.clear();
      if (highlighted) {
        btnBg.fillStyle(0x7a4e28, 1);
        btnBg.fillRoundedRect(boxX + 12, bY, boxW - 24, btnH, 6);
        btnBg.lineStyle(2, 0xf0c060, 1);
        btnBg.strokeRoundedRect(boxX + 12, bY, boxW - 24, btnH, 6);
      } else {
        btnBg.fillStyle(0x5c3018, 1);
        btnBg.fillRoundedRect(boxX + 12, bY, boxW - 24, btnH, 6);
        btnBg.lineStyle(2, 0x7a4e28, 1);
        btnBg.strokeRoundedRect(boxX + 12, bY, boxW - 24, btnH, 6);
      }
    };

    const updateSelection = (newIdx) => {
      drawBtn(selectedIdx, false);
      selectedIdx = newIdx;
      drawBtn(selectedIdx, true);
    };

    choices.forEach((choice, idx) => {
      const bY = boxY + 12 + idx * (btnH + gap);
      const btnBg = this.add.graphics();
      btnBgs.push(btnBg);
      this.dialogueContainer.add(btnBg);

      const btnText = this.add.text(boxX + boxW / 2, bY + btnH / 2, choice.text, {
        fontSize: '13px', color: '#f5e6c8',
      }).setOrigin(0.5).setDepth(1001);
      btnTexts.push(btnText);
      this.dialogueContainer.add(btnText);

      const btnZone = this.add.zone(boxX + boxW / 2, bY + btnH / 2, boxW - 24, btnH)
        .setInteractive({ useHandCursor: true }).setDepth(1002);
      this.dialogueContainer.add(btnZone);

      btnZone.on('pointerover', () => updateSelection(idx));
      btnZone.on('pointerdown', () => {
        this._removeChoiceKeys();
        choice.onSelect();
      });
    });

    // 초기 선택 표시
    drawBtn(0, true);
    for (let j = 1; j < choices.length; j++) drawBtn(j, false);

    // 키보드: 위/아래로 선택, 스페이스/엔터로 확정
    const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    const downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    const wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    const onUp = () => updateSelection((selectedIdx - 1 + choices.length) % choices.length);
    const onDown = () => updateSelection((selectedIdx + 1) % choices.length);
    const onConfirm = () => {
      this._removeChoiceKeys();
      choices[selectedIdx].onSelect();
    };

    upKey.on('down', onUp);
    wKey.on('down', onUp);
    downKey.on('down', onDown);
    sKey.on('down', onDown);
    this.spaceKey.on('down', onConfirm);
    enterKey.on('down', onConfirm);

    this._removeChoiceKeys = () => {
      upKey.off('down', onUp);
      wKey.off('down', onUp);
      downKey.off('down', onDown);
      sKey.off('down', onDown);
      this.spaceKey.off('down', onConfirm);
      enterKey.off('down', onConfirm);
      this._removeChoiceKeys = null;
    };
  }

  clearDialogueUI() {
    if (this._dialogueSpaceHandler) {
      this.spaceKey.off('down', this._dialogueSpaceHandler);
      this.escKey.off('down', this._dialogueSpaceHandler);
      this._dialogueSpaceHandler = null;
    }
    if (this._removeChoiceKeys) {
      this._removeChoiceKeys();
    }
    if (this.dialogueContainer) {
      this.dialogueContainer.destroy();
      this.dialogueContainer = null;
    }
  }

  endDialogue() {
    this.clearDialogueUI();
    // 짧은 쿨다운으로 스페이스바 재트리거 방지
    this.interactCooldown = true;
    this.time.delayedCall(300, () => {
      this.dialogueActive = false;
      this.interactCooldown = false;
    });
  }

  drawPixelShadow(x, y, depth, size) {
    const shadow = this.add.graphics().setDepth(depth);
    const px = 2;
    const s = size || 8;
    shadow.fillStyle(0x000000, 0.2);
    // 원점 기준으로 그리기 (setPosition으로 이동 가능)
    shadow.fillRect(-px * s / 2, 0, px * s, px);
    shadow.fillRect(-px * (s / 2 - 1), -px, px * (s - 2), px);
    shadow.fillRect(-px * (s / 2 - 1), px, px * (s - 2), px);
    shadow.fillRect(-px * (s / 2 - 2), -px * 2, px * (s - 4), px);
    shadow.fillRect(-px * (s / 2 - 2), px * 2, px * (s - 4), px);
    shadow.setPosition(x, y);
    return shadow;
  }

  setAction(action) {
    if (this.currentAction !== action) {
      this.currentAction = action;
      if (this.onActionChange) this.onActionChange(action);
    }
  }

  update() {
    this.updateGreetingBubbles();
    if (!this.myAvatar) return;

    // 대화 중이거나 모달이 열려있으면 이동 차단
    if (this.dialogueActive || this.modalActive) return;

    const avatar = this.myAvatar;
    const label = this.myAvatarLabel;
    const charKey = this.ownerCharKey || 'maxy';

    const up    = this.cursors.up.isDown    || this.wasd.up.isDown;
    const down  = this.cursors.down.isDown  || this.wasd.down.isDown;
    const left  = this.cursors.left.isDown  || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;

    let moved = false;
    let dx = 0, dy = 0;

    // 상하좌우 중 하나만 처리 (우선순위: 상하 > 좌우)
    let newDir = this.lastDir;
    if (up) {
      dy = -STEP;
      newDir = 'up';
    } else if (down) {
      dy = STEP;
      newDir = 'down';
    } else if (left) {
      dx = -STEP;
      newDir = 'left';
    } else if (right) {
      dx = STEP;
      newDir = 'right';
    }

    if (dx !== 0 || dy !== 0) {
      // 방향이 바뀐 첫 프레임은 이동 없이 방향만 전환
      if (newDir !== this.lastDir) {
        this.lastDir = newDir;
        avatar.play(`${charKey}_walk_${this.lastDir}`, true);
      } else {
        const nextX = avatar.x + dx;
        const nextY = avatar.y + dy;

        if (!this.isBlocked(nextX, nextY - 15)) {
          avatar.x = nextX;
          avatar.y = nextY;
          moved = true;

          // 방문 모드 상수리방: 문 밖으로 나가면 마법진으로 소환
          if (this.mode === 'visitor' && this._theme === 'sangsuri') {
            const rawY = nextY / this.scaleY;
            if (rawY > 1300) {
              this.onDoorEscapeSummon();
              return;
            }
          }
        }

        avatar.play(`${charKey}_walk_${this.lastDir}`, true);
        avatar.setDepth(avatar.y);
        if (label) {
          label.setPosition(avatar.x, avatar.y + 4);
          label.setDepth(avatar.y + 0.1);
        }
        if (this.myAvatarShadow) {
          this.myAvatarShadow.setPosition(avatar.x, avatar.y + 2);
          this.myAvatarShadow.setDepth(avatar.y - 0.1);
        }
        if (this.onAvatarMove) this.onAvatarMove({ x: avatar.x, y: avatar.y });
      }
    }

    // 키를 떼면 idle
    if (!moved && !up && !down && !left && !right) {
      const idleAnim = `${charKey}_idle_${this.lastDir}`;
      if (avatar.anims.currentAnim?.key !== idleAnim) {
        avatar.play(idleAnim, true);
      }
    }

    // ── 상호작용 감지 ──
    this.checkInteraction(avatar);
  }

  checkInteraction(avatar) {
    if (this.dialogueActive || this.modalActive || this.interactCooldown) {
      this.hideInteractHint();
      return;
    }

    // 아바타 앞 방향 기준 감지 포인트
    const dir = this.lastDir;
    let checkX = avatar.x;
    let checkY = avatar.y;
    const reach = 30;
    if (dir === 'up') checkY -= reach;
    else if (dir === 'down') checkY += reach;
    else if (dir === 'left') checkX -= reach;
    else if (dir === 'right') checkX += reach;

    let closest = null;
    let closestDist = Infinity;

    for (const obj of this.interactables) {
      // owner 모드에서 테마 미적용 시 책장과 문만 상호작용 가능
      if (this.mode === 'owner' && !this.themeApplied && obj.name !== 'bookshelf' && obj.name !== 'door') continue;
      // 수정구는 추가되었을 때만 상호작용 가능
      if (obj.name === 'crystal' && !this.crystalAdded) continue;

      let cx, cy;
      if (obj.getPos) {
        const pos = obj.getPos();
        cx = pos.cx;
        cy = pos.cy;
      } else {
        cx = obj.cx;
        cy = obj.cy;
      }
      const dist = Math.sqrt((checkX - cx) ** 2 + (checkY - cy) ** 2);
      if (dist < obj.range && dist < closestDist) {
        closest = obj;
        closestDist = dist;
      }
    }

    if (closest) {
      if (this.interactTarget !== closest) {
        this.interactTarget = closest;
        this.showInteractHint(avatar, closest.emoji);
      }
      // 스페이스바 처리
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.hideInteractHint();
        this.interactTarget = null;
        closest.action();
      }
    } else {
      if (this.interactTarget) {
        this.interactTarget = null;
        this.hideInteractHint();
      }
    }
  }

  showInteractHint(avatar, emoji) {
    this.hideInteractHint();

    const bw = 52;
    const bh = 42;
    const r = 18;
    const tailH = 10;
    const offsetY = 95;

    const bubble = this.add.graphics().setDepth(20);
    bubble.fillStyle(0xffffff, 0.92);
    bubble.fillRoundedRect(-bw / 2, -bh - tailH - 2, bw, bh, r);
    bubble.fillTriangle(0, -2, -8, -tailH - 2, 8, -tailH - 2);
    bubble.setPosition(avatar.x, avatar.y - offsetY);

    const emojiText = this.add.text(avatar.x, avatar.y - offsetY - tailH - bh / 2 - 1, emoji, {
      fontSize: '14px',
      padding: { top: 4, bottom: 4 },
    }).setOrigin(0.5).setDepth(21);

    // SPACE 안내 텍스트
    const spaceHint = this.add.text(avatar.x, avatar.y - offsetY + 8, 'SPACE', {
      fontSize: '7px', color: '#888', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(21);

    this.interactHintData = { bubble, emoji: emojiText, spaceHint, avatar, offsetY, tailH, bh };
  }

  hideInteractHint() {
    if (this.interactHintData) {
      const { bubble, emoji, spaceHint } = this.interactHintData;
      if (bubble) bubble.destroy();
      if (emoji) emoji.destroy();
      if (spaceHint) spaceHint.destroy();
      this.interactHintData = null;
    }
  }
}

export default LibraryScene;
