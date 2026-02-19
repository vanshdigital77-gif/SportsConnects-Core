
import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';

interface BadgeCardProps {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: React.ReactNode;
  category: string;
  progress?: number;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ name, description, unlocked, icon, category, progress }) => {
  return (
    <div className={`relative bg-white p-8 rounded-[2.5rem] shadow-sm border transition-all duration-500 flex flex-col items-center text-center overflow-hidden ${
      unlocked 
      ? 'border-[#E6C264] shadow-xl shadow-[#E6C264]/10 ring-4 ring-[#E6C264]/5' 
      : 'border-gray-100 grayscale opacity-75 hover:grayscale-0 hover:opacity-100'
    }`}>
      {/* Category Tag */}
      <span className={`absolute top-4 right-6 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
        unlocked ? 'bg-[#E6C264] text-[#1D3D76]' : 'bg-gray-100 text-gray-400'
      }`}>
        {category}
      </span>

      {/* Visual Badge Circle */}
      <div className={`relative w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 ${
        unlocked 
        ? 'bg-[#E6C264] text-[#1D3D76] shadow-[0_0_30px_rgba(230,194,100,0.5)] scale-110' 
        : 'bg-gray-50 text-gray-300'
      }`}>
        {icon}
        {unlocked ? (
          <div className="absolute -bottom-1 -right-1 bg-[#1D3D76] text-white p-1 rounded-full border-2 border-white shadow-lg">
            <CheckCircle2 size={16} />
          </div>
        ) : (
          <div className="absolute -bottom-1 -right-1 bg-gray-400 text-white p-1 rounded-full border-2 border-white">
            <Lock size={16} />
          </div>
        )}
      </div>

      <h4 className={`text-lg font-black mb-2 ${unlocked ? 'text-[#1D3D76]' : 'text-gray-400'}`}>{name}</h4>
      <p className="text-xs text-gray-500 leading-relaxed max-w-[180px] mb-6">{description}</p>

      {/* Progress for Streak Badges */}
      {progress !== undefined && !unlocked && (
        <div className="w-full mt-auto">
          <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1D3D76] transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {unlocked && (
        <div className="mt-auto pt-4 border-t border-[#E6C264]/20 w-full">
          <p className="text-[10px] font-black text-[#E6C264] uppercase tracking-[0.2em]">Honor Unlocked</p>
        </div>
      )}
    </div>
  );
};

export default BadgeCard;
