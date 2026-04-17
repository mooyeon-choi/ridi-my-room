import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PhaserGame from './PhaserGame';
import ChatBox from './ChatBox';
import VisitorLibraryModal from './VisitorLibraryModal';
import VisitorAchievementModal from './VisitorAchievementModal';
import { useRoomLayout } from '../hooks/useRoomLayout';

const USER_ROOM_DATA = {
  default: {
    background: '/assets/backgrounds/sangsuri_visitor.webp',
    greeting: '찾아와 주셔서 반가워요. 편하게 둘러보세요.',
    theme: 'sangsuri',
    hostSprite: '/assets/characters/ruth_sprite.webp',
    hostName: '루스',
    hostPortrait: '/assets/characters/portraits/ruth.png',
    spriteWidth: 344,
    spriteHeight: 384,
  },
  sangsuri_user: {
    background: '/assets/backgrounds/sangsuri_visitor.webp',
    greeting: '찾아와 주셔서 반가워요. 오늘은 읽고 싶은 책이 있으신가요?',
    theme: 'sangsuri',
    hostSprite: '/assets/characters/ruth_sprite.webp',
    hostName: '루스',
    hostPortrait: '/assets/characters/portraits/ruth.png',
    spriteWidth: 344,
    spriteHeight: 384,
  },
  neosokbam_user: {
    background: '/assets/backgrounds/neosokbam.webp',
    greeting: '어머... 이 밤에 찾아오다니. 용기가 있군요.',
    theme: 'neosokbam',
    hostSprite: '/assets/characters/neosokbam_heroine.webp',
    hostName: '고유주',
    hostPortrait: '/assets/characters/portraits/neosokbam_heroine.png',
    spriteWidth: 512,
    spriteHeight: 571,
  },
  betrayer_user: {
    background: '/assets/backgrounds/betrayer.webp',
    greeting: '...왔군요. 앉으세요.',
    theme: 'betrayer',
    hostSprite: '/assets/characters/betrayer_hero.webp',
    hostName: '박치경',
    hostPortrait: '/assets/characters/portraits/betrayer_hero.png',
    spriteWidth: 512,
    spriteHeight: 571,
  },
};

const TYPING_SPEED = 50;
const DISPLAY_DURATION = 3000;
const CHAT_H = 160;

const THEME_COLORS = {
  sangsuri: {
    bg: '#171729', fill: '#2C2C4E', line: '#47476E',
    dialogue: { background: 'linear-gradient(135deg, #C8C8E8 0%, #B0B0D8 50%, #A0A0C8 100%)', border: '3px solid #47476E', color: '#1E1E3A' },
    chat: {
      userBubble: { background: '#3D3D6B', border: '1px solid #47476E' },
      aiBubble:   { background: '#1E1E3A', border: '1px solid #33335A' },
      aiLabel:    { color: '#8B8BCC' },
      inputArea:  { background: '#1A1A30', borderTop: '1px solid #47476E' },
      input:      { background: '#12122A', border: '1px solid #47476E', color: '#C8C8E8' },
      sendBtn:    { background: '#47476E', border: '1px solid #5A5A8E', color: '#E0E0F0' },
    },
  },
  betrayer: {
    bg: '#131418', fill: '#292C34', line: '#666B78',
    dialogue: { background: 'linear-gradient(135deg, #C8CAD0 0%, #B0B2B8 50%, #A0A2A8 100%)', border: '3px solid #666B78', color: '#1E2028' },
    chat: {
      userBubble: { background: '#3A3D48', border: '1px solid #666B78' },
      aiBubble:   { background: '#1E2028', border: '1px solid #444854' },
      aiLabel:    { color: '#999EAE' },
      inputArea:  { background: '#1A1C22', borderTop: '1px solid #666B78' },
      input:      { background: '#101218', border: '1px solid #666B78', color: '#C8CAD0' },
      sendBtn:    { background: '#666B78', border: '1px solid #888D9A', color: '#E8EAF0' },
    },
  },
  neosokbam: {
    bg: '#8C5C14', fill: '#A06F25', line: '#E8AF5A',
    dialogue: { background: 'linear-gradient(135deg, #F5E6C8 0%, #E8D5A8 50%, #DCC090 100%)', border: '3px solid #E8AF5A', color: '#3D2810' },
    chat: {
      userBubble: { background: '#8C6B2E', border: '1px solid #E8AF5A' },
      aiBubble:   { background: '#6B4E18', border: '1px solid #A07830' },
      aiLabel:    { color: '#F0D080' },
      inputArea:  { background: '#5C4010', borderTop: '1px solid #E8AF5A' },
      input:      { background: '#4A3408', border: '1px solid #E8AF5A', color: '#F5E6C8' },
      sendBtn:    { background: '#E8AF5A', border: '1px solid #F0C070', color: '#3D2810' },
    },
  },
};

function VisitorRoom() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const L = useRoomLayout(CHAT_H);

  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGreeting, setShowGreeting] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [visitUserId, setVisitUserId] = useState('');
  const [showVisitInput, setShowVisitInput] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const gameRef = useRef(null);

  // 모달이 열리거나 닫힐 때 Phaser 입력 비활성화/활성화
  const anyModalOpen = showVisitInput || showLibrary || showAchievement;
  useEffect(() => {
    if (anyModalOpen) {
      gameRef.current?.disableInput();
    } else {
      gameRef.current?.enableInput();
    }
  }, [anyModalOpen]);

  // 스페이스바/ESC로 모달 닫기
  useEffect(() => {
    if (!anyModalOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        if (showVisitInput) { setShowVisitInput(false); setVisitUserId(''); }
        else if (showLibrary) setShowLibrary(false);
        else if (showAchievement) setShowAchievement(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [anyModalOpen, showVisitInput, showLibrary, showAchievement]);

  useEffect(() => { loadRoomData(); }, [userId]);

  // 방문 기록 저장
  useEffect(() => {
    if (!userId) return;
    try {
      const saved = JSON.parse(localStorage.getItem('visited_rooms') || '[]');
      if (!saved.includes(userId)) {
        saved.push(userId);
        localStorage.setItem('visited_rooms', JSON.stringify(saved));
      }
    } catch (e) {}
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
          hostSprite: userRoom.hostSprite,
          hostName: userRoom.hostName,
          hostPortrait: userRoom.hostPortrait,
          spriteWidth: userRoom.spriteWidth,
          spriteHeight: userRoom.spriteHeight,
        },
        aiConfig: {
          persona: userRoom.theme,
          customGreeting: userRoom.greeting,
          readingData: userRoom.theme === 'neosokbam'
            ? { recentBooks: ['너를 속이는 밤', '안개를 삼킨 나비', '메리 사이코'], favoriteGenres: ['로맨스', '스릴러'], totalBooksRead: 12 }
            : userRoom.theme === 'betrayer'
            ? { recentBooks: ['배덕한 타인에게', '데페이즈망', '폐하의 밤'], favoriteGenres: ['로맨스', '드라마'], totalBooksRead: 20 }
            : { recentBooks: ['상수리나무 아래', '전지적 독자 시점', '달빛조각사'], favoriteGenres: ['판타지', '로맨스'], totalBooksRead: 15 },
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

  const tc = THEME_COLORS[roomData.roomConfig.theme] || THEME_COLORS.sangsuri;

  return (
    <div style={{ ...styles.container, background: tc.bg }}>

      {/* 타이틀 */}
      {(() => {
        const titleFontSize = Math.max(13, Math.min(18, L.sideBtnFontSize + 4));
        const titleLabel = `${userId}님의 서재`;
        const titleBarMaxW = `${(titleLabel.length + 2) * 1.5 + 8}em`; // +2 for ← button
        return (
          <div style={{ ...styles.titleBar, background: tc.fill, borderColor: tc.line, width: '100%', maxWidth: titleBarMaxW, margin: '0 auto', marginBottom: '4vh', fontSize: titleFontSize }}>
            <button style={styles.backBtn} onClick={() => navigate('/web/my-room')}>←</button>
            <span style={{ ...styles.titleText, fontSize: titleFontSize }}>
              {titleLabel}
            </span>
          </div>
        );
      })()}

      {/* 게임 + 사이드 버튼 */}
      <div style={{ ...styles.middleRow, gap: L.gap }}>
        <div style={styles.gameWrapper}>
          <div style={{ width: L.gameW, height: L.gameH, overflow: 'hidden', borderRadius: '4px' }}>
            <PhaserGame
              ref={gameRef}
              mode="visitor"
              hostUserId={userId}
              roomConfig={roomData.roomConfig}
              aiConfig={roomData.aiConfig}
            />
          </div>
        </div>
        <div style={{ ...styles.sideButtons }}>
          {[
            { key: 'library', label: '서재' },
            { key: 'achievement', label: '업적' },
            { key: 'visit', label: '구경가기' },
          ].map(btn => (
            <button
              key={btn.key}
              style={{ ...styles.sideBtn, background: tc.fill, borderColor: tc.line, width: L.sideBtnW, padding: `${L.sideBtnPadding}px 0`, fontSize: L.sideBtnFontSize }}
              onClick={() => {
                if (btn.key === 'library') setShowLibrary(true);
                if (btn.key === 'achievement') setShowAchievement(true);
                if (btn.key === 'visit') setShowVisitInput(true);
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 하단: 대화창 + 채팅 */}
      <div style={{ ...styles.bottomWrapper, width: '100%', maxWidth: L.rowW, margin: '0 auto' }}>
        {showGreeting && (
          <div style={styles.dialogueOverlay}>
            <div style={{ ...styles.portraitWrapper, width: L.portraitW, left: L.portraitLeft, bottom: L.portraitBottom }}>
              <img src={roomData.roomConfig.hostPortrait || '/assets/characters/portraits/maxy.png'} alt={roomData.roomConfig.hostName || '맥시'} style={styles.portraitImg} />
            </div>
            <div style={{ ...styles.dialogueBox, ...(tc.dialogue || {}), padding: `12px 20px 12px ${Math.round(L.dialoguePaddingLeft * 0.75)}px` }}>
              <span style={{ ...styles.dialogueText, color: tc.dialogue?.color || '#3d2210' }}>{displayedText}</span>
            </div>
          </div>
        )}
        <div style={{ ...styles.chatArea, background: tc.fill, borderColor: tc.line, height: CHAT_H, minHeight: 60, maxHeight: 300, resize: 'vertical', overflow: 'auto' }}>
          <ChatBox
            hostUserId={userId}
            aiConfig={roomData.aiConfig}
            hostName={roomData.roomConfig.hostName}
            themeColors={tc.chat}
            onChatBubble={(type, value) => {
              const scene = gameRef.current?.getScene();
              if (!scene) return;
              if (type === 'typing') {
                scene.showTypingBubble(value);
              } else {
                scene.showChatBubble(type, value);
              }
            }}
          />
        </div>
      </div>

      {/* 구경가기 모달 */}
      {showVisitInput && (
        <div style={styles.visitOverlay} onClick={() => { setShowVisitInput(false); setVisitUserId(''); }}>
          <div style={{ ...styles.visitModal, background: tc.fill, borderColor: tc.line }} onClick={e => e.stopPropagation()}>
            <span style={styles.visitTitle}>다른 사람의 방 방문하기</span>
            <div style={styles.visitRoomList}>
              {[
                { id: 'sangsuri_user',    label: '상수리나무 아래 서재', theme: '상수리' },
                { id: 'neosokbam_user',   label: '너를 속이는 밤 서재', theme: '너속밤' },
                { id: 'betrayer_user',    label: '배덕한 타인 서재',    theme: '배덕' },
              ].map(room => (
                <button key={room.id} style={{ ...styles.visitRoomBtn, background: tc.bg, borderColor: tc.line }} onClick={() => navigate(`/web/${room.id}/room`)}>
                  <span style={{ ...styles.visitRoomTheme, background: tc.line, color: '#f5e6c8' }}>{room.theme}</span>
                  <span style={styles.visitRoomLabel}>{room.label}</span>
                </button>
              ))}
            </div>
            <div style={{ ...styles.visitDivider, borderColor: tc.line }} />
            <input
              style={{ ...styles.visitInput, background: tc.bg, borderColor: tc.line, color: '#f5e6c8' }}
              type="text"
              placeholder="유저 ID 직접 입력"
              value={visitUserId}
              onChange={e => setVisitUserId(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && visitUserId.trim()) navigate(`/web/${visitUserId.trim()}/room`); }}
            />
            <div style={styles.visitBtns}>
              <button style={{ ...styles.visitCancelBtn, background: tc.bg, borderColor: tc.line }} onClick={() => { setShowVisitInput(false); setVisitUserId(''); }}>취소</button>
              <button style={{ ...styles.visitConfirmBtn, background: tc.line, borderColor: tc.line }} onClick={() => { if (visitUserId.trim()) navigate(`/web/${visitUserId.trim()}/room`); }}>방문하기</button>
            </div>
          </div>
        </div>
      )}

      {showLibrary && <VisitorLibraryModal onClose={() => setShowLibrary(false)} roomTheme={roomData.roomConfig.theme} themeColors={tc} />}
      {showAchievement && <VisitorAchievementModal onClose={() => setShowAchievement(false)} roomTheme={roomData.roomConfig.theme} themeColors={tc} />}
    </div>
  );
}

const styles = {
  container: {
    width: '100%', height: '100dvh',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: '#280707',
    position: 'fixed', top: 0, left: 0,
    gap: '12px',
    paddingTop: '8vh',
    paddingBottom: '8vh',
    paddingLeft: '8vw',
    paddingRight: '8vw',
    boxSizing: 'border-box',
  },
  loadingScreen: {
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    gap: 'clamp(10px, 2vh, 16px)', background: '#3d2210',
  },
  exitBtn: {
    padding: 'clamp(6px, 1.2vh, 10px) clamp(12px, 2.5vw, 20px)', background: '#5c3322',
    color: '#f5e6c8', border: '2px solid #8b6914',
    borderRadius: '6px', cursor: 'pointer',
    fontSize: 'clamp(11px, 1.4vw, 13px)', fontWeight: 'bold',
  },
  titleBar: {
    background: '#3a1010', border: '1px solid #6b2a2a',
    borderRadius: '4px', padding: 'clamp(6px, 1.2vh, 10px) clamp(14px, 3vw, 24px)',
    boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 1.5vw, 12px)',
  },
  backBtn: {
    background: 'none', border: 'none',
    color: '#ffffff', fontSize: 'clamp(14px, 2vw, 18px)',
    cursor: 'pointer', padding: '0', lineHeight: 1,
  },
  titleText: { color: '#ffffff', letterSpacing: '1px' },
  middleRow: { position: 'relative', display: 'flex', alignItems: 'center' },
  gameWrapper: {
    position: 'relative',
  },
  sideButtons: { display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1vh, 10px)', alignSelf: 'flex-start' },
  sideBtn: {
    background: '#3a1010', border: '1px solid #6b2a2a',
    borderRadius: '4px', color: '#ffffff',
    cursor: 'pointer', letterSpacing: '1px',
    transition: 'background 0.15s',
  },
  bottomWrapper: { position: 'relative', boxSizing: 'border-box' },
  dialogueOverlay: { position: 'absolute', bottom: '100%', left: 0, right: 0, height: '0', zIndex: 30 },
  portraitWrapper: { position: 'absolute', zIndex: 31, pointerEvents: 'none' },
  portraitImg: { width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.4))' },
  dialogueBox: {
    position: 'absolute', bottom: '-20px', left: '-30px', right: '-28px',
    background: 'linear-gradient(135deg, #f0ddb8 0%, #e8cfa0 50%, #dcc090 100%)',
    borderRadius: '9999px', minHeight: 'clamp(40px, 6vh, 60px)',
    display: 'flex', alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
    border: '3px solid #753F22',
  },
  dialogueText: { color: '#3d2210', fontSize: 'clamp(13px, 2vw, 18px)', lineHeight: '1.5', fontWeight: '500', flex: 1 },
  chatArea: {
    width: '100%', background: '#2a1508',
    border: '2px solid #5c3018', borderRadius: '6px',
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
  },

  visitOverlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.5)',
  },
  visitModal: {
    background: '#c8934a', border: '4px solid #5c3018', borderRadius: '8px',
    padding: 'clamp(14px, 3vw, 24px)', display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vh, 16px)',
    width: 'clamp(260px, 40vw, 320px)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
  },
  visitTitle: { color: '#f5e6c8', fontSize: 'clamp(13px, 1.8vw, 16px)', fontWeight: 'bold', textAlign: 'center' },
  visitRoomList: { display: 'flex', flexDirection: 'column', gap: 'clamp(3px, 0.6vh, 6px)' },
  visitRoomBtn: {
    display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vw, 10px)',
    background: '#7a4e28', border: '2px solid #5c3018',
    borderRadius: '6px', padding: 'clamp(6px, 1.2vh, 10px) clamp(8px, 1.5vw, 14px)', cursor: 'pointer',
  },
  visitRoomTheme: {
    background: '#5c3018', color: '#f0c060', fontSize: 'clamp(9px, 1.2vw, 11px)',
    fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', flexShrink: 0,
  },
  visitRoomLabel: { color: '#f5e6c8', fontSize: 'clamp(11px, 1.5vw, 14px)' },
  visitDivider: { borderTop: '1px solid #5c3018', margin: '4px 0' },
  visitInput: {
    background: '#e8d09a', border: '2px solid #5c3018',
    borderRadius: '6px', padding: 'clamp(6px, 1.2vh, 10px) clamp(8px, 1.5vw, 14px)',
    fontSize: 'clamp(11px, 1.5vw, 14px)', color: '#3d2210', outline: 'none',
  },
  visitBtns: { display: 'flex', gap: 'clamp(4px, 1vw, 8px)', justifyContent: 'flex-end' },
  visitCancelBtn: {
    background: '#7a4e28', border: '2px solid #5c3018', borderRadius: '4px',
    color: '#f5e6c8', fontSize: 'clamp(11px, 1.4vw, 13px)', fontWeight: 'bold',
    padding: 'clamp(5px, 1vh, 8px) clamp(10px, 2vw, 16px)', cursor: 'pointer',
  },
  visitConfirmBtn: {
    background: '#5c3018', border: '2px solid #3d2010', borderRadius: '4px',
    color: '#f5e6c8', fontSize: 'clamp(11px, 1.4vw, 13px)', fontWeight: 'bold',
    padding: 'clamp(5px, 1vh, 8px) clamp(10px, 2vw, 16px)', cursor: 'pointer',
  },
};

export default VisitorRoom;
