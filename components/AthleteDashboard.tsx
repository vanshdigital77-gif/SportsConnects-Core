
import React, { useState, useMemo } from 'react';
import { User, TrainingLog } from '../types';
import { 
  Flame, 
  TrendingUp, 
  Activity, 
  Plus,
  ShieldAlert,
  HeartPulse,
  Zap,
  ChevronRight,
  Brain,
  Timer,
  Award,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
// Fix: Removed subDays from date-fns import as it was causing an error and switched to addDays with negative values
import { format, addDays, isSameDay, differenceInDays, isWithinInterval } from 'date-fns';
import StreakCard from './StreakCard';
import TrainingForm from './TrainingForm';
import StatsCard from './StatsCard';
import PremiumFeatureOverlay from './PremiumFeatureOverlay';

interface AthleteDashboardProps {
  user: User;
  logs: TrainingLog[];
  onAddLog: (log: TrainingLog) => void;
  onUpgrade: () => void;
}

const AthleteDashboard: React.FC<AthleteDashboardProps> = ({ user, logs, onAddLog, onUpgrade }) => {
  const [showLogModal, setShowLogModal] = useState(false);

  const athleteLogs = useMemo(() => {
    return logs.filter(l => l.athleteId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [logs, user.id]);

  const levelData = useMemo(() => {
    const totalSessions = athleteLogs.length;
    let level = 'Rookie';
    let xpPercent = (totalSessions % 10) * 10;
    
    if (totalSessions >= 50) level = 'Pro';
    else if (totalSessions >= 31) level = 'Elite';
    else if (totalSessions >= 16) level = 'Advanced';
    else if (totalSessions >= 6) level = 'Amateur';

    return { level, xpPercent };
  }, [athleteLogs]);

  const insights = useMemo(() => {
    if (athleteLogs.length === 0) return { 
      recovery: 0, 
      momentum: 'Stable', 
      momentumColor: 'text-gray-400', 
      momentumDesc: 'Awaiting data...',
      injuryRisk: 'Low',
      riskColor: 'text-green-500',
      suggestion: 'Log your first session to begin.' 
    };
    
    const lastLog = athleteLogs[0];
    const avgSleep = lastLog.sleepHours || 7;
    const avgRHR = lastLog.restingHeartRate || 65;
    
    let recovery = (avgSleep / 10) * 40 + (Math.max(0, 100 - avgRHR)) * 0.4 + (10 - lastLog.intensity) * 2;
    recovery = Math.min(100, Math.max(0, Math.round(recovery)));

    const last7Days = athleteLogs.filter(l => differenceInDays(new Date(), new Date(l.date)) <= 7);
    const last28Days = athleteLogs.filter(l => differenceInDays(new Date(), new Date(l.date)) <= 28);
    
    // Fix: Declared avgIntensity before its use to prevent block-scoped variable error
    const avgIntensity = last7Days.reduce((a, b) => a + b.intensity, 0) / (last7Days.length || 1);

    const acuteLoad = last7Days.reduce((a, b) => a + (b.intensity * b.duration), 0) / 7;
    const chronicLoad = last28Days.reduce((a, b) => a + (b.intensity * b.duration), 0) / 28;
    const ratio = acuteLoad / (chronicLoad || 1);

    let injuryRisk = 'Low';
    let riskColor = 'text-green-500';
    if (ratio > 1.5) { injuryRisk = 'High'; riskColor = 'text-red-500'; }
    else if (ratio > 1.2) { injuryRisk = 'Moderate'; riskColor = 'text-yellow-500'; }

    let momentum = 'Plateau';
    let momentumColor = 'text-yellow-500';
    let momentumDesc = 'Your training load is consistent but lacks variability to trigger new adaptations.';

    if (avgIntensity > 7 && recovery < 40) {
      momentum = 'Burnout Risk';
      momentumColor = 'text-red-500';
      momentumDesc = 'Acute load exceeds recovery capacity. Biological markers show high fatigue.';
    } else if (last7Days.length >= 5 && ratio >= 1.1) {
      momentum = 'Peak Zone';
      momentumColor = 'text-blue-500';
      momentumDesc = 'Optimal balance of stimulus and adaptation. You are in your prime training window.';
    } else if (last7Days.length >= 3 && ratio > 1.0) {
      momentum = 'Building Momentum';
      momentumColor = 'text-[#E6C264]';
      momentumDesc = 'Increasing acute load relative to chronic baseline. Functional overreaching detected.';
    }

    let suggestion = 'Maintain current load.';
    if (injuryRisk === 'High' || recovery < 30) suggestion = 'Mandatory recovery day. Focus on mobility.';
    else if (momentum === 'Plateau') suggestion = 'Introduce 1 high-intensity interval session.';
    else if (momentum === 'Peak Zone') suggestion = 'Maintain volume. Focus on precision and skill.';

    return { recovery, momentum, momentumColor, momentumDesc, injuryRisk, riskColor, suggestion };
  }, [athleteLogs]);

  const progressStory = useMemo(() => {
    if (athleteLogs.length < 2) return "Your performance story is just beginning. Every session counts.";
    
    // Fix: Using addDays with negative values instead of subDays
    const thisWeekInterval = { start: addDays(new Date(), -7), end: new Date() };
    const lastWeekInterval = { start: addDays(new Date(), -14), end: addDays(new Date(), -7) };

    const thisWeekVol = athleteLogs.filter(l => isWithinInterval(new Date(l.date), thisWeekInterval)).reduce((acc, curr) => acc + curr.duration, 0);
    const lastWeekVol = athleteLogs.filter(l => isWithinInterval(new Date(l.date), lastWeekInterval)).reduce((acc, curr) => acc + curr.duration, 0);

    const diff = lastWeekVol > 0 ? Math.round(((thisWeekVol - lastWeekVol) / lastWeekVol) * 100) : 0;
    
    if (diff > 0) return `Dominant week! You've surged ${diff}% in volume. Consistency is your superpower right now.`;
    if (diff < 0) return `Strategic deload? Volume is down ${Math.abs(diff)}%. Use this time to sharpen your technique.`;
    return "Steady as a rock. You matched your weekly volume exactly. That's true athletic discipline.";
  }, [athleteLogs]);

  const streak = useMemo(() => {
    const sortedDates: string[] = Array.from(new Set<string>(athleteLogs.map(l => l.date.split('T')[0]))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    if (sortedDates.length === 0) return 0;
    if (differenceInDays(new Date(), new Date(sortedDates[0])) > 1) return 0;
    let currentStreak = 1;
    let checkDate = new Date(sortedDates[0]);
    for (let i = 1; i < sortedDates.length; i++) {
      const d = new Date(sortedDates[i]);
      if (differenceInDays(checkDate, d) === 1) { currentStreak++; checkDate = d; }
      else break;
    }
    return currentStreak;
  }, [athleteLogs]);

  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(new Date(), -(6 - i));
      const dayLogs = athleteLogs.filter(l => isSameDay(new Date(l.date), date));
      return {
        name: format(date, 'EEE'),
        duration: dayLogs.reduce((acc, curr) => acc + curr.duration, 0),
      };
    });
  }, [athleteLogs]);

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Athlete Header */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[#1D3D76] rounded-[1.5rem] flex items-center justify-center text-[#E6C264] shadow-xl">
            <Award size={32} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-[#1D3D76]">{user.name}</h2>
              <span className="bg-[#E6C264] text-[#1D3D76] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Level: {levelData.level}</span>
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Athlete Command Center</p>
          </div>
        </div>

        <div className="flex-1 max-w-md w-full">
          <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
            <span>Progress to Next Rank</span>
            <span className="text-[#1D3D76]">Elite XP</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div className="bg-[#1D3D76] h-full transition-all duration-1000 ease-out w-[65%]"></div>
          </div>
        </div>

        <button 
          onClick={() => setShowLogModal(true)}
          className="flex items-center justify-center space-x-2 bg-[#1D3D76] text-white px-8 py-4 rounded-2xl hover:bg-blue-900 transition-all shadow-xl group active:scale-95"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span className="font-black">Record Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StreakCard streak={streak} />
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Momentum Meter</p>
            <Activity className="text-blue-500" size={18} />
          </div>
          <h4 className={`text-xl font-black ${insights.momentumColor}`}>{insights.momentum}</h4>
          <p className="text-[10px] text-gray-400 mt-2 font-medium leading-relaxed group-hover:text-gray-600 transition-colors">{insights.momentumDesc}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Injury Risk</p>
            <ShieldAlert className={insights.riskColor} size={18} />
          </div>
          <h4 className={`text-xl font-black ${insights.riskColor}`}>{insights.injuryRisk}</h4>
          <p className="text-[10px] text-gray-400 mt-2 font-medium leading-relaxed">
            {insights.injuryRisk === 'Low' ? 'Your chronic load is well-managed.' : 'Alert: Acute vs Chronic load ratio is peaking.'}
          </p>
        </div>
        <div className="bg-[#1D3D76] p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between group">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Readiness State</p>
          <div className="flex items-center space-x-3 mt-4">
            <div className={`w-3 h-3 rounded-full animate-pulse ${insights.recovery > 70 ? 'bg-green-500' : 'bg-[#E6C264]'}`}></div>
            <span className="text-2xl font-black">{insights.recovery > 75 ? 'Optimal' : insights.recovery > 45 ? 'Conditioned' : 'Rest Required'}</span>
          </div>
          <p className="text-[10px] text-blue-300 mt-2 font-medium">Synced with Bio-Metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden lg:col-span-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <HeartPulse className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-black text-[#1D3D76]">Readiness Score</h3>
          </div>
          <div className="text-center space-y-4">
            <div className="text-7xl font-black text-[#1D3D76] tracking-tighter">{insights.recovery}%</div>
            <p className="text-xs text-gray-500 px-4 leading-relaxed">Your central nervous system is {insights.recovery > 70 ? 'fully restored and primed for maximum effort sessions' : 'under moderate stress'}.</p>
          </div>
          {user.subscriptionStatus === 'FREE' && <PremiumFeatureOverlay onUpgrade={onUpgrade} title="Performance Science" />}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-50 rounded-2xl">
                  <Brain className="text-[#E6C264]" size={24} />
                </div>
                <h3 className="text-xl font-black text-[#1D3D76]">Weekly Progress Story</h3>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance Insights</span>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 border-l-4 border-l-[#E6C264]">
                <p className="text-sm text-[#1D3D76] font-bold italic leading-relaxed">
                  "{progressStory}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-[#1D3D76] rounded-[2rem] text-white flex flex-col justify-between">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap size={14} className="text-[#E6C264]" fill="#E6C264" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Adaptive Training Suggestion</span>
                  </div>
                  <p className="text-sm font-bold mt-2">{insights.suggestion}</p>
                </div>
                <div className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Efficiency Index</span>
                    <p className="text-xl font-black text-[#1D3D76]">0.92 <ArrowUpRight className="inline text-green-500" size={16} /></p>
                  </div>
                  <ShieldCheck className="text-[#E6C264]" size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-[#1D3D76]">Training Load Volume</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#1D3D76] rounded-full"></div>
                <span className="text-xs text-gray-400 font-bold uppercase">Actual Load</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorDur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D3D76" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1D3D76" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="duration" stroke="#1D3D76" strokeWidth={4} fillOpacity={1} fill="url(#colorDur)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full">
           <h3 className="text-lg font-black text-[#1D3D76] mb-6">Consistency Heatmap</h3>
           <div className="grid grid-cols-7 gap-2 flex-1">
            {Array.from({ length: 35 }).map((_, i) => {
              // Fix: Replaced subDays with addDays and negative value
              const date = addDays(new Date(), -(34 - i));
              const active = athleteLogs.some(l => isSameDay(new Date(l.date), date));
              return (
                <div 
                  key={i} 
                  title={format(date, 'MMM d')}
                  className={`aspect-square rounded-lg transition-all ${
                    active ? 'bg-[#1D3D76] shadow-sm scale-110' : 'bg-gray-50'
                  }`}
                ></div>
              )
            })}
          </div>
          <div className="mt-6 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>Last 5 Weeks</span>
            <div className="flex items-center space-x-1">
              <span>Rest</span>
              <div className="w-2 h-2 bg-gray-50 rounded-sm"></div>
              <div className="w-2 h-2 bg-[#1D3D76]/40 rounded-sm"></div>
              <div className="w-2 h-2 bg-[#1D3D76] rounded-sm"></div>
              <span>Elite</span>
            </div>
          </div>
        </div>
      </div>

      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
            <TrainingForm 
              athleteId={user.id} 
              onClose={() => setShowLogModal(false)} 
              onSubmit={(log) => {
                onAddLog(log);
                setShowLogModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleteDashboard;
