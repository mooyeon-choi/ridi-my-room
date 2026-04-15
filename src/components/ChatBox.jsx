import React, { useState, useRef, useEffect } from 'react';

function ChatBox({ hostUserId, aiConfig, hostName, onInputFocus, onInputBlur, onChatBubble }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: aiConfig?.customGreeting || '안녕하세요. 환영합니다!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleFocus() {
    if (onInputFocus) onInputFocus();
    if (onChatBubble) onChatBubble('typing', true);
  }

  function handleBlur() {
    if (onInputBlur) onInputBlur();
    if (onChatBubble) onChatBubble('typing', false);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // 타이핑 말풍선 해제 + 맥시(방문자) 말풍선
    if (onChatBubble) {
      onChatBubble('typing', false);
      onChatBubble('my', '💬');
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: hostUserId || 'user123',
          message: input,
          persona: aiConfig?.persona || 'sangsuri',
          chatHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          context: aiConfig?.readingData || {
            recentBooks: [],
            favoriteGenres: [],
            totalBooksRead: 0
          }
        })
      });

      if (!response.ok) throw new Error('API 호출 실패');
      const data = await response.json();
      const replyText = data.reply;
      const hostEmoji = data.emoji || '😊';
      const aiMessage = { role: 'assistant', content: replyText };
      setMessages(prev => [...prev, aiMessage]);
      // 호스트 말풍선
      if (onChatBubble) onChatBubble('host', hostEmoji);
    } catch (error) {
      // 네트워크 오류 시 로컬 폴백 응답 (캐릭터별)
      const persona = aiConfig?.persona || 'sangsuri';
      const fallbackMap = {
        sangsuri: [
          '찾아와 주셔서 반가워요. 천천히 둘러보세요.',
          '좋은 질문이네요. 저도 생각해 볼게요.',
          '책 한 권의 여운이 오래가는 날이에요.',
          '함께 이야기 나눌 수 있어서 기쁘네요.',
        ],
        neosokbam: [
          '어머, 찾아왔군요. 반가워요.',
          '그래요? 흥미로운 이야기네요.',
          '밤이 깊어질수록 이야기도 깊어지는 법이죠.',
          '그 책, 저도 좋아하는데요. 취향이 비슷한 것 같아요.',
        ],
        betrayer: [
          '왔군요.',
          '그렇군요.',
          '꽤 괜찮은 취향이시네요.',
          '...흥미롭군요. 계속 말해보세요.',
        ],
      };
      const replies = fallbackMap[persona] || fallbackMap.sangsuri;
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      const fallbackEmojis = { sangsuri: '📚', neosokbam: '🌙', betrayer: '🍷' };
      if (onChatBubble) onChatBubble('host', fallbackEmojis[persona] || '😊');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* 메시지 영역 */}
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.messageBubble,
              ...(msg.role === 'user' ? styles.userBubble : styles.aiBubble)
            }}
          >
            {msg.role === 'assistant' && (
              <span style={styles.aiLabel}>{hostName || '맥시'}</span>
            )}
            <div style={styles.messageText}>{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.messageBubble, ...styles.aiBubble }}>
            <span style={styles.aiLabel}>{hostName || '맥시'}</span>
            <div style={styles.loadingDots}>
              <span style={styles.dot}>.</span>
              <span style={{ ...styles.dot, animationDelay: '0.2s' }}>.</span>
              <span style={{ ...styles.dot, animationDelay: '0.4s' }}>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <form onSubmit={sendMessage} style={styles.inputArea}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="메시지를 입력하세요..."
          disabled={loading}
          style={styles.input}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            ...styles.sendBtn,
            opacity: (loading || !input.trim()) ? 0.5 : 1
          }}
        >
          전송
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: 'clamp(6px, 1.2vh, 10px) clamp(8px, 1.5vw, 12px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(4px, 0.6vh, 6px)',
    WebkitOverflowScrolling: 'touch'
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 'clamp(5px, 1vh, 8px) clamp(8px, 1.5vw, 12px)',
    borderRadius: 'clamp(8px, 1.5vw, 12px)',
    fontSize: 'clamp(11px, 1.4vw, 13px)',
    lineHeight: '1.5',
    wordBreak: 'break-word'
  },
  userBubble: {
    alignSelf: 'flex-end',
    background: '#8b5e3c',
    color: '#f5e6c8',
    borderBottomRightRadius: '4px'
  },
  aiBubble: {
    alignSelf: 'flex-start',
    background: '#5c3322',
    color: '#f5e6c8',
    borderBottomLeftRadius: '4px'
  },
  aiLabel: {
    display: 'inline-block',
    fontSize: 'clamp(8px, 1.1vw, 10px)',
    fontWeight: 'bold',
    color: '#d4a843',
    marginBottom: '2px'
  },
  messageText: {
    margin: 0
  },
  loadingDots: {
    display: 'flex',
    gap: '2px'
  },
  dot: {
    fontSize: 'clamp(14px, 2vw, 20px)',
    color: '#d4a843',
    animation: 'blink 1s infinite',
    lineHeight: '1'
  },
  inputArea: {
    display: 'flex',
    gap: 'clamp(4px, 0.6vw, 6px)',
    padding: 'clamp(5px, 1vh, 8px) clamp(6px, 1.2vw, 10px)',
    borderTop: '2px solid #8b6914',
    background: '#c4a050',
    flexShrink: 0
  },
  input: {
    flex: 1,
    padding: 'clamp(5px, 1vh, 8px) clamp(8px, 1.5vw, 12px)',
    borderRadius: '6px',
    border: '2px solid #8b6914',
    background: '#e8cfa0',
    color: '#3d2210',
    fontSize: 'clamp(11px, 1.4vw, 13px)',
    outline: 'none',
    WebkitAppearance: 'none'
  },
  sendBtn: {
    padding: 'clamp(5px, 1vh, 8px) clamp(8px, 1.5vw, 14px)',
    borderRadius: '6px',
    border: '2px solid #8b6914',
    background: '#5c3322',
    color: '#f5e6c8',
    fontSize: 'clamp(10px, 1.3vw, 12px)',
    fontWeight: 'bold',
    cursor: 'pointer',
    flexShrink: 0
  }
};

export default ChatBox;
