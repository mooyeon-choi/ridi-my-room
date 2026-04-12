import React, { useState, useEffect, useRef, useCallback } from 'react';
import PhaserGame from './PhaserGame';
import QRCodeModal from './QRCodeModal';
import ChatBox from './ChatBox';

// 현재 기기가 세로 상태인지 판별
function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

function MyRoom() {
  const userId = 'user123';
  const [currentAction, setCurrentAction] = useState('idle');
  const [monologue, setMonologue] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [portrait, setPortrait] = useState(isPortrait());
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });
  const lastMonologueTime = useRef(0);
  const gameRef = useRef(null);

  // 화면 방향 감지
  useEffect(() => {
    function handleResize() {
      setPortrait(isPortrait());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // orientation lock 시도
  useEffect(() => {
    async function lockOrientation() {
      try {
        // 전체화면 진입 시도 (orientation lock 필요)
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen().catch(() => {});
        }
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock(showChat ? 'portrait' : 'landscape').catch(() => {});
        }
      } catch (e) {
        // 무시
      }
    }
    lockOrientation();
  }, [showChat]);

  useEffect(() => {
    if (currentAction !== 'idle') {
      const now = Date.now();
      const elapsed = now - lastMonologueTime.current;
      if (elapsed >= 5000) {
        lastMonologueTime.current = now;
        generateMonologue(currentAction);
      }
    }
  }, [currentAction]);

  function setTouchDir(dir, pressed) {
    const scene = gameRef.current?.getScene();
    if (scene && scene.touchDir) {
      scene.touchDir[dir] = pressed;
    }
  }

  function handleDirDown(dir) {
    setTouchDir(dir, true);
  }

  function handleDirUp(dir) {
    setTouchDir(dir, false);
  }

  async function generateMonologue(action) {
    try {
      const response = await fetch('/api/monologue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'user123',
          action: action,
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
      setTimeout(() => setMonologue(''), 3000);
    } catch (error) {
      console.error('혼잣말 생성 오류:', error);
      const fallbackMonologues = {
        walking: '오늘은 산책하기 좋은 날이네.',
        reading: '이 책 정말 재미있어.',
        lookingWindow: '창밖 풍경이 참 좋구나.',
        organizing: '읽었던 책들이 추억이네.',
        sitting: '여기 앉아 있으니 차분해져.'
      };
      setMonologue(fallbackMonologues[action] || '좋은 하루야.');
      setTimeout(() => setMonologue(''), 3000);
    }
  }

  function DirBtn({ dir, label }) {
    return (
      <button
        style={styles.dpadBtn}
        onTouchStart={(e) => { e.preventDefault(); handleDirDown(dir); }}
        onTouchEnd={(e) => { e.preventDefault(); handleDirUp(dir); }}
        onTouchCancel={(e) => { e.preventDefault(); handleDirUp(dir); }}
        onMouseDown={() => handleDirDown(dir)}
        onMouseUp={() => handleDirUp(dir)}
        onMouseLeave={() => handleDirUp(dir)}
      >{label}</button>
    );
  }

  // === 채팅 모드 ===
  if (showChat) {
    // 기기가 가로 상태인데 세로가 필요 → CSS로 강제 회전
    const needRotate = !portrait;
    const wrapStyle = needRotate ? {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vh',
      height: '100vw',
      transform: 'rotate(-90deg) translateX(-100%)',
      transformOrigin: 'top left',
      overflow: 'hidden'
    } : {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    };

    return (
      <div style={wrapStyle}>
        <div style={styles.portraitContainer}>
          {/* 상단: 게임 화면 (키보드 올라오면 숨김) */}
          {!inputFocused && (
            <div style={styles.portraitGame}>
              <PhaserGame
                ref={gameRef}
                mode="owner"
                userId={userId}
                onActionChange={setCurrentAction}
                onAvatarMove={setBubblePosition}
              />
            </div>
          )}

          {/* 채팅창 */}
          <div style={inputFocused ? styles.portraitChatFull : styles.portraitChat}>
            <div style={styles.portraitChatHeader}>
              <span style={styles.chatTitle}>채팅</span>
              <button style={styles.chatCloseBtn} onClick={() => setShowChat(false)}>✕ 게임으로</button>
            </div>
            <div style={styles.portraitChatBody}>
              <ChatBox
                hostUserId={userId}
                onInputFocus={() => setInputFocused(true)}
                onInputBlur={() => setInputFocused(false)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === 게임 모드 ===
  // 기기가 세로 상태인데 가로가 필요 → CSS로 강제 회전
  const needRotate = portrait;
  const wrapStyle = needRotate ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vh',
    height: '100vw',
    transform: 'rotate(90deg) translateY(-100%)',
    transformOrigin: 'top left',
    overflow: 'hidden'
  } : {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  };

  return (
    <div style={wrapStyle}>
      <div style={styles.container}>
        <div style={styles.gameContainer}>
          <PhaserGame
            ref={gameRef}
            mode="owner"
            userId={userId}
            onActionChange={setCurrentAction}
            onAvatarMove={setBubblePosition}
          />

          {monologue && (
            <div
              className="speech-bubble"
              style={{
                left: `${bubblePosition.x}px`,
                top: `${bubblePosition.y - 60}px`
              }}
            >
              {monologue}
            </div>
          )}
        </div>

        {/* 왼쪽 하단 - D-Pad */}
        <div style={styles.dpad}>
          <div style={styles.dpadRow}>
            <div style={styles.dpadSpacer} />
            <DirBtn dir="up" label="▲" />
            <div style={styles.dpadSpacer} />
          </div>
          <div style={styles.dpadRow}>
            <DirBtn dir="left" label="◀" />
            <div style={styles.dpadSpacer} />
            <DirBtn dir="right" label="▶" />
          </div>
          <div style={styles.dpadRow}>
            <div style={styles.dpadSpacer} />
            <DirBtn dir="down" label="▼" />
            <div style={styles.dpadSpacer} />
          </div>
        </div>

        {/* 오른쪽 하단 - 채팅 버튼 */}
        <button style={styles.chatBtn} onClick={() => setShowChat(true)}>
          <span style={styles.chatBtnIcon}>💬</span>
        </button>

        {showQR && (
          <QRCodeModal
            url={`${window.location.origin}/${userId}/room`}
            onClose={() => setShowQR(false)}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  // === 게임 모드 (가로) ===
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    background: '#000'
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },

  // D-Pad
  dpad: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    opacity: 0.6
  },
  dpadRow: {
    display: 'flex',
    gap: '2px',
    justifyContent: 'center'
  },
  dpadBtn: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    border: '2px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.4)',
    color: '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'none',
    WebkitTapHighlightColor: 'transparent',
    outline: 'none'
  },
  dpadSpacer: {
    width: '52px',
    height: '52px'
  },

  // 채팅 버튼
  chatBtn: {
    position: 'absolute',
    bottom: '40px',
    right: '24px',
    zIndex: 10,
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
    opacity: 0.6
  },
  chatBtnIcon: {
    fontSize: '26px',
    lineHeight: 1
  },

  // === 채팅 모드 (세로) ===
  portraitContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#1a1a1a',
    overflow: 'hidden'
  },
  portraitGame: {
    width: '100%',
    height: '40%',
    minHeight: '180px',
    background: '#000',
    flexShrink: 0
  },
  portraitChat: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#1e1e1e'
  },
  portraitChatFull: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#1e1e1e'
  },
  portraitChatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    flexShrink: 0
  },
  chatTitle: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  chatCloseBtn: {
    padding: '6px 14px',
    borderRadius: '16px',
    border: 'none',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  portraitChatBody: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }
};

export default MyRoom;
