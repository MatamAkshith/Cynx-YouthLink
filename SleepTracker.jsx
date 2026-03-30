import React, { useState, useEffect } from 'react';

const SleepTracker = () => {
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepStartTime, setSleepStartTime] = useState(null);
  const [lastSleepDuration, setLastSleepDuration] = useState('');

  // Load state from localStorage when component mounts
  useEffect(() => {
    const savedIsSleeping = localStorage.getItem('isSleeping') === 'true';
    const savedStartTime = localStorage.getItem('sleepStartTime');
    const savedDuration = localStorage.getItem('lastSleepDuration');

    if (savedIsSleeping) setIsSleeping(true);
    if (savedStartTime) setSleepStartTime(parseInt(savedStartTime, 10));
    if (savedDuration) setLastSleepDuration(savedDuration);
  }, []);

  const startSleep = () => {
    const now = Date.now();
    setIsSleeping(true);
    setSleepStartTime(now);
    
    // Persist to localStorage
    localStorage.setItem('isSleeping', 'true');
    localStorage.setItem('sleepStartTime', now.toString());
  };

  const endSleep = () => {
    const wakeTime = Date.now();
    // Default diff to 0 if no start time is found for some reason
    const diffMs = sleepStartTime ? wakeTime - sleepStartTime : 0;
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    const durationStr = `${hours}h ${minutes}m`;
    
    setIsSleeping(false);
    setLastSleepDuration(durationStr);
    
    // Update localStorage
    localStorage.setItem('isSleeping', 'false');
    localStorage.setItem('lastSleepDuration', durationStr);
    
    // Hackathon Trigger: Alert if sleep is under 5 hours (300 mins)
    if (diffMins < 300) {
      window.alert("Sleep debt detected (< 5 hours). Should we check your academic schedule?");
    }
  };

  // Helper to format the sleep start time nicely
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Clean, inline styles for a self-contained component
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6', // Soft gray background for contrast
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      padding: '40px 30px',
      width: '100%',
      maxWidth: '380px',
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px'
    },
    title: {
      margin: '0',
      color: '#111827',
      fontSize: '28px',
      fontWeight: '800',
      letterSpacing: '-0.025em'
    },
    infoText: {
      margin: '0',
      color: '#6b7280',
      fontSize: '16px',
      lineHeight: '1.5'
    },
    sleepTimeStr: {
      fontWeight: '700',
      color: '#374151',
      display: 'block',
      fontSize: '20px',
      marginTop: '8px'
    },
    buttonStart: {
      backgroundColor: '#3730A3', // Deep indigo / blue
      color: '#ffffff',
      border: 'none',
      borderRadius: '16px',
      padding: '18px 24px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s ease',
      boxShadow: '0 8px 20px -6px rgba(55, 48, 163, 0.6)'
    },
    buttonEnd: {
      backgroundColor: '#F59E0B', // Warm amber / energetic orange
      color: '#ffffff',
      border: 'none',
      borderRadius: '16px',
      padding: '18px 24px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s ease',
      boxShadow: '0 8px 20px -6px rgba(245, 158, 11, 0.6)'
    },
    durationBox: {
      marginTop: '8px',
      padding: '20px',
      backgroundColor: '#F9FAFB',
      borderRadius: '16px',
      width: '100%',
      boxSizing: 'border-box',
      border: '1px solid #E5E7EB'
    },
    durationLabel: {
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontWeight: '600',
      color: '#9CA3AF',
      marginBottom: '8px',
      display: 'block'
    },
    durationValue: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#111827',
      margin: '0'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sleep Tracker</h2>
        
        {isSleeping ? (
          <>
            <p style={styles.infoText}>
              Resting quietly. You went to sleep at:
              <span style={styles.sleepTimeStr}>{formatTime(sleepStartTime)}</span>
            </p>
            <button 
              style={styles.buttonEnd}
              onClick={endSleep}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              I'm Up! (End Sleep)
            </button>
          </>
        ) : (
          <>
            <p style={styles.infoText}>Ready to recharge and log some rest?</p>
            <button 
              style={styles.buttonStart}
              onClick={startSleep}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Going Dark (Start Sleep)
            </button>
          </>
        )}

        {!isSleeping && lastSleepDuration && (
          <div style={styles.durationBox}>
            <span style={styles.durationLabel}>Last Sleep Session</span>
            <p style={styles.durationValue}>{lastSleepDuration}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SleepTracker;
