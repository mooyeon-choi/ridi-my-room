import React, { useState } from 'react';

const AVAILABLE_BOOKS = [
  { id: 'sangsuri',  title: '상수리나무 아래',          genre: '웹툰>로판',      img: '/assets/books/sangsuri.png' },
  { id: 'pumgyeok',  title: '품격을 배반한다',          genre: '웹툰>로판',      img: '/assets/books/betraying_dignity.png' },
  { id: 'angae',     title: '안개를 삼킨 나비',         genre: '웹툰>로판',      img: '/assets/books/fog_butterfly.png' },
  { id: 'nampyeon',  title: '남편에게 쫓기고 있습니다', genre: '웹툰>로판',      img: '/assets/books/chased_by_husband.png' },
  { id: 'merry',     title: '메리 사이코',              genre: '로맨스>웹소설',  img: '/assets/books/merry_psycho.png' },
  { id: 'neoreul',   title: '너를 속이는 밤',           genre: '로맨스>웹소설',  img: '/assets/books/night_deceiving_you.png' },
  { id: 'dephase',   title: '데페이즈망',               genre: '로맨스>웹소설',  img: '/assets/books/dephase.png' },
  { id: 'owol',      title: '오월의 정원에서',          genre: '로판>웹소설',    img: '/assets/books/may_garden.png' },
  { id: 'pyeha',     title: '폐하의 밤',                genre: '로판>웹소설',    img: '/assets/books/night_of_majesty.png' },
  { id: 'asha',      title: '국경의 아샤',              genre: '웹툰>로판',      img: '/assets/books/border_asha.png' },
];

const SLOT_COUNT = 14;

// 각 방의 서재 (14칸 가득 채움)
const ROOM_LIBRARIES = {
  // 너를 속이는 밤: 로판만 (중복 없이)
  neosokbam: [
    'sangsuri', 'pumgyeok', 'angae', 'nampyeon', 'dephase', 'owol', 'pyeha', 'asha',
  ],
  // 배덕한 타인: 현대물만
  betrayer: [
    'merry',
  ],
  // 루스: 랜덤 혼합 (중복 없이)
  sangsuri: [
    'sangsuri', 'pumgyeok', 'angae', 'merry', 'neoreul', 'dephase', 'owol', 'pyeha', 'nampyeon', 'asha',
  ],
};

function getBookById(id) {
  return AVAILABLE_BOOKS.find(b => b.id === id);
}

function VisitorLibraryModal({ onClose, roomTheme, themeColors }) {
  const tc = themeColors || {};
  const bookIds = ROOM_LIBRARIES[roomTheme] || ROOM_LIBRARIES.sangsuri;
  const books = bookIds.map(id => getBookById(id)).filter(Boolean);
  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => books[i] || null);
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div style={styles.overlay} onClick={onClose} onKeyDown={e => e.stopPropagation()}>
      <div style={styles.wrapper} onClick={e => e.stopPropagation()}>

        {selectedBook && (
          <div style={{ ...styles.detailPanel, background: tc.fill || '#b07840' }}>
            <div style={{ ...styles.detailInner, background: tc.bg || '#5c3018', borderColor: tc.line || '#3d1e10' }}>
              <div style={{ ...styles.bookCoverFrame, background: tc.bg || '#5c3018', borderColor: tc.line || '#3d1e10' }}>
                <img src={selectedBook.img} alt={selectedBook.title} style={styles.detailImg} />
              </div>
              <div style={styles.detailRight}>
                <span style={styles.detailTitle}>{selectedBook.title}</span>
                <span style={styles.detailGenre}>{selectedBook.genre}</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ ...styles.gridPanel, background: tc.fill || '#b07840', borderColor: tc.line || '#5c3018' }}>
          <div style={{ ...styles.grid, background: tc.bg || '#c8a060', borderColor: tc.line || '#8b6030' }}>
            {slots.map((book, i) => (
              <div
                key={i}
                style={{
                  ...styles.slot,
                  background: tc.bg || styles.slot.background,
                  borderColor: tc.line || styles.slot.border,
                  ...(book ? { ...styles.slotFilled, background: tc.bg || '#5c3018', borderColor: tc.line || '#5c3018' } : {}),
                  ...(selectedBook?.id === book?.id ? styles.slotSelected : {}),
                  cursor: book ? 'pointer' : 'default',
                }}
                onClick={() => book && setSelectedBook(prev => prev?.id === book.id ? null : book)}
              >
                {book && (
                  <img src={book.img} alt={book.title} style={styles.slotImg} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button style={{ ...styles.closeBtn, background: tc.fill || '#5c3018', borderColor: tc.line || undefined }} onClick={onClose}>✕ 닫기</button>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(4px, 1vh, 8px)',
    background: 'rgba(0, 0, 0, 0.5)',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: 'clamp(360px, 85vw, 796px)',
    gap: '0',
  },
  detailPanel: {
    background: '#b07840',
    border: 'none',
    borderRadius: '8px 8px 0 0',
    padding: 'clamp(10px, 2vw, 16px)',
  },
  detailInner: {
    background: '#5c3018',
    border: '2px solid #3d1e10',
    borderRadius: '6px',
    padding: 'clamp(10px, 2vw, 16px)',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(12px, 2.5vw, 20px)',
  },
  bookCoverFrame: {
    background: '#5c3018',
    border: '3px solid #3d1e10',
    borderRadius: '3px',
    padding: '4px',
    boxShadow: '3px 4px 8px rgba(0,0,0,0.3)',
  },
  detailImg: {
    width: 'clamp(60px, 10vw, 100px)',
    height: 'clamp(78px, 13vw, 130px)',
    objectFit: 'cover',
    display: 'block',
  },
  detailRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(4px, 0.8vw, 8px)',
  },
  detailTitle: {
    fontSize: 'clamp(14px, 2.2vw, 20px)',
    fontWeight: 'bold',
    color: '#f0c060',
  },
  detailGenre: {
    fontSize: 'clamp(12px, 1.8vw, 16px)',
    color: '#f5e6c8',
  },
  gridPanel: {
    background: '#b07840',
    border: '3px solid #5c3018',
    borderTop: '2px solid #5c3018',
    borderRadius: '0 0 8px 8px',
    padding: 'clamp(8px, 1.5vw, 12px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
  },
  grid: {
    background: '#c8a060',
    border: '2px solid #8b6030',
    borderRadius: '6px',
    padding: 'clamp(8px, 1.5vw, 12px)',
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 'clamp(4px, 0.8vw, 8px)',
  },
  slot: {
    aspectRatio: '623 / 810',
    background: '#a07040',
    border: '2px solid #7a5028',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  slotFilled: {
    border: '2px solid #5c3018',
    background: '#5c3018',
    padding: '3px',
    boxShadow: '2px 3px 6px rgba(0,0,0,0.25)',
  },
  slotSelected: {
    border: '2px solid #fff0a0',
    boxShadow: '0 0 8px rgba(255,240,100,0.5)',
  },
  slotImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '1px',
  },
  plusIcon: {
    fontSize: 'clamp(16px, 2.5vw, 22px)',
    color: '#7a5028',
    lineHeight: 1,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginRight: 'calc(50% - clamp(180px, 42.5vw, 398px))',
    background: '#5c3018',
    border: 'none',
    borderRadius: '4px',
    color: '#f5e6c8',
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    fontWeight: 'bold',
    padding: 'clamp(6px, 1vh, 10px) clamp(14px, 2.5vw, 24px)',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
};

export default VisitorLibraryModal;
