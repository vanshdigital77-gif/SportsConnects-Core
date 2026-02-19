
import React, { useMemo } from 'react';
import { TrainingLog, User } from '../types';
import { Trophy, Medal, Flame, Zap, Award, Target, Lock, CheckCircle2, Star } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import BadgeCard from './BadgeCard';

interface BadgesViewProps {
  user: User;
  logs: TrainingLog[];
}

const BadgesView: React.FC<BadgesViewProps> = ({ user, logs }) => {
  const athleteLogs = useMemo(() => logs.filter(l => l.athleteId === user.id), [logs, user.id]);

  const currentStreak = useMemo(() => {
    if (athleteLogs.length === 0) return 0;
    // Fix: Explicitly use Set<string> to ensure Array.from returns string[] instead of unknown[]
    const sortedDates: string[] = Array.from(new Set<string>(athleteLogs.map(l => l.date.split('T')[0]))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streakCount = 0;
    let checkDate = new Date();
    
    if (sortedDates.length === 0) return 0;
    const lastLogDate = new Date(sortedDates[0]);
    if (differenceInDays(new Date(), lastLogDate) > 1) return 0;

    for (let i = 0; i < sortedDates.length; i++) {
      const d = new Date(sortedDates[i]);
      if (i === 0) {
        streakCount = 1;
        checkDate = d;
      } else {
        const diff = differenceInDays(checkDate, d);
        if (diff === 1) {
          streakCount++;
          checkDate = d;
        } else if (diff > 1) {
          break;
        }
      }
    }
    return streakCount;
  }, [athleteLogs]);

  const badges = useMemo(() => {
    // Streak Badges
    const streakBadges = [
      {
        id: 's7',
        name: 'Week Warrior',
        description: 'Achieve a 7-day training streak.',
        unlocked: currentStreak >= 7,
        icon: <Flame size={32} />,
        category: 'Streak',
        progress: Math.min(100, (currentStreak / 7) * 100)
      },
      {
        id: 's30',
        name: 'Monthly Master',
        description: 'Achieve a 30-day training streak.',
        unlocked: currentStreak >= 30,
        icon: <Trophy size={32} />,
        category: 'Streak',
        progress: Math.min(100, (currentStreak / 30) * 100)
      },
      {
        id: 's90',
        name: 'Quarterly King',
        description: 'Achieve a 90-day training streak.',
        unlocked: currentStreak >= 90,
        icon: <Award size={32} />,
        category: 'Streak',
        progress: Math.min(100, (currentStreak / 90) * 100)
      }
    ];

    // Performance Badges
    const hasGymPB = athleteLogs.some(l => l.sportType === 'Gym' && (l.metrics.weight || 0) >= 80);
    const hasRunningPB = athleteLogs.some(l => l.sportType === 'Running' && (l.metrics.distance || 0) >= 10);
    const hasSkillPB = athleteLogs.some(l => (l.metrics.performance || l.metrics.skill || 0) >= 9);

    const perfBadges = [
      {
        id: 'p_gym',
        name: 'Iron Titan',
        description: 'Lift 80kg or more in a single session.',
        unlocked: hasGymPB,
        icon: <Medal size={32} />,
        category: 'Performance'
      },
      {
        id: 'p_run',
        name: 'Speed Demon',
        description: 'Complete a 10km run session.',
        unlocked: hasRunningPB,
        icon: <Zap size={32} />,
        category: 'Performance'
      },
      {
        id: 'p_skill',
        name: 'Elite Talent',
        description: 'Achieve a 9+ performance rating.',
        unlocked: hasSkillPB,
        icon: <Star size={32} />,
        category: 'Performance'
      }
    ];

    return { streak: streakBadges, performance: perfBadges };
  }, [currentStreak, athleteLogs]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-[#1D3D76]">Achievement Hall</h2>
          <p className="text-gray-500">Collect honors for your discipline and consistency.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#E6C264] rounded-2xl flex items-center justify-center text-[#1D3D76] shadow-lg">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Points</p>
            <p className="text-xl font-black text-[#1D3D76] mt-1">{badges.streak.filter(b => b.unlocked).length * 100 + badges.performance.filter(b => b.unlocked).length * 250}</p>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center space-x-3 mb-6">
          <Flame className="text-orange-500" size={24} />
          <h3 className="text-xl font-bold text-[#1D3D76]">Streak Milestones</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.streak.map(badge => (
            <BadgeCard key={badge.id} {...badge} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center space-x-3 mb-6">
          <Target className="text-blue-500" size={24} />
          <h3 className="text-xl font-bold text-[#1D3D76]">Performance Honors</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.performance.map(badge => (
            <BadgeCard key={badge.id} {...badge} />
          ))}
        </div>
      </section>

      {/* Pro Badge Lock Section */}
      {user.subscriptionStatus === 'FREE' && (
        <section className="relative">
          <div className="flex items-center space-x-3 mb-6 opacity-40">
            <Award className="text-[#E6C264]" size={24} />
            <h3 className="text-xl font-bold text-[#1D3D76]">Pro Elite Badges</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 grayscale">
            <BadgeCard 
              id="pro_1" 
              name="Recovery Pro" 
              description="Maintain 80% recovery for 30 days." 
              unlocked={false} 
              icon={<Medal size={32} />} 
              category="PRO" 
            />
          </div>
          <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
             <div className="text-center p-8 bg-white shadow-2xl rounded-3xl border border-gray-100 max-w-sm">
                <Lock className="mx-auto text-[#1D3D76] mb-4" size={40} />
                <h4 className="text-lg font-black text-[#1D3D76] mb-2">Unlock Pro Achievements</h4>
                <p className="text-sm text-gray-500 mb-6">Go PRO to unlock advanced scientific performance badges and recovery monitoring milestones.</p>
                <button className="bg-[#E6C264] text-[#1D3D76] px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform flex items-center justify-center space-x-2 w-full">
                  <Zap size={16} fill="#1D3D76" />
                  <span>Upgrade Hall of Fame</span>
                </button>
             </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BadgesView;
