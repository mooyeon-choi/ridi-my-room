import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  // TODO: 실제로는 로그인 시스템 연동
  const handleStart = () => {
    // 임시로 user123으로 설정
    navigate('/my-room');
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>리디 마이룸</h1>
        <p style={styles.subtitle}>픽셀 아트로 만드는 나만의 서재</p>

        <div style={styles.features}>
          <div style={styles.feature}>
            📚 내 서재에서 AI 아바타와 함께
          </div>
          <div style={styles.feature}>
            🎨 트래블러스 레스트 스타일 픽셀 아트
          </div>
          <div style={styles.feature}>
            🤖 상수리나무 주인공처럼 따뜻한 AI
          </div>
          <div style={styles.feature}>
            📱 QR 코드로 친구 초대
          </div>
        </div>

        <button onClick={handleStart} style={styles.button}>
          내 서재 시작하기
        </button>

        <p style={styles.demo}>
          데모용: <a href="/user123/room">다른 사람 서재 방문해보기</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  content: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px'
  },
  features: {
    marginBottom: '32px'
  },
  feature: {
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '8px',
    fontSize: '14px'
  },
  button: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s'
  },
  demo: {
    marginTop: '24px',
    fontSize: '14px',
    color: '#666'
  }
};

export default Home;
