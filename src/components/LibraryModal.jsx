import React, { useState } from 'react';

const SLOT_COUNT = 14; // 2행 7열

const AVAILABLE_BOOKS = [
  { id: 'sangsuri',  title: '상수리나무 아래',          genre: '웹툰>로판',      description: '그림서말, 나무 글\n김수지 원작\n리디 출판 총 146화', img: '/assets/books/sangsuri.png',              screenshot: '/assets/screenshots/page_sangsuri.png' },
  { id: 'pumgyeok',  title: '품격을 배반한다',          genre: '웹툰>로판',      description: '소통팬엔터/소.그림\n리디 연재중',                    img: '/assets/books/betraying_dignity.webp',   screenshot: '/assets/screenshots/page_pumgyeok.png' },
  { id: 'angae',     title: '안개를 삼킨 나비',         genre: '웹툰>로판',      description: '소통팬엔터/소.그림\n매주 화 연재',                   img: '/assets/books/fog_butterfly.webp',       screenshot: '/assets/screenshots/page_angae.png' },
  { id: 'nampyeon',  title: '남편에게 쫓기고 있습니다', genre: '웹툰>로판',      description: '소통팬엔터/소.그림\n매주 일요일 연재',               img: '/assets/books/chased_by_husband.webp',   screenshot: '/assets/screenshots/page_nampyeon.png' },
  { id: 'merry',     title: '메리 사이코',              genre: '로맨스>웹소설',  description: '진예서 글\n매주 금 연재',                            img: '/assets/books/merry_psycho.webp',        screenshot: '/assets/screenshots/page_merry.png' },
  { id: 'neoreul',   title: '너를 속이는 밤',           genre: '로맨스>웹소설',  description: '소통팬엔터/소.그림\n매주 화요일 연재',               img: '/assets/books/night_deceiving_you.webp', screenshot: '/assets/screenshots/page_neoreul.png' },
  { id: 'dephase',   title: '데페이즈망',               genre: '로맨스>웹소설',  description: '소통팬엔터/소.그림\n매주 목요일 연재',               img: '/assets/books/dephase.webp',             screenshot: '/assets/screenshots/page_dephase.png' },
  { id: 'owol',      title: '오월의 정원에서',          genre: '로판>웹소설',    description: '봄봄 글\n매주 화 연재',                              img: '/assets/books/may_garden.webp',          screenshot: '/assets/screenshots/page_owol.png' },
  { id: 'pyeha',     title: '폐하의 밤',                genre: '로판>웹소설',    description: '리디 출판\n완결',                                    img: '/assets/books/night_of_majesty.webp',    screenshot: '/assets/screenshots/page_pyeha.png' },
  { id: 'asha',      title: '국경의 아샤',              genre: '로판>웹소설',    description: '리디 연재중',                                        img: '/assets/books/border_asha.webp',         screenshot: '/assets/screenshots/page_sangsuri.png' },
];

const INITIAL_BOOKS = [
  AVAILABLE_BOOKS[0], // 상수리나무 아래
  AVAILABLE_BOOKS.find(b => b.id === 'asha'), // 국경의 아샤
].filter(Boolean);

function LibraryModal({ onClose, onMissionComplete }) {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [selectedBook, setSelectedBook] = useState(null);
  const [screenshotData, setScreenshotData] = useState(null); // { screenshot, pendingBook }
  const [added, setAdded] = useState(false);
  const [missionTriggered, setMissionTriggered] = useState(false);

  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => books[i] || null);

  function handleSlotClick(book, isEmptySlot) {
    if (book) {
      setSelectedBook(prev => prev?.id === book.id ? null : book);
    } else if (isEmptySlot) {
      openScreenshotPage();
    }
  }

  function openScreenshotPage() {
    const existingIds = new Set(books.map(b => b.id));
    const available = AVAILABLE_BOOKS.filter(b => !existingIds.has(b.id));
    if (available.length === 0) return;

    const pendingBook = available[Math.floor(Math.random() * available.length)];

    setScreenshotData({ screenshot: pendingBook.screenshot, pendingBook });
    setAdded(false);
  }

  function handleAddFromScreenshot() {
    if (!screenshotData || added) return;
    const { pendingBook } = screenshotData;
    setBooks(prev => {
      const updated = [...prev, pendingBook];
      if (updated.length >= 3 && !missionTriggered) {
        setMissionTriggered(true);
        if (onMissionComplete) onMissionComplete();
      }
      return updated;
    });
    setScreenshotData(null);
    setAdded(false);
  }

  function closeScreenshot() {
    setScreenshotData(null);
    setAdded(false);
  }

  // 전체화면 스크린샷 페이지
  if (screenshotData) {
    return (
      <div style={styles.screenshotFullscreen}>
        <div style={styles.screenshotContainer}>
          <div style={styles.screenshotImgWrapper}>
            <img src={screenshotData.screenshot} alt="책 페이지" style={styles.screenshotImg} />

            {/* "+관심" 버튼 옆에 "내 서재+" 버튼 오버레이 — 이미지 기준 상대 위치 */}
            <div style={styles.screenshotBtnOverlay}>
              <button
                style={{
                  ...styles.addLibraryOverlayBtn,
                  ...(added ? styles.addLibraryOverlayBtnDone : {}),
                }}
                onClick={handleAddFromScreenshot}
                disabled={added}
              >
                {added ? '✓ 추가됨' : '+ 내 서재'}
              </button>
            </div>
          </div>
        </div>

        {/* 뒤로가기 버튼 */}
        <button style={styles.screenshotBackBtn} onClick={closeScreenshot}>
          ← 서재로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.wrapper} onClick={e => e.stopPropagation()}>

        {/* 상단 상세보기 패널 — 책 선택 시만 표시 */}
        {selectedBook && (
          <div style={styles.detailPanel}>
            <div style={styles.detailInner}>
              <div style={styles.bookCover}>
                <div style={styles.bookCoverFrame}>
                  <img src={selectedBook.img} alt={selectedBook.title} style={styles.detailImg} />
                </div>
              </div>
              <div style={styles.detailRight}>
                <div style={styles.detailInfo}>
                  <div style={styles.detailTop}>
                    <span style={styles.detailTitle}>{selectedBook.title}</span>
                    <span style={styles.detailGenre}>{selectedBook.genre}</span>
                  </div>
                  <span style={styles.detailDesc}>{selectedBook.description}</span>
                </div>
                <button style={styles.goBtn} onClick={() => {
                  setScreenshotData({ screenshot: selectedBook.screenshot, pendingBook: null });
                  setAdded(true);
                }}>보러가기</button>
              </div>
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
                onClick={() => handleSlotClick(book, !book)}
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
  // 전체화면 스크린샷 페이지
  screenshotFullscreen: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    zIndex: 200,
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  screenshotContainer: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  screenshotImgWrapper: {
    position: 'relative',
    height: '100%',
  },
  screenshotImg: {
    height: '100%',
    width: 'auto',
    display: 'block',
  },
  // "+관심" 버튼 오른쪽 위치 (이미지 기준 상대좌표)
  screenshotBtnOverlay: {
    position: 'absolute',
    top: '33.7%',
    left: '36.2%',
    zIndex: 10,
  },
  addLibraryOverlayBtn: {
    background: '#3B82F6',
    border: '1px solid #2563EB',
    borderRadius: '4px',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 'clamp(10px, 1.2vw, 13px)',
    fontWeight: '500',
    padding: 'clamp(4px, 0.6vh, 7px) clamp(8px, 1vw, 14px)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    transition: 'all 0.2s',
  },
  addLibraryOverlayBtnDone: {
    background: '#22C55E',
    border: '1px solid #16A34A',
    cursor: 'default',
  },
  screenshotBackBtn: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    background: '#fff',
    borderTop: '1px solid #e0e0e0',
    color: '#3B82F6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 'clamp(13px, 1.6vw, 16px)',
    fontWeight: '600',
    padding: 'clamp(12px, 2vh, 18px) 0',
    cursor: 'pointer',
    zIndex: 20,
    textAlign: 'center',
    border: 'none',
    borderTop: '1px solid #e0e0e0',
  },

  // 서재 모달
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

  // 상단 상세보기 — 디자인 매칭
  detailPanel: {
    background: '#b07840',
    border: '3px solid #5c3018',
    borderBottom: '2px solid #5c3018',
    borderRadius: '8px 8px 0 0',
    padding: 'clamp(10px, 2vw, 16px)',
  },
  detailInner: {
    background: '#d4b080',
    border: '2px solid #8b6030',
    borderRadius: '6px',
    padding: 'clamp(10px, 2vw, 16px)',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(12px, 2.5vw, 20px)',
  },
  bookCover: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookCoverFrame: {
    background: '#5c3018',
    border: '3px solid #3d1e10',
    borderRadius: '3px',
    padding: '4px',
    boxShadow: '3px 4px 8px rgba(0,0,0,0.3)',
  },
  detailImg: {
    width: 'clamp(60px, 9vw, 90px)',
    height: 'clamp(80px, 12vw, 120px)',
    objectFit: 'cover',
    display: 'block',
  },
  detailRight: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(10px, 2vw, 16px)',
  },
  detailInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(4px, 0.8vw, 8px)',
  },
  detailTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  },
  detailTitle: {
    fontSize: 'clamp(15px, 2.2vw, 20px)',
    fontWeight: 'bold',
    color: '#3d2210',
  },
  detailGenre: {
    fontSize: 'clamp(10px, 1.3vw, 13px)',
    color: '#5c3a1e',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  detailDesc: {
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    color: '#5c3a1e',
    lineHeight: '1.6',
    whiteSpace: 'pre-line',
  },
  goBtn: {
    background: '#5c3018',
    border: 'none',
    borderRadius: '6px',
    color: '#f5e6c8',
    fontSize: 'clamp(13px, 1.8vw, 17px)',
    fontWeight: 'bold',
    padding: 'clamp(10px, 1.5vh, 16px) clamp(16px, 3vw, 28px)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },

  // 하단 그리드
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
    aspectRatio: '98 / 116',
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

  // 닫기 버튼
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

export default LibraryModal;
