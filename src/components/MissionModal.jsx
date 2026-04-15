import React from 'react';

const MISSIONS = [
  {
    id: 1,
    title: '컬렉션 자랑하기',
    description: '나의서재에 새 컬렉션 추가하고 자랑하기',
    rewards: [
      { img: '/assets/pets/cat_white.png', alt: '흰 고양이' },
      { img: '/assets/pets/cat_black.png', alt: '검은 고양이' },
      { img: '/assets/pets/cat_gray.png',  alt: '회색 고양이' },
    ],
    rewardText: '맥시의 새끼\n고양이 3마리',
  },
];

function MissionModal({ onClose }) {
  return (
    <div style={styles.overlay}>
      {/* 모달 본체 */}
      <div style={styles.modal}>
        <div style={styles.missionList}>
          {MISSIONS.map(mission => (
            <div key={mission.id} style={styles.missionRow}>
              {/* 좌측: 제목 + 설명 */}
              <div style={styles.missionInfo}>
                <span style={styles.missionTitle}>{mission.title}</span>
                <span style={styles.missionDesc}>{mission.description}</span>
              </div>

              {/* 우측: 보상 */}
              <div style={styles.rewardSection}>
                <div style={styles.rewardBadge}>보상</div>
                <div style={styles.rewardItems}>
                  {mission.rewards.map((r, i) => (
                    <div key={i} style={styles.rewardSlot}>
                      <img src={r.img} alt={r.alt} style={styles.rewardImg} />
                    </div>
                  ))}
                  <span style={styles.rewardText}>{mission.rewardText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 닫기 버튼 — 모달 우측 하단 바깥 */}
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
  },
  modal: {
    width: 'clamp(320px, 80vw, 640px)',
    background: '#c8934a',
    border: '4px solid #5c3018',
    borderRadius: '8px',
    padding: 'clamp(8px, 1.5vw, 12px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
  },
  missionList: {
    background: '#d4a85a',
    border: '3px solid #5c3018',
    borderRadius: '6px',
    padding: 'clamp(8px, 1.5vw, 12px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(4px, 1vw, 8px)',
    minHeight: 'clamp(200px, 30vh, 300px)',
  },
  missionRow: {
    display: 'flex',
    alignItems: 'stretch',
    background: '#5c3018',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '2px solid #7a4e28',
  },
  missionInfo: {
    flex: 1,
    padding: 'clamp(8px, 1.5vw, 14px) clamp(10px, 2vw, 16px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(3px, 0.5vw, 6px)',
    justifyContent: 'center',
  },
  missionTitle: {
    color: '#f0c060',
    fontSize: 'clamp(12px, 1.8vw, 15px)',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  missionDesc: {
    color: '#f5e6c8',
    fontSize: 'clamp(11px, 1.5vw, 13px)',
  },
  rewardSection: {
    background: '#c8934a',
    borderLeft: '2px solid #7a4e28',
    padding: 'clamp(6px, 1vw, 8px) clamp(8px, 1.5vw, 12px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 'clamp(3px, 0.5vw, 6px)',
    minWidth: 'clamp(160px, 30vw, 220px)',
  },
  rewardBadge: {
    background: '#f5e6c8',
    color: '#3d2210',
    fontSize: 'clamp(9px, 1.2vw, 11px)',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '3px',
  },
  rewardItems: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(3px, 0.6vw, 6px)',
  },
  rewardSlot: {
    width: 'clamp(36px, 6vw, 52px)',
    height: 'clamp(36px, 6vw, 52px)',
    background: '#d4a85a',
    border: '2px solid #7a4e28',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardImg: {
    width: 'clamp(28px, 5vw, 44px)',
    height: 'clamp(28px, 5vw, 44px)',
    objectFit: 'contain',
    imageRendering: 'pixelated',
  },
  rewardText: {
    color: '#3d2210',
    fontSize: 'clamp(10px, 1.5vw, 13px)',
    fontWeight: 'bold',
    lineHeight: '1.4',
    whiteSpace: 'pre-line',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginRight: 'calc(50% - clamp(160px, 40vw, 320px))',
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

export default MissionModal;
