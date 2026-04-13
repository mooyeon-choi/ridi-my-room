import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);

  function handleStart() {
    setTransitioning(true);
    // 애니메이션(1.4s) 후 화면 전환
    setTimeout(() => navigate('/web/my-room'), 1800);
  }

  return (
    <div style={styles.container}>
      {/* 배경 이미지 — 전환 시 문 위치로 확대 */}
      <div
        className={transitioning ? 'bg zoom-in' : 'bg'}
        style={styles.bg}
      />

      {/* 조명 글로우 레이어 */}
      <div
        className={transitioning ? 'glow-layer glow-burst' : 'glow-layer'}
        style={styles.glowLayer}
      />

      {/* 화이트아웃 레이어 */}
      {transitioning && <div className="whiteout" style={styles.whiteout} />}

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

        /* 버튼 클릭 시 — 문 중앙 아래쪽(50% 75%)으로 확대 */
        @keyframes zoomInDoor {
          0%   { transform: scale(1);   transform-origin: 50% 85%; }
          100% { transform: scale(1.5); transform-origin: 50% 85%; }
        }
        .bg.zoom-in {
          animation: zoomInDoor 1.8s cubic-bezier(0.8, 0, 0.3, 1) forwards;
        }

        /* 조명 폭발적으로 밝아지기 */
        @keyframes glowBurst {
          0%   { opacity: 0.15; }
          60%  { opacity: 0.35; }
          100% { opacity: 0.5;  }
        }
        .glow-layer.glow-burst {
          animation: glowBurst 1.8s ease-in forwards;
        }

        /* 화이트아웃 */
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
    height: '100vh',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: '13vh',
    overflow: 'hidden'
  },
  bg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(/assets/backgrounds/main.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0
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
    zIndex: 1
  },
  whiteout: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255, 230, 150, 0.95)',
    pointerEvents: 'none',
    zIndex: 2
  },
  button: {
    position: 'relative',
    zIndex: 3,
    background: '#4F0C0C',
    color: '#f5e6c8',
    border: '1px solid #8B3232',
    borderRadius: '2px',
    padding: '2vh 12vw',
    fontSize: 'clamp(14px, 1.8vw, 28px)',
    fontWeight: 'bold',
    cursor: 'pointer',
    letterSpacing: '2px',
    transition: 'opacity 0.2s'
  },
  buttonHidden: {
    opacity: 0,
    pointerEvents: 'none'
  }
};

export default Home;
