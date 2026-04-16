import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);

  function handleStart() {
    setTransitioning(true);
    setTimeout(() => navigate('/web/my-room'), 1800);
  }

  return (
    <div style={styles.container}>
      {/* 배경 이미지 */}
      <div
        className={transitioning ? 'bg zoom-in' : 'bg'}
        style={styles.bg}
      />

      {/* 비네트 오버레이 */}
      <div style={styles.vignette} />

      {/* 조명 글로우 레이어 */}
      <div
        className={transitioning ? 'glow-layer glow-burst' : 'glow-layer'}
        style={styles.glowLayer}
      />

      {/* 화이트아웃 레이어 */}
      {transitioning && <div className="whiteout" style={styles.whiteout} />}

      {/* 버튼 */}
      <button
        onClick={handleStart}
        style={{ ...styles.button, ...(transitioning ? styles.buttonHidden : {}) }}
        disabled={transitioning}
      >
        시작하기
      </button>

      <style>{`
        @keyframes flicker {
          0%   { opacity: 0.10; }
          25%  { opacity: 0.18; }
          50%  { opacity: 0.08; }
          75%  { opacity: 0.20; }
          100% { opacity: 0.10; }
        }
        .glow-layer {
          animation: flicker 4s ease-in-out infinite;
        }

        @keyframes zoomInDoor {
          0%   { transform: scale(1);   transform-origin: 50% 85%; }
          100% { transform: scale(1.5); transform-origin: 50% 85%; }
        }
        .bg.zoom-in {
          animation: zoomInDoor 1.8s cubic-bezier(0.8, 0, 0.3, 1) forwards;
        }

        @keyframes glowBurst {
          0%   { opacity: 0.15; }
          60%  { opacity: 0.35; }
          100% { opacity: 0.5;  }
        }
        .glow-layer.glow-burst {
          animation: glowBurst 1.8s ease-in forwards;
        }

        @keyframes whiteout {
          0%   { opacity: 0; }
          60%  { opacity: 0; }
          100% { opacity: 1; }
        }
        .whiteout {
          animation: whiteout 1.8s ease-in forwards;
        }

      `}</style>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100dvh',
    position: 'fixed',
    top: 0, left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 'clamp(8vh, 12vh, 16vh)',
    overflow: 'hidden',
    gap: 'clamp(12px, 2vh, 24px)',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(/assets/backgrounds/main.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  glowLayer: {
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(ellipse 38% 30% at 28% 58%, rgba(255, 200, 80, 1) 0%, transparent 100%),
      radial-gradient(ellipse 38% 30% at 72% 58%, rgba(255, 200, 80, 1) 0%, transparent 100%),
      radial-gradient(ellipse 15% 20% at 50% 62%, rgba(255, 180, 60, 1) 0%, transparent 100%)
    `,
    pointerEvents: 'none',
    zIndex: 1,
  },
  whiteout: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255, 230, 150, 0.95)',
    pointerEvents: 'none',
    zIndex: 2,
  },
  button: {
    position: 'relative',
    zIndex: 3,
    background: '#4F0C0C',
    color: '#f5e6c8',
    border: '3px solid #8B3232',
    borderRadius: '2px',
    padding: 'clamp(10px, 1.8vh, 16px) clamp(32px, 7vw, 64px)',
    fontSize: 'clamp(13px, 1.8vw, 20px)',
    fontWeight: 'bold',
    cursor: 'pointer',
    letterSpacing: 'clamp(2px, 0.5vw, 5px)',
    transition: 'opacity 0.3s',
    boxShadow: '4px 4px 0px #2a0606, inset 0 1px 0 rgba(255,255,255,0.1)',
    imageRendering: 'pixelated',
  },
  buttonHidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
};

export default Home;
