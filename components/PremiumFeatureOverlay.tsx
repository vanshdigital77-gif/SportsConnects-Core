
import React from 'react';
import { Lock, Zap } from 'lucide-react';

interface PremiumFeatureOverlayProps {
  onUpgrade: () => void;
  title: string;
}

const PremiumFeatureOverlay: React.FC<PremiumFeatureOverlayProps> = ({ onUpgrade, title }) => {
  return (
    <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[12px] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <div className="w-16 h-16 bg-[#1D3D76] rounded-2xl flex items-center justify-center shadow-xl mb-4 group cursor-pointer hover:scale-110 transition-transform" onClick={onUpgrade}>
        <Lock className="text-[#E6C264]" size={28} />
      </div>
      <h4 className="text-xl font-black text-[#1D3D76] mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-6 max-w-[240px]">This scientific performance intelligence is reserved for PRO members.</p>
      <button 
        onClick={onUpgrade}
        className="flex items-center space-x-2 bg-[#E6C264] text-[#1D3D76] px-8 py-3 rounded-2xl font-black text-sm shadow-lg hover:shadow-[#E6C264]/40 transition-all active:scale-95"
      >
        <Zap size={16} fill="#1D3D76" />
        <span>Unlock Performance Lab</span>
      </button>
      <p className="text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">Billed on sportsconnects.in</p>
    </div>
  );
};

export default PremiumFeatureOverlay;
