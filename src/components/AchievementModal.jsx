import React, { useState } from 'react';

// 책 장르 태그 매핑
const BOOK_TAGS = {
  sangsuri: '로판', pumgyeok: '로판', angae: '로판', nampyeon: '로판',
  merry: '현대물', neoreul: '로맨스', dephase: '로판',
  owol: '로판', pyeha: '로판', asha: '로판',
};

const SLOT_COUNT = 14;
const REQUIRED_ROOMS = ['sangsuri_user', 'neosokbam_user', 'betrayer_user'];

function checkAchievements() {
  let slotApplied = {};
  let completedMissions = {};
  let libraryBooks = [];
  let visitedRooms = [];

  try { slotApplied = JSON.parse(localStorage.getItem('myroom_slotApplied') || '{}'); } catch (e) {}
  try { completedMissions = JSON.parse(localStorage.getItem('myroom_completedMissions') || '{}'); } catch (e) {}
  try { libraryBooks = JSON.parse(localStorage.getItem('library_books') || '[]'); } catch (e) {}
  try { visitedRooms = JSON.parse(localStorage.getItem('visited_rooms') || '[]'); } catch (e) {}

  const hasTheme = !!slotApplied.theme;
  const allCats = !!completedMissions.first_register && !!completedMissions.view_work && !!completedMissions.purchase_work;
  const hasRaptan = !!slotApplied.raptan;
  const visitedAny = visitedRooms.length > 0;
  const visitedAll = REQUIRED_ROOMS.every(r => visitedRooms.includes(r));

  // 서재 가득 채우기 체크 (14슬롯)
  const isFull = libraryBooks.length >= SLOT_COUNT;
  const bookTags = libraryBooks.map(id => BOOK_TAGS[id]).filter(Boolean);
  const allRopan = isFull && bookTags.length >= SLOT_COUNT && bookTags.every(t => t === '로판');
  const allModern = isFull && bookTags.length >= SLOT_COUNT && bookTags.every(t => t === '현대물');

  return [
    { id: 1, title: '명예 북부대공', description: '로판 작품으로만 서재를 가득 채웠습니다', unlocked: allRopan,   img: '/assets/medal_ropan.webp' },
    { id: 2, title: '현대물 킬러',   description: '현대물 작품으로만 서재를 가득 채웠습니다', unlocked: allModern,  img: '/assets/medal_modern.webp' },
    { id: 3, title: '사교계의 꽃',   description: '모든 리디룸을 방문했습니다',             unlocked: visitedAll, img: '/assets/medal_social.webp' },
  ];
}

function AchievementModal({ onClose }) {
  const ACHIEVEMENTS = checkAchievements();
  const slots = Array.from({ length: 10 }, (_, i) => ACHIEVEMENTS[i] || null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  function handleSlotClick(ach, i) {
    if (!ach) {
      setSelectedSlot({ title: '???', description: '아직 발견되지 않은 업적입니다.', unlocked: false, slotIndex: i });
    } else {
      setSelectedSlot({ ...ach, slotIndex: i });
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose} onKeyDown={e => e.stopPropagation()}>
      <div style={styles.wrapper} onClick={e => e.stopPropagation()}>
        <img src="/assets/backgrounds/achievement_bg.webp" alt="업적 배경" style={styles.bgImg} />
        <div style={styles.content}>
          <div style={styles.grid}>
            {slots.map((ach, i) => (
              <div key={i} style={styles.slot} onClick={() => handleSlotClick(ach, i)}>
                {ach && ach.unlocked && ach.img && (
                  <>
                    <div className="medal-glow" style={styles.medalGlow} />
                    <img src={ach.img} alt={ach.title} style={styles.medalImg} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 설명 팝업 */}
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
              <button style={styles.descCloseBtn} onClick={() => setSelectedSlot(null)}>닫기</button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes medalPulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          50%  { transform: scale(1.2); opacity: 1;   }
          100% { transform: scale(1);   opacity: 0.6; }
        }
        .medal-glow {
          animation: medalPulse 2.5s ease-in-out infinite;
        }
      `}</style>
      <button style={styles.closeBtn} onClick={onClose}>✕ 닫기</button>
    </div>
  );
}

// ── 업적 달성 알림 토스트 ──
function AchievementToast({ achievement, onDone }) {
  React.useEffect(() => {
    const timer = setTimeout(onDone, 4000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="achievement-toast" style={toastStyles.container}>
      {achievement.img && (
        <img src={achievement.img} alt={achievement.title} style={toastStyles.img} />
      )}
      <div style={toastStyles.textArea}>
        <span style={toastStyles.label}>업적 달성!</span>
        <span style={toastStyles.title}>{achievement.title}</span>
      </div>
      <style>{`
        @keyframes toastSlideIn {
          0%   { transform: translateY(-100%); opacity: 0; }
          15%  { transform: translateY(0);     opacity: 1; }
          85%  { transform: translateY(0);     opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        .achievement-toast {
          animation: toastSlideIn 4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

const toastStyles = {
  container: {
    position: 'fixed',
    top: 'clamp(12px, 2vh, 24px)',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(8px, 1.5vw, 14px)',
    background: 'linear-gradient(135deg, #3d2210 0%, #5c3018 100%)',
    border: '3px solid #d4a843',
    borderRadius: '8px',
    padding: 'clamp(8px, 1.5vh, 14px) clamp(14px, 3vw, 24px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 15px rgba(212,168,67,0.3)',
  },
  img: {
    width: 'clamp(36px, 6vw, 52px)',
    height: 'clamp(36px, 6vw, 52px)',
    objectFit: 'contain',
    imageRendering: 'pixelated',
  },
  textArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  label: {
    fontSize: 'clamp(9px, 1.2vw, 11px)',
    color: '#d4a843',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  title: {
    fontSize: 'clamp(13px, 1.8vw, 17px)',
    color: '#f5e6c8',
    fontWeight: 'bold',
  },
};

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
  },
  slotIcon: {
    fontSize: 'clamp(20px, 3.5vw, 36px)',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
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

export default AchievementModal;
export { AchievementToast, checkAchievements };
