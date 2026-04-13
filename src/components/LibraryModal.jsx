import React, { useState } from 'react';

const SLOT_COUNT = 14; // 2행 7열

const INITIAL_BOOKS = [
  {
    id: 1,
    title: '상수리나무 아래',
    genre: '웹툰>로판',
    description: '그림서말, 나무 글\n김수지 원작\n리디 출판 총 146화',
    img: '/assets/books/sangsuri.png',
  },
];

function LibraryModal({ onClose }) {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [selectedBook, setSelectedBook] = useState(null);

  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => books[i] || null);

  function handleSlotClick(book) {
    if (book) {
      setSelectedBook(prev => prev?.id === book.id ? null : book);
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.wrapper}>

        {/* 상단 상세보기 패널 — 책 선택 시만 표시 */}
        {selectedBook && (
          <div style={styles.detailPanel}>
            <div style={styles.detailInner}>
              <img src={selectedBook.img} alt={selectedBook.title} style={styles.detailImg} />
              <div style={styles.detailInfo}>
                <div style={styles.detailTop}>
                  <span style={styles.detailTitle}>{selectedBook.title}</span>
                  <span style={styles.detailGenre}>{selectedBook.genre}</span>
                </div>
                <span style={styles.detailDesc}>{selectedBook.description}</span>
              </div>
              <button style={styles.goBtn}>보러가기</button>
            </div>
          </div>
        )}

        {/* 하단 그리드 패널 */}
        <div style={styles.gridPanel}>
          <div style={styles.grid}>
            {slots.map((book, i) => (
              <div
                key={i}
                style={{
                  ...styles.slot,
                  ...(book ? styles.slotFilled : {}),
                  ...(selectedBook?.id === book?.id ? styles.slotSelected : {}),
                }}
                onClick={() => handleSlotClick(book)}
              >
                {book ? (
                  <img src={book.img} alt={book.title} style={styles.slotImg} />
                ) : (
                  <span style={styles.plusIcon}>+</span>
                )}
              </div>

            ))}
          </div>
        </div>

      </div>

      {/* 닫기 버튼 — 모달 외부 */}
      <button style={styles.closeBtn} onClick={onClose}>✕ 닫기</button>
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
    gap: '8px',
  },

  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '796px',
    gap: '0',
  },

  // 상단 상세보기
  detailPanel: {
    background: '#c8934a',
    border: '4px solid #5c3018',
    borderBottom: '2px solid #5c3018',
    borderRadius: '8px 8px 0 0',
    padding: '12px',
  },
  detailInner: {
    background: '#e8d09a',
    border: '2px solid #5c3018',
    borderRadius: '6px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  detailImg: {
    width: '80px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '2px solid #5c3018',
    flexShrink: 0,
  },
  detailInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  detailTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3d2210',
  },
  detailGenre: {
    fontSize: '13px',
    color: '#5c3a1e',
    background: '#d4b070',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  detailDesc: {
    fontSize: '13px',
    color: '#5c3a1e',
    lineHeight: '1.6',
    whiteSpace: 'pre-line',
  },
  goBtn: {
    background: '#5c3018',
    border: '2px solid #3d2010',
    borderRadius: '6px',
    color: '#f5e6c8',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '10px 20px',
    cursor: 'pointer',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },

  // 하단 그리드
  gridPanel: {
    background: '#c8934a',
    border: '4px solid #5c3018',
    borderTop: '2px solid #5c3018',
    borderRadius: '0 0 8px 8px',
    padding: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
  },
  grid: {
    background: '#d4a85a',
    border: '3px solid #5c3018',
    borderRadius: '6px',
    padding: '12px',
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 98px)',
    gap: '8px',
  },
  slot: {
    width: '98px',
    height: '116px',
    background: '#b8864a',
    border: '2px solid #7a4e28',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  slotFilled: {
    border: '2px solid transparent',
    background: 'none',
  },
  slotSelected: {
    border: '2px solid #fff0a0',
    boxShadow: '0 0 6px rgba(255,240,100,0.5)',
  },
  slotImg: {
    width: '98px',
    height: '116px',
    objectFit: 'cover',
    display: 'block',
  },
  plusIcon: {
    fontSize: '22px',
    color: '#7a4e28',
    lineHeight: 1,
  },

  // 닫기 버튼
  closeBtn: {
    alignSelf: 'flex-end',
    marginRight: 'calc(50% - 398px)',
    background: '#5c3018',
    border: '2px solid #7a4e28',
    borderRadius: '4px',
    color: '#f5e6c8',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '10px 24px',
    cursor: 'pointer',
  },
};

export default LibraryModal;
