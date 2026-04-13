import React, { useState, useEffect, createContext, useContext } from 'react';

export const BOTTOM_MARGIN = 80;

export const MobileDimsContext = createContext(null);
export const MobileUISlotContext = createContext(null); // UI 슬롯 setter

export function useMobileDims() {
  return useContext(MobileDimsContext);
}

export function useMobileUISlot() {
  return useContext(MobileUISlotContext);
}

function MobileLayout({ children }) {
  const [state, setState] = useState(null);
  const [uiContent, setUIContent] = useState(null);

  useEffect(() => {
    function update() {
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      const gameH = sh - BOTTOM_MARGIN;
      const isPortrait = sh > sw;

      if (isPortrait) {
        // 세로모드: 90도 회전 → 논리 너비=sh, 논리 높이=sw
        // 게임 컨테이너 물리 높이는 gameH(여백 제외)
        const logicalW = sh;
        const logicalH = sw;
        setState({
          isPortrait: true,
          wrapperStyle: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: sw + 'px',
            height: sh + 'px',
            overflow: 'hidden'
          },
          containerStyle: {
            position: 'absolute',
            top: (-BOTTOM_MARGIN) + 'px',
            left: 0,
            width: sw + 'px',
            height: (sh + BOTTOM_MARGIN) + 'px',
            overflow: 'hidden'
          },
          innerStyle: {
            position: 'absolute',
            transform: 'rotate(90deg)',
            transformOrigin: '0 0',
            left: sw + 'px',
            top: BOTTOM_MARGIN + 'px',
            width: logicalW + 'px',
            height: gameH + 'px',
            overflow: 'hidden'
          },
          overlayStyle: {
            position: 'absolute',
            transform: 'rotate(90deg)',
            transformOrigin: '0 0',
            left: sw + 'px',
            top: BOTTOM_MARGIN + 'px',
            width: logicalW + 'px',
            height: gameH + 'px',
            pointerEvents: 'none',
            zIndex: 50
          },
          dims: { width: logicalW, height: logicalH }
        });
      } else {
        // 가로모드
        setState({
          isPortrait: false,
          wrapperStyle: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: sw + 'px',
            height: sh + 'px',
            overflow: 'hidden'
          },
          containerStyle: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: sw + 'px',
            height: gameH + 'px',
            overflow: 'hidden'
          },
          innerStyle: null,
          overlayStyle: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: sw + 'px',
            height: sh + 'px',
            pointerEvents: 'none',
            zIndex: 50
          },
          dims: { width: sw, height: gameH }
        });
      }
    }

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!state) return null;

  return (
    <MobileDimsContext.Provider value={state.dims}>
      <MobileUISlotContext.Provider value={setUIContent}>
        <div style={state.wrapperStyle}>
          {/* 게임 영역 */}
          <div style={state.containerStyle}>
            {state.innerStyle
              ? <div style={state.innerStyle}>{children}</div>
              : children
            }
          </div>
          {/* UI 오버레이 — wrapperStyle 기준, 게임 클리핑과 무관 */}
          {uiContent && (
            <div style={state.overlayStyle}>
              {uiContent}
            </div>
          )}
        </div>
      </MobileUISlotContext.Provider>
    </MobileDimsContext.Provider>
  );
}

export default MobileLayout;
