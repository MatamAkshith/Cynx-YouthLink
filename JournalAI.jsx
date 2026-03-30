import React, { useState, useEffect } from 'react';

const JournalAI = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [loginId, setLoginId] = useState('');

  // App State
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null); // { mood: "", emoji: "" }
  const [diaryText, setDiaryText] = useState('');
  const [lastEntryDate, setLastEntryDate] = useState('');
  const [reflectionText, setReflectionText] = useState('');

  // Privacy / Notes State
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [quickNotes, setQuickNotes] = useState([]);

  const MOODS = [
    { mood: "Happy", emoji: "😊" },
    { mood: "Calm", emoji: "🌿" },
    { mood: "Okay", emoji: "😐" },
    { mood: "Sad", emoji: "😢" },
    { mood: "Anxious", emoji: "😰" },
    { mood: "Tired", emoji: "😴" }
  ];

  const getReflection = (mood) => {
    switch (mood) {
      case "Happy": return "🌟 It’s good to notice and hold onto positive moments. Try writing what made today feel good.";
      case "Calm": return "🌿 Calm days matter too. Peaceful moments are worth remembering.";
      case "Okay": return "💛 An ordinary day is still a valid day. Not every day needs to be extraordinary.";
      case "Sad": return "💙 It sounds like today felt heavy. Writing honestly is already a meaningful step.";
      case "Anxious": return "🌼 If things feel overwhelming, try breaking your thoughts into smaller pieces. One moment at a time.";
      case "Tired": return "☁️ Rest matters. Being tired can affect both body and mind more than we realize.";
      default: return "📝 Thank you for checking in with yourself today.";
    }
  };

  // 1. Data Loading Effect
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Load Entries
      const savedEntries = JSON.parse(localStorage.getItem(`${currentUser}_entries`)) || [];
      setEntries(savedEntries);
      
      // Load Streak
      const savedStreak = parseInt(localStorage.getItem(`${currentUser}_streak`)) || 0;
      const savedLastDate = localStorage.getItem(`${currentUser}_lastDate`) || "";
      setStreak(savedStreak);
      setLastEntryDate(savedLastDate);
      
      // Load Quick Notes
      const savedNotes = JSON.parse(localStorage.getItem(`${currentUser}_quickNotes`));
      if (savedNotes && savedNotes.length > 0) {
        setQuickNotes(savedNotes);
      } else {
        setQuickNotes(["New note..."]); // Default first load
      }
    }
  }, [currentUser]);

  // 2. Keyboard Listener for Quick Hide Mode (Ctrl + Q)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        if (currentUser) setIsPrivacyMode(prev => !prev);
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentUser]);

  // 3. Document Title Masking Effect
  useEffect(() => {
    if (isPrivacyMode) {
      document.title = "Quick Notes";
    } else {
      document.title = "JournalAI";
    }
  }, [isPrivacyMode]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginId.trim()) {
      alert("Please enter Login ID");
      return;
    }
    localStorage.setItem("currentUser", loginId.trim());
    setCurrentUser(loginId.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setLoginId('');
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    let newStreak = streak;
    if (lastEntryDate === today) return; // Already checked in today

    if (lastEntryDate === yesterdayString) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    setStreak(newStreak);
    setLastEntryDate(today);
    localStorage.setItem(`${currentUser}_streak`, newStreak);
    localStorage.setItem(`${currentUser}_lastDate`, today);
  };

  // ----- THE AI SENTIMENT ENGINE -----
  const analyzeSentiment = (text) => {
    const weights = { anxious: -2, sad: -2, tired: -1, fail: -3, stress: -2, happy: 2, calm: 1 };
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    let score = 0;
    
    words.forEach(word => {
      if (weights[word] !== undefined) {
        score += weights[word];
      }
    });

    if (score < -5) {
      window.alert("Privacy Alert: Emotional distress detected. Sending automated update to assigned Mentor.");
    }
  };

  const handleSaveEntry = () => {
    if (!diaryText.trim()) {
      alert("Please write something in your diary first.");
      return;
    }
    if (!selectedMood) {
      alert("Please select your mood.");
      return;
    }

    // Call Sentiment Engine
    analyzeSentiment(diaryText);

    const newEntry = {
      id: Date.now().toString(),
      mood: `${selectedMood.emoji} ${selectedMood.mood}`,
      text: diaryText,
      date: new Date().toLocaleString()
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem(`${currentUser}_entries`, JSON.stringify(updatedEntries));

    setReflectionText(getReflection(selectedMood.mood));
    updateStreak();

    setDiaryText("");
    setSelectedMood(null);
  };

  const handleNoteChange = (index, value) => {
    const newNotes = [...quickNotes];
    newNotes[index] = value;
    setQuickNotes(newNotes);
    localStorage.setItem(`${currentUser}_quickNotes`, JSON.stringify(newNotes));
  };

  const addQuickBox = () => {
    const newNotes = [...quickNotes, "New note..."];
    setQuickNotes(newNotes);
    localStorage.setItem(`${currentUser}_quickNotes`, JSON.stringify(newNotes));
  };


  // 4. Clean Inline Styling Object
  const styles = {
    wrapper: { minHeight: '100vh', background: '#f4f6fb', color: '#1e1e2f', fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif' },
    authScreen: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6c63ff, #8f94fb)', padding: '20px' },
    authBox: { background: 'white', width: '100%', maxWidth: '360px', padding: '36px 30px', borderRadius: '18px', textAlign: 'center', boxShadow: '0 18px 40px rgba(0, 0, 0, 0.12)' },
    authTitle: { fontSize: '32px', marginBottom: '8px', color: '#2b2b45' },
    subtitle: { color: '#6b6b82', fontSize: '14px', marginBottom: '20px' },
    authInput: { width: '100%', padding: '13px 14px', border: '1px solid #ddd', borderRadius: '10px', outline: 'none', marginBottom: '14px', fontSize: '15px', boxSizing: 'border-box' },
    authBtn: { width: '100%', padding: '13px', border: 'none', borderRadius: '10px', background: '#6c63ff', color: 'white', fontWeight: '600', fontSize: '15px', cursor: 'pointer' },
    hint: { marginTop: '12px', fontSize: '12px', color: '#999' },
    
    topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', background: 'white', borderBottom: '1px solid #ececf5', position: 'sticky', top: '0', zIndex: '20' },
    topbarTitle: { fontSize: '28px', color: '#2b2b45', margin: 0 },
    topbarActions: { display: 'flex', alignItems: 'center', gap: '14px' },
    quickHideTag: { fontSize: '13px', color: '#7a7a90', background: '#f2f3ff', padding: '10px 12px', borderRadius: '10px', fontWeight: '600' },
    logoutBtn: { border: 'none', background: '#ff5f6d', color: 'white', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
    
    mainGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', padding: '28px 40px' },
    card: { background: 'white', borderRadius: '18px', padding: '24px', boxShadow: '0 10px 28px rgba(25, 25, 40, 0.06)' },
    sectionTitle: { fontSize: '24px', marginBottom: '8px', color: '#2a2a44', marginTop: 0 },
    sectionDesc: { fontSize: '14px', color: '#77788e', marginBottom: '16px' },
    textarea: { width: '100%', minHeight: '170px', padding: '16px', border: '1px solid #ddd', borderRadius: '14px', resize: 'vertical', fontSize: '15px', outline: 'none', lineHeight: '1.6', background: '#fcfcff', boxSizing: 'border-box' },
    
    moodSection: { marginTop: '20px' },
    label: { fontSize: '14px', marginBottom: '10px', color: '#666b80', fontWeight: '500' },
    moodButtons: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
    moodBtn: { width: '50px', height: '50px', border: 'none', borderRadius: '14px', fontSize: '22px', cursor: 'pointer', background: '#f1f3ff', transition: '0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    moodBtnActive: { background: '#6c63ff', color: 'white', boxShadow: '0 10px 20px rgba(108, 99, 255, 0.25)' },
    
    saveBtn: { width: '100%', marginTop: '20px', padding: '14px', border: 'none', borderRadius: '12px', background: '#6c63ff', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
    reflectionBox: { marginTop: '18px', padding: '14px 16px', background: '#eef0ff', borderRadius: '12px', color: '#42446b', fontSize: '14px', lineHeight: '1.6' },
    
    streakBox: { textAlign: 'center', padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, #ff9966, #ff5e62)', color: 'white', marginBottom: '20px' },
    streakContent: { fontSize: '34px', fontWeight: '700', margin: '10px 0 6px' },
    streakSubtext: { fontSize: '13px', opacity: '0.95' },
    miniText: { color: '#76788e', fontSize: '14px', marginBottom: '14px' },
    infoBox: { background: '#f8f9ff', border: '1px solid #eff1ff', padding: '16px', borderRadius: '14px', marginTop: '14px' },
    infoBoxTitle: { fontSize: '16px', marginBottom: '8px', color: '#343658', marginTop: 0 },
    infoBoxText: { fontSize: '14px', color: '#676a82', lineHeight: '1.6', margin: 0 },
    
    entriesWrapper: { padding: '0 40px 34px' },
    entriesList: { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' },
    entryCard: { background: 'white', borderRadius: '16px', padding: '18px', boxShadow: '0 8px 22px rgba(25, 25, 40, 0.05)', border: '1px solid #f0f1f7' },
    entryTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '10px' },
    entryMood: { fontSize: '15px', fontWeight: '600', color: '#36385c' },
    entryDate: { fontSize: '12px', color: '#8d8ea5' },
    entryText: { fontSize: '14px', color: '#4e5067', lineHeight: '1.7', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 },
    emptyState: { fontSize: '14px', color: '#9a9cb3', background: 'white', padding: '18px', borderRadius: '14px', boxShadow: '0 8px 22px rgba(25, 25, 40, 0.04)', margin: 0 },
    
    privacyScreen: { minHeight: '100vh', background: '#f5f5f5', padding: '30px' },
    privacyHeaderTitle: { fontSize: '28px', color: '#2f2f2f', margin: '0 0 6px 0' },
    privacyHeaderText: { color: '#777', fontSize: '14px', margin: '0 0 20px 0' },
    notesToolbar: { marginBottom: '18px' },
    addNoteBtn: { padding: '12px 16px', border: 'none', borderRadius: '10px', background: '#2f2f2f', color: 'white', fontSize: '14px', cursor: 'pointer' },
    quickNotesContainer: { display: 'flex', flexWrap: 'wrap', gap: '18px' },
    quickNoteBox: { 
      width: '240px', minHeight: '150px', background: 'white', borderRadius: '14px', padding: '14px', 
      boxShadow: '0 8px 18px rgba(0, 0, 0, 0.05)', fontSize: '14px', color: '#333', border: '1px solid #ececec',
      outline: 'none', lineHeight: '1.6', boxSizing: 'border-box',
      resize: 'vertical' 
    }
  };

  // --- RENDERING VIEWS ---

  if (!currentUser) {
    return (
      <div style={styles.authScreen}>
        <div style={styles.authBox}>
          <h1 style={styles.authTitle}>Journal AI</h1>
          <p style={styles.subtitle}>Log in to access your secure diary</p>
          <form onSubmit={handleLogin}>
            <input 
              style={styles.authInput} 
              type="text" 
              placeholder="Enter Login ID" 
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
            <button style={styles.authBtn} type="submit">Unlock Diary</button>
          </form>
          <p style={styles.hint}>All data is stored locally on your device.</p>
        </div>
      </div>
    );
  }

  if (isPrivacyMode) {
    return (
      <div style={styles.privacyScreen}>
        <div style={styles.privacyHeader}>
          <h1 style={styles.privacyHeaderTitle}>Quick Notes</h1>
          <p style={styles.privacyHeaderText}>Your diary is hidden. Press Ctrl + Q to unlock.</p>
        </div>
        <div style={styles.notesToolbar}>
          <button style={styles.addNoteBtn} onClick={addQuickBox}>+ Add Note</button>
        </div>
        <div style={styles.quickNotesContainer}>
          {quickNotes.map((note, idx) => (
            <textarea
              key={idx}
              style={styles.quickNoteBox}
              value={note}
              onChange={(e) => handleNoteChange(idx, e.target.value)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Topbar */}
      <div style={styles.topbar}>
        <h1 style={styles.topbarTitle}>My Diary</h1>
        <div style={styles.topbarActions}>
          <span style={styles.quickHideTag}>Ctrl + Q to Quick Hide</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Lock</button>
        </div>
      </div>

      {/* Main Grid Setup */}
      <div style={styles.mainGrid}>
        
        {/* Editor Side */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>New Entry</h2>
          <p style={styles.sectionDesc}>Write about your day, thoughts, or feelings.</p>
          
          <textarea
            style={styles.textarea}
            placeholder="Dear Diary..."
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
          />

          <div style={styles.moodSection}>
            <p style={styles.label}>How are you feeling?</p>
            <div style={styles.moodButtons}>
              {MOODS.map(m => {
                const isActive = selectedMood && selectedMood.mood === m.mood;
                return (
                  <button
                    key={m.mood}
                    style={{...styles.moodBtn, ...(isActive ? styles.moodBtnActive : {})}}
                    onClick={() => setSelectedMood(m)}
                    title={m.mood}
                  >
                    {m.emoji}
                  </button>
                );
              })}
            </div>
          </div>

          <button style={styles.saveBtn} onClick={handleSaveEntry}>
            Save Entry
          </button>

          {reflectionText && (
            <div style={styles.reflectionBox}>
              {reflectionText}
            </div>
          )}
        </div>

        {/* Info Side Panel */}
        <div className="side-panel">
          <div style={styles.streakBox}>
            <h3>Writing Streak 🔥</h3>
            <div style={styles.streakContent}>{streak}</div>
            <div style={styles.streakSubtext}>Days in a row</div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Insights</h2>
            <p style={styles.miniText}>Your tracking stats</p>
            
            <div style={styles.infoBox}>
              <h3 style={styles.infoBoxTitle}>Total Entries</h3>
              <p style={styles.infoBoxText}>{entries.length} reflections recorded.</p>
            </div>
            
            <div style={styles.infoBox}>
              <h3 style={styles.infoBoxTitle}>Why keep a diary?</h3>
              <p style={styles.infoBoxText}>Writing regularly helps reduce stress and organize your thoughts better over time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Entries Output */}
      <div style={styles.entriesWrapper}>
        <h2 style={styles.sectionTitle}>Past Entries</h2>
        <div style={styles.entriesList}>
          {entries.length === 0 ? (
            <p style={styles.emptyState}>No entries yet. Start by writing about your day 🌱</p>
          ) : (
            entries.map(entry => (
              <div key={entry.id} style={styles.entryCard}>
                <div style={styles.entryTop}>
                  <div style={styles.entryMood}>{entry.mood}</div>
                  <div style={styles.entryDate}>{entry.date}</div>
                </div>
                <p style={styles.entryText}>{entry.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default JournalAI;
