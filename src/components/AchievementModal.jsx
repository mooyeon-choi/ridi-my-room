import React from 'react';

const ACHIEVEMENTS = [
  { id: 1, title: '첫 방문', description: '서재에 처음 방문했습니다', unlocked: true },
  { id: 2, title: '독서의 시작', description: '나의 서재에 첫 번째 책을 추가했습니다', unlocked: true },
  { id: 3, title: '컬렉터', description: '나의 서재에 책을 3권 이상 추가했습니다', unlocked: true },
  { id: 4, title: '테마 마스터', description: '방 테마를 적용했습니다', unlocked: false },
  { id: 5, title: '고양이 집사', description: '고양이 3마리를 모두 데려왔습니다', unlocked: false },
  { id: 6, title: '운명의 수정구', description: '오늘의 운세를 확인했습니다', unlocked: false },
  { id: 7, title: '리프탄 소환', description: '리프탄을 방에 초대했습니다', unlocked: false },
  { id: 8, title: '방문자', description: '다른 사람의 서재를 방문했습니다', unlocked: false },
  { id: 9, title: '???', description: '???', unlocked: false },
  { id: 10, title: '???', description: '???', unlocked: false },
];

function AchievementModal({ onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose} onKeyDown={e => e.stopPropagation()}>
      <div style={styles.wrapper} onClick={e => e.stopPropagation()}>
        <img src="/assets/backgrounds/achievement_bg.webp" alt="업적 배경" style={styles.bgImg} />
        <div style={styles.content}>
          <div style={styles.grid}>
            {ACHIEVEMENTS.map(ach => (
              <div key={ach.id} style={{ ...styles.slot, ...(ach.unlocked ? styles.slotUnlocked : {}) }}>
                <span style={styles.slotIcon}>{ach.unlocked ? '⭐' : '?'}</span>
                <span style={styles.slotTitle}>{ach.unlocked ? ach.title : '???'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button style={styles.closeBtn} onClick={onClose}>✕ 닫기</button>
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
    padding: 'clamp(30px, 5vw, 50px) clamp(20px, 4vw, 40px)',
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 'clamp(6px, 1.2vw, 12px)',
    width: '100%',
  },
  slot: {
    aspectRatio: '1',
    background: 'rgba(40, 30, 20, 0.7)',
    border: '2px solid #5c4020',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    cursor: 'default',
    opacity: 0.5,
  },
  slotUnlocked: {
    opacity: 1,
    background: 'rgba(60, 40, 20, 0.8)',
    border: '2px solid #d4a843',
    boxShadow: '0 0 8px rgba(212, 168, 67, 0.3)',
  },
  slotIcon: {
    fontSize: 'clamp(16px, 2.5vw, 24px)',
  },
  slotTitle: {
    fontSize: 'clamp(8px, 1.2vw, 11px)',
    color: '#f5e6c8',
    textAlign: 'center',
    fontWeight: 'bold',
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
