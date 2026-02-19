
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
  ShieldCheck,
  Clock
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
import { format, addDays, isSameDay, differenceInDays, isWithinInterval } from 'date-fns';
import StreakCard from './StreakCard';
import TrainingForm from './TrainingForm';
import StatsCard from './StatsCard';
import PremiumFeatureOverlay from './PremiumFeatureOverlay';
import { calculateACWR, calculateRecoveryScore, getCalibrationStatus } from '../src/services/performanceScience';

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

  const acwrInsight = useMemo(() => calculateACWR(athleteLogs), [athleteLogs]);
  const recoveryInsight = useMemo(() => calculateRecoveryScore(athleteLogs), [athleteLogs]);
  const calibration = useMemo(() => getCalibrationStatus(user), [user]);

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

  const progressStory = useMemo(() => {
    if (athleteLogs.length < 2) return "Your performance story is just beginning. Every session counts.";
    
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
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">ACWR (Load Ratio)</p>
            <Activity className="text-blue-500" size={18} />
          </div>
          <h4 className={`text-xl font-black ${acwrInsight.status === 'optimal' ? 'text-green-500' : acwrInsight.status === 'warning' ? 'text-orange-500' : 'text-red-500'}`}>
            {acwrInsight.value}
          </h4>
          <p className="text-[10px] text-gray-400 mt-2 font-medium leading-relaxed group-hover:text-gray-600 transition-colors">{acwrInsight.description}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Injury Risk</p>
            <ShieldAlert className={acwrInsight.status === 'danger' ? 'text-red-500' : acwrInsight.status === 'warning' ? 'text-orange-500' : 'text-green-500'} size={18} />
          </div>
          <h4 className={`text-xl font-black ${acwrInsight.status === 'danger' ? 'text-red-500' : acwrInsight.status === 'warning' ? 'text-orange-500' : 'text-green-500'}`}>
            {acwrInsight.status === 'danger' ? 'High' : acwrInsight.status === 'warning' ? 'Moderate' : 'Low'}
          </h4>
          <p className="text-[10px] text-gray-400 mt-2 font-medium leading-relaxed">
            {acwrInsight.status === 'calibration' ? 'Establishing baseline...' : 'Based on Acute:Chronic workload ratio.'}
          </p>
        </div>

        <div className="bg-[#1D3D76] p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between group">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Readiness State</p>
          <div className="flex items-center space-x-3 mt-4">
            <div className={`w-3 h-3 rounded-full animate-pulse ${recoveryInsight.status === 'optimal' ? 'bg-green-500' : 'bg-[#E6C264]'}`}></div>
            <span className="text-2xl font-black">{recoveryInsight.value}</span>
          </div>
          <p className="text-[10px] text-blue-300 mt-2 font-medium">Synced with Bio-Metrics</p>
        </div>
      </div>

      {/* Performance Alerts & Guidance */}
      {(acwrInsight.status === 'danger' || recoveryInsight.status === 'danger') && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-start space-x-4 animate-pulse">
          <ShieldAlert className="text-red-600 mt-1 shrink-0" size={24} />
          <div>
            <h4 className="text-red-900 font-black uppercase text-xs tracking-widest mb-1">Medical Advisory Notice</h4>
            <p className="text-red-700 text-sm font-bold leading-relaxed">
              If you are experiencing pain, discomfort, or signs of injury, please consult a qualified medical professional or sports doctor immediately. This platform does not replace professional medical evaluation.
            </p>
          </div>
        </div>
      )}

      {athleteLogs.length > 5 && acwrInsight.status === 'warning' && (
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex items-start justify-between space-x-4">
          <div className="flex items-start space-x-4">
            <TrendingUp className="text-blue-600 mt-1 shrink-0" size={24} />
            <div>
              <h4 className="text-blue-900 font-black uppercase text-xs tracking-widest mb-1">Performance Support Suggestion</h4>
              <p className="text-blue-700 text-sm font-bold leading-relaxed">
                If you are not reaching your desired performance levels, consider enrolling in professional sports training sessions through SportsConnects to receive personalized coaching support.
              </p>
            </div>
          </div>
          <button className="bg-[#1D3D76] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-900 transition-all shrink-0">
            Find a Coach
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden lg:col-span-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <HeartPulse className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-black text-[#1D3D76]">Readiness Score</h3>
          </div>
          <div className="text-center space-y-4">
            <div className="text-7xl font-black text-[#1D3D76] tracking-tighter">{recoveryInsight.value}</div>
            <p className="text-xs text-gray-500 px-4 leading-relaxed">{recoveryInsight.description}</p>
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
                  <p className="text-sm font-bold mt-2">{acwrInsight.description}</p>
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
