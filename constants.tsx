
import React from 'react';
import { 
  Dumbbell, 
  MoveRight, 
  Target, 
  Activity, 
  Trophy, 
  Users, 
  Calendar, 
  TrendingUp, 
  Settings,
  Flame,
  Zap,
  Award
} from 'lucide-react';
import { SportType } from './types';

export const COLORS = {
  primary: '#1D3D76',
  accent: '#E6C264',
  background: '#FFFFFF',
};

export const SPORTS_CONFIG: Record<SportType, { icon: React.ReactNode; fields: { key: string; label: string; type: 'number' | 'text' | 'boolean'; unit?: string }[] }> = {
  Gym: {
    icon: <Dumbbell className="w-5 h-5" />,
    fields: [
      { key: 'sets', label: 'Sets', type: 'number' },
      { key: 'reps', label: 'Reps', type: 'number' },
      { key: 'weight', label: 'Weight Lifted', type: 'number', unit: 'kg' }
    ]
  },
  Running: {
    icon: <MoveRight className="w-5 h-5" />,
    fields: [
      { key: 'distance', label: 'Distance', type: 'number', unit: 'km' },
      { key: 'pace', label: 'Pace', type: 'text', unit: 'min/km' },
      { key: 'calories', label: 'Calories', type: 'number', unit: 'kcal' }
    ]
  },
  Cycling: {
    icon: <Activity className="w-5 h-5" />,
    fields: [
      { key: 'distance', label: 'Distance', type: 'number', unit: 'km' },
      { key: 'elevation', label: 'Elevation', type: 'number', unit: 'm' },
      { key: 'avgSpeed', label: 'Avg Speed', type: 'number', unit: 'km/h' }
    ]
  },
  Boxing: {
    icon: <Flame className="w-5 h-5" />,
    fields: [
      { key: 'rounds', label: 'Rounds', type: 'number' },
      { key: 'sparring', label: 'Sparring Time', type: 'number', unit: 'min' },
      { key: 'reaction', label: 'Reaction Score', type: 'number', unit: '/10' }
    ]
  },
  Badminton: {
    icon: <Zap className="w-5 h-5" />,
    fields: [
      { key: 'matches', label: 'Matches Played', type: 'number' },
      { key: 'rally', label: 'Avg Rally Duration', type: 'number', unit: 'sec' },
      { key: 'skill', label: 'Skill Rating', type: 'number', unit: '/10' }
    ]
  },
  Cricket: {
    icon: <Award className="w-5 h-5" />,
    fields: [
      { key: 'runs', label: 'Runs Scored', type: 'number' },
      { key: 'wickets', label: 'Wickets Taken', type: 'number' },
      { key: 'performance', label: 'Performance Rating', type: 'number', unit: '/10' }
    ]
  },
  Football: {
    icon: <Award className="w-5 h-5" />,
    fields: [
      { key: 'goals', label: 'Goals/Assists', type: 'number' },
      { key: 'distance', label: 'Total Distance', type: 'number', unit: 'km' },
      { key: 'performance', label: 'Performance Rating', type: 'number', unit: '/10' }
    ]
  },
  Athletics: {
    icon: <Activity className="w-5 h-5" />,
    fields: [
      { key: 'event', label: 'Event Type', type: 'text' },
      { key: 'result', label: 'Result', type: 'text' },
      { key: 'split', label: 'Best Split', type: 'text' }
    ]
  },
  Swimming: {
    icon: <Activity className="w-5 h-5" />,
    fields: [
      { key: 'laps', label: 'Laps', type: 'number' },
      { key: 'distance', label: 'Total Distance', type: 'number', unit: 'm' },
      { key: 'stroke', label: 'Main Stroke', type: 'text' }
    ]
  },
  Other: {
    icon: <Activity className="w-5 h-5" />,
    fields: [
      { key: 'intensity', label: 'Intensity', type: 'number', unit: '/10' },
      { key: 'custom', label: 'Specific Metric', type: 'text' }
    ]
  }
};
