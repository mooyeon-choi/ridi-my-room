import React, { useState } from 'react';

const ROOM_ACHIEVEMENTS = {
  neosokbam: [
    { id: 1, title: '명예 북부대공', description: '로판 작품으로만 서재를 가득 채웠습니다', unlocked: true, img: '/assets/medal_ropan.webp' },
    { id: 2, title: '현대물 킬러',   description: '현대물 작품으로만 서재를 가득 채웠습니다', unlocked: false, img: '/assets/medal_modern.webp' },
    { id: 3, title: '사교계의 꽃',   description: '모든 리디룸을 방문했습니다',             unlocked: false, img: '/assets/medal_social.webp' },
  ],
  betrayer: [
    { id: 1, title: '명예 북부대공', description: '로판 작품으로만 서재를 가득 채웠습니다', unlocked: false, img: '/assets/medal_ropan.webp' },
    { id: 2, title: '현대물 킬러',   description: '현대물 작품으로만 서재를 가득 채웠습니다', unlocked: true, img: '/assets/medal_modern.webp' },
    { id: 3, title: '사교계의 꽃',   description: '모든 리디룸을 방문했습니다',             unlocked: false, img: '/assets/medal_social.webp' },
  ],
  sangsuri: [
    { id: 1, title: '명예 북부대공', description: '로판 작품으로만 서재를 가득 채웠습니다', unlocked: false, img: '/assets/medal_ropan.webp' },
    { id: 2, title: '현대물 킬러',   description: '현대물 작품으로만 서재를 가득 채웠습니다', unlocked: false, img: '/assets/medal_modern.webp' },
    { id: 3, title: '사교계의 꽃',   description: '모든 리디룸을 방문했습니다',             unlocked: false, img: '/assets/medal_social.webp' },
  ],
};

function VisitorAchievementModal({ onClose, roomTheme, themeColors }) {
  const tc = themeColors || {};
  const achievements = ROOM_ACHIEVEMENTS[roomTheme] || ROOM_ACHIEVEMENTS.sangsuri;
  const slots = Array.from({ length: 10 }, (_, i) => achievements[i] || null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  function handleSlotClick(ach) {
    if (!ach) {
      setSelectedSlot({ title: '???', description: '아직 발견되지 않은 업적입니다.', unlocked: false });
    } else {
      setSelectedSlot(ach);
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose} onKeyDown={e => e.stopPropagation()}>
      <div style={styles.wrapper} onClick={e => e.stopPropagation()}>
        <img src="/assets/backgrounds/achievement_bg.webp" alt="업적 배경" style={styles.bgImg} />
        <div style={styles.content}>
          <div style={styles.grid}>
            {slots.map((ach, i) => (
              <div key={i} style={styles.slot} onClick={() => handleSlotClick(ach)}>
                {ach && ach.unlocked && ach.img && (
                  <>
                    <div className="medal-glow-visitor" style={styles.medalGlow} />
                    <img src={ach.img} alt={ach.title} style={styles.medalImg} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedSlot && (
          <div style={styles.descOverlay} onClick={() => setSelectedSlot(null)}>
            <div style={styles.descPopup} onClick={e => e.stopPropagation()}>
              {selectedSlot.unlocked && selectedSlot.img && (
                <img src={selectedSlot.img} alt={selectedSlot.title} style={styles.descMedalImg} />
              )}
              <span style={styles.descTitle}>
                {selectedSlot.unlocked ? selectedSlot.title : '???'}
              </span>
              <span style={styles.descText}>{selectedSlot.description}</span>
              {selectedSlot.unlocked && (
                <span style={styles.descUnlocked}>달성 완료!</span>
              )}
              <button style={{ ...styles.descCloseBtn, background: tc.fill || '#5c3018' }} onClick={() => setSelectedSlot(null)}>닫기</button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes medalPulseVisitor {
          0%   { transform: scale(1);   opacity: 0.6; }
          50%  { transform: scale(1.2); opacity: 1;   }
          100% { transform: scale(1);   opacity: 0.6; }
        }
        .medal-glow-visitor {
          animation: medalPulseVisitor 2.5s ease-in-out infinite;
        }
      `}</style>
      <button style={{ ...styles.closeBtn, background: tc.fill || '#5c3018', borderColor: tc.line || '#7a4e28' }} onClick={onClose}>✕ 닫기</button>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(4px, 1vh, 8px)',
    background: 'rgba(0, 0, 0, 0.5)',
  },
  wrapper: {
    position: 'relative',
    width: 'clamp(360px, 85vw, 700px)',
    aspectRatio: '16 / 9',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  bgImg: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    objectFit: 'cover',
  },
  content: {
    position: 'relative',
    width: '100%', height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'calc(12% - 12px) calc(8% + 10.5px) calc(6% + 12px) calc(8% + 10.5px)',
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    columnGap: '0px',
    rowGap: 'clamp(12px, 3.6vw, 32px)',
    width: '100%',
  },
  slot: {
    aspectRatio: '1',
    width: '75%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    margin: '0 auto',
    cursor: 'pointer',
  },
  medalGlow: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    marginTop: '10px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 220, 100, 0.35) 0%, rgba(255, 200, 60, 0.12) 50%, transparent 70%)',
    pointerEvents: 'none',
  },
  medalImg: {
    position: 'relative',
    width: '80%',
    height: '80%',
    objectFit: 'contain',
    imageRendering: 'pixelated',
    filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))',
  },
  descOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: '8px',
  },
  descPopup: {
    background: 'linear-gradient(180deg, #f5e6c8 0%, #e8d5a8 100%)',
    border: '3px solid #d4a843',
    borderRadius: '8px',
    padding: 'clamp(14px, 2.5vw, 24px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'clamp(6px, 1vh, 10px)',
    maxWidth: 'clamp(200px, 40vw, 280px)',
    boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
  },
  descMedalImg: {
    width: 'clamp(48px, 8vw, 72px)',
    height: 'clamp(48px, 8vw, 72px)',
    objectFit: 'contain',
    imageRendering: 'pixelated',
  },
  descTitle: {
    fontSize: 'clamp(14px, 2vw, 18px)',
    fontWeight: 'bold',
    color: '#3d2210',
    textAlign: 'center',
  },
  descText: {
    fontSize: 'clamp(11px, 1.4vw, 13px)',
    color: '#5c3a1e',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  descUnlocked: {
    fontSize: 'clamp(10px, 1.2vw, 12px)',
    color: '#22c55e',
    fontWeight: 'bold',
  },
  descCloseBtn: {
    background: '#5c3018',
    border: 'none',
    borderRadius: '4px',
    color: '#f5e6c8',
    fontSize: 'clamp(10px, 1.3vw, 12px)',
    fontWeight: 'bold',
    padding: 'clamp(4px, 0.8vh, 8px) clamp(14px, 2.5vw, 24px)',
    cursor: 'pointer',
    marginTop: '4px',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginRight: 'calc(50% - clamp(180px, 42.5vw, 350px))',
    background: '#5c3018',
    border: '2px solid #7a4e28',
    borderRadius: '4px',
    color: '#f5e6c8',
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    fontWeight: 'bold',
    padding: 'clamp(6px, 1vh, 10px) clamp(14px, 2.5vw, 24px)',
    cursor: 'pointer',
  },
};

export default VisitorAchievementModal;
