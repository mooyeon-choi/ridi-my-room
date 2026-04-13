import React, { useState, useRef, useEffect } from 'react';

function ChatBox({ hostUserId, aiConfig, onInputFocus, onInputBlur }) {
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
  }

  function handleBlur() {
    if (onInputBlur) onInputBlur();
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

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
      const aiMessage = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: '죄송합니다. 응답 중 오류가 발생했습니다.'
      };
      setMessages(prev => [...prev, errorMessage]);
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
              <span style={styles.aiLabel}>맥시</span>
            )}
            <div style={styles.messageText}>{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.messageBubble, ...styles.aiBubble }}>
            <span style={styles.aiLabel}>맥시</span>
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
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    WebkitOverflowScrolling: 'touch'
  },
  messageBubble: {
    maxWidth: '85%',
    padding: '8px 12px',
    borderRadius: '12px',
    fontSize: '13px',
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
    fontSize: '10px',
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
    fontSize: '20px',
    color: '#d4a843',
    animation: 'blink 1s infinite',
    lineHeight: '1'
  },
  inputArea: {
    display: 'flex',
    gap: '6px',
    padding: '8px 10px',
    borderTop: '2px solid #8b6914',
    background: '#c4a050',
    flexShrink: 0
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '6px',
    border: '2px solid #8b6914',
    background: '#e8cfa0',
    color: '#3d2210',
    fontSize: '13px',
    outline: 'none',
    WebkitAppearance: 'none'
  },
  sendBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: '2px solid #8b6914',
    background: '#5c3322',
    color: '#f5e6c8',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flexShrink: 0
  }
};

export default ChatBox;
