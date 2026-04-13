import React, { useState, useEffect, useRef } from 'react';
import PhaserGame from './PhaserGame';
import QRCodeModal from './QRCodeModal';
import RewardModal from './RewardModal';
import MissionModal from './MissionModal';

const SIDE_BUTTONS = [
  { key: 'mission',  label: '미션' },
  { key: 'library',  label: '나의 서재' },
  { key: 'item',     label: '아이템' },
  { key: 'share',    label: '자랑하기' },
];

const SLOT_COUNT = 10;

const GREETING_TEXT = '맥시 : 오늘도 독서 열심히 해보자!';
const TYPING_SPEED = 50; // ms per character
const DISPLAY_DURATION = 3000; // ms after typing finishes

function MyRoom() {
  const userId = 'user123';
  const [currentAction, setCurrentAction] = useState('idle');
  const [showQR, setShowQR] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [activeSlot, setActiveSlot] = useState(0);
  const [showGreeting, setShowGreeting] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const lastMonologueTime = useRef(0);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!showGreeting) return;
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      i++;
      setDisplayedText(GREETING_TEXT.slice(0, i));
      if (i >= GREETING_TEXT.length) {
        clearInterval(interval);
        setTimeout(() => setShowGreeting(false), DISPLAY_DURATION);
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0 && navEntries[0].type === 'back_forward') {
      setShowReward(true);
    }
    function handlePageShow(e) {
      if (e.persisted) setShowReward(true);
    }
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return (
    <div style={styles.container}>

      {/* 상단 타이틀 */}
      <div style={styles.titleBar}>
        <span style={styles.titleText}>{userId}의 리디룸</span>
      </div>

      {/* 중단: 게임 + 사이드 버튼 */}
      <div style={styles.middleRow}>
        {/* 게임 영역 */}
        <div style={styles.gameWrapper}>
          <div style={styles.gameArea}>
            <PhaserGame
              ref={gameRef}
              mode="owner"
              userId={userId}
              onActionChange={setCurrentAction}
            />
          </div>
        </div>

        {/* 우측 사이드 버튼 */}
        <div style={styles.sideButtons}>
          {SIDE_BUTTONS.map(btn => (
            <button
              key={btn.key}
              style={styles.sideBtn}
              onClick={() => btn.key === 'mission' && setShowMission(true)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 미션 모달 — 전체 화면 오버레이 */}
      {showMission && (
        <MissionModal onClose={() => setShowMission(false)} />
      )}

      {/* 하단 슬롯 바 + 대화창 wrapper */}
      <div style={styles.bottomWrapper}>
        {/* 진입 인사 대화창 — 슬롯 바 위에 겹침 */}
        {showGreeting && (
          <div style={styles.dialogueOverlay}>
            <div style={styles.portraitWrapper}>
              <img
                src="/assets/characters/portraits/maxy.png"
                alt="맥시"
                style={styles.portraitImg}
              />
            </div>
            <div style={styles.dialogueBox}>
              <span style={styles.dialogueText}>{displayedText}</span>
            </div>
          </div>
        )}

        {/* 슬롯 바 */}
        <div style={styles.slotBar}>
          {Array.from({ length: SLOT_COUNT }, (_, i) => (
            <button
              key={i}
              style={{
                ...styles.slot,
                ...(activeSlot === i ? styles.slotActive : {})
              }}
              onClick={() => setActiveSlot(i)}
            >
              <span style={styles.slotNumber}>{i === 9 ? 0 : i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {showQR && (
        <QRCodeModal
          url={`${window.location.origin}/${userId}/room`}
          onClose={() => setShowQR(false)}
        />
      )}
      {showReward && (
        <RewardModal
          onConfirm={() => setShowReward(false)}
          onCancel={() => setShowReward(false)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a0505',
    position: 'fixed',
    top: 0,
    left: 0,
    gap: '16px',
  },

  // 타이틀 바
  titleBar: {
    background: '#3a1010',
    border: '1px solid #6b2a2a',
    borderRadius: '4px',
    padding: '10px 48px',
  },
  titleText: {
    color: '#ffffff',
    fontSize: '18px',
    letterSpacing: '1px',
  },

  // 중단 행
  middleRow: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  // 게임 래퍼 (픽셀 아트 프레임 느낌)
  gameWrapper: {
    position: 'relative',
    border: '3px solid #6b3a1a',
    borderRadius: '8px',
    background: '#2a1a0a',
    padding: '4px',
  },
  gameArea: {
    width: '560px',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    borderRadius: '4px',
  },

  // 사이드 버튼
  sideButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sideBtn: {
    width: '110px',
    padding: '14px 0',
    background: '#3a1010',
    border: '1px solid #6b2a2a',
    borderRadius: '4px',
    color: '#ffffff',
    fontSize: '16px',
    cursor: 'pointer',
    letterSpacing: '1px',
    transition: 'background 0.15s',
  },

  // 하단 wrapper
  bottomWrapper: {
    position: 'relative',
  },

  // 진입 인사 대화창
  dialogueOverlay: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    height: '0',
    zIndex: 30,
  },
  portraitWrapper: {
    position: 'absolute',
    bottom: '-70px',
    left: '-90px',
    width: '190px',
    zIndex: 31,
    pointerEvents: 'none',
  },
  portraitImg: {
    width: '100%',
    height: 'auto',
    display: 'block',
    filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.4))',
  },
  dialogueBox: {
    position: 'absolute',
    bottom: '-20px',
    left: '-30px',
    right: '-28px',
    background: 'linear-gradient(135deg, #f0ddb8 0%, #e8cfa0 50%, #dcc090 100%)',
    borderRadius: '9999px',
    padding: '12px 20px 12px 130px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
    border: '3px solid #753F22',
  },
  dialogueText: {
    color: '#3d2210',
    fontSize: '18px',
    lineHeight: '1.5',
    fontWeight: '500',
    flex: 1,
  },
  // 슬롯 바
  slotBar: {
    display: 'flex',
    gap: '6px',
    background: '#3a2010',
    border: '2px solid #6b3a1a',
    borderRadius: '6px',
    padding: '8px 10px',
  },
  slot: {
    width: '60px',
    height: '60px',
    background: '#e8d4a0',
    border: '2px solid #a07840',
    borderRadius: '4px',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: '3px',
  },
  slotActive: {
    border: '2px solid #fff8c0',
    boxShadow: '0 0 6px rgba(255,240,150,0.6)',
  },
  slotNumber: {
    fontSize: '10px',
    color: '#5c3a1e',
    lineHeight: 1,
  },
};

export default MyRoom;
