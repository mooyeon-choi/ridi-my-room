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
          '…쓸데없는 질문이군요. 뭐, 대답은 해드리죠.',
          '그 정도는 스스로 생각해보는 게 좋을 텐데요.',
          '마나를 흘리는 방식이 엉망입니다만... 뭐, 예전보단 낫군요.',
          '원정을 나가기 전에 좀 더 준비하세요.',
        ],
        neosokbam: [
          '왜 그렇게 쳐다보는 거예요...?',
          '... 거짓말을 하고 있네요.',
          '취향이 나쁘진 않네요.',
          '신어머니가 그러셨어요. 뭐든지 읽고 배워두라고.',
        ],
        betrayer: [
          '...뭐요.',
          '그렇군요.',
          '꽤 괜찮은 와인이군요. 땅콩 냄새가 좀 나지만....',
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
    overflow: 'hidden',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: 'clamp(4px, 0.8vh, 8px) clamp(6px, 1vw, 10px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(3px, 0.5vh, 5px)',
    WebkitOverflowScrolling: 'touch',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 'clamp(4px, 0.7vh, 7px) clamp(6px, 1vw, 10px)',
    borderRadius: '8px',
    fontSize: 'clamp(10px, 1.3vw, 12px)',
    lineHeight: '1.4',
    wordBreak: 'break-word',
  },
  userBubble: {
    alignSelf: 'flex-end',
    background: '#6b4423',
    color: '#f0ddb8',
    borderBottomRightRadius: '2px',
    border: '1px solid #8b5e3c',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    background: '#3d1e10',
    color: '#f0ddb8',
    borderBottomLeftRadius: '2px',
    border: '1px solid #5c3322',
  },
  aiLabel: {
    display: 'inline-block',
    fontSize: 'clamp(8px, 1vw, 10px)',
    fontWeight: 'bold',
    color: '#d4a843',
    marginBottom: '1px',
  },
  messageText: {
    margin: 0,
  },
  loadingDots: {
    display: 'flex',
    gap: '2px',
  },
  dot: {
    fontSize: 'clamp(12px, 1.8vw, 18px)',
    color: '#d4a843',
    animation: 'blink 1s infinite',
    lineHeight: '1',
  },
  inputArea: {
    display: 'flex',
    gap: 'clamp(3px, 0.5vw, 5px)',
    padding: 'clamp(4px, 0.7vh, 6px) clamp(5px, 1vw, 8px)',
    borderTop: '1px solid #5c3018',
    background: '#3a1a0a',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: 'clamp(4px, 0.7vh, 6px) clamp(6px, 1vw, 10px)',
    borderRadius: '4px',
    border: '1px solid #5c3018',
    background: '#1a0a04',
    color: '#f0ddb8',
    fontSize: 'clamp(10px, 1.3vw, 12px)',
    outline: 'none',
    WebkitAppearance: 'none',
  },
  sendBtn: {
    padding: 'clamp(4px, 0.7vh, 6px) clamp(6px, 1vw, 12px)',
    borderRadius: '4px',
    border: '1px solid #5c3018',
    background: '#5c3018',
    color: '#f0ddb8',
    fontSize: 'clamp(9px, 1.2vw, 11px)',
    fontWeight: 'bold',
    cursor: 'pointer',
    flexShrink: 0,
  },
};

export default ChatBox;
