import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PhaserGame from './PhaserGame';
import ChatBox from './ChatBox';

function VisitorRoom() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const gameRef = useRef(null);


  useEffect(() => {
    loadRoomData();
  }, [userId]);

  async function loadRoomData() {
    try {
      const dummyRoomData = {
        userId,
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

  function renderTabContent() {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatBox
            hostUserId={userId}
            aiConfig={roomData.aiConfig}
          />
        );
      case 'guestbook':
        return (
          <div style={styles.placeholderTab}>
            <p style={styles.placeholderText}>방명록을 남겨보세요!</p>
          </div>
        );
      case 'info':
        return (
          <div style={styles.placeholderTab}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>읽은 책</span>
              <span style={styles.statValue}>{roomData.aiConfig.readingData.totalBooksRead}권</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>선호 장르</span>
              <span style={styles.statValue}>{roomData.aiConfig.readingData.favoriteGenres.join(', ')}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div style={styles.container}>
      {/* === 상단: 배경 + 아바타 === */}
      <div style={styles.topSection}>
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

      {/* === 캐릭터 일러스트 + 대사 박스 === */}
      <div style={styles.dialogueOverlay}>
        <div style={styles.portraitWrapper}>
          <img
            src="/assets/characters/portraits/maxy.png"
            alt="맥시"
            style={styles.portraitImg}
          />
        </div>
        <div style={styles.dialogueBox}>
          <span style={styles.dialogueText}>
            맥시 : 어서 와, 내 서재에 온 걸 환영해!
          </span>
        </div>
      </div>

      {/* === 하단: 나무 프레임 인터페이스 === */}
      <div style={styles.woodFrame}>
        <div style={styles.woodFrameInner}>
          {/* 상단 헤더 바 */}
          <div style={styles.panelHeader}>
            <div style={styles.headerTitleArea}>
              <button style={styles.backBtn} onClick={() => navigate('/')}>
                ←
              </button>
              <span style={styles.headerTitle}>{userId}님의 서재</span>
            </div>
            <div style={styles.headerBtnArea}>
              {[
                { key: 'chat', label: 'AI채팅' },
                { key: 'guestbook', label: '방명록' },
                { key: 'info', label: '정보' },
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

  loadingScreen: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    gap: '16px', background: '#3d2210'
  },

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
  exitBtn: {
    padding: '10px 20px',
    background: '#5c3322',
    color: '#f5e6c8',
    border: '2px solid #8b6914',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold'
  },

  // === 캐릭터 일러스트 + 대사 ===
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

  // === 나무 프레임 UI ===
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
    alignItems: 'center',
    gap: '10px'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#f5e6c8',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '0 4px'
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
  panelContent: {
    flex: 1,
    margin: '6px',
    background: '#dcb86a',
    borderRadius: '3px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },

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

export default VisitorRoom;
