import React, { useState, useEffect, useRef } from 'react';

const RESPONSE_POOL = {
  academics: [
    "Academic pressure is heavy. Remember to take it one step at a time. Have you checked your Schedule tracker today?",
    "It sounds like school is really overwhelming right now. You are more than your grades. Take a deep breath.",
    "I hear you. Studying can drain your energy fast. Make sure you aren't sacrificing your sleep for this!",
    "That sounds really stressful. Don't forget to break your tasks into smaller, manageable chunks."
  ],
  fatigue: [
    "It sounds like you're running on empty. Maybe it's time to use the Sleep Tracker and get some rest?",
    "Burnout is real. Your brain needs downtime to process everything. Have you taken a break today?",
    "Listen to your body. No amount of studying is worth your health. Try to get some solid sleep tonight."
  ],
  loneliness: [
    "I'm here to listen. It's okay to feel disconnected sometimes. Do you want to vent more about it?",
    "Feeling isolated is really tough. Remember that your mentor is just a message away if you need a human connection.",
    "You aren't alone in feeling this way. Sometimes journaling your thoughts can help untangle them."
  ],
  fallback: [
    "I hear you. Tell me a bit more about what's on your mind.",
    "That makes sense. How is that making you feel right now?",
    "Thank you for sharing that with me. I'm right here if you want to keep venting.",
    "I'm listening. Take your time."
  ]
};

const AIChatbot = () => {
  // State Management
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Persistence: Load on Mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser") || "Student";
    setCurrentUser(storedUser);

    const historyKey = `${storedUser}_chatHistory`;
    const savedMessages = localStorage.getItem(historyKey);

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }

    // Initial welcoming state if no history
    setMessages([{
      id: Date.now(),
      sender: 'ai',
      text: `Hi ${storedUser}, I'm your safe, on-device companion. I'm here to listen entirely offline. What's on your mind today?`
    }]);
  }, []);

  // Persistence: Save on Change & Scroll Management
  useEffect(() => {
    if (currentUser && messages.length > 0) {
      const historyKey = `${currentUser}_chatHistory`;
      localStorage.setItem(historyKey, JSON.stringify(messages));
    }
    // Auto-scroll to bottom seamlessly
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentUser, isTyping]);

  const handleResetChat = () => {
    if (!currentUser) return;
    const historyKey = `${currentUser}_chatHistory`;
    localStorage.removeItem(historyKey);
    setMessages([{
      id: Date.now(),
      sender: 'ai',
      text: `Hi ${currentUser}, I'm your safe, on-device companion. I'm here to listen entirely offline. What's on your mind today?`
    }]);
  };

  const getDiverseResponse = (category, lastResponseText) => {
    const pool = RESPONSE_POOL[category] || RESPONSE_POOL.fallback;
    let candidates = pool.filter(res => res !== lastResponseText);

    // Fallback if the array strictly contains only the last response (failsafe)
    if (candidates.length === 0) candidates = pool;

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: userText
    };

    // Capture State Instantly
    const newMessages = [...messages, userMessage];

    // Update with user message
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    const lowerText = userText.toLowerCase();

    // High-Priority Crisis Interceptor
    const crisisKeywords = ["suicide", "end it", "kill myself", "hopeless", "give up"];
    const isCrisis = crisisKeywords.some(keyword => lowerText.includes(keyword));

    if (isCrisis) {
      setTimeout(() => {
        window.alert("Critical Alert: Severe distress detected. Urgent mentor intervention requested.");
      }, 50);

      const hardcodedResponse = "I hear how much pain you're in, and I want you to know you are not alone. Please let me connect you with your mentor or a professional who can help right now.";

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: hardcodedResponse
      }]);
      setIsTyping(false);
      return;
    }

    // Determine Category
    let category = "fallback";
    if (["exam", "fail", "marks", "study", "grades", "stress"].some(k => lowerText.includes(k))) {
      category = "academics";
    } else if (["tired", "exhausted", "sleep", "sleepy", "burnout"].some(k => lowerText.includes(k))) {
      category = "fatigue";
    } else if (["alone", "friends", "lonely", "isolated", "nobody"].some(k => lowerText.includes(k))) {
      category = "loneliness";
    }

    // Identify last AI response to prevent immediate repetition
    const lastAiMsg = messages.slice().reverse().find(m => m.sender === 'ai');
    const lastResponseText = lastAiMsg ? lastAiMsg.text : "";

    const responseText = getDiverseResponse(category, lastResponseText);

    // Simulated Typing Delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText
      }]);
      setIsTyping(false);
    }, 1500);
  };

  // UI/UX Styling
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1e293b', // Subdued dark slate panel
      borderRadius: '24px',
      height: '550px',
      width: '100%',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
      border: '1px solid #334155',
      overflow: 'hidden',
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif'
    },
    header: {
      backgroundColor: '#0f172a', // Global dark slate
      padding: '20px 24px',
      borderBottom: '1px solid #334155',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    headerDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: '#10b981', // green indicating "online (edge mode)"
      boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
    },
    headerTitle: {
      color: '#ffffff',
      margin: 0,
      fontSize: '18px',
      fontWeight: '600'
    },
    headerSubtitle: {
      color: '#94a3b8',
      fontSize: '12px',
      margin: 0,
      marginTop: '2px'
    },
    resetBtn: {
      marginLeft: 'auto',
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      fontSize: '13px',
      cursor: 'pointer',
      textDecoration: 'underline',
      padding: '4px 8px',
      transition: 'color 0.2s ease'
    },
    chatArea: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      backgroundColor: '#1e293b'
    },
    messageRow: {
      display: 'flex',
      width: '100%'
    },
    userRow: {
      justifyContent: 'flex-end'
    },
    aiRow: {
      justifyContent: 'flex-start'
    },
    bubble: {
      maxWidth: '75%',
      padding: '14px 18px',
      fontSize: '15px',
      lineHeight: '1.5',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    userBubble: {
      backgroundColor: '#ccfbf1', // Teal branding for user
      color: '#0f766e',
      borderRadius: '20px 20px 4px 20px'
    },
    aiBubble: {
      backgroundColor: '#e0e7ff', // Soft Indigo for AI
      color: '#3730a3',
      borderRadius: '20px 20px 20px 4px'
    },
    inputArea: {
      backgroundColor: '#0f172a', // Dark slate footer
      padding: '16px 20px',
      borderTop: '1px solid #334155',
      display: 'flex',
      gap: '12px'
    },
    input: {
      flex: 1,
      backgroundColor: '#1e293b',
      border: '1px solid #475569',
      padding: '14px 18px',
      borderRadius: '24px',
      color: '#f8fafc',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    sendBtn: {
      backgroundColor: '#0d9488', // Global Teal brand
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      padding: '0 24px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerDot}></div>
        <div>
          <h2 style={styles.headerTitle}>Companion AI</h2>
          <p style={styles.headerSubtitle}>100% Secure & On-Device</p>
        </div>
        <button
          style={styles.resetBtn}
          onClick={handleResetChat}
          onMouseOver={(e) => e.target.style.color = '#f8fafc'}
          onMouseOut={(e) => e.target.style.color = '#94a3b8'}
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div style={styles.chatArea}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} style={{ ...styles.messageRow, ...(isUser ? styles.userRow : styles.aiRow) }}>
              <div style={{ ...styles.bubble, ...(isUser ? styles.userBubble : styles.aiBubble) }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div style={{ ...styles.messageRow, ...styles.aiRow }}>
            <div style={{ ...styles.bubble, ...styles.aiBubble, fontStyle: 'italic', opacity: 0.7 }}>
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Bottom Input */}
      <form style={styles.inputArea} onSubmit={handleSend}>
        <input
          style={styles.input}
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = '#0d9488'}
          onBlur={(e) => e.target.style.borderColor = '#475569'}
          disabled={isTyping}
        />
        <button
          type="submit"
          style={{ ...styles.sendBtn, opacity: isTyping ? 0.6 : 1 }}
          onMouseOver={(e) => !isTyping && (e.target.style.backgroundColor = '#0f766e')}
          onMouseOut={(e) => !isTyping && (e.target.style.backgroundColor = '#0d9488')}
          disabled={isTyping}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIChatbot;
