
import React, { useState } from 'react';
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
import { Activity, Zap, TrendingUp, BarChart3, Info, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import PremiumFeatureOverlay from './PremiumFeatureOverlay';
import { calculateACWR, calculateRecoveryScore, getCalibrationStatus, ScientificInsight } from '../src/services/performanceScience';

interface AnalyticsViewProps {
  logs: TrainingLog[];
  user: User;
  onUpgrade: () => void;
}

const COLORS = ['#1D3D76', '#E6C264', '#10b981', '#f59e0b', '#ef4444'];

const InsightCard: React.FC<{ insight: ScientificInsight }> = ({ insight }) => {
  const [showLogic, setShowLogic] = useState(false);

  const getStatusColor = (status: ScientificInsight['status']) => {
    switch (status) {
      case 'optimal': return 'text-green-500';
      case 'warning': return 'text-orange-500';
      case 'danger': return 'text-red-500';
      case 'calibration': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: ScientificInsight['status']) => {
    switch (status) {
      case 'optimal': return <ShieldCheck size={14} />;
      case 'warning': return <AlertTriangle size={14} />;
      case 'danger': return <Activity size={14} />;
      case 'calibration': return <Clock size={14} />;
      default: return <Info size={14} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{insight.label}</p>
        <button 
          onClick={() => setShowLogic(!showLogic)}
          className="text-gray-300 hover:text-[#1D3D76] transition-colors"
          title="View Calculation Logic"
        >
          <Info size={16} />
        </button>
      </div>
      
      <p className="text-3xl font-black text-[#1D3D76]">{insight.value}</p>
      
      <div className={`flex items-center space-x-1 text-[10px] font-bold mt-2 ${getStatusColor(insight.status)}`}>
        {getStatusIcon(insight.status)}
        <span>{insight.description}</span>
      </div>

      {showLogic && (
        <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 animate-fadeIn">
          <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Scientific Logic</p>
          <p className="text-[10px] text-gray-600 leading-relaxed italic">{insight.calculationLogic}</p>
        </div>
      )}
    </div>
  );
};

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ logs, user, onUpgrade }) => {
  const acwr = React.useMemo(() => calculateACWR(logs), [logs]);
  const recovery = React.useMemo(() => calculateRecoveryScore(logs), [logs]);
  const calibration = React.useMemo(() => getCalibrationStatus(user), [user]);

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
          <p className="text-gray-500">Evidence-based diagnostics and physiological trend analysis.</p>
        </div>
        {calibration.isCalibrating && (
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl flex items-center space-x-2">
            <Clock size={16} className="text-blue-500" />
            <span className="text-xs font-bold text-blue-700">Calibration Phase: {calibration.daysRemaining} days remaining</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Volume</p>
          <p className="text-3xl font-black text-[#1D3D76]">{logs.length}</p>
          <div className="flex items-center text-green-500 text-[10px] font-bold mt-2">
            <TrendingUp size={12} className="mr-1" /> Verified Sessions
          </div>
        </div>
        
        <InsightCard insight={acwr} />
        <InsightCard insight={recovery} />

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Intensity</p>
          <p className="text-3xl font-black text-[#1D3D76]">{(logs.reduce((a,b)=>a+b.intensity,0)/logs.length).toFixed(1)}</p>
          <div className="flex items-center text-[#E6C264] text-[10px] font-bold mt-2">
            RPE Baseline Established
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
      <div className="space-y-4 mt-12 pt-8 border-t border-gray-100">
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
          <p className="text-[10px] text-blue-600 font-bold leading-relaxed">
            <span className="uppercase font-black mr-2">Medical Advisory:</span>
            If you are experiencing pain, discomfort, or signs of injury, please consult a qualified medical professional or sports doctor immediately. This platform does not replace professional medical evaluation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
              <span className="uppercase font-black mr-2">Results Variability:</span>
              Performance insights are generated using structured analytical models. Results may vary between individuals. While we strive for high accuracy and reliability, outcomes may show slight variations depending on data quality and individual differences. This platform does not guarantee 100% accuracy.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center">
            <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
              <span className="uppercase font-black mr-2">Responsible Usage:</span>
              This tool provides performance insights for educational and training support purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
