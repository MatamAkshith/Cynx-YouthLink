import React from 'react';

const StudentSchedule = () => {
  const tasks = [
    { time: '09:00 AM', label: 'Mathematics 101', status: 'Completed' },
    { time: '11:15 AM', label: 'Physics Lab', status: 'Upcoming' },
    { time: '02:00 PM', label: 'Student Mentorship Hub', status: 'Upcoming' },
  ];

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-teal-500/20 rounded-[2rem] p-6 shadow-2xl hover:border-teal-500/40 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl rounded-full"></div>
      <header className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
          <span className="material-symbols-outlined text-2xl font-light">calendar_today</span>
        </div>
        <h3 className="text-xl font-bold font-['Manrope'] text-slate-100">Daily Horizon</h3>
      </header>
      <div className="space-y-4">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-800/20 border border-white/5 group-hover:border-teal-500/10 transition-all">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-500/70">{task.time}</span>
              <div className="w-px h-8 bg-teal-500/20 my-1"></div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-200">{task.label}</h4>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${task.status === 'Completed' ? 'text-teal-400' : 'text-slate-500'}`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SleepTracker = () => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-teal-500/20 rounded-[2rem] p-6 shadow-2xl hover:border-teal-500/40 transition-all group">
      <header className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
          <span className="material-symbols-outlined text-2xl font-light">bedtime</span>
        </div>
        <h3 className="text-xl font-bold font-['Manrope'] text-slate-100">Rest Metric</h3>
      </header>
      <div className="relative flex flex-col items-center justify-center h-48">
        {/* Anti-Gravity Ring */}
        <div className="absolute inset-0 border-4 border-teal-500/5 rounded-full"></div>
        <div className="absolute inset-2 border-2 border-teal-500/10 border-t-teal-500 rounded-full animate-spin duration-[10s]"></div>
        <div className="text-center z-10">
          <span className="text-4xl font-black font-['Manrope'] text-teal-400">7.2</span>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mt-1">Hours Logged</p>
        </div>
        {/* Dynamic Data Blobs */}
        <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-teal-500/40 animate-pulse"></div>
        <div className="absolute bottom-4 right-10 w-3 h-3 rounded-full bg-teal-500/20 animate-ping"></div>
      </div>
      <div className="mt-8 flex justify-between px-2">
        <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-black">Quality</p>
            <span className="text-sm font-bold text-teal-400">Deep</span>
        </div>
        <div className="text-center border-x border-white/5 px-8">
            <p className="text-[10px] text-slate-500 uppercase font-black">Cycles</p>
            <span className="text-sm font-bold text-teal-400">5 Prot.</span>
        </div>
        <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-black">REM</p>
            <span className="text-sm font-bold text-teal-400">1.8h</span>
        </div>
      </div>
    </div>
  );
};

const JournalAI = () => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-teal-500/20 rounded-[3rem] p-8 shadow-2xl hover:border-teal-500/40 transition-all col-span-1 md:col-span-2 lg:col-span-1 border-t-teal-500/40 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-600/10 flex items-center justify-center text-teal-500 border border-teal-500/20">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>self_improvement</span>
                </div>
                <div>
                    <h3 className="text-2xl font-black font-['Manrope'] text-slate-100 tracking-tight">Emotional Vent</h3>
                    <p className="text-xs text-teal-500/70 font-bold uppercase tracking-widest">Encrypted Uplink Active</p>
                </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-teal-500/5 border border-teal-500/10 hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-teal-500/80 uppercase tracking-widest">AI Syncing...</span>
            </div>
        </header>
        
        <div className="relative group">
            <textarea 
                className="w-full h-48 bg-slate-800/10 border border-white/5 rounded-3xl p-6 text-slate-300 placeholder:text-slate-600 focus:ring-2 focus:ring-teal-500/40 focus:border-transparent transition-all scrollbar-hide resize-none font-body leading-relaxed"
                placeholder="How are you feeling, truly? Share your perspective anonymously..."
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="p-3 bg-slate-900 hover:bg-teal-500 text-teal-500 hover:text-white rounded-2xl transition-all shadow-xl group/btn">
                    <span className="material-symbols-outlined group-hover/btn:scale-110 transition-transform">send</span>
                </button>
            </div>
        </div>
        <p className="mt-6 text-[10px] text-center text-slate-600 uppercase tracking-[0.3em] font-black italic">100% Client-Side Privacy • Nature Perspective Engaged</p>
    </div>
  );
};

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-['Inter'] p-6 md:p-12 lg:p-20 relative overflow-hidden">
      {/* Background Cinematic Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-600/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/4"></div>

      <header className="relative z-10 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/20 text-teal-500 text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="material-symbols-outlined text-sm">shield</span>
            Safe Haven Active
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-['Manrope'] tracking-tighter text-slate-50">
            Welcome, <span className="text-teal-400">Nature #2124</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            Your anonymous digital sanctuary. Tracking your wellbeing markers in real-time, encrypted for your safety.
          </p>
        </div>
        <div className="flex gap-4">
            <button className="px-6 py-3 rounded-2xl bg-teal-500 text-slate-900 font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(13,148,136,0.3)]">Get Support</button>
            <button className="px-6 py-3 rounded-2xl bg-slate-800 border border-white/5 text-slate-200 font-bold text-sm hover:bg-slate-700 transition-all">Emergency SOP</button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StudentSchedule />
        <SleepTracker />
        <JournalAI />
      </main>

      <footer className="relative z-10 mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
              <span className="text-2xl font-black tracking-tighter text-teal-500 font-['Manrope']">YouthLink</span>
              <div className="w-px h-6 bg-white/10 hidden md:block"></div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-black italic">A Digital Sanctuary</p>
          </div>
          <div className="flex gap-8 text-[10px] text-slate-600 font-black uppercase tracking-widest">
              <a href="#" className="hover:text-teal-500 transition-colors">Privacy Privacy</a>
              <a href="#" className="hover:text-teal-500 transition-colors">Safe Terms</a>
              <a href="#" className="hover:text-teal-500 transition-colors">2026 Archive</a>
          </div>
      </footer>
    </div>
  );
};

export default UserDashboard;
