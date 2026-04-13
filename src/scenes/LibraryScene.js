import * as Phaser from 'phaser';

// 배경 이미지 원본 크기: 746 x 420
// 장애물 영역 정의 (원본 픽셀 기준)
const OBSTACLES = [
  // 상단 벽 전체
  { x: 0,   y: 0,   w: 746, h: 150 },
  // 좌측 벽
  { x: 0,   y: 0,   w: 50,  h: 420 },
  // 우측 벽
  { x: 696, y: 0,   w: 50,  h: 420 },
  // 하단 벽 (좌측 - 문 왼쪽)
  { x: 0,   y: 360, w: 160, h: 60  },
  // 하단 벽 (우측 - 문 오른쪽)
  { x: 220, y: 360, w: 526, h: 60  },
  // 하단 벽 문 구간 (기존 높이 유지)
  { x: 160, y: 390, w: 60,  h: 30  },
  // 벽난로 (좌측)
  { x: 140, y: 70,  w: 110, h: 130 },
  // 러그 위 테이블/촛대
  { x: 50,  y: 180, w: 40,  h: 130 },
  // 책장 상단 중앙
  { x: 290, y: 100, w: 130, h: 90  },
  // 책장 우측
  { x: 505, y: 100, w: 190, h: 90  },
  // 중앙 책상
  { x: 375, y: 230, w: 165, h: 60  },
  // 의자 등받이 (위쪽만 막음, 아래 앉는 자리는 통과 가능)
  { x: 550, y: 200, w: 60,  h: 45  },
  // 화분 좌측 하단
  { x: 45,  y: 300, w: 60,  h: 60  },
  // 화분 우측 하단
  { x: 630, y: 260, w: 60,  h: 90  },
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
    this.currentAction = 'idle';
    this.lastDir = 'down';
  }

  preload() {
    const bg = this.roomConfig?.background || '/assets/backgrounds/background_1.png';
    this.load.image('background', bg);
    this.load.spritesheet('character_05', '/assets/characters/Premade_Character_48x48_05.png', {
      frameWidth: 48, frameHeight: 96
    });
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
    this.scaleX = width / 746;
    this.scaleY = height / 420;

    // 배경
    this.bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.bg.setDisplaySize(width, height);
    this.bg.setDepth(-10);

    // 장애물 물리 그룹 생성
    this.obstacleGroup = this.physics.add.staticGroup();

    // [디버그] 장애물 영역을 빨간 반투명 사각형으로 시각화
    // 장애물 위치 조정이 필요할 때 아래 두 블록의 주석을 해제하고 확인 후 다시 주석처리
    // const debugGfx = this.add.graphics().setDepth(999);

    OBSTACLES.forEach(({ x, y, w, h }) => {
      const rx = x * this.scaleX;
      const ry = y * this.scaleY;
      const rw = w * this.scaleX;
      const rh = h * this.scaleY;
      const zone = this.add.zone(rx + rw / 2, ry + rh / 2, rw, rh);
      this.physics.add.existing(zone, true);
      this.obstacleGroup.add(zone);

      // [디버그] 장애물 시각적 표시 — 위의 debugGfx 선언도 함께 해제 필요
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

    if (this.mode === 'owner') {
      this.createOwnerMode();
    } else {
      this.createVisitorMode();
    }
  }

  createAnimations() {
    const characters = ['character_05', 'character_08', 'character_12'];
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
  }

  // 특정 위치가 장애물과 겹치는지 확인
  isBlocked(x, y, margin = 10) {
    for (const { x: ox, y: oy, w, h } of OBSTACLES) {
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

    this.myAvatar = this.add.sprite(startX, startY, 'character_05').setOrigin(0.5);
    this.myAvatar.setScale(0.75);
    this.myAvatar.play('character_05_idle_down');
    this.myAvatar.setDepth(5);

    this.showGreetingBubble(this.myAvatar);

    this.myAvatarLabel = this.add.text(startX, startY + 56, '맥시', {
      fontSize: '10px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(10);
  }

  createVisitorMode() {
    const avatarY = this.bgH * 0.78;

    this.hostAvatar = this.add.sprite(this.bgW * 0.35, avatarY, 'character_08').setOrigin(0.5);
    this.hostAvatar.setScale(0.75);
    this.hostAvatar.play('character_08_idle_down');
    this.hostAvatar.setDepth(5);

    this.hostAvatarLabel = this.add.text(this.hostAvatar.x, this.hostAvatar.y + 56, '맥시', {
      fontSize: '10px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(10);

    this.visitorAvatar = this.add.sprite(this.bgW * 0.65, avatarY, 'character_12').setOrigin(0.5);
    this.visitorAvatar.setScale(0.75);
    this.visitorAvatar.play('character_12_idle_down');
    this.visitorAvatar.setDepth(5);

    this.visitorAvatarLabel = this.add.text(this.visitorAvatar.x, this.visitorAvatar.y + 56, '방문자', {
      fontSize: '10px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(10);

    this.startAutoMovement(this.hostAvatar, 'character_08');
    this.showGreetingBubble(this.hostAvatar);
  }

  showGreetingBubble(avatar) {
    const bw = 64;
    const bh = 52;
    const r  = 22;   // 더 둥글게
    const tailH = 12; // 꼬리 높이
    const offsetY = 25; // 아바타 머리 위 거리

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
    const minX = this.bgW * 0.05;
    const maxX = this.bgW * 0.95;
    const minY = this.bgH * 0.55;
    const maxY = this.bgH * 0.90;

    const doMove = () => {
      if (!avatar || !avatar.active) return;

      const { x: targetX, y: targetY } = this.getWalkablePoint(minX, maxX, minY, maxY);
      const dx = targetX - avatar.x;
      const dy = targetY - avatar.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const duration = (distance / SPEED) * 1000;

      let dir = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'right' : 'left')
        : (dy > 0 ? 'down' : 'up');

      avatar.play(`${charKey}_walk_${dir}`, true);

      this.tweens.add({
        targets: avatar,
        x: targetX,
        y: targetY,
        duration,
        ease: 'Linear',
        onUpdate: () => {
          const label = avatar === this.hostAvatar ? this.hostAvatarLabel : this.visitorAvatarLabel;
          if (label) label.setPosition(avatar.x, avatar.y + 22);
          avatar.setDepth(5 + avatar.y * 0.01);
        },
        onComplete: () => {
          if (!avatar || !avatar.active) return;
          avatar.play(`${charKey}_idle_${dir}`, true);
          this.time.delayedCall(Phaser.Math.Between(2000, 5000), doMove);
        }
      });
    };

    this.time.delayedCall(1000, doMove);
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
    const charKey = 'character_05';

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

        if (!this.isBlocked(nextX, nextY + 5)) {
          avatar.x = nextX;
          avatar.y = nextY;
          moved = true;
        }

        avatar.play(`${charKey}_walk_${this.lastDir}`, true);
        avatar.setDepth(5 + avatar.y * 0.01);
        if (label) label.setPosition(avatar.x, avatar.y + 22);
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
