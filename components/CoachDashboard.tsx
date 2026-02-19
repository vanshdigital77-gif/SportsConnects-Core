
import React, { useState, useMemo } from 'react';
import { TrainingLog, SportType } from '../types';
import { 
  Users, 
  Download, 
  ChevronRight, 
  Search,
  Activity,
  TrendingUp,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

interface CoachDashboardProps {
  athleteLogs: TrainingLog[];
}

const COLORS = ['#1D3D76', '#E6C264', '#10b981', '#f59e0b', '#ef4444'];

const CoachDashboard: React.FC<CoachDashboardProps> = ({ athleteLogs }) => {
  const [sportFilter, setSportFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const athletes = [
    { id: '1', name: 'James Wilson', sport: 'Gym', score: 85, lastActive: 'Today', logsCount: 12, sub: 'FREE', recovery: 62 },
    { id: '2', name: 'Sarah Chen', sport: 'Running', score: 92, lastActive: 'Yesterday', logsCount: 45, sub: 'PRO', recovery: 88, risk: 'Low' },
    { id: '3', name: 'Mike Ross', sport: 'Boxing', score: 78, lastActive: '3 days ago', logsCount: 8, sub: 'FREE', recovery: 45 },
    { id: '4', name: 'Emma Watson', sport: 'Badminton', score: 88, lastActive: 'Today', logsCount: 22, sub: 'PRO', recovery: 95, risk: 'Low' },
    { id: '5', name: 'David Beckham', sport: 'Football', score: 65, lastActive: 'Today', logsCount: 30, sub: 'PRO', recovery: 32, risk: 'High' }
  ];

  const filteredAthletes = useMemo(() => {
    return athletes.filter(a => {
      const matchesSport = sportFilter === 'All' || a.sport === sportFilter;
      const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSport && matchesSearch;
    });
  }, [sportFilter, searchTerm]);

  const sportDistribution = useMemo(() => {
    const data: Record<string, number> = {};
    athleteLogs.forEach(l => {
      data[l.sportType] = (data[l.sportType] || 0) + 1;
    });
    if (Object.keys(data).length === 0) {
      return [
        { name: 'Gym', value: 40 },
        { name: 'Running', value: 30 },
        { name: 'Boxing', value: 20 },
        { name: 'Other', value: 10 }
      ];
    }
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [athleteLogs]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1D3D76]">Squad Monitoring Center</h2>
          <p className="text-gray-500">Real-time team readiness and health diagnostics.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-[#1D3D76] text-white px-6 py-3 rounded-2xl hover:bg-blue-900 transition-all font-bold shadow-lg">
          <Download size={20} />
          <span>Export Team Intel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-black text-[#1D3D76]">Active Roster</h3>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Find athlete..." 
                  className="pl-9 pr-4 py-3 text-sm bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-[#1D3D76] w-full sm:w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="text-sm bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none font-bold text-[#1D3D76]"
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
              >
                <option value="All">All Disciplines</option>
                <option value="Gym">Gym</option>
                <option value="Running">Running</option>
                <option value="Football">Football</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAthletes.map(athlete => (
              <div key={athlete.id} className="group flex items-center justify-between p-5 bg-gray-50 rounded-[1.5rem] border border-transparent hover:border-[#1D3D76]/10 hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                <div className="flex items-center space-x-5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-[#1D3D76] text-white flex items-center justify-center font-black text-xl">
                      {athlete.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {athlete.sub === 'PRO' && (
                      <div className="absolute -top-1 -right-1 bg-[#E6C264] p-1 rounded-lg shadow-sm border-2 border-white">
                        <Zap size={10} fill="#1D3D76" className="text-[#1D3D76]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-black text-[#1D3D76]">{athlete.name}</h4>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                      <span>{athlete.sport}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{athlete.logsCount} Sessions</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-12">
                  <div className="text-center hidden lg:block">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Recovery</p>
                    <p className={`text-lg font-black ${athlete.recovery > 70 ? 'text-green-500' : athlete.recovery > 40 ? 'text-[#E6C264]' : 'text-red-500'}`}>
                      {athlete.recovery}%
                    </p>
                  </div>
                  
                  {athlete.sub === 'PRO' && athlete.risk === 'High' && (
                    <div className="flex items-center text-red-500 space-x-1 hidden sm:flex">
                      <ShieldAlert size={16} />
                      <span className="text-[10px] font-black uppercase">High Risk</span>
                    </div>
                  )}

                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Perf Score</p>
                    <p className="text-lg font-black text-[#1D3D76]">{athlete.score}%</p>
                  </div>
                  <ChevronRight size={24} className="text-gray-300 group-hover:text-[#1D3D76] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 min-h-[300px]">
            <h3 className="text-xl font-black text-[#1D3D76] mb-2">Team Balance</h3>
            <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest font-bold">Distribution by Sport</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sportDistribution}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {sportDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
               {sportDistribution.slice(0, 4).map((entry, i) => (
                 <div key={i} className="flex items-center space-x-2 text-[10px] font-bold text-gray-500">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span>{entry.name}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-[#1D3D76] text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-6 flex items-center space-x-3">
                <ShieldAlert size={24} className="text-[#E6C264]" />
                <span>Smart Alerts</span>
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/20 rounded-2xl border border-red-500/20">
                  <p className="text-xs font-black uppercase tracking-widest text-red-200 mb-1">Injury Warning</p>
                  <p className="text-sm font-medium">David Beckham workload up 45%. High injury risk detected.</p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl">
                  <p className="text-xs font-black uppercase tracking-widest text-blue-200 mb-1">Recovery Alert</p>
                  <p className="text-sm font-medium">3 athletes reporting less than 40% recovery scores today.</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-blue-200 uppercase font-black tracking-widest">Active Monitoring</p>
                  <p className="text-3xl font-black">100%</p>
                </div>
                <div className="w-12 h-12 bg-[#E6C264] rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-[#1D3D76]" size={24} />
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
