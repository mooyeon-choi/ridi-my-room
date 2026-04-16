import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as Phaser from 'phaser';
import LibraryScene from '../scenes/LibraryScene';

const PhaserGame = forwardRef(function PhaserGame(
  { mode, userId, hostUserId, roomConfig, aiConfig, onActionChange, onAvatarMove, onBookshelfClick, width, height, parentWidth, parentHeight },
  ref
) {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getScene() {
      if (!phaserGameRef.current) return null;
      return phaserGameRef.current.scene.getScene('LibraryScene');
    },
    disableInput() {
      const scene = phaserGameRef.current?.scene.getScene('LibraryScene');
      if (scene) {
        scene.input.enabled = false;
        if (scene.input.keyboard) scene.input.keyboard.enabled = false;
        scene.modalActive = true;
      }
    },
    enableInput() {
      const scene = phaserGameRef.current?.scene.getScene('LibraryScene');
      if (scene) {
        scene.input.enabled = true;
        if (scene.input.keyboard) scene.input.keyboard.enabled = true;
        scene.modalActive = false;
      }
    }
  }));

  useEffect(() => {
    if (phaserGameRef.current) return;

    const gameWidth = width || 746;
    const gameHeight = height || 420;

    const config = {
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      parent: gameRef.current,
      backgroundColor: '#2a2018',
      transparent: true,
      scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.NO_CENTER,
        expandParent: false
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: LibraryScene
    };

    const game = new Phaser.Game(config);
    phaserGameRef.current = game;

    game.scene.start('LibraryScene', {
      mode,
      userId: userId || hostUserId,
      roomConfig,
      aiConfig,
      onActionChange,
      onAvatarMove,
      onBookshelfClick
    });

    // canvas를 부모 컨테이너에 꽉 채움 (CSS만 조정, 게임 해상도 유지)
    requestAnimationFrame(() => {
      const canvas = game.canvas;
      if (!canvas) return;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
    });

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  const style = {
    overflow: 'hidden'
  };
  // parentWidth/Height가 있으면 px로 고정, 없으면 100%
  if (parentWidth && parentHeight) {
    style.width = parentWidth + 'px';
    style.height = parentHeight + 'px';
  } else {
    style.width = '100%';
    style.height = '100%';
  }

  return <div ref={gameRef} style={style}></div>;
});

export default PhaserGame;
