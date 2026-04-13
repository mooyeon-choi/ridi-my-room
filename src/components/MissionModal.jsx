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
    gap: '8px',
  },
  modal: {
    width: '640px',
    background: '#c8934a',
    border: '4px solid #5c3018',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
  },
  missionList: {
    background: '#d4a85a',
    border: '3px solid #5c3018',
    borderRadius: '6px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minHeight: '300px',
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
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    justifyContent: 'center',
  },
  missionTitle: {
    color: '#f0c060',
    fontSize: '15px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  missionDesc: {
    color: '#f5e6c8',
    fontSize: '13px',
  },
  rewardSection: {
    background: '#c8934a',
    borderLeft: '2px solid #7a4e28',
    padding: '8px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
    minWidth: '220px',
  },
  rewardBadge: {
    background: '#f5e6c8',
    color: '#3d2210',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '3px',
  },
  rewardItems: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  rewardSlot: {
    width: '52px',
    height: '52px',
    background: '#d4a85a',
    border: '2px solid #7a4e28',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardImg: {
    width: '44px',
    height: '44px',
    objectFit: 'contain',
    imageRendering: 'pixelated',
  },
  rewardText: {
    color: '#3d2210',
    fontSize: '13px',
    fontWeight: 'bold',
    lineHeight: '1.4',
    whiteSpace: 'pre-line',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginRight: 'calc(50% - 320px)', // modal 우측 끝에 맞춤
    background: '#5c3018',
    border: '2px solid #7a4e28',
    borderRadius: '4px',
    color: '#f5e6c8',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '10px 24px',
    cursor: 'pointer',
  },
};

export default MissionModal;
