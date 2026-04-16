import React from 'react';

const MISSIONS = [
  {
    id: 'first_register',
    title: '첫 작품 등록',
    description: '서재가 텅 비었잖아! 첫 작품을 들여놓자',
    reward: { img: '/assets/pets/cat_white.png', alt: '흰 고양이' },
    rewardText: '로라',
    secretComplete: false,
  },
  {
    id: 'view_work',
    title: '작품 감상하기',
    description: '눈으로 읽어야 진짜 독서! 작품 속으로 빠져보자',
    reward: { img: '/assets/pets/cat_black.png', alt: '검정 고양이' },
    rewardText: '리프',
    secretComplete: true,
  },
  {
    id: 'purchase_work',
    title: '작품 결제하기',
    description: '좋은 작품엔 지갑을 열어야지! 작가님 응원 고고',
    reward: { img: '/assets/pets/cat_gray.png', alt: '회색 고양이' },
    rewardText: '탄이',
    secretComplete: true,
  },
];

function MissionModal({ onClose, completedMissions = {}, onSecretComplete }) {
  return (
    <div style={styles.overlay} onClick={onClose} onKeyDown={e => e.stopPropagation()}>
      {/* 모달 본체 */}
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.missionList}>
          {MISSIONS.map(mission => {
            const completed = completedMissions[mission.id];
            const canSecret = mission.secretComplete && !completed && onSecretComplete;
            return (
              <div key={mission.id} style={{ ...styles.missionRow, ...(completed ? styles.missionRowCompleted : {}) }}>
                {/* 좌측: 제목 + 설명 */}
                <div style={styles.missionInfo}>
                  <span style={styles.missionTitle}>
                    {completed && <span style={styles.checkIcon}>✓ </span>}
                    {mission.title}
                  </span>
                  <span style={styles.missionDesc}>{mission.description}</span>
                </div>

                {/* 우측: 보상 */}
                <div
                  style={styles.rewardSection}
                  onClick={canSecret ? () => onSecretComplete(mission.id) : undefined}
                >
                  <div style={styles.rewardBadge}>{completed ? '완료' : '보상'}</div>
                  <div style={styles.rewardItems}>
                    <div style={styles.rewardSlot}>
                      <img src={mission.reward.img} alt={mission.reward.alt} style={styles.rewardImg} />
                    </div>
                    <span style={styles.rewardText}>{mission.rewardText}</span>
                  </div>
                </div>
              </div>
            );
          })}
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
    background: 'rgba(0, 0, 0, 0.5)',
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
  missionRowCompleted: {
    opacity: 0.6,
    border: '2px solid #4ade80',
  },
  checkIcon: {
    color: '#4ade80',
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
