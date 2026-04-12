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
    // === 16x16 바닥/벽 타일셋 ===
    this.load.spritesheet('floor_tiles', '/assets/interiors/Room_Builder_Floors_16x16.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('wall_tiles', '/assets/interiors/Room_Builder_Walls_16x16.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    // === 48x48 타일맵 에셋 (스프라이트시트) ===
    this.load.spritesheet('room_builder', '/assets/interiors/Room_Builder_48x48.png', {
      frameWidth: 48,
      frameHeight: 48
    });

    // 인테리어 메인 타일셋 (모든 가구 포함 - 48x48)
    this.load.spritesheet('interiors', '/assets/interiors/Interiors_48x48.png', {
      frameWidth: 48,
      frameHeight: 48
    });

    // 서재 테마 타일셋 (스프라이트시트로 로드 - 16열 x 34행)
    this.load.spritesheet('library_theme', '/assets/interiors/5_Classroom_and_library_Shadowless_48x48.png', {
      frameWidth: 48,
      frameHeight: 48
    });

    // === 애니메이티드 오브젝트 (48x48) ===
    this.load.spritesheet('animated_candle', '/assets/animated/animated_candle_48x48.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('animated_clock', '/assets/animated/animated_pendulum_clock_48x48.png', {
      frameWidth: 48,
      frameHeight: 144
    });
    this.load.spritesheet('animated_fishtank', '/assets/animated/animated_fishtank_orange_48x48.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('animated_butterfly', '/assets/animated/animated_butterfly_idle_48x48.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('animated_plant', '/assets/animated/animated_sprout_48x48.png', {
      frameWidth: 48,
      frameHeight: 96
    });

    // === 캐릭터 스프라이트 (48x48 프리메이드 캐릭터) ===
    this.load.spritesheet('character_01', '/assets/characters/Premade_Character_48x48_01.png', {
      frameWidth: 48,
      frameHeight: 96
    });
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

    // 기본 아바타
    this.load.spritesheet('avatar', '/assets/characters/Premade_Character_48x48_01.png', {
      frameWidth: 48,
      frameHeight: 96
    });

    console.log('✅ 48x48 에셋 로딩: room_builder + interiors + 캐릭터 + 애니메이션 = 약 12개 파일');
  }

  create() {
    // 터치 방향 입력 (외부에서 설정 가능)
    this.touchDir = { left: false, right: false, up: false, down: false };

    this.createBackground();
    this.createFurniture();
    this.createAnimatedObjects();
    this.createAnimations();

    if (this.mode === 'owner') {
      this.createOwnerMode();
    } else {
      this.createVisitorMode();
    }
  }

  createBackground() {
    const width = 960;
    const height = 540;
    const tileSize = 48; // 16x16 타일을 3배 스케일 → 48x48로 가구와 동일

    // === 바닥 타일 (16x16 나무 바닥, 3배 스케일) ===
    // Room_Builder_Floors_16x16: 15열 x 40행
    // 나무 판자 바닥 내부 타일: row 10, col 1 = frame 151
    const floorFrame = 151;
    for (let y = 0; y < height; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        const floorTile = this.add.sprite(x + tileSize/2, y + tileSize/2, 'floor_tiles', floorFrame);
        floorTile.setScale(3);
        floorTile.setDepth(-2);
      }
    }

    // === 벽 타일 (16x16 크림 벽지, 3배 스케일) ===
    // Room_Builder_Walls_16x16: 32열 x 40행
    // 크림/베이지 벽 내부 타일: row 2, col 4 = frame 68
    const wallFrame = 68;
    const wallHeight = 150;
    for (let y = 0; y < wallHeight; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        const wallTile = this.add.sprite(x + tileSize/2, y + tileSize/2, 'wall_tiles', wallFrame);
        wallTile.setScale(3);
        wallTile.setDepth(-1);
      }
    }

  }

  createFurniture() {
    // === 48x48 인테리어 스프라이트시트 사용 ===

    // === 왼쪽 벽 책장들 (library_theme: 5_Classroom_and_library_Shadowless_48x48) ===
    // 책장A: 가로 2칸 x 세로 3칸 (209+210 상단, 225+226 중간, 241+242 하단)
    // 책장B: 가로 2칸 x 세로 3칸 (211+212 상단, 227+228 중간, 243+244 하단)

    // 왼쪽 벽 - 책장A (가로 3칸 x 세로 3칸: 208~210, 224~226, 240~242)
    const shelfA_frames = [
      [208, 209, 210],  // 상단
      [224, 225, 226],  // 중간
      [240, 241, 242],  // 하단
    ];
    shelfA_frames.forEach((row, ry) => {
      row.forEach((frame, cx) => {
        const s = this.add.sprite(200 + cx * 48, 170 + ry * 48, 'library_theme', frame).setOrigin(0.5);
        this.physics.add.existing(s); s.body.immovable = true; s.body.setSize(48, 48);
        if (ry === 0 && cx === 0) this.bookshelf = s;
      });
    });

    // 왼쪽 벽 - 책장B (가로 3칸 x 세로 3칸: 211~213, 227~229, 243~245)
    const shelfB_frames = [
      [211, 212, 213],  // 상단
      [227, 228, 229],  // 중간
      [243, 244, 245],  // 하단
    ];
    shelfB_frames.forEach((row, ry) => {
      row.forEach((frame, cx) => {
        const s = this.add.sprite(200 + cx * 48, 320 + ry * 48, 'library_theme', frame).setOrigin(0.5);
        this.physics.add.existing(s); s.body.immovable = true; s.body.setSize(48, 48);
      });
    });

    // === 오른쪽 벽 책장들 ===
    // 오른쪽 벽 - 책장A (가로 3칸 x 세로 3칸)
    shelfA_frames.forEach((row, ry) => {
      row.forEach((frame, cx) => {
        const s = this.add.sprite(664 + cx * 48, 170 + ry * 48, 'library_theme', frame).setOrigin(0.5);
        this.physics.add.existing(s); s.body.immovable = true; s.body.setSize(48, 48);
      });
    });

    // 오른쪽 벽 - 책장B (가로 3칸 x 세로 3칸)
    shelfB_frames.forEach((row, ry) => {
      row.forEach((frame, cx) => {
        const s = this.add.sprite(664 + cx * 48, 320 + ry * 48, 'library_theme', frame).setOrigin(0.5);
        this.physics.add.existing(s); s.body.immovable = true; s.body.setSize(48, 48);
      });
    });

    // === 중앙 독서 공간 ===
    // 책상 (library_theme 가로 2칸 x 세로 2칸: 80+81 상단, 96+97 하단)
    const deskFrames = [[80, 81], [96, 97]];
    deskFrames.forEach((row, ry) => {
      row.forEach((frame, cx) => {
        const s = this.add.sprite(456 + cx * 48, 290 + ry * 48, 'library_theme', frame).setOrigin(0.5);
        this.physics.add.existing(s); s.body.immovable = true; s.body.setSize(48, 48);
        if (ry === 0 && cx === 0) this.desk = s;
      });
    });

    // 의자 (library_theme 세로 2칸: 48 상단, 64 하단)
    const chairTop = this.add.sprite(480, 380, 'library_theme', 48).setOrigin(0.5).setDepth(5);
    const chairBot = this.add.sprite(480, 428, 'library_theme', 64).setOrigin(0.5).setDepth(5);
    [chairTop, chairBot].forEach(s => {
      this.physics.add.existing(s); s.body.immovable = true; s.body.setSize(48, 48);
    });

  }

  createAnimatedObjects() {
    // === 애니메이티드 오브젝트 애니메이션 생성 ===

    // 양초 애니메이션
    this.anims.create({
      key: 'candle_burn',
      frames: this.anims.generateFrameNumbers('animated_candle', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    // 시계 애니메이션
    this.anims.create({
      key: 'clock_tick',
      frames: this.anims.generateFrameNumbers('animated_clock', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });

    // 물고기 탱크 애니메이션
    this.anims.create({
      key: 'fishtank_swim',
      frames: this.anims.generateFrameNumbers('animated_fishtank', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1
    });

    // 나비 애니메이션
    this.anims.create({
      key: 'butterfly_idle',
      frames: this.anims.generateFrameNumbers('animated_butterfly', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });

    // 식물 애니메이션
    this.anims.create({
      key: 'plant_grow',
      frames: this.anims.generateFrameNumbers('animated_plant', { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1
    });

    // === 애니메이티드 오브젝트 배치 ===

    // 책상 위 양초
    const candle1 = this.add.sprite(450, 290, 'animated_candle').setOrigin(0.5);
    candle1.play('candle_burn');
    candle1.setDepth(10);

    const candle2 = this.add.sprite(510, 290, 'animated_candle').setOrigin(0.5);
    candle2.play('candle_burn');
    candle2.setDepth(10);

    // 벽 시계
    const clock = this.add.sprite(480, 80, 'animated_clock').setOrigin(0.5);
    clock.play('clock_tick');
    clock.setDepth(5);

    // 물고기 탱크 (오른쪽 아래)
    const fishtank = this.add.sprite(850, 460, 'animated_fishtank').setOrigin(0.5);
    fishtank.play('fishtank_swim');
    fishtank.setDepth(5);

    // 나비
    const butterfly1 = this.add.sprite(300, 110, 'animated_butterfly').setOrigin(0.5);
    butterfly1.play('butterfly_idle');
    butterfly1.setDepth(15);

    const butterfly2 = this.add.sprite(700, 130, 'animated_butterfly').setOrigin(0.5);
    butterfly2.play('butterfly_idle');
    butterfly2.setDepth(15);

    // 식물 (왼쪽 아래)
    const plant = this.add.sprite(110, 460, 'animated_plant').setOrigin(0.5);
    plant.play('plant_grow');
    plant.setDepth(5);
  }

  createAnimations() {
    const characters = ['character_05', 'character_08', 'character_12', 'avatar'];

    // 48x96 프레임, 56열 기준. Row 2 (frame 112부터), 6프레임씩:
    // 우(0-5), 위(6-11), 좌(12-17), 아래(18-23)
    // walk_right: 112~115, walk_up: 118~121, walk_left: 124~127, walk_down: 130~133
    characters.forEach(charKey => {
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

      // Row 1 (frame 56부터) idle 애니메이션 - 방향별, 6프레임씩 반복
      // 우(56~61), 위(62~67), 좌(68~73), 아래(74~79)
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

      // 기본 idle (아래 방향)
      this.anims.create({
        key: `${charKey}_idle`,
        frames: this.anims.generateFrameNumbers(charKey, { start: 74, end: 79 }),
        frameRate: 6,
        repeat: -1
      });
    });
  }

  createOwnerMode() {
    // 내 아바타 (48x48, 스케일 조정 없음)
    this.myAvatar = this.add.sprite(480, 420, 'character_05').setOrigin(0.5);
    this.myAvatar.setTint(0x88ff88); // 초록색
    this.myAvatar.play('character_05_idle');

    this.physics.add.existing(this.myAvatar);
    this.myAvatar.body.setCollideWorldBounds(true);
    this.myAvatar.body.setSize(48, 48);
    this.myAvatar.body.setOffset(0, 48);

    // 이름표
    this.myAvatarLabel = this.add.text(this.myAvatar.x, this.myAvatar.y + 30, '나', {
      fontSize: '12px',
      color: '#333',
      backgroundColor: '#ffffff',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5);

    // 키보드 조종
    this.cursors = this.input.keyboard.createCursorKeys();

    // 상호작용 설정
    this.setupInteractions();
  }

  createVisitorMode() {
    // 주인 AI 아바타 (48x48)
    this.hostAvatar = this.add.sprite(380, 320, 'character_08').setOrigin(0.5);
    this.hostAvatar.play('character_08_walk_down');

    this.physics.add.existing(this.hostAvatar);
    this.hostAvatar.body.setCollideWorldBounds(true);
    this.hostAvatar.body.setSize(48, 48);
    this.hostAvatar.body.setOffset(0, 48);

    // 이름표
    this.hostAvatarLabel = this.add.text(this.hostAvatar.x, this.hostAvatar.y + 60, 'AI', {
      fontSize: '12px',
      color: '#333',
      backgroundColor: '#ffffff',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5);

    // 방문자 아바타 (48x48)
    this.visitorAvatar = this.add.sprite(580, 420, 'character_12').setOrigin(0.5);
    this.visitorAvatar.setTint(0x88ccff); // 파란색
    this.visitorAvatar.play('character_12_idle');

    this.physics.add.existing(this.visitorAvatar);
    this.visitorAvatar.body.setCollideWorldBounds(true);
    this.visitorAvatar.body.setSize(48, 48);
    this.visitorAvatar.body.setOffset(0, 48);

    // 방문자 이름표
    this.visitorAvatarLabel = this.add.text(this.visitorAvatar.x, this.visitorAvatar.y + 60, '방문자', {
      fontSize: '12px',
      color: '#333',
      backgroundColor: '#ffffff',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5);

    // 방문자 키보드 조종
    this.cursors = this.input.keyboard.createCursorKeys();

    // AI 자율 이동
    this.startHostAIMovement();
  }

  setupInteractions() {
    // 충돌 감지
    this.physics.add.collider(this.myAvatar, this.bookshelf);
    this.physics.add.collider(this.myAvatar, this.desk);
  }

  startHostAIMovement() {
    // AI 주인 자율 이동 (간단한 랜덤 이동)
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (!this.hostAvatar) return;

        const directions = ['walk_down', 'walk_right', 'walk_up', 'walk_left'];
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        this.hostAvatar.play(`character_08_${randomDir}`);

        const speed = 50;
        switch (randomDir) {
          case 'walk_down': this.hostAvatar.body.setVelocity(0, speed); this.hostAvatar.setFlipX(false); break;
          case 'walk_up': this.hostAvatar.body.setVelocity(0, -speed); this.hostAvatar.setFlipX(false); break;
          case 'walk_left': this.hostAvatar.body.setVelocity(-speed, 0); this.hostAvatar.setFlipX(false); break;
          case 'walk_right': this.hostAvatar.body.setVelocity(speed, 0); this.hostAvatar.setFlipX(false); break;
        }

        // 마지막 방향 저장
        const dir = randomDir.replace('walk_', '');
        this.hostLastDir = dir;

        this.time.delayedCall(1000, () => {
          if (this.hostAvatar) {
            this.hostAvatar.body.setVelocity(0, 0);
            this.hostAvatar.play(`character_08_idle_${this.hostLastDir || 'down'}`);
          }
        });
      },
      loop: true
    });
  }

  update() {
    if (this.mode === 'owner' && this.myAvatar) {
      this.updateOwnerAvatar();
    } else if (this.mode === 'visitor' && this.visitorAvatar) {
      this.updateVisitorAvatar();
    }
  }

  updateOwnerAvatar() {
    const speed = 150;
    let moving = false;

    this.myAvatar.body.setVelocity(0);

    const td = this.touchDir;

    if (this.cursors.left.isDown || td.left) {
      this.myAvatar.body.setVelocityX(-speed);
      this.myAvatar.play('character_05_walk_left', true);
      this.myLastDir = 'left';
      moving = true;
    } else if (this.cursors.right.isDown || td.right) {
      this.myAvatar.body.setVelocityX(speed);
      this.myAvatar.play('character_05_walk_right', true);
      this.myLastDir = 'right';
      moving = true;
    }

    if (this.cursors.up.isDown || td.up) {
      this.myAvatar.body.setVelocityY(-speed);
      this.myAvatar.play('character_05_walk_up', true);
      this.myLastDir = 'up';
      moving = true;
    } else if (this.cursors.down.isDown || td.down) {
      this.myAvatar.body.setVelocityY(speed);
      this.myAvatar.play('character_05_walk_down', true);
      this.myLastDir = 'down';
      moving = true;
    }

    if (!moving) {
      this.myAvatar.play(`character_05_idle_${this.myLastDir || 'down'}`, true);
      this.setAction('idle');
    } else {
      this.setAction('walking');
    }

    // 이름표 위치 업데이트
    this.myAvatarLabel.setPosition(this.myAvatar.x, this.myAvatar.y + 30);

    // 아바타 위치 콜백
    if (this.onAvatarMove) {
      this.onAvatarMove({ x: this.myAvatar.x, y: this.myAvatar.y });
    }

    // 상호작용 감지
    this.checkInteractions();
  }

  updateVisitorAvatar() {
    const speed = 150;
    let moving = false;

    this.visitorAvatar.body.setVelocity(0);

    const td = this.touchDir;

    if (this.cursors.left.isDown || td.left) {
      this.visitorAvatar.body.setVelocityX(-speed);
      this.visitorAvatar.play('character_12_walk_left', true);
      this.visitorLastDir = 'left';
      moving = true;
    } else if (this.cursors.right.isDown || td.right) {
      this.visitorAvatar.body.setVelocityX(speed);
      this.visitorAvatar.play('character_12_walk_right', true);
      this.visitorLastDir = 'right';
      moving = true;
    }

    if (this.cursors.up.isDown || td.up) {
      this.visitorAvatar.body.setVelocityY(-speed);
      this.visitorAvatar.play('character_12_walk_up', true);
      this.visitorLastDir = 'up';
      moving = true;
    } else if (this.cursors.down.isDown || td.down) {
      this.visitorAvatar.body.setVelocityY(speed);
      this.visitorAvatar.play('character_12_walk_down', true);
      this.visitorLastDir = 'down';
      moving = true;
    }

    if (!moving) {
      this.visitorAvatar.play(`character_12_idle_${this.visitorLastDir || 'down'}`, true);
    }

    // 이름표 위치 업데이트
    this.visitorAvatarLabel.setPosition(this.visitorAvatar.x, this.visitorAvatar.y + 60);
    this.hostAvatarLabel.setPosition(this.hostAvatar.x, this.hostAvatar.y + 60);
  }

  checkInteractions() {
    const avatar = this.myAvatar;

    // 책장 근처
    if (Phaser.Math.Distance.Between(avatar.x, avatar.y, this.bookshelf.x, this.bookshelf.y) < 80) {
      this.setAction('organizing');
    }

    // 책상 근처
    else if (Phaser.Math.Distance.Between(avatar.x, avatar.y, this.desk.x, this.desk.y) < 80) {
      this.setAction('reading');
    }

  }

  setAction(action) {
    if (this.currentAction !== action) {
      this.currentAction = action;
      if (this.onActionChange) {
        this.onActionChange(action);
      }
    }
  }
}

export default LibraryScene;
