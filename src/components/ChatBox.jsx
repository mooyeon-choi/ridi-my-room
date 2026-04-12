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
        headers: {
          'Content-Type': 'application/json'
        },
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

      if (!response.ok) {
        throw new Error('API 호출 실패');
      }

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('채팅 오류:', error);
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
              <span style={styles.aiLabel}>AI</span>
            )}
            <div style={styles.messageText}>{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.messageBubble, ...styles.aiBubble }}>
            <span style={styles.aiLabel}>AI</span>
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
            opacity: (loading || !input.trim()) ? 0.4 : 1
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
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    WebkitOverflowScrolling: 'touch'
  },
  messageBubble: {
    maxWidth: '85%',
    padding: '10px 14px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: '1.5',
    wordBreak: 'break-word'
  },
  userBubble: {
    alignSelf: 'flex-end',
    background: '#3b82f6',
    color: '#fff',
    borderBottomRightRadius: '4px'
  },
  aiBubble: {
    alignSelf: 'flex-start',
    background: '#2a2a2a',
    color: '#e0e0e0',
    borderBottomLeftRadius: '4px'
  },
  aiLabel: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#8b5cf6',
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
    fontSize: '24px',
    color: '#888',
    animation: 'blink 1s infinite',
    lineHeight: '1'
  },
  inputArea: {
    display: 'flex',
    gap: '8px',
    padding: '10px 12px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    background: '#1a1a1a',
    flexShrink: 0
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: '#2a2a2a',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    WebkitAppearance: 'none'
  },
  sendBtn: {
    padding: '10px 18px',
    borderRadius: '20px',
    border: 'none',
    background: '#3b82f6',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flexShrink: 0
  }
};

export default ChatBox;
