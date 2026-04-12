import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

function QRCodeModal({ url, onClose }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    generateQRCode();
  }, [url]);

  async function generateQRCode() {
    try {
      const qrUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('QR 코드 생성 오류:', error);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(url)
      .then(() => alert('URL이 복사되었습니다!'))
      .catch(err => console.error('복사 실패:', err));
  }

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={e => e.stopPropagation()}>
        <h2>내 서재 공유</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
          QR 코드를 스캔하거나 URL을 공유하세요
        </p>

        {qrCodeUrl && (
          <img src={qrCodeUrl} alt="QR Code" style={{ display: 'block', margin: '0 auto' }} />
        )}

        <div style={{
          background: '#f5f5f5',
          padding: '12px',
          borderRadius: '8px',
          marginTop: '16px',
          fontSize: '12px',
          wordBreak: 'break-all'
        }}>
          {url}
        </div>

        <div className="qr-modal-buttons">
          <button onClick={copyToClipboard}>
            URL 복사
          </button>
          <button onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCodeModal;
