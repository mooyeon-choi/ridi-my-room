import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as Phaser from 'phaser';
import LibraryScene from '../scenes/LibraryScene';

const PhaserGame = forwardRef(function PhaserGame(
  { mode, userId, hostUserId, roomConfig, aiConfig, onActionChange, onAvatarMove },
  ref
) {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getScene() {
      if (!phaserGameRef.current) return null;
      return phaserGameRef.current.scene.getScene('LibraryScene');
    }
  }));

  useEffect(() => {
    if (phaserGameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 960,
      height: 540,
      parent: gameRef.current,
      backgroundColor: '#d4cfc9',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
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
      onAvatarMove
    });

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return <div ref={gameRef} style={{ width: '100%', height: '100%' }}></div>;
});

export default PhaserGame;
