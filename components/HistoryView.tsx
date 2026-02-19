
import React from 'react';
import { TrainingLog } from '../types';
import { SPORTS_CONFIG } from '../constants';
import { format } from 'date-fns';
import { Clock, Calendar, ChevronRight } from 'lucide-react';

interface HistoryViewProps {
  logs: TrainingLog[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs }) => {
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
          <Calendar size={40} />
        </div>
        <h3 className="text-xl font-black text-[#1D3D76]">Empty Training Vault</h3>
        <p className="text-gray-400 mt-2 max-w-xs">You haven't uploaded any training intel yet. Your performance history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#1D3D76]">Training Vault</h2>
          <p className="text-gray-500">A chronological record of your performance journey.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-black text-[#1D3D76] uppercase tracking-widest">{logs.length} Total Sessions</span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedLogs.map((log) => {
          const config = SPORTS_CONFIG[log.sportType];
          return (
            <div key={log.id} className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col md:flex-row items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg ${
                log.intensity > 7 ? 'bg-red-500' : 'bg-[#1D3D76]'
              }`}>
                {config.icon}
              </div>

              <div className="flex-1 space-y-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h4 className="text-lg font-black text-[#1D3D76]">{log.trainingType} {log.sportType} Session</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    log.intensity > 7 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    Intensity: {log.intensity}/10
                  </span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {format(new Date(log.date), 'MMMM d, yyyy')}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {log.duration} Minutes</span>
                </div>
              </div>

              <div className="flex items-center gap-4 md:border-l border-gray-100 md:pl-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Efficiency</p>
                  <p className="text-lg font-black text-[#1D3D76]">High</p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-[#1D3D76] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;
