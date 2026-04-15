import * as Phaser from 'phaser';

// 배경 이미지 원본 크기: 2048 x 1172
// 장애물 영역 정의 (원본 픽셀 기준)
const OBSTACLE_MAPS = {
  // 상수리나무 아래 / 맥시방
  sangsuri: [
    { x: 0,    y: 0,    w: 2048, h: 520 },
    { x: 0,    y: 0,    w: 90,   h: 1172 },
    { x: 1958, y: 0,    w: 90,   h: 1172 },
    { x: 0,    y: 1050, w: 1400, h: 122 },
    { x: 1400, y: 950,  w: 648,  h: 222 },
    { x: 325,  y: 340,  w: 350,  h: 300 },  // 벽난로
    { x: 700,  y: 280,  w: 170,  h: 320 },  // 거울
    { x: 910,  y: 250,  w: 270,  h: 315 },  // 책장
    { x: 1450, y: 360,  w: 300,  h: 320 },  // 침대
    { x: 2250, y: 300,  w: 110,  h: 220 },  // 화분
    { x: 90,   y: 710,  w: 110,  h: 340 },  // 촛대
    { x: 650,  y: 650,  w: 400,  h: 170 },  // 책상
    { x: 960,  y: 585,  w: 100,  h: 125 },  // 수정구
    { x: 1170, y: 830,  w: 100,  h: 120 },  // 꽃병
    { x: 1450, y: 800,  w: 300,  h: 160 },  // 상자
    { x: 2050, y: 800,  w: 150,  h: 120 },  // 바구니
  ],
  // 너를 속이는 밤
  neosokbam: [
    { x: 0,    y: 0,    w: 2048, h: 380 },  // 상단 벽 + 지붕
    { x: 0,    y: 0,    w: 120,  h: 1172 }, // 좌측 벽
    { x: 1928, y: 0,    w: 120,  h: 1172 }, // 우측 벽
    { x: 0,    y: 1050, w: 2048, h: 122 },  // 하단 벽
    { x: 100,  y: 300,  w: 180,  h: 250 },  // 석등
    { x: 350,  y: 280,  w: 250,  h: 280 },  // 병풍/족자
    { x: 700,  y: 380,  w: 200,  h: 200 },  // 선반
    { x: 1300, y: 250,  w: 600,  h: 400 },  // 나무 + 제단 영역
    { x: 100,  y: 700,  w: 150,  h: 200 },  // 항아리 (좌하)
    { x: 300,  y: 800,  w: 100,  h: 120 },  // 양동이
    { x: 700,  y: 550,  w: 250,  h: 200 },  // 책상/의자
    { x: 1000, y: 550,  w: 350,  h: 300 },  // 제단 + 촛대
    { x: 1400, y: 700,  w: 400,  h: 250 },  // 다다미 + 병풍
  ],
  // 배덕한 타인
  betrayer: [
    { x: 0,    y: 0,    w: 2048, h: 350 },  // 상단 벽
    { x: 0,    y: 0,    w: 80,   h: 1172 }, // 좌측 벽
    { x: 1968, y: 0,    w: 80,   h: 1172 }, // 우측 벽
    { x: 0,    y: 1050, w: 2048, h: 122 },  // 하단 벽
    { x: 0,    y: 950,  w: 400,  h: 222 },  // 좌하 계단
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

// 기본 장애물 (owner 모드 / sangsuri)
const OBSTACLES = OBSTACLE_MAPS.sangsuri;

const FORTUNES = [
  { quote: '"네가 원하는 건 네가 정하는 거야."', source: '상수리나무 아래', fortune: '오늘은 결단의 날! 망설이던 일을 시작하기 좋은 운세입니다.' },
  { quote: '"사랑이란 결국, 서로를 비추는 거울이다."', source: '상수리나무 아래', fortune: '소중한 사람과의 관계가 더 깊어지는 하루가 될 거예요.' },
  { quote: '"품격이란 지키는 것이 아니라, 배반하는 것이다."', source: '품격을 배반한다', fortune: '틀을 깨는 용기가 행운을 가져다 줍니다.' },
  { quote: '"진짜 나를 감추는 것에도 한계가 있다."', source: '품격을 배반한다', fortune: '숨겨왔던 재능을 드러낼 기회가 찾아옵니다.' },
  { quote: '"안개 속에서도 나비는 날개를 펴."', source: '안개를 삼킨 나비', fortune: '불확실한 상황에서도 당신의 빛이 길을 밝힐 거예요.' },
  { quote: '"삼킨 안개가 날개가 되었다."', source: '안개를 삼킨 나비', fortune: '힘들었던 경험이 오늘 당신의 강점이 됩니다.' },
  { quote: '"미친 듯이 사랑하거나, 미친 듯이 도망치거나."', source: '메리 사이코', fortune: '강렬한 감정이 밀려오는 날. 직감을 믿으세요!' },
  { quote: '"정상인 척하는 게 제일 피곤해."', source: '메리 사이코', fortune: '오늘은 솔직해져도 괜찮은 날입니다.' },
  { quote: '"밤은 모든 것을 속이지만, 진심만은 숨기지 못해."', source: '너를 속이는 밤', fortune: '감춰진 진실이 드러나는 날. 좋은 소식이 있을 수 있어요.' },
  { quote: '"속이는 건 밤이지, 내가 아니야."', source: '너를 속이는 밤', fortune: '오해가 풀리고 관계가 회복되는 운세입니다.' },
  { quote: '"현실이 초현실이 되는 순간."', source: '데페이즈망', fortune: '예상치 못한 곳에서 영감을 얻게 될 거예요.' },
  { quote: '"익숙한 것을 낯설게 볼 때, 비로소 보이는 것이 있다."', source: '데페이즈망', fortune: '새로운 시각으로 문제를 바라보면 해답이 보입니다.' },
  { quote: '"도망치는 것도 용기다."', source: '남편에게 쫓기고 있습니다', fortune: '지금은 물러서는 것이 현명한 선택일 수 있어요.' },
  { quote: '"쫓기면서도 웃을 수 있다면, 이미 이긴 거야."', source: '남편에게 쫓기고 있습니다', fortune: '어려운 상황에서도 유머를 잃지 마세요. 행운이 따릅니다.' },
  { quote: '"오월의 정원에는 비밀이 피어난다."', source: '오월의 정원에서', fortune: '새로운 시작과 성장의 기운이 가득한 날입니다.' },
  { quote: '"폐하의 밤은 영원히 끝나지 않는다."', source: '폐하의 밤', fortune: '인내가 곧 보상으로 돌아옵니다. 조금만 더 버텨보세요.' },
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
    this.currentAction = 'idle';
    this.lastDir = 'down';
  }

  preload() {
    const bg = this.roomConfig?.background || '/assets/backgrounds/maxy_room_x.webp';
    this.load.image('background', bg);
    this.load.image('bg_maxy_room', '/assets/backgrounds/maxy_room.webp');

    // 맥시 모션 개별 이미지 (owner 아바타)
    const maxyDir = '/assets/maxy_motion';
    ['F1','F2','B1','B2','L1','L2','L3','L4','R1','R2','R3','R4'].forEach(name => {
      this.load.image(`maxy_${name}`, `${maxyDir}/CM_${name}.png`);
    });

    // 고양이
    this.load.image('cat_white', '/assets/pets/cat_white.png');
    this.load.image('cat_black', '/assets/pets/cat_black.png');
    this.load.image('cat_gray',  '/assets/pets/cat_gray.png');

    // 라프탄
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
    this.scaleY = height / 1172;

    // 배경
    this.bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.bg.setDisplaySize(width, height);
    this.bg.setDepth(-10);

    // 장애물 물리 그룹 생성
    this.obstacleGroup = this.physics.add.staticGroup();

    // 테마에 맞는 장애물 맵 선택
    const theme = this.roomConfig?.theme || 'sangsuri';
    this.currentObstacles = OBSTACLE_MAPS[theme] || OBSTACLE_MAPS.sangsuri;

    // 장애물 영역 (디버그 표시 비활성화, 충돌 영역은 유지)
    // const debugGfx = this.add.graphics().setDepth(999);

    this.currentObstacles.forEach(({ x, y, w, h }) => {
      const rx = x * this.scaleX;
      const ry = y * this.scaleY;
      const rw = w * this.scaleX;
      const rh = h * this.scaleY;
      const zone = this.add.zone(rx + rw / 2, ry + rh / 2, rw, rh);
      this.physics.add.existing(zone, true);
      this.obstacleGroup.add(zone);

      // [디버그] 주석 해제하면 장애물 시각화
      // debugGfx.lineStyle(1, 0xff0000, 0.8);
      // debugGfx.fillStyle(0xff0000, 0.25);
      // debugGfx.fillRect(rx, ry, rw, rh);
      // debugGfx.strokeRect(rx, ry, rw, rh);
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

    // 거울 클릭 영역 (owner/sangsuri만)
    const mirrorObs = this.currentObstacles[6]; // 거울
    if (mirrorObs) {
      const mx = mirrorObs.x * this.scaleX;
      const my = mirrorObs.y * this.scaleY;
      const mw = mirrorObs.w * this.scaleX;
      const mh = mirrorObs.h * this.scaleY;
      this.mirrorZone = this.add.zone(mx + mw / 2, my + mh / 2, mw, mh)
        .setInteractive({ useHandCursor: true })
        .setDepth(50);
      this.mirrorZone.on('pointerdown', () => this.onMirrorClick());
    }

    // 책장 클릭 영역 (owner/sangsuri만)
    const bookshelfObs = this.currentObstacles[7]; // 책장
    if (bookshelfObs) {
      const bx = bookshelfObs.x * this.scaleX;
      const by = bookshelfObs.y * this.scaleY;
      const bw = bookshelfObs.w * this.scaleX;
      const bh = bookshelfObs.h * this.scaleY;
      this.bookshelfZone = this.add.zone(bx + bw / 2, by + bh / 2, bw, bh)
        .setInteractive({ useHandCursor: true })
        .setDepth(50);
      this.bookshelfZone.on('pointerdown', () => {
        if (this.onBookshelfClick) this.onBookshelfClick();
      });
    }

    // 수정구 클릭 영역 (owner/sangsuri만)
    const crystalObs = this.currentObstacles[12]; // 수정구
    if (crystalObs) {
      const cx = crystalObs.x * this.scaleX;
      const cy = crystalObs.y * this.scaleY;
      const cw = crystalObs.w * this.scaleX;
      const ch = crystalObs.h * this.scaleY;
      this.crystalZone = this.add.zone(cx + cw / 2, cy + ch / 2, cw, ch)
        .setInteractive({ useHandCursor: true })
        .setDepth(50);
      this.crystalZone.on('pointerdown', () => this.onCrystalClick());
    }

    // 대화 시스템 초기화
    this.dialogueActive = false;
    this.dialogueContainer = null;

    if (this.mode === 'owner') {
      this.createOwnerMode();
    } else {
      this.createVisitorMode();
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
      [
        { key: `${hc}_walk_down`,  start: 0, end: 1 },
        { key: `${hc}_walk_up`,    start: 2, end: 3 },
        { key: `${hc}_walk_right`, start: 4, end: 5 },
        { key: `${hc}_walk_left`,  start: 6, end: 7 },
        { key: `${hc}_idle_down`,  start: 0, end: 0 },
        { key: `${hc}_idle_up`,    start: 2, end: 2 },
        { key: `${hc}_idle_right`, start: 4, end: 4 },
        { key: `${hc}_idle_left`,  start: 6, end: 6 },
        { key: `${hc}_idle`,       start: 0, end: 0 },
      ].forEach(({ key, start, end }) => {
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers(hc, { start, end }),
          frameRate: start !== end ? 6 : 1,
          repeat: -1,
        });
      });
    }
  }

  // 특정 위치가 장애물과 겹치는지 확인
  isBlocked(x, y, margin = 10) {
    const obstacles = this.currentObstacles || OBSTACLES;
    for (const { x: ox, y: oy, w, h } of obstacles) {
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

    if (useCustomHost) {
      const spriteH = this.roomConfig.spriteHeight || 571;
      const hostScale = (98 / spriteH);  // 맥시 표시높이(98px) 기준
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

    // 방문자 (맥시)
    this.visitorAvatar = this.add.sprite(this.bgW * 0.65, avatarY, 'maxy_F1').setOrigin(0.5, 1);
    this.visitorAvatar.setScale(0.15);
    this.visitorAvatar.play('maxy_idle_down');
    this.visitorAvatar.setDepth(avatarY);

    this.visitorAvatarLabel = this.add.text(this.visitorAvatar.x, avatarY + 4, '맥시', {
      fontSize: '10px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(avatarY + 0.1);

    this.hostCharKey = hostCharKey;
    this.startAutoMovement(this.hostAvatar, hostCharKey);
    this.showGreetingBubble(this.hostAvatar);
  }

  showGreetingBubble(avatar) {
    const bw = 64;
    const bh = 52;
    const r  = 22;   // 더 둥글게
    const tailH = 12; // 꼬리 높이
    const offsetY = 95; // 아바타 머리 위 거리

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
      fontSize: '26px'
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

  updateGreetingBubbles() {
    ['greetingBubble_my', 'greetingBubble_host'].forEach(key => {
      const data = this[key];
      if (!data) return;
      const { bubble, emoji, avatar, offsetY, tailH, bh } = data;
      if (!avatar || !avatar.active) return;
      bubble.setPosition(avatar.x, avatar.y - offsetY);
      emoji.setPosition(avatar.x, avatar.y - offsetY - tailH - bh / 2);
    });
  }

  startAutoMovement(avatar, charKey) {
    const baseX = avatar.x;
    const baseY = avatar.y;
    const rangeX = this.bgW * 0.12;
    const rangeY = this.bgH * 0.08;
    const isCustom = (avatar === this.hostAvatar && this.textures.exists('host_custom'));

    const doMove = () => {
      if (!avatar || !avatar.active) return;

      // 상하좌우 중 하나만 이동
      const dirs = ['up', 'down', 'left', 'right'];
      const dir = dirs[Math.floor(Math.random() * dirs.length)];

      let targetX = avatar.x;
      let targetY = avatar.y;
      const moveAmount = Phaser.Math.Between(20, 60);

      if (dir === 'up') targetY = Math.max(baseY - rangeY, avatar.y - moveAmount);
      else if (dir === 'down') targetY = Math.min(baseY + rangeY, avatar.y + moveAmount);
      else if (dir === 'left') targetX = Math.max(baseX - rangeX, avatar.x - moveAmount);
      else if (dir === 'right') targetX = Math.min(baseX + rangeX, avatar.x + moveAmount);

      // 장애물 체크 — 막혀있으면 이동 취소하고 재시도
      if (this.isBlocked(targetX, targetY - 15)) {
        this.time.delayedCall(Phaser.Math.Between(1000, 3000), doMove);
        return;
      }

      const distance = Math.abs(targetX - avatar.x) + Math.abs(targetY - avatar.y);
      const duration = (distance / 20) * 1000;

      avatar.play(`${charKey}_walk_${dir}`, true);

      this.tweens.add({
        targets: avatar,
        x: targetX,
        y: targetY,
        duration,
        ease: 'Linear',
        onUpdate: () => {
          const label = avatar === this.hostAvatar ? this.hostAvatarLabel : this.visitorAvatarLabel;
          if (label) {
            label.setPosition(avatar.x, avatar.y + (isCustom ? 4 : 22));
            label.setDepth(avatar.y + 0.1);
          }
          avatar.setDepth(avatar.y);
        },
        onComplete: () => {
          if (!avatar || !avatar.active) return;
          avatar.play(`${charKey}_idle_down`, true);
          this.time.delayedCall(Phaser.Math.Between(3000, 7000), doMove);
        }
      });
    };

    this.time.delayedCall(2000, doMove);
  }

  changeBackground(textureKey) {
    if (!this.bg) return;
    if (this.textures.exists(textureKey)) {
      this.bg.setTexture(textureKey);
      this.bg.setDisplaySize(this.bgW, this.bgH);
    }
  }

  addCats() {
    if (this.catsAdded) return;
    this.catsAdded = true;
    this.catClicksRemaining = 2; // 2회 포인트 획득 가능

    const catKeys = ['cat_white', 'cat_black', 'cat_gray'];

    catKeys.forEach((key, i) => {
      const x = this.bgW * (0.3 + i * 0.2);
      const y = this.bgH * 0.75;
      const cat = this.add.sprite(x, y, key).setOrigin(0.5, 1);
      cat.setScale(0.4);
      cat.setDepth(y);
      cat.setInteractive({ useHandCursor: true });
      cat.on('pointerdown', () => this.onCatClick());
    });
  }

  onCatClick() {
    if (this.dialogueActive) return;
    this.dialogueActive = true;

    if (this.catClicksRemaining > 0) {
      const points = Phaser.Math.Between(1, 10);
      this.catClicksRemaining--;

      this.showDialogue('로라', '그르릉..', () => {
        this.showDialogue('맥시', `로라의 기분이 좋아요. ${points} 포인트를 물어왔어요!`, () => {
          this.endDialogue();
        });
      });
    } else {
      this.showDialogue('로라', 'zZz..', () => {
        this.showDialogue('맥시', '오늘은 로라가 졸린 것 같아요.', () => {
          this.endDialogue();
        });
      });
    }
  }

  addRaptan() {
    if (this.raptanAdded) return;
    this.raptanAdded = true;

    // 라프탄 애니메이션: 프레임 0,1 = 아래, 2,3 = 위
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
    this.raptan = this.add.sprite(x, y, 'raptan', 0).setOrigin(0.5, 1);
    this.raptan.setScale(0.27);
    this.raptan.setDepth(y);
    this.raptan.play('raptan_idle_down');

    this.raptanLabel = this.add.text(x, y + 4, '라프탄', {
      fontSize: '10px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(y + 0.1);

    this.startRaptanMovement();
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
    const cardW = width * 0.75;
    const cardH = height * 0.55;
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;

    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x1a0a2e, 0.95);
    cardBg.fillRoundedRect(cardX, cardY, cardW, cardH, 14);
    cardBg.lineStyle(3, 0x8b5cf6, 1);
    cardBg.strokeRoundedRect(cardX, cardY, cardW, cardH, 14);
    this.dialogueContainer.add(cardBg);

    // 제목
    const titleText = this.add.text(width / 2, cardY + 22, '🔮 오늘의 운세', {
      fontSize: '16px', fontStyle: 'bold', color: '#c4b5fd',
    }).setOrigin(0.5, 0);
    this.dialogueContainer.add(titleText);

    // 구분선
    const line = this.add.graphics();
    line.lineStyle(1, 0x8b5cf6, 0.4);
    line.lineBetween(cardX + 20, cardY + 52, cardX + cardW - 20, cardY + 52);
    this.dialogueContainer.add(line);

    // 명대사
    const quoteText = this.add.text(width / 2, cardY + 68, fortune.quote, {
      fontSize: '14px', fontStyle: 'italic', color: '#e9d5ff',
      wordWrap: { width: cardW - 48 }, lineSpacing: 6, align: 'center',
    }).setOrigin(0.5, 0);
    this.dialogueContainer.add(quoteText);

    // 출처
    const sourceText = this.add.text(width / 2, cardY + 68 + quoteText.height + 10, `— ${fortune.source}`, {
      fontSize: '11px', color: '#a78bfa',
    }).setOrigin(0.5, 0);
    this.dialogueContainer.add(sourceText);

    // 구분선 2
    const line2Y = cardY + 68 + quoteText.height + 10 + sourceText.height + 14;
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
    const closeText = this.add.text(width / 2, cardY + cardH - 20, '화면을 터치하면 닫힙니다', {
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

  // ── 거울 클릭 → 대화 시스템 ──
  onMirrorClick() {
    if (this.dialogueActive) return;
    this.dialogueActive = true;

    const books = ['상수리나무 아래', '품격을 배반한다', '안개를 삼킨 나비', '메리 사이코', '너를 속이는 밤', '데페이즈망'];
    const bookName = books[Math.floor(Math.random() * books.length)];

    this.showDialogue('거울', `맥시, 오늘은 <${bookName}>을 읽어 볼래요?`, () => {
      this.showChoices([
        {
          text: '조, 좋아!',
          onSelect: () => {
            this.showDialogue('맥시', '조, 좋아!', () => {
              this.showDialogue('거울', '좋아요! 3회차를 읽고 오면 특별한 존재가 당신을 찾아올거에요.', () => {
                this.endDialogue();
              });
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
    const nameColor = speaker === '라프탄' ? '#7ec8e3' : speaker === '거울' ? '#c0e0ff' : speaker === '로라' ? '#f0a0c0' : '#f0c060';
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
          // 터치/클릭으로 다음 진행
          const clickZone = this.add.zone(width / 2, height / 2, width, height)
            .setInteractive().setDepth(1001);
          this.dialogueContainer.add(clickZone);
          clickZone.once('pointerdown', () => {
            if (onComplete) onComplete();
          });
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

    choices.forEach((choice, idx) => {
      const btnY = boxY + 12 + idx * (btnH + gap);
      const btnBg = this.add.graphics();
      btnBg.fillStyle(0x5c3018, 1);
      btnBg.fillRoundedRect(boxX + 12, btnY, boxW - 24, btnH, 6);
      btnBg.lineStyle(2, 0x7a4e28, 1);
      btnBg.strokeRoundedRect(boxX + 12, btnY, boxW - 24, btnH, 6);
      this.dialogueContainer.add(btnBg);

      const btnText = this.add.text(boxX + boxW / 2, btnY + btnH / 2, choice.text, {
        fontSize: '13px', color: '#f5e6c8',
      }).setOrigin(0.5).setDepth(1001);
      this.dialogueContainer.add(btnText);

      const btnZone = this.add.zone(boxX + boxW / 2, btnY + btnH / 2, boxW - 24, btnH)
        .setInteractive({ useHandCursor: true }).setDepth(1002);
      this.dialogueContainer.add(btnZone);

      btnZone.on('pointerover', () => {
        btnBg.clear();
        btnBg.fillStyle(0x7a4e28, 1);
        btnBg.fillRoundedRect(boxX + 12, btnY, boxW - 24, btnH, 6);
        btnBg.lineStyle(2, 0xf0c060, 1);
        btnBg.strokeRoundedRect(boxX + 12, btnY, boxW - 24, btnH, 6);
      });
      btnZone.on('pointerout', () => {
        btnBg.clear();
        btnBg.fillStyle(0x5c3018, 1);
        btnBg.fillRoundedRect(boxX + 12, btnY, boxW - 24, btnH, 6);
        btnBg.lineStyle(2, 0x7a4e28, 1);
        btnBg.strokeRoundedRect(boxX + 12, btnY, boxW - 24, btnH, 6);
      });
      btnZone.on('pointerdown', () => {
        choice.onSelect();
      });
    });
  }

  clearDialogueUI() {
    if (this.dialogueContainer) {
      this.dialogueContainer.destroy();
      this.dialogueContainer = null;
    }
  }

  endDialogue() {
    this.clearDialogueUI();
    this.dialogueActive = false;
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
        }

        avatar.play(`${charKey}_walk_${this.lastDir}`, true);
        avatar.setDepth(avatar.y);
        if (label) {
          label.setPosition(avatar.x, avatar.y + 4);
          label.setDepth(avatar.y + 0.1);
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
  }
}

export default LibraryScene;
