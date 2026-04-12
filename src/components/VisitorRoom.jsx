import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PhaserGame from './PhaserGame';
import ChatBox from './ChatBox';

function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

function VisitorRoom() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [portrait, setPortrait] = useState(isPortrait());
  const gameRef = useRef(null);

  useEffect(() => {
    function handleResize() { setPortrait(isPortrait()); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadRoomData();
  }, [userId]);

  useEffect(() => {
    async function lockOrientation() {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen().catch(() => {});
        }
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock(showChat ? 'portrait' : 'landscape').catch(() => {});
        }
      } catch (e) {}
    }
    lockOrientation();
  }, [showChat]);

  async function loadRoomData() {
    try {
      const dummyRoomData = {
        userId: userId,
        roomConfig: {
          furniture: [
            { id: 'desk_01', type: 'desk', x: 250, y: 200 },
            { id: 'bookshelf_01', type: 'bookshelf', x: 100, y: 150 }
          ],
          theme: 'default'
        },
        aiConfig: {
          persona: 'sangsuri',
          customGreeting: '안녕하세요. 책 향기 가득한 서재에 오신 것을 환영합니다.',
          readingData: {
            recentBooks: ['전지적 독자 시점', '달빛조각사', '나 혼자만 레벨업'],
            favoriteGenres: ['판타지', '로맨스'],
            totalBooksRead: 15
          }
        }
      };
      setRoomData(dummyRoomData);
      setLoading(false);
    } catch (error) {
      console.error('서재 데이터 로딩 오류:', error);
      setLoading(false);
    }
  }

  function setTouchDir(dir, pressed) {
    const scene = gameRef.current?.getScene();
    if (scene && scene.touchDir) {
      scene.touchDir[dir] = pressed;
    }
  }

  function handleDirDown(dir) { setTouchDir(dir, true); }
  function handleDirUp(dir) { setTouchDir(dir, false); }

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

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div className="loading"></div>
        <p style={{ color: '#fff' }}>서재 로딩 중...</p>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div style={styles.loadingScreen}>
        <h2 style={{ color: '#fff' }}>서재를 찾을 수 없습니다</h2>
        <button onClick={() => navigate('/')} style={styles.exitBtn}>홈으로</button>
      </div>
    );
  }

  // === 채팅 모드 ===
  if (showChat) {
    const needRotate = !portrait;
    const wrapStyle = needRotate ? {
      position: 'fixed', top: 0, left: 0,
      width: '100vh', height: '100vw',
      transform: 'rotate(-90deg) translateX(-100%)',
      transformOrigin: 'top left', overflow: 'hidden'
    } : {
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%', overflow: 'hidden'
    };

    return (
      <div style={wrapStyle}>
        <div style={styles.portraitContainer}>
          {!inputFocused && (
            <div style={styles.portraitGame}>
              <PhaserGame
                ref={gameRef}
                mode="visitor"
                hostUserId={userId}
                roomConfig={roomData.roomConfig}
                aiConfig={roomData.aiConfig}
              />
            </div>
          )}
          <div style={inputFocused ? styles.portraitChatFull : styles.portraitChat}>
            <div style={styles.portraitChatHeader}>
              <span style={styles.chatTitle}>{userId}님의 AI와 대화</span>
              <button style={styles.chatCloseBtn} onClick={() => setShowChat(false)}>✕ 게임으로</button>
            </div>
            <div style={styles.portraitChatBody}>
              <ChatBox
                hostUserId={userId}
                aiConfig={roomData.aiConfig}
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
  const needRotate = portrait;
  const wrapStyle = needRotate ? {
    position: 'fixed', top: 0, left: 0,
    width: '100vh', height: '100vw',
    transform: 'rotate(90deg) translateY(-100%)',
    transformOrigin: 'top left', overflow: 'hidden'
  } : {
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%', overflow: 'hidden'
  };

  return (
    <div style={wrapStyle}>
      <div style={styles.container}>
        <div style={styles.gameContainer}>
          <PhaserGame
            ref={gameRef}
            mode="visitor"
            hostUserId={userId}
            roomConfig={roomData.roomConfig}
            aiConfig={roomData.aiConfig}
          />
        </div>

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

        <div style={styles.rightButtons}>
          <button style={styles.actionBtn} onClick={() => setShowChat(true)}>
            <span style={styles.btnIcon}>💬</span>
          </button>
          <button style={styles.actionBtn} onClick={() => navigate('/')}>
            <span style={styles.btnIcon}>🚪</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    background: '#000'
  },
  gameContainer: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%'
  },
  loadingScreen: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    gap: '16px', background: '#000'
  },

  dpad: {
    position: 'absolute',
    bottom: '16px', left: '16px',
    zIndex: 10,
    display: 'flex', flexDirection: 'column',
    gap: '2px', opacity: 0.6
  },
  dpadRow: {
    display: 'flex', gap: '2px', justifyContent: 'center'
  },
  dpadBtn: {
    width: '52px', height: '52px',
    borderRadius: '12px',
    border: '2px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.4)',
    color: '#fff', fontSize: '20px', fontWeight: 'bold',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none',
    touchAction: 'none', WebkitTapHighlightColor: 'transparent', outline: 'none'
  },
  dpadSpacer: { width: '52px', height: '52px' },

  rightButtons: {
    position: 'absolute',
    bottom: '16px', right: '16px',
    zIndex: 10, display: 'flex', flexDirection: 'column',
    gap: '12px', opacity: 0.6
  },
  actionBtn: {
    width: '56px', height: '56px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.4)',
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    userSelect: 'none', WebkitTapHighlightColor: 'transparent', outline: 'none'
  },
  btnIcon: { fontSize: '24px', lineHeight: 1 },
  exitBtn: {
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.2)',
    color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
  },

  portraitContainer: {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    background: '#1a1a1a', overflow: 'hidden'
  },
  portraitGame: {
    width: '100%', height: '40%', minHeight: '180px',
    background: '#000', flexShrink: 0
  },
  portraitChat: {
    flex: 1, display: 'flex', flexDirection: 'column',
    overflow: 'hidden', background: '#1e1e1e'
  },
  portraitChatFull: {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden', background: '#1e1e1e'
  },
  portraitChatHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0
  },
  chatTitle: { color: '#fff', fontSize: '16px', fontWeight: 'bold' },
  chatCloseBtn: {
    padding: '6px 14px', borderRadius: '16px', border: 'none',
    background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
  },
  portraitChatBody: {
    flex: 1, overflow: 'hidden',
    display: 'flex', flexDirection: 'column'
  }
};

export default VisitorRoom;
