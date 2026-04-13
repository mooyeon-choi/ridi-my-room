import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PhaserGame from './PhaserGame';
import ChatBox from './ChatBox';

// 유저별 방 설정 (배경 테마)
const USER_ROOM_DATA = {
  default: {
    background: '/assets/backgrounds/background_default.png',
    greeting: '안녕하세요! 기본 서재에 오신 것을 환영합니다.',
    theme: 'default',
  },
  modern_user: {
    background: '/assets/backgrounds/background_modern.png',
    greeting: '어서와, 내 현대식 서재야!',
    theme: 'modern',
  },
  wuxia_user: {
    background: '/assets/backgrounds/background_wuxia.png',
    greeting: '어서 오거라, 강호의 벗이여!',
    theme: 'wuxia',
  },
  apocalypse_user: {
    background: '/assets/backgrounds/background_apocalypse.png',
    greeting: '살아남았군... 여긴 내 은신처야.',
    theme: 'apocalypse',
  },
};

const TYPING_SPEED = 50;
const DISPLAY_DURATION = 3000;

function VisitorRoom() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGreeting, setShowGreeting] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [visitUserId, setVisitUserId] = useState('');
  const [showVisitInput, setShowVisitInput] = useState(false);
  const gameRef = useRef(null);

  useEffect(() => {
    loadRoomData();
  }, [userId]);

  useEffect(() => {
    if (!roomData) return;
    setShowGreeting(true);
    setDisplayedText('');
    const text = roomData.aiConfig.customGreeting;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => setShowGreeting(false), DISPLAY_DURATION);
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, [roomData]);

  async function loadRoomData() {
    try {
      const userRoom = USER_ROOM_DATA[userId] || USER_ROOM_DATA['default'];
      setRoomData({
        userId,
        roomConfig: {
          theme: userRoom.theme,
          background: userRoom.background,
        },
        aiConfig: {
          persona: 'sangsuri',
          customGreeting: userRoom.greeting,
          readingData: {
            recentBooks: ['전지적 독자 시점', '달빛조각사', '나 혼자만 레벨업'],
            favoriteGenres: ['판타지', '로맨스'],
            totalBooksRead: 15,
          },
        },
      });
      setLoading(false);
    } catch (error) {
      console.error('서재 데이터 로딩 오류:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div className="loading"></div>
        <p style={{ color: '#f5e6c8', fontSize: '14px' }}>서재 로딩 중...</p>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div style={styles.loadingScreen}>
        <h2 style={{ color: '#f5e6c8', fontSize: '16px' }}>서재를 찾을 수 없습니다</h2>
        <button onClick={() => navigate('/')} style={styles.exitBtn}>홈으로</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* 상단 타이틀 */}
      <div style={styles.titleBar}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <span style={styles.titleText}>{userId}님의 서재</span>
      </div>

      {/* 중단: 게임 + 사이드 버튼 */}
      <div style={styles.middleRow}>
        {/* 게임 영역 */}
        <div style={styles.gameWrapper}>
          <div style={styles.gameArea}>
            <PhaserGame
              ref={gameRef}
              mode="visitor"
              hostUserId={userId}
              roomConfig={roomData.roomConfig}
              aiConfig={roomData.aiConfig}
            />
          </div>
        </div>

        {/* 우측 사이드 버튼 */}
        <div style={styles.sideButtons}>
          <button style={styles.sideBtn} onClick={() => setShowVisitInput(true)}>
            자랑하기
          </button>
        </div>
      </div>

      {/* 하단: 대화창 + 채팅창 wrapper */}
      <div style={styles.bottomWrapper}>
        {/* 진입 인사 대화창 */}
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

        {/* 채팅창 */}
        <div style={styles.chatArea}>
          <ChatBox
            hostUserId={userId}
            aiConfig={roomData.aiConfig}
          />
        </div>
      </div>

      {/* 자랑하기 — 방 이동 모달 */}
      {showVisitInput && (
        <div style={styles.visitOverlay}>
          <div style={styles.visitModal}>
            <span style={styles.visitTitle}>다른 사람의 방 방문하기</span>
            <div style={styles.visitRoomList}>
              {[
                { id: 'default',         label: '기본 서재',       theme: '기본' },
                { id: 'modern_user',     label: '현대 서재',       theme: '현대' },
                { id: 'wuxia_user',      label: '무협 서재',       theme: '무협' },
                { id: 'apocalypse_user', label: '아포칼립스 서재', theme: '아포칼립스' },
              ].map(room => (
                <button
                  key={room.id}
                  style={styles.visitRoomBtn}
                  onClick={() => navigate(`/web/${room.id}/room`)}
                >
                  <span style={styles.visitRoomTheme}>{room.theme}</span>
                  <span style={styles.visitRoomLabel}>{room.label}</span>
                </button>
              ))}
            </div>
            <div style={styles.visitDivider} />
            <input
              style={styles.visitInput}
              type="text"
              placeholder="유저 ID 직접 입력"
              value={visitUserId}
              onChange={e => setVisitUserId(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && visitUserId.trim())
                  navigate(`/web/${visitUserId.trim()}/room`);
              }}
            />
            <div style={styles.visitBtns}>
              <button
                style={styles.visitCancelBtn}
                onClick={() => { setShowVisitInput(false); setVisitUserId(''); }}
              >취소</button>
              <button
                style={styles.visitConfirmBtn}
                onClick={() => {
                  if (visitUserId.trim()) navigate(`/web/${visitUserId.trim()}/room`);
                }}
              >방문하기</button>
            </div>
          </div>
        </div>
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
    overflow: 'hidden',
    position: 'fixed',
    top: 0, left: 0,
    gap: '16px',
  },

  loadingScreen: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    gap: '16px', background: '#3d2210',
  },
  exitBtn: {
    padding: '10px 20px',
    background: '#5c3322',
    color: '#f5e6c8',
    border: '2px solid #8b6914',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
  },

  // 타이틀 바
  titleBar: {
    background: '#3a1010',
    border: '1px solid #6b2a2a',
    borderRadius: '4px',
    padding: '10px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0',
    lineHeight: 1,
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

  // 게임 래퍼
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
    alignSelf: 'flex-start',
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
    width: '560px',
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

  // 채팅창
  chatArea: {
    width: '100%',
    height: '200px',
    background: '#3a1010',
    border: '2px solid #6b3a1a',
    borderRadius: '6px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  // 자랑하기 방문 모달
  visitOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.5)',
  },
  visitModal: {
    background: '#c8934a',
    border: '4px solid #5c3018',
    borderRadius: '8px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '320px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
  },
  visitTitle: {
    color: '#f5e6c8',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  visitRoomList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  visitRoomBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#7a4e28',
    border: '2px solid #5c3018',
    borderRadius: '6px',
    padding: '10px 14px',
    cursor: 'pointer',
  },
  visitRoomTheme: {
    background: '#5c3018',
    color: '#f0c060',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '4px',
    flexShrink: 0,
  },
  visitRoomLabel: {
    color: '#f5e6c8',
    fontSize: '14px',
  },
  visitDivider: {
    borderTop: '1px solid #5c3018',
    margin: '4px 0',
  },
  visitInput: {
    background: '#e8d09a',
    border: '2px solid #5c3018',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#3d2210',
    outline: 'none',
  },
  visitBtns: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  visitCancelBtn: {
    background: '#7a4e28',
    border: '2px solid #5c3018',
    borderRadius: '4px',
    color: '#f5e6c8',
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '8px 16px',
    cursor: 'pointer',
  },
  visitConfirmBtn: {
    background: '#5c3018',
    border: '2px solid #3d2010',
    borderRadius: '4px',
    color: '#f5e6c8',
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '8px 16px',
    cursor: 'pointer',
  },
};

export default VisitorRoom;
