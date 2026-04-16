import React, { useState } from 'react';

const ITEMS = [
  { id: 'incense_burner',      name: '사성 전사의 모자',     description: '별이 달린 붉은 모자. 위대한 전사의 아들이 쓰던 것으로, 쓰면 전투력이 급상승한다는 소문이 있다.', img: '/assets/items/incense_burner.png' },
  { id: 'pocket_watch',        name: '등가교환의 시계',     description: '어느 국가 소속 연금술사의 은빛 회중시계. 무언가를 얻으려면 반드시 같은 값을 치러야 한다.', img: '/assets/items/pocket_watch.png' },
  { id: 'millennium_pendant',  name: '어둠의 역피라미드',   description: '고대 왕국에서 발굴된 퍼즐. 완성한 자의 내면에 또 다른 인격이 깨어난다고 한다.', img: '/assets/items/millennium_pendant.png' },
  { id: 'spirit_phone',        name: '태양의 귀걸이',      description: '대대로 전해 내려온 해 문양의 귀걸이. 쓰면 호흡이 깊어지고 칼날이 붉게 타오른다.', img: '/assets/items/spirit_phone.png' },
  { id: 'stone_mask',          name: '기묘한 석가면',       description: '달빛 아래 피를 바르면 착용자를 초월적 존재로 각성시킨다는 고대의 가면. 사용에 주의할 것.', img: '/assets/items/stone_mask.png' },
  { id: 'grappling_hook',      name: '아버지의 열쇠',       description: '벽 너머의 진실이 잠든 지하실을 여는 열쇠. 세계의 비밀을 알게 되면 돌아갈 수 없다.', img: '/assets/items/grappling_hook.png' },
  { id: 'wristband',           name: '인정의 이마보호대',   description: '마을 문양이 새겨진 금속 머리띠. 이것을 받는 순간, 한 명의 닌자로 인정받게 된다.', img: '/assets/items/wristband.png' },
  { id: 'jersey_10',           name: '천재의 10번 유니폼',  description: '"천재니까요." 전국 제패의 꿈을 품은 붉은 유니폼. 입으면 왠지 리바운드가 잘 된다.', img: '/assets/items/jersey_10.png' },
  { id: 'pokedex',             name: '모험가 자격증',       description: '특별한 시험을 통과한 자만이 받을 수 있는 카드. 소유자에게 세계 어디든 갈 수 있는 자유가 주어진다.', img: '/assets/items/pokedex.png' },
  { id: 'chain_bomb',          name: '운명의 요석',         description: '피눈물을 흘리는 자 앞에 나타나 운명의 선택을 강요하는 붉은 구슬. 인과율이 뒤틀린다.', img: '/assets/items/chain_bomb.png' },
  { id: 'wooden_bat',          name: '거대한 철 덩어리',    description: '그것은 검이라기엔 너무 크고, 두껍고, 무겁고, 거칠었다. 그리고 대충 만들어져 있었다.', img: '/assets/items/wooden_bat.png' },
  { id: 'straw_hat',           name: '약속의 밀짚모자',     description: '은인에게 물려받은 소중한 모자. 반드시 돌려주겠다는 약속과 함께 바다 위의 왕을 꿈꾼다.', img: '/assets/items/straw_hat.png' },
  { id: 'dragon_balls',        name: '소원의 구슬',         description: '별이 새겨진 일곱 개의 구슬. 모두 모으면 하늘에서 거대한 용이 나타나 소원을 들어준다.', img: '/assets/items/dragon_balls.png' },
];

const SLOT_COUNT = 20; // 4행 5열

function ItemModal({ onClose }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => ITEMS[i] || null);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.wrapper} onClick={e => e.stopPropagation()}>

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
    background: 'rgba(0, 0, 0, 0.5)',
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
