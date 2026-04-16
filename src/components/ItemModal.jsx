import React, { useState } from 'react';

const ITEMS = [
  { id: 'incense_burner',      name: '손오반의 모자',      description: '사성이 달린 붉은 모자. 아버지 손오공의 뜻을 이어받은 전사의 상징.', img: '/assets/items/incense_burner.png' },
  { id: 'pocket_watch',        name: '국가 연금술사 시계', description: '군의 개라 불리는 자들이 지닌 은빛 회중시계. 등가교환의 법칙을 잊지 마라.', img: '/assets/items/pocket_watch.png' },
  { id: 'millennium_pendant',  name: '천년 퍼즐',        description: '고대 이집트의 어둠의 힘이 깃든 역피라미드형 펜던트. 또 다른 자아가 깨어난다.', img: '/assets/items/millennium_pendant.png' },
  { id: 'spirit_phone',        name: '탄지로의 귀걸이',   description: '히노카미 카구라와 함께 대대로 전해져 내려온 해의 귀걸이.', img: '/assets/items/spirit_phone.png' },
  { id: 'stone_mask',          name: '석가면',           description: '죠죠의 기묘한 모험. 달빛을 받으면 인간을 초월한 존재로 각성시키는 고대의 가면.', img: '/assets/items/stone_mask.png' },
  { id: 'grappling_hook',      name: '지하실 열쇠',      description: '진격의 거인. 그리샤 예거가 남긴 지하실의 열쇠. 세계의 진실이 잠들어 있다.', img: '/assets/items/grappling_hook.png' },
  { id: 'wristband',           name: '닌자 머리띠',      description: '마을의 상징이 새겨진 이마보호대. 이것을 받는 순간, 닌자로 인정받는다.', img: '/assets/items/wristband.png' },
  { id: 'jersey_10',           name: '쇼호쿠 10번 유니폼', description: '천재니까요. 전국 제패를 향한 붉은 유니폼.', img: '/assets/items/jersey_10.png' },
  { id: 'pokedex',             name: '헌터 라이센스',     description: '헌터x헌터. 헌터 시험에 합격한 자만이 받을 수 있는 특별한 자격증.', img: '/assets/items/pokedex.png' },
  { id: 'chain_bomb',          name: '베헤리트',          description: '붉은 눈물을 흘리는 자에게 운명의 선택을 강요하는 요석. 인과의 흐름 속에 있다.', img: '/assets/items/chain_bomb.png' },
  { id: 'wooden_bat',          name: '드래곤 슬레이어',    description: '그것은 검이라기엔 너무나 크고, 무겁고, 거칠고, 그리고 대충 만들어져 있었다.', img: '/assets/items/wooden_bat.png' },
  { id: 'straw_hat',           name: '밀짚모자',          description: '샹크스에게 물려받은 소중한 모자. 해적왕이 되겠다는 약속의 증거.', img: '/assets/items/straw_hat.png' },
  { id: 'dragon_balls',        name: '드래곤볼',          description: '일곱 개를 모으면 신룡이 나타나 어떤 소원이든 이루어준다.', img: '/assets/items/dragon_balls.png' },
];

const SLOT_COUNT = 20; // 4행 5열

function ItemModal({ onClose }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => ITEMS[i] || null);

  return (
    <div style={styles.overlay}>
      <div style={styles.wrapper}>

        {/* 상단 상세보기 */}
        {selectedItem && (
          <div style={styles.detailPanel}>
            <div style={styles.detailInner}>
              <img src={selectedItem.img} alt={selectedItem.name} style={styles.detailImg} />
              <div style={styles.detailInfo}>
                <span style={styles.detailName}>{selectedItem.name}</span>
                <span style={styles.detailDesc}>{selectedItem.description}</span>
              </div>
            </div>
          </div>
        )}

        {/* 그리드 */}
        <div style={styles.gridPanel}>
          <div style={styles.grid}>
            {slots.map((item, i) => (
              <div
                key={i}
                style={{
                  ...styles.slot,
                  ...(item ? styles.slotFilled : {}),
                  ...(selectedItem?.id === item?.id ? styles.slotSelected : {}),
                }}
                onClick={() => item && setSelectedItem(prev => prev?.id === item.id ? null : item)}
              >
                {item ? (
                  <img src={item.img} alt={item.name} style={styles.slotImg} />
                ) : (
                  <span style={styles.emptySlot} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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
    gap: 'clamp(4px, 1vh, 8px)',
  },

  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: 'clamp(300px, 60vw, 520px)',
    gap: '0',
  },

  // 상세보기
  detailPanel: {
    background: '#2a1508',
    border: '3px solid #5c3018',
    borderBottom: '1px solid #5c3018',
    borderRadius: '8px 8px 0 0',
    padding: 'clamp(8px, 1.5vw, 12px)',
  },
  detailInner: {
    background: '#1a0a04',
    border: '2px solid #3d1e10',
    borderRadius: '6px',
    padding: 'clamp(8px, 1.5vw, 12px)',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(8px, 2vw, 16px)',
  },
  detailImg: {
    width: 'clamp(48px, 7vw, 72px)',
    height: 'clamp(48px, 7vw, 72px)',
    objectFit: 'contain',
    imageRendering: 'pixelated',
    flexShrink: 0,
  },
  detailInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(2px, 0.5vw, 6px)',
  },
  detailName: {
    fontSize: 'clamp(13px, 1.8vw, 16px)',
    fontWeight: 'bold',
    color: '#f0c060',
  },
  detailDesc: {
    fontSize: 'clamp(10px, 1.3vw, 13px)',
    color: '#c8a878',
    lineHeight: '1.5',
  },

  // 그리드
  gridPanel: {
    background: '#2a1508',
    border: '3px solid #5c3018',
    borderTop: '1px solid #5c3018',
    borderRadius: '0 0 8px 8px',
    padding: 'clamp(8px, 1.5vw, 12px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
  },
  grid: {
    background: '#1a0a04',
    border: '2px solid #3d1e10',
    borderRadius: '6px',
    padding: 'clamp(6px, 1vw, 10px)',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 'clamp(4px, 0.8vw, 8px)',
  },
  slot: {
    aspectRatio: '1',
    background: '#3d1e10',
    border: '2px solid #5c3018',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  slotFilled: {
    cursor: 'pointer',
    background: '#2a1508',
    border: '2px solid #6b3a1a',
  },
  slotSelected: {
    border: '2px solid #f0c060',
    boxShadow: '0 0 8px rgba(240,192,96,0.4)',
  },
  slotImg: {
    width: '75%',
    height: '75%',
    objectFit: 'contain',
    imageRendering: 'pixelated',
    display: 'block',
  },
  emptySlot: {
    display: 'block',
  },

  // 닫기
  closeBtn: {
    alignSelf: 'flex-end',
    marginRight: 'calc(50% - clamp(150px, 30vw, 260px))',
    background: '#5c3018',
    border: '2px solid #7a4e28',
    borderRadius: '4px',
    color: '#f5e6c8',
    fontSize: 'clamp(11px, 1.5vw, 14px)',
    fontWeight: 'bold',
    padding: 'clamp(6px, 1vh, 10px) clamp(14px, 2.5vw, 24px)',
    cursor: 'pointer',
  },
};

export default ItemModal;
