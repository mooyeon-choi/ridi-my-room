import React from 'react';

const REWARD_INFO = {
  first_register: { img: '/assets/pets/cat_white.png', alt: '흰 고양이', name: '로라' },
  view_work:      { img: '/assets/pets/cat_black.png', alt: '검정 고양이', name: '리프' },
  purchase_work:  { img: '/assets/pets/cat_gray.png',  alt: '회색 고양이', name: '탄이' },
};

function RewardModal({ onConfirm, onCancel, missionId }) {
  const reward = REWARD_INFO[missionId] || REWARD_INFO.first_register;
  return (
    <div style={styles.overlay} onKeyDown={e => e.stopPropagation()}>
      <div style={styles.frame}>
        <div style={styles.inner}>
          <h2 style={styles.title}>미션 완료!</h2>
          <p style={styles.description}>{reward.name}를 얻었습니다!</p>

          <div style={styles.rewardImages}>
            <img src={reward.img} alt={reward.alt} style={styles.rewardImg} />
          </div>

          <p style={styles.question}>바로 적용하시겠습니까?</p>

          <div style={styles.buttons}>
            <button style={styles.btnNo} onClick={onCancel}>아니오</button>
            <button style={styles.btnYes} onClick={onConfirm}>예</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  frame: {
    background: '#c4a050',
    border: '4px solid #8b6914',
    borderRadius: '8px',
    padding: 'clamp(3px, 0.5vw, 5px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    maxWidth: 'clamp(280px, 50vw, 380px)',
    width: 'calc(100% - 40px)'
  },
  inner: {
    background: 'linear-gradient(180deg, #f5e6c8 0%, #e8d5a8 100%)',
    borderRadius: '4px',
    border: '2px solid #d4a843',
    padding: 'clamp(16px, 3vw, 28px) clamp(14px, 2.5vw, 24px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'clamp(10px, 2vh, 16px)'
  },
  title: {
    margin: 0,
    fontSize: 'clamp(16px, 2.5vw, 22px)',
    fontWeight: 'bold',
    color: '#3d2210',
    textAlign: 'center'
  },
  description: {
    margin: 0,
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    color: '#5c3a1e',
    textAlign: 'center'
  },
  rewardImages: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'clamp(6px, 1.5vw, 12px)',
    padding: 'clamp(4px, 1vh, 8px) 0'
  },
  rewardImg: {
    width: 'clamp(40px, 7vw, 64px)',
    height: 'clamp(40px, 7vw, 64px)',
    objectFit: 'contain',
    imageRendering: 'pixelated'
  },
  question: {
    margin: 0,
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    color: '#3d2210',
    textAlign: 'center'
  },
  buttons: {
    display: 'flex',
    gap: 'clamp(6px, 1.5vw, 12px)',
    marginTop: '4px'
  },
  btnNo: {
    width: 'clamp(80px, 12vw, 120px)',
    padding: 'clamp(6px, 1vh, 10px) 0',
    borderRadius: '6px',
    border: '2px solid #5c3322',
    background: '#fff',
    color: '#5c3322',
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  btnYes: {
    width: 'clamp(80px, 12vw, 120px)',
    padding: 'clamp(6px, 1vh, 10px) 0',
    borderRadius: '6px',
    border: '2px solid #5c3322',
    background: '#5c3322',
    color: '#f5e6c8',
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default RewardModal;
