
export type SportType = 'Gym' | 'Running' | 'Boxing' | 'Badminton' | 'Cricket' | 'Football' | 'Athletics' | 'Swimming' | 'Cycling' | 'Other';

export type UserRole = 'ATHLETE' | 'COACH';
export type SubscriptionStatus = 'FREE' | 'PRO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  sportPreference?: SportType;
  avatar?: string;
  xp?: number;
  level?: string;
  joinedAt: string; // ISO date string
}

export interface TrainingLog {
  id: string;
  athleteId: string;
  date: string;
  sportType: SportType;
  trainingType: 'Strength' | 'Cardio' | 'Skill' | 'Match' | 'Recovery';
  duration: number; // in minutes
  intensity: number; // 1-10
  sleepHours?: number;
  restingHeartRate?: number;
  metrics: Record<string, any>;
  notes: string;
}

export interface BodyMetrics {
  id: string;
  athleteId: string;
  date: string;
  weight: number;
  height: number;
  restingHeartRate: number;
  bodyFat?: number;
}

export interface PerformanceRecord {
  id: string;
  athleteId: string;
  date: string;
  matchPlayed: boolean;
  speedStrengthRecord: string;
  skillScore: number;
  coachFeedback?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  type: 'streak' | 'performance' | 'pro';
  icon: string;
  unlockedAt?: string;
}
