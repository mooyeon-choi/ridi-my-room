import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SLOT_COUNT = 14; // 2행 7열

const AVAILABLE_BOOKS = [
  { id: 'sangsuri',  title: '상수리나무 아래',          genre: '웹툰>로판',      tag: '로판', description: '그림 P, 글 서말, 나무\n원작 김수지\n리디 출판 총 146화', img: '/assets/books/sangsuri.png',              screenshot: '/assets/screenshots/page_sangsuri.png' },
  { id: 'pumgyeok',  title: '품격을 배반한다',          genre: '웹툰>로판',      tag: '로판', description: '글, 그림 스르륵코믹스\n원작 김빠\n스르륵코믹스 출판 총 83화', img: '/assets/books/betraying_dignity.png',   screenshot: '/assets/screenshots/page_pumgyeok.png' },
  { id: 'angae',     title: '안개를 삼킨 나비',         genre: '웹툰>로판',      tag: '로판', description: '글, 그림 스르륵코믹스\n원작 박오롯\n스르륵코믹스 출판 총 35화', img: '/assets/books/fog_butterfly.png',       screenshot: '/assets/screenshots/page_angae.png' },
  { id: 'nampyeon',  title: '남편에게 쫓기고 있습니다', genre: '웹툰>로판',      tag: '로판', description: '글, 그림 스르륵코믹스\n원작 유나진\n스르륵코믹스 출판 총 54화', img: '/assets/books/chased_by_husband.png',   screenshot: '/assets/screenshots/page_nampyeon.png' },
  { id: 'merry',     title: '메리 사이코',              genre: '로맨스>웹소설',  tag: '현대물', description: '저자 건어물녀\n에이블 출판 총 270화',                 img: '/assets/books/merry_psycho.png',        screenshot: '/assets/screenshots/page_merry.png' },
  { id: 'neoreul',   title: '너를 속이는 밤',           genre: '로맨스>웹소설',  tag: '로맨스', description: '그림 스르륵코믹스\n원작 정은동\n스르륵코믹스 출판 총 23화', img: '/assets/books/night_deceiving_you.png', screenshot: '/assets/screenshots/page_neoreul.png' },
  { id: 'dephase',   title: '데페이즈망',               genre: '로맨스>웹소설',  tag: '로판', description: '글, 그림 스르륵코믹스\n스르륵코믹스 출판 총 15화',    img: '/assets/books/dephase.png',             screenshot: '/assets/screenshots/page_dephase.png' },
  { id: 'owol',      title: '오월의 정원에서',          genre: '로판>웹소설',    tag: '로판', description: '저자 서당연\n로즈엔 출판 총 154화',                   img: '/assets/books/may_garden.png',          screenshot: '/assets/screenshots/page_owol.png' },
  { id: 'pyeha',     title: '폐하의 밤',                genre: '로판>웹소설',    tag: '로판', description: '저자 타야베\n라렌느 출판 총 150화',                   img: '/assets/books/night_of_majesty.png',    screenshot: '/assets/screenshots/page_pyeha.png' },
  { id: 'asha',      title: '국경의 아샤',              genre: '웹툰>로판',      tag: '로판', description: '글, 그림 스르륵코믹스\n리디 출판 총 70화',             img: '/assets/books/border_asha.png',         screenshot: '/assets/screenshots/page_sangsuri.png', comingSoon: true },
];

const INITIAL_BOOKS = [
  AVAILABLE_BOOKS[0], // 상수리나무 아래
  AVAILABLE_BOOKS.find(b => b.id === 'asha'), // 국경의 아샤
].filter(Boolean);

function getInitialBooks() {
  try {
    const saved = localStorage.getItem('library_books');
    if (saved) {
      const ids = JSON.parse(saved);
      const books = ids.map(id => AVAILABLE_BOOKS.find(b => b.id === id)).filter(Boolean);
      if (books.length > 0) return books;
    }
  } catch (e) {}
  return INITIAL_BOOKS;
}

function LibraryModal({ onClose, onMissionComplete, completedMissions = {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState(getInitialBooks);
  const [selectedBook, setSelectedBook] = useState(null);

  // 책 목록 변경 시 로컬스토리지 저장
  useEffect(() => {
    localStorage.setItem('library_books', JSON.stringify(books.map(b => b.id)));
  }, [books]);

  // 모달 열릴 때 모든 이미지 미리 로드
  useEffect(() => {
    AVAILABLE_BOOKS.forEach(book => {
      new Image().src = book.img;
      new Image().src = book.screenshot;
    });
  }, []);
  const [screenshotData, setScreenshotData] = useState(null); // { screenshot, pendingBook }
  const [added, setAdded] = useState(false);
  const [missionTriggered, setMissionTriggered] = useState({});
  const [showBookList, setShowBookList] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(null);

  const triggerMission = useCallback((missionId) => {
    if (completedMissions[missionId]) return;
    setMissionTriggered(prev => {
      if (prev[missionId]) return prev;
      if (onMissionComplete) onMissionComplete(missionId);
      return { ...prev, [missionId]: true };
    });
  }, [completedMissions, onMissionComplete]);

  // 브라우저 뒤로가기로 스크린샷 닫기
  const closeScreenshotInternal = useCallback(() => {
    setScreenshotData(prev => {
      if (prev?.isViewing && !completedMissions.view_work) {
        setTimeout(() => triggerMission('view_work'), 100);
      }
      return null;
    });
    setAdded(false);
  }, [completedMissions, triggerMission]);

  useEffect(() => {
    if (!screenshotData) return;
    function handlePopState() {
      closeScreenshotInternal();
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [screenshotData, closeScreenshotInternal]);

  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => books[i] || null);

  function handleSlotClick(book, isEmptySlot) {
    if (book) {
      setSelectedBook(prev => prev?.id === book.id ? null : book);
      setShowBookList(false);
    } else if (isEmptySlot) {
      setShowBookList(true);
      setSelectedBook(null);
    }
  }

  function openScreenshotForBook(pendingBook) {
    setShowBookList(false);
    window.history.pushState({ screenshot: true }, '', `${location.pathname}?view=book-preview`);
    setScreenshotData({ screenshot: pendingBook.screenshot, pendingBook });
    setAdded(false);
  }

  function handleRemoveBook(bookId) {
    setBooks(prev => prev.filter(b => b.id !== bookId));
    setSelectedBook(null);
  }

  function handleAddFromScreenshot() {
    if (!screenshotData || added) return;
    const { pendingBook } = screenshotData;
    setBooks(prev => {
      const updated = [...prev, pendingBook];
      // 첫 작품 등록 미션: 새 작품을 서재에 추가할 때
      if (!completedMissions.first_register) {
        setTimeout(() => triggerMission('first_register'), 100);
      }
      return updated;
    });
    setScreenshotData(null);
    setAdded(false);
    window.history.back();
  }

  function closeScreenshot() {
    // 작품 감상 미션: "보러가기"로 감상 후 돌아올 때
    if (screenshotData?.isViewing && !completedMissions.view_work && !missionTriggered.view_work) {
      setTimeout(() => triggerMission('view_work'), 100);
    }
    setScreenshotData(null);
    setAdded(false);
    window.history.back();
  }

  function handlePurchase() {
    if (!screenshotData) return;
    // 작품 결제 미션
    if (!completedMissions.purchase_work && !missionTriggered.purchase_work) {
      triggerMission('purchase_work');
    }
    setScreenshotData(null);
    setAdded(false);
    window.history.back();
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

        {/* 하단 버튼 영역 */}
        <div style={styles.screenshotBottomBar}>
          {screenshotData.isViewing && !completedMissions.purchase_work && (
            <button style={styles.purchaseBtn} onClick={handlePurchase}>
              💰 결제하기
            </button>
          )}
          <button style={styles.screenshotBackBtn} onClick={closeScreenshot}>
            ← 서재로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose} onKeyDown={e => e.stopPropagation()}>
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
                <div style={styles.detailTopRow}>
                  <span style={styles.detailTitle}>{selectedBook.title}</span>
                  <span style={styles.detailGenre}>{selectedBook.genre}</span>
                </div>
                <div style={styles.detailMiddle}>
                  <span style={styles.detailDesc}>{selectedBook.description}</span>
                  {selectedBook.comingSoon ? (
                    <span style={styles.comingSoonBadge}>오픈 예정</span>
                  ) : (
                    <button style={styles.goBtn} onClick={() => {
                      window.history.pushState({ screenshot: true }, '', `${location.pathname}?view=book-preview`);
                      setScreenshotData({ screenshot: selectedBook.screenshot, pendingBook: null, isViewing: true });
                      setAdded(true);
                    }}>보러가기</button>
                  )}
                </div>
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
                  <>
                    <img src={book.img} alt={book.title} style={styles.slotImg} />
                    <button
                      style={styles.slotRemoveBtn}
                      onClick={e => {
                        e.stopPropagation();
                        setRemoveConfirm(book);
                      }}
                    >✕</button>
                  </>
                ) : (
                  <span style={styles.plusIcon}>+</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 책 추가 목록 패널 */}
        {showBookList && (() => {
          const existingIds = new Set(books.map(b => b.id));
          const available = AVAILABLE_BOOKS.filter(b => !existingIds.has(b.id));
          return (
            <div style={styles.bookListPanel}>
              <div style={styles.bookListHeader}>
                <span style={styles.bookListTitle}>작품 추가하기</span>
                <button style={styles.bookListCloseBtn} onClick={() => setShowBookList(false)}>✕</button>
              </div>
              {available.length === 0 ? (
                <div style={styles.bookListEmpty}>추가할 수 있는 작품이 없습니다</div>
              ) : (
                <div style={styles.bookListItems}>
                  {available.map(book => (
                    <div key={book.id} style={styles.bookListItem} onClick={() => openScreenshotForBook(book)}>
                      <img src={book.img} alt={book.title} style={styles.bookListImg} />
                      <div style={styles.bookListInfo}>
                        <span style={styles.bookListItemTitle}>{book.title}</span>
                        <span style={styles.bookListItemGenre}>{book.genre}</span>
                      </div>
                      {book.comingSoon && <span style={styles.bookListComingSoon}>오픈 예정</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

      </div>

      {/* 제거 확인 모달 */}
      {removeConfirm && (
        <div style={styles.confirmOverlay} onClick={() => setRemoveConfirm(null)}>
          <div style={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <div style={styles.confirmInner}>
              <img src={removeConfirm.img} alt={removeConfirm.title} style={styles.confirmBookImg} />
              <span style={styles.confirmTitle}>{removeConfirm.title}</span>
              <span style={styles.confirmText}>서재에서 제거하시겠습니까?</span>
              <div style={styles.confirmBtns}>
                <button style={styles.confirmBtnNo} onClick={() => setRemoveConfirm(null)}>취소</button>
                <button style={styles.confirmBtnYes} onClick={() => { handleRemoveBook(removeConfirm.id); setRemoveConfirm(null); }}>제거</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
  screenshotBottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 20,
  },
  purchaseBtn: {
    background: '#F59E0B',
    border: 'none',
    borderTop: '1px solid #D97706',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 'clamp(13px, 1.6vw, 16px)',
    fontWeight: '600',
    padding: 'clamp(10px, 1.5vh, 14px) 0',
    cursor: 'pointer',
    textAlign: 'center',
  },
  screenshotBackBtn: {
    background: '#fff',
    border: 'none',
    borderTop: '1px solid #e0e0e0',
    color: '#3B82F6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 'clamp(13px, 1.6vw, 16px)',
    fontWeight: '600',
    padding: 'clamp(12px, 2vh, 18px) 0',
    cursor: 'pointer',
    textAlign: 'center',
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
    alignItems: 'stretch',
    gap: 'clamp(12px, 2.5vw, 20px)',
  },
  bookCover: {
    flex: 1,
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
    width: 'clamp(80px, 12vw, 130px)',
    height: 'clamp(104px, 15.6vw, 169px)',
    objectFit: 'cover',
    display: 'block',
  },
  detailRight: {
    width: '65%',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    background: '#d4b080',
    border: '2px solid #8b6030',
    borderRadius: '6px',
    padding: 'clamp(10px, 2vw, 16px)',
  },
  detailTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailMiddle: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end',
    gap: 'clamp(10px, 2vw, 16px)',
  },
  detailTitle: {
    fontSize: 'clamp(16px, 2.5vw, 22px)',
    fontWeight: 'bold',
    color: '#431010',
  },
  detailGenre: {
    fontSize: 'clamp(16px, 2.5vw, 22px)',
    fontWeight: 'bold',
    color: '#431010',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  detailDesc: {
    flex: 1,
    fontSize: 'clamp(14px, 2vw, 18px)',
    color: '#87452E',
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
  comingSoonBadge: {
    background: '#a07040',
    border: '2px solid #7a5028',
    borderRadius: '6px',
    color: '#f5e6c8',
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    fontWeight: 'bold',
    padding: 'clamp(8px, 1.2vh, 12px) clamp(12px, 2vw, 20px)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    textAlign: 'center',
  },

  // 책 추가 목록
  bookListPanel: {
    background: '#b07840',
    border: '3px solid #5c3018',
    borderTop: 'none',
    borderRadius: '0 0 8px 8px',
    padding: 'clamp(8px, 1.5vw, 12px)',
    marginTop: '-1px',
  },
  bookListHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'clamp(6px, 1vw, 10px)',
  },
  bookListTitle: {
    color: '#f5e6c8',
    fontSize: 'clamp(12px, 1.6vw, 15px)',
    fontWeight: 'bold',
  },
  bookListCloseBtn: {
    background: 'transparent',
    border: 'none',
    color: '#f5e6c8',
    fontSize: 'clamp(14px, 1.8vw, 18px)',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  bookListItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(4px, 0.6vw, 6px)',
    maxHeight: 'clamp(120px, 20vh, 200px)',
    overflowY: 'auto',
  },
  bookListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(8px, 1.5vw, 12px)',
    background: '#5c3018',
    border: '2px solid #7a4e28',
    borderRadius: '4px',
    padding: 'clamp(4px, 0.8vw, 8px)',
    cursor: 'pointer',
  },
  bookListImg: {
    width: 'clamp(30px, 4vw, 42px)',
    height: 'clamp(39px, 5.2vw, 55px)',
    objectFit: 'cover',
    borderRadius: '2px',
    flexShrink: 0,
  },
  bookListInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  bookListItemTitle: {
    color: '#f0c060',
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    fontWeight: 'bold',
  },
  bookListItemGenre: {
    color: '#c8a878',
    fontSize: 'clamp(9px, 1.2vw, 11px)',
  },
  bookListComingSoon: {
    background: '#a07040',
    border: '1px solid #7a5028',
    borderRadius: '4px',
    color: '#f5e6c8',
    fontSize: 'clamp(8px, 1vw, 10px)',
    fontWeight: 'bold',
    padding: '2px 6px',
    flexShrink: 0,
  },
  bookListEmpty: {
    color: '#c8a878',
    fontSize: 'clamp(11px, 1.5vw, 13px)',
    textAlign: 'center',
    padding: 'clamp(12px, 2vh, 20px)',
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
    position: 'relative',
    overflow: 'visible',
  },
  slotRemoveBtn: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    width: 'clamp(14px, 2vw, 18px)',
    height: 'clamp(14px, 2vw, 18px)',
    background: '#5c3018',
    border: '1.5px solid #7a4e28',
    borderRadius: '50%',
    color: '#f5e6c8',
    fontSize: 'clamp(7px, 1vw, 9px)',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    padding: 0,
    zIndex: 1,
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

  // 제거 확인 모달
  confirmOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 300,
  },
  confirmModal: {
    background: '#c4a050',
    border: '4px solid #8b6914',
    borderRadius: '8px',
    padding: 'clamp(3px, 0.5vw, 5px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    maxWidth: 'clamp(240px, 45vw, 320px)',
    width: 'calc(100% - 40px)',
  },
  confirmInner: {
    background: 'linear-gradient(180deg, #f5e6c8 0%, #e8d5a8 100%)',
    borderRadius: '4px',
    border: '2px solid #d4a843',
    padding: 'clamp(16px, 3vw, 24px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'clamp(8px, 1.5vh, 14px)',
  },
  confirmBookImg: {
    width: 'clamp(50px, 8vw, 70px)',
    height: 'clamp(65px, 10.4vw, 91px)',
    objectFit: 'cover',
    borderRadius: '3px',
    border: '2px solid #5c3018',
    boxShadow: '2px 3px 6px rgba(0,0,0,0.3)',
  },
  confirmTitle: {
    fontSize: 'clamp(13px, 1.8vw, 16px)',
    fontWeight: 'bold',
    color: '#3d2210',
    textAlign: 'center',
  },
  confirmText: {
    fontSize: 'clamp(11px, 1.4vw, 13px)',
    color: '#5c3a1e',
    textAlign: 'center',
  },
  confirmBtns: {
    display: 'flex',
    gap: 'clamp(8px, 1.5vw, 14px)',
    marginTop: '4px',
  },
  confirmBtnNo: {
    width: 'clamp(70px, 11vw, 100px)',
    padding: 'clamp(6px, 1vh, 10px) 0',
    borderRadius: '6px',
    border: '2px solid #5c3322',
    background: '#fff',
    color: '#5c3322',
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  confirmBtnYes: {
    width: 'clamp(70px, 11vw, 100px)',
    padding: 'clamp(6px, 1vh, 10px) 0',
    borderRadius: '6px',
    border: '2px solid #8b3232',
    background: '#8b3232',
    color: '#f5e6c8',
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    fontWeight: 'bold',
    cursor: 'pointer',
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
