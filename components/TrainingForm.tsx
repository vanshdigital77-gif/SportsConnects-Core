
import React, { useState } from 'react';
import { SportType, TrainingLog } from '../types';
import { SPORTS_CONFIG } from '../constants';
import { X, Save, Zap, Heart, Moon } from 'lucide-react';

interface TrainingFormProps {
  athleteId: string;
  onClose: () => void;
  onSubmit: (log: TrainingLog) => void;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ athleteId, onClose, onSubmit }) => {
  const [sportType, setSportType] = useState<SportType>('Gym');
  const [trainingType, setTrainingType] = useState<TrainingLog['trainingType']>('Strength');
  const [duration, setDuration] = useState(60);
  const [intensity, setIntensity] = useState(5);
  const [sleepHours, setSleepHours] = useState(8);
  const [rhr, setRhr] = useState(60);
  const [notes, setNotes] = useState('');
  const [metrics, setMetrics] = useState<Record<string, any>>({});

  const sportConfig = SPORTS_CONFIG[sportType];

  const handleMetricChange = (key: string, value: any) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: TrainingLog = {
      id: Math.random().toString(36).substr(2, 9),
      athleteId,
      date: new Date().toISOString(),
      sportType,
      trainingType,
      duration,
      intensity,
      sleepHours,
      restingHeartRate: rhr,
      metrics,
      notes
    };
    onSubmit(newLog);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[95vh]">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-[#1D3D76] text-white">
        <div>
          <h3 className="text-2xl font-black">Performance Entry</h3>
          <p className="text-blue-200 text-xs mt-1 uppercase tracking-widest font-bold">Daily Training Intel</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-2xl transition-colors">
          <X size={28} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {/* Sport Discipline */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Choose Discipline</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {(Object.keys(SPORTS_CONFIG) as SportType[]).map(sport => (
              <button
                key={sport}
                type="button"
                onClick={() => {
                  setSportType(sport);
                  setMetrics({});
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  sportType === sport 
                  ? 'bg-[#1D3D76] border-[#1D3D76] text-white shadow-xl scale-[1.05]' 
                  : 'bg-white border-gray-100 text-gray-400 hover:border-blue-100'
                }`}
              >
                {SPORTS_CONFIG[sport].icon}
                <span className="text-[10px] font-black mt-2">{sport}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scientific Baseline Section */}
        <div className="bg-gray-50 p-6 rounded-3xl space-y-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <Zap size={16} className="text-[#E6C264]" fill="#E6C264" />
            <p className="text-xs font-black text-[#1D3D76] uppercase tracking-widest">Scientific Recovery Data</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                <Moon size={14} />
                <span>Sleep Quality (Hrs)</span>
              </label>
              <input 
                type="number"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full bg-white border-gray-200 rounded-2xl p-4 text-sm text-gray-900 font-bold focus:ring-2 focus:ring-[#1D3D76] outline-none shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                <Heart size={14} />
                <span>Resting Heart Rate</span>
              </label>
              <input 
                type="number"
                value={rhr}
                onChange={(e) => setRhr(Number(e.target.value))}
                className="w-full bg-white border-gray-200 rounded-2xl p-4 text-sm text-gray-900 font-bold focus:ring-2 focus:ring-[#1D3D76] outline-none shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Training Main Metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Intensity (1-10)</label>
            <input 
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1D3D76]"
            />
            <div className="flex justify-between text-[10px] font-bold text-gray-400">
              <span>RECOVERY</span>
              <span>MAX OUT</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Session Duration</label>
            <div className="relative">
              <input 
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 text-sm text-gray-900 font-bold focus:ring-2 focus:ring-[#1D3D76] outline-none"
              />
              <span className="absolute right-4 top-4 text-xs text-gray-400 font-bold uppercase">Mins</span>
            </div>
          </div>
        </div>

        {/* Dynamic Sport-Specific Metrics */}
        <div className="space-y-4">
          <p className="text-xs font-black text-[#1D3D76] uppercase tracking-widest flex items-center">
            <span className="w-8 h-[2px] bg-[#E6C264] mr-3"></span>
            {sportType} Performance
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sportConfig.fields.map(field => (
              <div key={field.key} className="space-y-2">
                <label className="block text-xs font-medium text-gray-500">{field.label} {field.unit && `(${field.unit})`}</label>
                <input 
                  type={field.type}
                  placeholder={`---`}
                  value={metrics[field.key] || ''}
                  onChange={(e) => handleMetricChange(field.key, e.target.value)}
                  className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 text-sm text-gray-900 focus:ring-2 focus:ring-[#1D3D76] outline-none font-medium"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Subjective Feedback</label>
          <textarea 
            rows={3}
            placeholder="Athlete notes, perceived exertion, or injuries..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-gray-50 border-gray-200 rounded-3xl p-4 text-sm text-gray-900 focus:ring-2 focus:ring-[#1D3D76] outline-none resize-none font-medium"
          ></textarea>
        </div>
      </div>

      <div className="p-8 border-t border-gray-100 bg-white">
        <button 
          type="submit"
          className="w-full bg-[#1D3D76] text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center space-x-3 hover:bg-blue-900 transition-all shadow-xl active:scale-95 group"
        >
          <Save size={24} className="group-hover:animate-pulse" />
          <span>Upload Training Intel</span>
        </button>
      </div>
    </form>
  );
};

export default TrainingForm;
