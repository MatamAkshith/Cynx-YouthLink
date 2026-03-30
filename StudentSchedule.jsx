import React, { useState, useEffect } from 'react';

const StudentSchedule = () => {
  // State Management
  const [events, setEvents] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState(''); // New state for start time
  const [newEndTime, setNewEndTime] = useState(''); // New state for end time
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistence: Load on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('student_events');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        console.error("Failed to parse events from localStorage");
      }
    }
    setIsLoaded(true);
  }, []);

  // Persistence & Hackathon Trigger: Save and check stress when events change
  useEffect(() => {
    if (!isLoaded) return;
    
    // Save to localStorage
    localStorage.setItem('student_events', JSON.stringify(events));

    // The Context Engine trigger: Detect Academic Stress
    const checkUpcomingStress = () => {
      const today = new Date();
      // Format as YYYY-MM-DD keeping local time zone intact
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

      // Check if any event falls exactly today or tomorrow
      const isStressed = events.some(event => event.date === todayStr || event.date === tomorrowStr);
      
      // Share state with SleepTracker or Chatbot via localStorage
      localStorage.setItem('has_upcoming_exam', isStressed ? 'true' : 'false');
    };

    checkUpcomingStress();
  }, [events, isLoaded]);

  // Post-Exam Check-In Interval Logic
  useEffect(() => {
    if (!isLoaded || events.length === 0) return;

    // Run every 30 seconds for immediate hackathon demonstration
    const intervalId = setInterval(() => {
      let hasUpdates = false;
      const updatedEvents = events.map(event => {
        if (event.endTime && !event.notified) {
          const endDateTime = new Date(`${event.date}T${event.endTime}`);
          if (new Date() > endDateTime) {
            window.alert("Hey, you just finished your " + (event.subject || event.title) + " exam! How did it go?");
            hasUpdates = true;
            return { ...event, notified: true }; // Mark as notified
          }
        }
        return event;
      });

      // Update state if notifications triggered (localStorage saves via the other useEffect)
      if (hasUpdates) {
        setEvents(updatedEvents);
      }
    }, 30000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [events, isLoaded]);

  // Core Logic: Add an event
  const addEvent = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate || !newStartTime || !newEndTime) return;

    const year = newDate.split('-')[0];
    if (year.length > 4) {
      window.alert("Please enter a valid 4-digit year.");
      return;
    }

    const newEvent = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      title: newTitle.trim(),
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      notified: false // Initialized to false
    };

    // Sort events by date and time ascending 
    const updatedEvents = [...events, newEvent].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
      return dateA - dateB;
    });
    
    setEvents(updatedEvents);
    setNewTitle('');
    setNewDate('');
    setNewStartTime('');
    setNewEndTime('');
  };

  // Core Logic: Delete an event
  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Helper to nicely format dates
  const formatDate = (dateString, startTime, endTime) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString + 'T00:00:00'); // Ensure it reads as local block
    const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    
    const formatTimeStr = (timeStr) => {
      if (!timeStr) return '';
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    };

    // Output format: "Mar 30 • 10:00 AM - 12:00 PM"
    return startTime && endTime ? `${formattedDate} • ${formatTimeStr(startTime)} - ${formatTimeStr(endTime)}` : formattedDate;
  };

  // Clean, inline styles for a self-contained component
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc', // Soft slate
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      padding: '36px',
      width: '100%',
      maxWidth: '450px',
      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
      boxSizing: 'border-box'
    },
    header: {
      margin: '0 0 24px 0',
      color: '#0f172a',
      fontSize: '24px',
      fontWeight: '700',
      textAlign: 'center'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '28px'
    },
    inputRow: {
      display: 'flex',
      gap: '12px',
      width: '100%'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: '12px',
      border: '1px solid #cbd5e1',
      fontSize: '16px',
      color: '#334155',
      backgroundColor: '#f8fafc',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    inputFlex: {
      flex: 1,
      minWidth: '0' // prevents flex blowout
    },
    addButton: {
      backgroundColor: '#0d9488', // Calming Teal
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, transform 0.1s ease',
      boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
      marginTop: '4px'
    },
    listHeader: {
      margin: '0 0 16px 0',
      fontSize: '18px',
      color: '#334155',
      fontWeight: '600',
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: '8px'
    },
    list: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: '#f1f5f9',
      borderRadius: '12px',
      borderLeft: '4px solid #0d9488'
    },
    eventInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    eventTitle: {
      margin: '0',
      fontSize: '16px',
      fontWeight: '600',
      color: '#0f172a'
    },
    eventDate: {
      margin: '0',
      fontSize: '14px',
      color: '#64748b'
    },
    deleteButton: {
      background: 'none',
      border: 'none',
      color: '#ef4444', // Soft red indicator
      fontSize: '24px',
      lineHeight: '1',
      cursor: 'pointer',
      padding: '0 8px',
      fontWeight: '300',
      transition: 'color 0.2s ease'
    },
    emptyState: {
      textAlign: 'center',
      color: '#64748b',
      fontSize: '16px',
      margin: '32px 0 16px 0',
      fontStyle: 'italic'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>Student Schedule</h2>

        {/* Input Form Area */}
        <form style={styles.formGroup} onSubmit={addEvent}>
          <input 
            type="text" 
            style={styles.input}
            placeholder="Exam / Subject Name..." 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <input 
            type="date" 
            style={styles.input}
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />
          <div style={styles.inputRow}>
            <input 
              type="time" 
              style={{...styles.input, ...styles.inputFlex}}
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              required
            />
            <input 
              type="time" 
              style={{...styles.input, ...styles.inputFlex}}
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            style={styles.addButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0f766e'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#0d9488'}
          >
            Add to Schedule
          </button>
        </form>

        <h3 style={styles.listHeader}>Upcoming Events</h3>

        {/* Events Output */}
        {events.length === 0 ? (
          <p style={styles.emptyState}>No upcoming exams. Breathe easy!</p>
        ) : (
          <ul style={styles.list}>
            {events.map((event) => (
              <li key={event.id} style={styles.listItem}>
                <div style={styles.eventInfo}>
                  <p style={styles.eventTitle}>{event.title}</p>
                  <p style={styles.eventDate}>{formatDate(event.date, event.startTime, event.endTime)}</p>
                </div>
                <button 
                  style={styles.deleteButton}
                  onClick={() => deleteEvent(event.id)}
                  title="Remove event"
                  onMouseOver={(e) => e.target.style.color = '#b91c1c'}
                  onMouseOut={(e) => e.target.style.color = '#ef4444'}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentSchedule;
