import { useState, useEffect } from 'react';

const TITLE_H = 44;
const GAP = 12;
const GAME_WRAPPER_CHROME = 0;

function compute(bottomH) {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const paddingH = vh * 0.10; // 10vh (상하 패딩 + 타이틀 아래 여백 포함)
  const paddingW = vw * 0.08; // 8vw

  // 세로 여백: 타이틀 + 하단 + 타이틀아래여백 + 간격 + 패딩 상하
  const titleMarginBottom = vh * 0.04; // 4vh
  const reserved = TITLE_H + bottomH + titleMarginBottom + GAP + paddingH * 2;
  const gameH = Math.max(160, vh - reserved);
  const gameW = Math.round(gameH * (16 / 9));

  // 사이드버튼 너비 계산
  const sideBtnW = Math.round(Math.max(72, Math.min(gameW * 0.18, 130)));

  // 가로 여백: 사이드버튼 + 간격 + gameWrapper chrome + 패딩 좌우
  const maxGameW = vw - sideBtnW - GAP - GAME_WRAPPER_CHROME * 2 - paddingW * 2;
  const finalGameW = Math.min(gameW, maxGameW);
  const finalGameH = Math.round(finalGameW * (9 / 16));

  const finalSideBtnW = Math.round(Math.max(72, Math.min(finalGameW * 0.18, 130)));
  const sideBtnPadding = Math.max(8, Math.round(finalGameH * 0.04));
  const sideBtnFontSize = Math.max(11, Math.min(Math.round(finalSideBtnW * 0.14), 16));

  // 슬롯 크기 (MyRoom용): 10슬롯 + 9gap(6px) + padding(8px*2) + border(2px*2)
  const slotW = Math.max(40, Math.floor((finalGameW - 54 - 20) / 10));

  // 일러스트 크기
  const portraitW = Math.round(finalGameW * 0.30);
  const portraitLeft = -Math.round(portraitW * 0.47);
  const portraitBottom = -Math.round(portraitW * 0.37);
  const dialoguePaddingLeft = Math.round(portraitW * 0.70);

  // 전체 행 너비 (titleBar, bottomWrapper에 맞춤)
  const rowW = finalGameW + finalSideBtnW + GAP + GAME_WRAPPER_CHROME * 2;

  return {
    gameW: finalGameW,
    gameH: finalGameH,
    sideBtnW: finalSideBtnW,
    sideBtnPadding,
    sideBtnFontSize,
    slotW,
    portraitW,
    portraitLeft,
    portraitBottom,
    dialoguePaddingLeft,
    gap: GAP,
    rowW,
  };
}

export function useRoomLayout(bottomH) {
  const [dims, setDims] = useState(() => compute(bottomH));

  useEffect(() => {
    function update() { setDims(compute(bottomH)); }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [bottomH]);

  return dims;
}
