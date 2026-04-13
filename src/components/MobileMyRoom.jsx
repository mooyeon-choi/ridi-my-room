import React, { useState, useEffect, useRef } from 'react';
import PhaserGame from './PhaserGame';
import RewardModal from './RewardModal';
import { useMobileDims, useMobileUISlot } from './MobileLayout';

function MobileMyRoom() {
  const userId = 'user123';
  const [currentAction, setCurrentAction] = useState('idle');
  const [monologue, setMonologue] = useState('');
  const [showReward, setShowReward] = useState(false);
  const lastMonologueTime = useRef(0);
  const gameRef = useRef(null);
  const dims = useMobileDims();
  const setUIContent = useMobileUISlot();

  // 뒤로가기로 돌아왔을 때 모달 표시
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

  useEffect(() => {
    if (currentAction !== 'idle') {
      const now = Date.now();
      const elapsed = now - lastMonologueTime.current;
      if (elapsed >= 8000) {
        lastMonologueTime.current = now;
        generateMonologue(currentAction);
      }
    }
  }, [currentAction]);

  // 하단 UI 슬롯에 UI 마운트
  useEffect(() => {
    setUIContent(<BottomUI monologue={monologue} />);
    return () => setUIContent(null);
  }, [monologue]);

  async function generateMonologue(action) {
    try {
      const response = await fetch('/api/monologue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action,
          persona: 'sangsuri',
          context: {
            recentBooks: ['전지적 독자 시점', '달빛조각사'],
            favoriteGenres: ['판타지', '로맨스']
          }
        })
      });

      if (!response.ok) throw new Error('API 호출 실패');
      const data = await response.json();
      setMonologue(data.monologue);
      setTimeout(() => setMonologue(''), 4000);
    } catch (error) {
      const fallbackMonologues = {
        walking: '오늘은 산책하기 좋은 날이네.',
        reading: '이 책 정말 재미있어.',
        lookingWindow: '창밖 풍경이 참 좋구나.',
        organizing: '읽었던 책들이 추억이네.',
        sitting: '여기 앉아 있으니 차분해져.'
      };
      setMonologue(fallbackMonologues[action] || '좋은 하루야.');
      setTimeout(() => setMonologue(''), 4000);
    }
  }

  const w = dims ? dims.width : window.innerWidth;
  const h = dims ? dims.height : window.innerHeight;

  return (
    <>
      <div style={{ width: w + 'px', height: h + 'px', position: 'relative', background: '#2a2018' }}>
        <PhaserGame
          ref={gameRef}
          mode="owner"
          userId={userId}
          onActionChange={setCurrentAction}
          parentWidth={w}
          parentHeight={h}
        />
      </div>

      {showReward && (
        <RewardModal
          onConfirm={() => setShowReward(false)}
          onCancel={() => setShowReward(false)}
        />
      )}
    </>
  );
}

// 게임 오버레이 위에 렌더링 — 게임 화면 하단에 붙음
function BottomUI({ monologue }) {
  return (
    <div style={styles.uiRow}>
      <div style={styles.portraitWrapper}>
        <img
          src="/assets/characters/portraits/maxy.png"
          alt="맥시"
          style={styles.portraitImg}
        />
      </div>
      <div style={styles.dialogueBox}>
        <span style={styles.dialogueText}>
          {monologue || '맥시 : 어서 와, 내 서재에 온 걸 환영해!'}
        </span>
      </div>
    </div>
  );
}

const styles = {
  uiRow: {
    position: 'absolute',
    bottom: '40px',
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px 0 0'
  },
  portraitWrapper: {
    flexShrink: 0,
    zIndex: 1,
    position: 'relative'
  },
  portraitImg: {
    height: '120px',
    width: 'auto',
    display: 'block',
    filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.5))'
  },
  dialogueBox: {
    flex: 1,
    marginLeft: '-36px',
    transform: 'translateY(20px)',
    background: 'linear-gradient(135deg, #f0ddb8 0%, #e8cfa0 50%, #dcc090 100%)',
    borderRadius: '16px',
    padding: '10px 16px 10px 36px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
    border: '2px solid #c4a060'
  },
  dialogueText: {
    color: '#3d2210',
    fontSize: '13px',
    lineHeight: '1.5',
    fontWeight: '500'
  }
};

export default MobileMyRoom;
