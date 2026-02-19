
import React from 'react';
import { TrainingLog, User } from '../types';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Activity, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import PremiumFeatureOverlay from './PremiumFeatureOverlay';

interface AnalyticsViewProps {
  logs: TrainingLog[];
  user: User;
  onUpgrade: () => void;
}

const COLORS = ['#1D3D76', '#E6C264', '#10b981', '#f59e0b', '#ef4444'];

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ logs, user, onUpgrade }) => {
  const sportDistribution = React.useMemo(() => {
    const data: Record<string, number> = {};
    logs.forEach(l => {
      data[l.sportType] = (data[l.sportType] || 0) + 1;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [logs]);

  const intensityTrend = React.useMemo(() => {
    return logs.slice(-10).reverse().map(l => ({
      date: new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      intensity: l.intensity,
      duration: l.duration
    }));
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="p-6 bg-gray-50 rounded-[2.5rem] mb-6">
          <BarChart3 size={48} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-black text-[#1D3D76]">Performance Lab Offline</h3>
        <p className="text-gray-400 mt-2 max-w-xs">Upload your training intel to unlock the Performance Lab diagnostics engine.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-[#1D3D76]">Performance Lab</h2>
          <p className="text-gray-500">Advanced diagnostic metrics and athlete trend analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Session Volume</p>
          <p className="text-3xl font-black text-[#1D3D76]">{logs.length}</p>
          <div className="flex items-center text-green-500 text-[10px] font-bold mt-2">
            <TrendingUp size={12} className="mr-1" /> Elite Consistency
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mean Intensity</p>
          <p className="text-3xl font-black text-[#1D3D76]">{(logs.reduce((a,b)=>a+b.intensity,0)/logs.length).toFixed(1)}</p>
          <div className="flex items-center text-blue-500 text-[10px] font-bold mt-2">
            Stable Adaptation
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time on Field</p>
          <p className="text-3xl font-black text-[#1D3D76]">{Math.round(logs.reduce((a,b)=>a+b.duration,0)/60)}h</p>
          <div className="flex items-center text-orange-500 text-[10px] font-bold mt-2">
            <Zap size={12} className="mr-1" /> Pro Tier Effort
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Potential Rating</p>
          <p className="text-3xl font-black text-[#1D3D76]">S-CLASS</p>
          <div className="flex items-center text-[#E6C264] text-[10px] font-bold mt-2">
            Top 2% Active Athletes
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-[#1D3D76] mb-8">Specialization Mix</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sportDistribution}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sportDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
             {sportDistribution.map((entry, i) => (
               <div key={i} className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{entry.name}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
          <h3 className="text-xl font-black text-[#1D3D76] mb-8">Performance Efficiency Index</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={intensityTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="intensity" stroke="#E6C264" strokeWidth={4} dot={{r: 6, fill: '#E6C264', strokeWidth: 2, stroke: '#fff'}} />
                <Line type="monotone" dataKey="duration" stroke="#1D3D76" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-[2px] bg-[#E6C264]"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Stimulus</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-[2px] bg-[#1D3D76] border-dashed border-t-2"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Load Ratio</span>
            </div>
          </div>
          {user.subscriptionStatus === 'FREE' && <PremiumFeatureOverlay title="Performance Index" onUpgrade={onUpgrade} />}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
