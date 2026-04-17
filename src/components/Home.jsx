import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PRELOAD_ASSETS = [
  // 배경
  '/assets/backgrounds/maxy_room_x.webp',
  '/assets/backgrounds/maxy_room.webp',
  '/assets/backgrounds/maxy_room_crystal.webp',
  '/assets/backgrounds/sangsuri_visitor.webp',
  '/assets/backgrounds/neosokbam.webp',
  '/assets/backgrounds/betrayer.webp',
  '/assets/backgrounds/betrayer_x.webp',
  '/assets/backgrounds/fortune/sangsuri.webp',
  '/assets/backgrounds/fortune/neosokbam.webp',
  '/assets/backgrounds/fortune/betrayer.webp',
  // 맥시 모션
  ...['F1','F2','B1','B2','L1','L2','L3','L4','R1','R2','R3','R4'].map(n => `/assets/maxy_motion/CM_${n}.png`),
  // 고양이
  '/assets/pets/cat_white.png',
  '/assets/pets/cat_black.png',
  '/assets/pets/cat_gray.png',
  // 캐릭터 스프라이트
  '/assets/characters/raptan_sprite.webp',
  '/assets/characters/ruth_sprite.webp',
  '/assets/characters/neosokbam_heroine.webp',
  '/assets/characters/betrayer_hero.webp',
  '/assets/characters/Premade_Character_48x48_08.png',
  '/assets/characters/Premade_Character_48x48_12.png',
  // 초상화
  '/assets/characters/portraits/maxy.png',
  '/assets/characters/portraits/ruth.png',
  '/assets/characters/portraits/neosokbam_heroine.png',
  '/assets/characters/portraits/betrayer_hero.png',
  // 책 표지 + 스크린샷
  ...['sangsuri','betraying_dignity','fog_butterfly','chased_by_husband','merry_psycho','night_deceiving_you','dephase','may_garden','night_of_majesty','border_asha'].map(n => `/assets/books/${n}.png`),
  ...['page_sangsuri','page_pumgyeok','page_angae','page_nampyeon','page_merry','page_neoreul','page_dephase','page_owol','page_pyeha'].map(n => `/assets/screenshots/${n}.png`),
  // 인벤토리 아이콘
  ...Array.from({length: 7}, (_, i) => `/assets/items/inv_item${i+1}.${i >= 4 ? 'webp' : 'png'}`),
];

const LOADING_MESSAGES = [
  '맥시가 서재를 정리하고 있어요',
  '고양이들이 자리를 잡는 중이에요',
  '리프탄이 검을 닦고 있어요',
  '루스가 마법진을 그리는 중이에요',
  '책장에 책을 꽂고 있어요',
  '수정구에 운세를 채우는 중이에요',
];

function preloadImages(urls, onProgress) {
  let loaded = 0;
  return new Promise(resolve => {
    if (urls.length === 0) { onProgress(100); resolve(); return; }
    urls.forEach(url => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        onProgress(Math.round((loaded / urls.length) * 100));
        if (loaded >= urls.length) resolve();
      };
      img.src = url;
    });
  });
}

function Home() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [loadDone, setLoadDone] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    const start = Date.now();
    preloadImages(PRELOAD_ASSETS, setLoadProgress).then(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 3000 - elapsed);
      setTimeout(() => setLoadDone(true), remaining);
    });
  }, []);

  // 표시 퍼센트를 부드럽게 증가
  useEffect(() => {
    if (displayProgress >= loadProgress) return;
    const timer = setTimeout(() => {
      setDisplayProgress(prev => Math.min(prev + 1, loadProgress));
    }, 30);
    return () => clearTimeout(timer);
  }, [displayProgress, loadProgress]);

  // 로딩 메시지 랜덤 교체
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMsg(prev => {
        const others = LOADING_MESSAGES.filter(m => m !== prev);
        return others[Math.floor(Math.random() * others.length)];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

      {/* 로딩 표시 */}
      {!loadDone && !transitioning && (
        <div style={styles.loadingArea}>
          <div style={styles.loadingBarBg}>
            <div style={{ ...styles.loadingBarFill, width: `${displayProgress}%` }} />
          </div>
          <span style={styles.loadingText}>{loadingMsg}...</span>
        </div>
      )}

      {/* 버튼 */}
      <button
        onClick={handleStart}
        style={{
          ...styles.button,
          ...(transitioning ? styles.buttonHidden : {}),
          ...(!loadDone ? styles.buttonDisabled : {}),
        }}
        disabled={transitioning || !loadDone}
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
  buttonDisabled: {
    opacity: 0.4,
    cursor: 'default',
  },
  loadingArea: {
    position: 'relative',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'clamp(4px, 0.8vh, 8px)',
    width: 'clamp(160px, 30vw, 280px)',
  },
  loadingBarBg: {
    width: '100%',
    height: 'clamp(6px, 1vh, 10px)',
    background: 'rgba(79, 12, 12, 0.5)',
    border: '2px solid #8B3232',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  loadingBarFill: {
    height: '100%',
    background: '#f5e6c8',
    transition: 'width 0.2s ease-out',
  },
  loadingText: {
    color: '#f5e6c8',
    fontSize: 'clamp(10px, 1.3vw, 13px)',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
  },
};

export default Home;
