import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PhaserGame from './PhaserGame';
import { useMobileDims, useMobileUISlot } from './MobileLayout';

function MobileVisitorRoom() {
  const { userId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const gameRef = useRef(null);
  const dims = useMobileDims();
  const setUIContent = useMobileUISlot();

  useEffect(() => {
    loadRoomData();
  }, [userId]);

  // 하단 UI 슬롯에 대사 박스 마운트
  useEffect(() => {
    if (!roomData) return;
    setUIContent(<BottomUI greeting={roomData.aiConfig.customGreeting} />);
    return () => setUIContent(null);
  }, [roomData]);

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

  const w = dims ? dims.width : window.innerWidth;
  const h = dims ? dims.height : window.innerHeight;
  const baseStyle = { width: w + 'px', height: h + 'px', position: 'relative', background: '#2a2018' };

  if (loading) {
    return (
      <div style={{ ...baseStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px', background: '#3d2210' }}>
        <div className="loading"></div>
        <p style={{ color: '#f5e6c8', fontSize: '14px' }}>서재 로딩 중...</p>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div style={{ ...baseStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#3d2210' }}>
        <h2 style={{ color: '#f5e6c8', fontSize: '16px' }}>서재를 찾을 수 없습니다</h2>
      </div>
    );
  }

  return (
    <div style={baseStyle}>
      <PhaserGame
        ref={gameRef}
        mode="visitor"
        hostUserId={userId}
        roomConfig={roomData.roomConfig}
        aiConfig={roomData.aiConfig}
        parentWidth={w}
        parentHeight={h}
      />
    </div>
  );
}

function BottomUI({ greeting }) {
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
          {greeting || '맥시 : 어서 와, 내 서재에 온 걸 환영해!'}
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

export default MobileVisitorRoom;
