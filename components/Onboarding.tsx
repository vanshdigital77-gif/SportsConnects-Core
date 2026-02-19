
import React, { useState } from 'react';
import { SportType } from '../types';
import { SPORTS_CONFIG } from '../constants';
import { CheckCircle2, Trophy, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (sport: SportType) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);

  const steps = [
    {
      title: "Welcome to SportsConnects",
      desc: "The elite performance tracking platform built for professional athletes.",
      icon: <Trophy className="w-16 h-16 text-[#E6C264]" />
    },
    {
      title: "Choose Your Discipline",
      desc: "Select your primary sport to personalize your dashboard and tracking metrics.",
      icon: null
    },
    {
      title: "Ready to Achieve?",
      desc: "We've configured your custom dynamic forms and performance charts.",
      icon: <CheckCircle2 className="w-16 h-16 text-green-500" />
    }
  ];

  const handleNext = () => {
    if (step === 2 && !selectedSport) return;
    if (step === 3) {
      if (selectedSport) onComplete(selectedSport);
      return;
    }
    setStep(s => s + 1);
  };

  return (
    <div className="min-h-screen bg-[#1D3D76] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8 md:p-12 relative">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-[#1D3D76]' : 'w-2 bg-gray-200'}`}
              ></div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          {steps[step-1].icon && (
            <div className="flex justify-center mb-6 animate-bounce">
              {steps[step-1].icon}
            </div>
          )}
          <h2 className="text-3xl font-black text-[#1D3D76] mb-4">{steps[step-1].title}</h2>
          <p className="text-gray-500 leading-relaxed">{steps[step-1].desc}</p>
        </div>

        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {(Object.keys(SPORTS_CONFIG) as SportType[]).map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                  selectedSport === sport 
                  ? 'border-[#1D3D76] bg-blue-50 text-[#1D3D76] font-bold scale-[0.98]' 
                  : 'border-gray-100 bg-white text-gray-400 hover:border-blue-100 hover:text-gray-600'
                }`}
              >
                <div className="mb-2">{SPORTS_CONFIG[sport].icon}</div>
                <span className="text-xs">{sport}</span>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-[#1D3D76] rounded-xl flex items-center justify-center text-white">
                {selectedSport && SPORTS_CONFIG[selectedSport].icon}
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Selected Core Sport</p>
                <p className="text-lg font-bold text-[#1D3D76]">{selectedSport}</p>
              </div>
            </div>
            <ul className="text-sm text-gray-500 space-y-3">
              <li className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Personalized analytics dashboard</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Multi-sport training log access</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Coach feedback integration</span>
              </li>
            </ul>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={step === 2 && !selectedSport}
          className="w-full bg-[#1D3D76] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-900 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <span>{step === 3 ? "Let's Begin" : "Next Step"}</span>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center mt-6 text-xs text-gray-400 font-medium">Step {step} of 3</p>
      </div>
    </div>
  );
};

export default Onboarding;
