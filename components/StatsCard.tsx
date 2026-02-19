
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, subtitle }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</p>
        <div className="p-2 bg-gray-50 rounded-xl">
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="text-2xl font-black text-[#1D3D76]">{value}</h4>
        <p className="text-[10px] text-gray-400 mt-1 font-medium">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatsCard;
