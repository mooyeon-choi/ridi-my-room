import React, { useState, useEffect, useRef, useCallback } from 'react';
import PhaserGame from './PhaserGame';
import QRCodeModal from './QRCodeModal';
import ChatBox from './ChatBox';
import RewardModal from './RewardModal';

function MyRoom() {
  const userId = 'user123';
  const [currentAction, setCurrentAction] = useState('idle');
  const [monologue, setMonologue] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const lastMonologueTime = useRef(0);
  const gameRef = useRef(null);

  // 뒤로가기로 돌아왔을 때 (앞으로가기 히스토리가 존재할 때) 모달 표시
  useEffect(() => {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0 && navEntries[0].type === 'back_forward') {
      setShowReward(true);
    }

    function handlePageShow(e) {
      if (e.persisted) {
        setShowReward(true);
      }
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

  function renderTabContent() {
    switch (activeTab) {
      case 'chat':
        return <ChatBox hostUserId={userId} />;
      case 'guestbook':
        return (
          <div style={styles.placeholderTab}>
            <p style={styles.placeholderText}>아직 방명록이 없습니다.</p>
            <p style={styles.placeholderSubtext}>방문자가 남긴 메시지가 여기에 표시됩니다.</p>
          </div>
        );
      case 'stats':
        return (
          <div style={styles.placeholderTab}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>읽은 책</span>
              <span style={styles.statValue}>23권</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>레벨</span>
              <span style={styles.statValue}>Lv.5</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>방문자</span>
              <span style={styles.statValue}>42명</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>포인트</span>
              <span style={styles.statValue}>1,200P</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div style={styles.container}>
      {/* === 상단: 배경 + 아바타 영역 === */}
      <div style={styles.topSection}>
        <div style={styles.gameArea}>
          <PhaserGame
            ref={gameRef}
            mode="owner"
            userId={userId}
            onActionChange={setCurrentAction}
          />
        </div>
      </div>

      {/* === 캐릭터 일러스트 + 대사 박스 (게임과 인터페이스 사이에 걸침) === */}
      <div style={styles.dialogueOverlay}>
        {/* 캐릭터 일러스트 */}
        <div style={styles.portraitWrapper}>
          <img
            src="/assets/characters/portraits/maxy.png"
            alt="맥시"
            style={styles.portraitImg}
          />
        </div>
        {/* 대사 박스 */}
        <div style={styles.dialogueBox}>
          <span style={styles.dialogueText}>
            {monologue || '맥시 : 어서 와, 내 서재에 온 걸 환영해!'}
          </span>
        </div>
      </div>

      {/* === 하단: 나무 프레임 인터페이스 === */}
      <div style={styles.woodFrame}>
        <div style={styles.woodFrameInner}>
          {/* 상단 헤더 바 */}
          <div style={styles.panelHeader}>
            <div style={styles.headerTitleArea}>
              <span style={styles.headerTitle}>{userId}의 서재</span>
            </div>
            <div style={styles.headerBtnArea}>
              {[
                { key: 'chat', label: '채팅' },
                { key: 'guestbook', label: '방명록' },
                { key: 'stats', label: '통계' },
              ].map(tab => (
                <button
                  key={tab.key}
                  style={{
                    ...styles.headerBtn,
                    ...(activeTab === tab.key ? styles.headerBtnActive : {})
                  }}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 콘텐츠 영역 */}
          <div style={styles.panelContent}>
            {renderTabContent()}
          </div>
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
    background: '#1a1a1a',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0
  },

  // === 상단: 게임 영역 ===
  topSection: {
    position: 'relative',
    width: '100%',
    flexShrink: 0,
    background: '#2a2018',
    display: 'flex',
    justifyContent: 'center'
  },
  gameArea: {
    width: '100%',
    maxWidth: '746px',
    aspectRatio: '16 / 9',
    overflow: 'hidden'
  },

  // === 캐릭터 일러스트 + 대사 박스 ===
  dialogueOverlay: {
    position: 'relative',
    width: '100%',
    height: '0',
    zIndex: 30
  },
  portraitWrapper: {
    position: 'absolute',
    bottom: '-50px',
    left: '0px',
    width: '110px',
    zIndex: 31,
    pointerEvents: 'none'
  },
  portraitImg: {
    width: '100%',
    height: 'auto',
    display: 'block',
    filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.4))'
  },
  dialogueBox: {
    position: 'absolute',
    bottom: '-24px',
    left: '50px',
    right: '12px',
    background: 'linear-gradient(135deg, #f0ddb8 0%, #e8cfa0 50%, #dcc090 100%)',
    borderRadius: '20px',
    padding: '10px 16px 10px 60px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
    border: '2px solid #c4a060'
  },
  dialogueText: {
    color: '#3d2210',
    fontSize: '13px',
    lineHeight: '1.5',
    fontWeight: '500'
  },

  // === 하단: 나무 프레임 UI ===
  woodFrame: {
    flex: 1,
    background: '#5c3a1e',
    borderTop: '4px solid #3d2210',
    padding: '6px',
    paddingTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  woodFrameInner: {
    flex: 1,
    border: '3px solid #8b6914',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#d4a843'
  },

  // 헤더 바 (상단)
  panelHeader: {
    display: 'flex',
    flexShrink: 0,
    margin: '6px 6px 0 6px',
    borderRadius: '3px',
    overflow: 'hidden',
    border: '2px solid #8b6914'
  },
  headerTitleArea: {
    flex: 1,
    background: '#5c3322',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    color: '#f5e6c8',
    fontSize: '13px',
    fontWeight: 'bold',
    letterSpacing: '0.5px'
  },
  headerBtnArea: {
    display: 'flex',
    gap: '6px',
    background: '#e8cfa0',
    padding: '6px 8px',
    alignItems: 'center'
  },
  headerBtn: {
    width: '42px',
    height: '32px',
    borderRadius: '4px',
    border: '2px solid #8b6914',
    background: '#a07030',
    color: '#f5e6c8',
    fontSize: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s'
  },
  headerBtnActive: {
    background: '#5c3322',
    borderColor: '#d4a843',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)'
  },

  // 콘텐츠 영역
  panelContent: {
    flex: 1,
    margin: '6px',
    background: '#dcb86a',
    borderRadius: '3px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },

  // 플레이스홀더
  placeholderTab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    gap: '8px'
  },
  placeholderText: {
    color: '#5c3a1e',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  placeholderSubtext: {
    color: '#8b6914',
    fontSize: '12px'
  },

  // 통계
  statItem: {
    width: '100%',
    maxWidth: '280px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(92,58,30,0.15)'
  },
  statLabel: {
    color: '#5c3a1e',
    fontSize: '14px'
  },
  statValue: {
    color: '#3d2210',
    fontSize: '14px',
    fontWeight: 'bold'
  }
};

export default MyRoom;
