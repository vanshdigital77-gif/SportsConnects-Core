
import React from 'react';
import { Flame } from 'lucide-react';

interface StreakCardProps {
  streak: number;
}

const StreakCard: React.FC<StreakCardProps> = ({ streak }) => {
  const getMotivationalMessage = (s: number) => {
    if (s === 0) return "Start a new journey today!";
    if (s < 3) return "Great start! Keep pushing.";
    if (s < 7) return "Almost a full week! Power on.";
    if (s < 14) return "You're on fire! Unstoppable.";
    return "Legendary consistency!";
  };

  return (
    <div className="streak-gradient p-6 rounded-2xl text-white shadow-xl relative overflow-hidden flex flex-col justify-between group">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">Current Streak</p>
          <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
            <Flame className="text-[#E6C264]" size={20} fill={streak > 0 ? "#E6C264" : "none"} />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <h4 className="text-5xl font-black">{streak}</h4>
          <span className="text-lg font-bold text-[#E6C264]">DAYS</span>
        </div>
      </div>
      
      <p className="relative z-10 mt-4 text-xs font-medium text-blue-100 italic">
        "{getMotivationalMessage(streak)}"
      </p>

      {/* Decorative circle */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
    </div>
  );
};

export default StreakCard;
