import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PhaserGame from './PhaserGame';
import ChatBox from './ChatBox';
import QRCodeModal from './QRCodeModal';
import RewardModal from './RewardModal';
import MissionModal from './MissionModal';
import LibraryModal from './LibraryModal';
import ItemModal from './ItemModal';
import { useRoomLayout } from '../hooks/useRoomLayout';

const SIDE_BUTTONS = [
  { key: 'mission',  label: '미션' },
  { key: 'library',  label: '나의 서재' },
  { key: 'item',     label: '아이템' },
  { key: 'share',    label: '자랑하기' },
];

const SLOT_COUNT = 10;
const SLOT_ITEMS = [
  { img: '/assets/items/crystal_ball.png', label: '수정구' },
  { img: '/assets/items/cat_icon.png', label: '고양이' },
  { img: '/assets/items/raptan_icon.png', label: '라프탄' },
  null, null, null, null, null, null, null,
];
const GREETING_TEXT = '맥시 : 오늘도 독서 열심히 해보자!';
const TYPING_SPEED = 50;
const DISPLAY_DURATION = 3000;
const SLOT_BAR_H = 84; // slotBar 높이 (슬롯60 + padding8*2 + border2*2)

function MyRoom() {
  const userId = 'user123';
  const navigate = useNavigate();
  const L = useRoomLayout(SLOT_BAR_H);

  const [showQR, setShowQR] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showVisitInput, setShowVisitInput] = useState(false);
  const [visitUserId, setVisitUserId] = useState('');
  const [activeSlot, setActiveSlot] = useState(0);
  const [slotApplied, setSlotApplied] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
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


  function handleSlotClick(i) {
    setActiveSlot(i);
    const scene = gameRef.current?.getScene();
    if (!scene) return;

    if (i === 0 && !slotApplied[0]) {
      // 1번 슬롯: 배경 변경
      scene.changeBackground('bg_maxy_room');
      setSlotApplied(prev => ({ ...prev, 0: true }));
    } else if (i === 1 && !slotApplied[1]) {
      // 2번 슬롯: 고양이 3마리 추가
      scene.addCats();
      setSlotApplied(prev => ({ ...prev, 1: true }));
    } else if (i === 2 && !slotApplied[2]) {
      // 3번 슬롯: 라프탄 캐릭터 추가
      scene.addRaptan();
      setSlotApplied(prev => ({ ...prev, 2: true }));
      setShowChat(true);
    }
  }

  const slotW = Math.max(36, Math.floor((L.gameW - 9 * 6 - 20) / 10));
  const slotBarMaxW = slotW * 10 + 6 * 9 + 10 * 2 + 2 * 2;
  const titleFontSize = Math.max(13, Math.min(18, L.sideBtnFontSize + 4));
  const titleText = `${userId}의 리디룸`;
  const titleBarMaxW = `${titleText.length * 1.5 + 8}em`;

  return (
    <div style={styles.container}>

      {/* 타이틀 */}
      <div style={{ ...styles.titleBar, width: '100%', maxWidth: titleBarMaxW, margin: '0 auto', marginBottom: '4vh', fontSize: titleFontSize }}>
        <span style={{ ...styles.titleText, fontSize: titleFontSize }}>
          {titleText}
        </span>
      </div>

      {/* 게임 + 사이드 버튼 */}
      <div style={{ ...styles.middleRow, gap: L.gap }}>
        <div style={styles.gameWrapper}>
          <div style={{ width: L.gameW, height: L.gameH, overflow: 'hidden', borderRadius: '4px' }}>
            <PhaserGame ref={gameRef} mode="owner" userId={userId} onActionChange={() => {}} onBookshelfClick={() => setShowLibrary(true)} />
          </div>
        </div>
        <div style={styles.sideButtons}>
          {SIDE_BUTTONS.map(btn => (
            <button
              key={btn.key}
              style={{ ...styles.sideBtn, width: L.sideBtnW, padding: `${L.sideBtnPadding}px 0`, fontSize: L.sideBtnFontSize }}
              onClick={() => {
                if (btn.key === 'mission') setShowMission(true);
                if (btn.key === 'library') setShowLibrary(true);
                if (btn.key === 'item') setShowItem(true);
                if (btn.key === 'share') setShowVisitInput(true);
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 하단: 대화창 + 채팅 + 슬롯바 */}
      <div style={{ ...styles.bottomWrapper, width: '100%', maxWidth: showChat ? L.rowW : slotBarMaxW, margin: '0 auto' }}>
        {showGreeting && (
          <div style={styles.dialogueOverlay}>
            <div style={{ ...styles.portraitWrapper, width: L.portraitW, left: L.portraitLeft, bottom: L.portraitBottom }}>
              <img src="/assets/characters/portraits/maxy.png" alt="맥시" style={styles.portraitImg} />
            </div>
            <div style={{ ...styles.dialogueBox, padding: `12px 20px 12px ${L.dialoguePaddingLeft}px` }}>
              <span style={styles.dialogueText}>{displayedText}</span>
            </div>
          </div>
        )}
        {showChat && (
          <div style={{ ...styles.chatArea, height: 120, minHeight: 60, maxHeight: 300, marginBottom: 'clamp(4px, 0.8vh, 8px)', resize: 'vertical', overflow: 'auto' }}>
            <ChatBox
              hostUserId={userId}
              aiConfig={{ persona: 'sangsuri', customGreeting: '라프탄 : 마, 맥시... 무슨 이야기를 할까요?', readingData: { recentBooks: ['상수리나무 아래'], favoriteGenres: ['판타지', '로맨스'], totalBooksRead: 15 } }}
              hostName="라프탄"
              onChatBubble={(type, value) => {
                const scene = gameRef.current?.getScene();
                if (!scene) return;
                if (type === 'typing') scene.showTypingBubble(value);
                else scene.showChatBubble(type, value);
              }}
            />
          </div>
        )}
        <div style={styles.slotBar}>
          {Array.from({ length: SLOT_COUNT }, (_, i) => {
            const item = SLOT_ITEMS[i];
            const applied = slotApplied[i];
            return (
              <button
                key={i}
                style={{
                  ...styles.slot, width: slotW, height: slotW,
                  ...(activeSlot === i ? styles.slotActive : {}),
                  ...(applied ? styles.slotApplied : {}),
                  position: 'relative', overflow: 'hidden',
                }}
                onClick={() => handleSlotClick(i)}
              >
                {item ? (
                  <img
                    src={item.img}
                    alt={item.label}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      opacity: applied ? 0.5 : 1,
                      display: 'block',
                      imageRendering: 'pixelated',
                      mixBlendMode: 'multiply',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: Math.max(8, Math.round(slotW * 0.17)), color: '#5c3a1e', lineHeight: 1 }}>
                    {i === 9 ? 0 : i + 1}
                  </span>
                )}
                {applied && (
                  <span style={styles.slotCheckmark}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 모달들 */}
      {showMission  && <MissionModal onClose={() => setShowMission(false)} />}
      {showLibrary  && <LibraryModal onClose={() => setShowLibrary(false)} onMissionComplete={() => setShowReward(true)} />}
      {showItem     && <ItemModal onClose={() => setShowItem(false)} />}

      {showVisitInput && (
        <div style={styles.visitOverlay}>
          <div style={styles.visitModal}>
            <span style={styles.visitTitle}>다른 사람의 방 방문하기</span>
            <div style={styles.visitRoomList}>
              {[
                { id: 'sangsuri_user',    label: '상수리나무 아래 서재', theme: '상수리' },
                { id: 'neosokbam_user',   label: '너를 속이는 밤 서재', theme: '너속밤' },
                { id: 'betrayer_user',    label: '배덕한 타인 서재',    theme: '배덕' },
              ].map(room => (
                <button key={room.id} style={styles.visitRoomBtn} onClick={() => navigate(`/web/${room.id}/room`)}>
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
              onKeyDown={e => { if (e.key === 'Enter' && visitUserId.trim()) navigate(`/web/${visitUserId.trim()}/room`); }}
            />
            <div style={styles.visitBtns}>
              <button style={styles.visitCancelBtn} onClick={() => { setShowVisitInput(false); setVisitUserId(''); }}>취소</button>
              <button style={styles.visitConfirmBtn} onClick={() => { if (visitUserId.trim()) navigate(`/web/${visitUserId.trim()}/room`); }}>방문하기</button>
            </div>
          </div>
        </div>
      )}

      {showQR && <QRCodeModal url={`${window.location.origin}/${userId}/room`} onClose={() => setShowQR(false)} />}
      {showReward && <RewardModal onConfirm={() => setShowReward(false)} onCancel={() => setShowReward(false)} />}
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
  titleBar: {
    background: '#3a1010',
    border: '1px solid #6b2a2a',
    borderRadius: '4px',
    padding: 'clamp(6px, 1.2vh, 10px) clamp(14px, 3vw, 24px)',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: { color: '#ffffff', letterSpacing: '1px' },
  middleRow: { position: 'relative', display: 'flex', alignItems: 'center' },
  gameWrapper: {
    position: 'relative',
  },
  sideButtons: { display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1vh, 10px)', alignSelf: 'flex-start' },
  sideBtn: {
    background: '#3a1010',
    border: '1px solid #6b2a2a',
    borderRadius: '4px',
    color: '#ffffff',
    cursor: 'pointer',
    letterSpacing: '1px',
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
  slotBar: {
    display: 'flex', gap: 'clamp(3px, 0.6vw, 6px)',
    background: '#3a2010', border: '2px solid #6b3a1a',
    borderRadius: '6px', padding: 'clamp(4px, 1vh, 8px) clamp(6px, 1.2vw, 10px)',
  },
  slot: {
    background: '#e8d4a0', border: '2px solid #a07840',
    borderRadius: '4px', cursor: 'pointer',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
    padding: '3px', flexShrink: 0,
  },
  chatArea: {
    width: '100%', background: '#2a1508',
    border: '2px solid #5c3018', borderRadius: '6px',
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
  },
  slotActive: { border: '2px solid #fff8c0', boxShadow: '0 0 6px rgba(255,240,150,0.6)' },
  slotApplied: { border: '2px solid #4ade80' },
  slotCheckmark: {
    position: 'absolute', top: 2, right: 2,
    background: '#22c55e', color: '#fff',
    fontSize: '9px', fontWeight: 'bold',
    width: 14, height: 14, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    lineHeight: 1,
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

export default MyRoom;
