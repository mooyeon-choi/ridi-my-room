import * as Phaser from 'phaser';

class LibraryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LibraryScene' });
  }

  init(data) {
    this.mode = data.mode; // 'owner' or 'visitor'
    this.userId = data.userId;
    this.roomConfig = data.roomConfig;
    this.aiConfig = data.aiConfig;
    this.onActionChange = data.onActionChange;
    this.onAvatarMove = data.onAvatarMove;

    this.currentAction = 'idle';
  }

  preload() {
    // 배경 이미지
    this.load.image('background', '/assets/backgrounds/background_1.png');

    // 캐릭터 스프라이트
    this.load.spritesheet('character_05', '/assets/characters/Premade_Character_48x48_05.png', {
      frameWidth: 48,
      frameHeight: 96
    });
    this.load.spritesheet('character_08', '/assets/characters/Premade_Character_48x48_08.png', {
      frameWidth: 48,
      frameHeight: 96
    });
    this.load.spritesheet('character_12', '/assets/characters/Premade_Character_48x48_12.png', {
      frameWidth: 48,
      frameHeight: 96
    });
  }

  create() {
    const { width, height } = this.scale;

    // === 배경 이미지: 캔버스에 꽉 채움 ===
    this.bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.bg.setDisplaySize(width, height);
    this.bg.setDepth(-10);

    // 배경 영역 = 캔버스 전체
    this.bgOffsetX = 0;
    this.bgOffsetY = 0;
    this.bgWidth = width;
    this.bgHeight = height;

    // 캐릭터 애니메이션 생성
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
      // 걷기 애니메이션
      this.anims.create({
        key: `${charKey}_walk_right`,
        frames: this.anims.generateFrameNumbers(charKey, { start: 112, end: 115 }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${charKey}_walk_up`,
        frames: this.anims.generateFrameNumbers(charKey, { start: 118, end: 121 }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${charKey}_walk_left`,
        frames: this.anims.generateFrameNumbers(charKey, { start: 124, end: 127 }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${charKey}_walk_down`,
        frames: this.anims.generateFrameNumbers(charKey, { start: 130, end: 133 }),
        frameRate: 8,
        repeat: -1
      });

      // Idle 애니메이션
      this.anims.create({
        key: `${charKey}_idle_right`,
        frames: this.anims.generateFrameNumbers(charKey, { start: 56, end: 61 }),
        frameRate: 6,
        repeat: -1
      });
      this.anims.create({
        key: `${charKey}_idle_up`,
        frames: this.anims.generateFrameNumbers(charKey, { start: 62, end: 67 }),
        frameRate: 6,
        repeat: -1
      });
      this.anims.create({
        key: `${charKey}_idle_left`,
        frames: this.anims.generateFrameNumbers(charKey, { start: 68, end: 73 }),
        frameRate: 6,
        repeat: -1
      });
      this.anims.create({
        key: `${charKey}_idle_down`,
        frames: this.anims.generateFrameNumbers(charKey, { start: 74, end: 79 }),
        frameRate: 6,
        repeat: -1
      });
      this.anims.create({
        key: `${charKey}_idle`,
        frames: this.anims.generateFrameNumbers(charKey, { start: 74, end: 79 }),
        frameRate: 6,
        repeat: -1
      });
    });
  }

  createOwnerMode() {
    const avatarX = this.bgOffsetX + this.bgWidth / 2;
    const avatarY = this.bgOffsetY + this.bgHeight * 0.75;

    // 내 아바타 (1/2 크기)
    this.myAvatar = this.add.sprite(avatarX, avatarY, 'character_05').setOrigin(0.5);
    this.myAvatar.setScale(0.5);
    this.myAvatar.play('character_05_idle');
    this.myAvatar.setDepth(5);

    // 이름표
    this.myAvatarLabel = this.add.text(this.myAvatar.x, this.myAvatar.y + 28, '맥시', {
      fontSize: '10px',
      color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(10);

    // 자율 이동 시작
    this.startAutoMovement(this.myAvatar, 'character_05');
  }

  createVisitorMode() {
    const avatarY = this.bgOffsetY + this.bgHeight * 0.75;

    // 주인 AI 아바타 (1/2 크기)
    this.hostAvatar = this.add.sprite(this.bgOffsetX + this.bgWidth * 0.35, avatarY, 'character_08').setOrigin(0.5);
    this.hostAvatar.setScale(0.5);
    this.hostAvatar.play('character_08_idle');
    this.hostAvatar.setDepth(5);

    this.hostAvatarLabel = this.add.text(this.hostAvatar.x, this.hostAvatar.y + 28, '맥시', {
      fontSize: '10px',
      color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(10);

    // 방문자 아바타 (1/2 크기)
    this.visitorAvatar = this.add.sprite(this.bgOffsetX + this.bgWidth * 0.65, avatarY, 'character_12').setOrigin(0.5);
    this.visitorAvatar.setScale(0.5);
    this.visitorAvatar.play('character_12_idle');
    this.visitorAvatar.setDepth(5);

    this.visitorAvatarLabel = this.add.text(this.visitorAvatar.x, this.visitorAvatar.y + 28, '방문자', {
      fontSize: '10px',
      color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(10);

    // AI 자율 이동
    this.startAutoMovement(this.hostAvatar, 'character_08');
  }

  startAutoMovement(avatar, charKey) {
    // 이동 가능 영역 (배경 내부 기준)
    const minX = this.bgOffsetX + this.bgWidth * 0.1;
    const maxX = this.bgOffsetX + this.bgWidth * 0.9;
    const minY = this.bgOffsetY + this.bgHeight * 0.5;
    const maxY = this.bgOffsetY + this.bgHeight * 0.9;

    const doMove = () => {
      if (!avatar || !avatar.active) return;

      const targetX = Phaser.Math.Between(minX, maxX);
      const targetY = Phaser.Math.Between(minY, maxY);
      const dx = targetX - avatar.x;
      const dy = targetY - avatar.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 40;
      const duration = (distance / speed) * 1000;

      // 방향 결정
      let dir;
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? 'right' : 'left';
      } else {
        dir = dy > 0 ? 'down' : 'up';
      }
      avatar.play(`${charKey}_walk_${dir}`, true);

      // 이동 트윈
      this.tweens.add({
        targets: avatar,
        x: targetX,
        y: targetY,
        duration: duration,
        ease: 'Linear',
        onUpdate: () => {
          // 이름표 위치 업데이트
          const label = avatar === this.myAvatar ? this.myAvatarLabel :
                        avatar === this.hostAvatar ? this.hostAvatarLabel :
                        this.visitorAvatarLabel;
          if (label) {
            label.setPosition(avatar.x, avatar.y + 22);
          }
          // depth 정렬 (아래에 있을수록 앞에)
          avatar.setDepth(5 + avatar.y * 0.01);

          if (this.onAvatarMove && avatar === this.myAvatar) {
            this.onAvatarMove({ x: avatar.x, y: avatar.y });
          }
        },
        onComplete: () => {
          if (!avatar || !avatar.active) return;
          avatar.play(`${charKey}_idle_${dir}`, true);

          // 액션 변경 콜백
          if (avatar === this.myAvatar && this.onActionChange) {
            const actions = ['idle', 'reading', 'organizing', 'lookingWindow'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            this.setAction(randomAction);
          }

          // 다음 이동 (2~5초 후)
          this.time.delayedCall(Phaser.Math.Between(2000, 5000), doMove);
        }
      });
    };

    // 첫 이동 시작 (1초 후)
    this.time.delayedCall(1000, doMove);
  }

  setAction(action) {
    if (this.currentAction !== action) {
      this.currentAction = action;
      if (this.onActionChange) {
        this.onActionChange(action);
      }
    }
  }

  update() {
    // 자율 이동 방식이므로 별도 update 로직 불필요
  }
}

export default LibraryScene;
