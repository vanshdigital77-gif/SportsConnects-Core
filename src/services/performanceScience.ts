
import { differenceInDays, parseISO, subDays, isAfter, isBefore } from 'date-fns';
import { TrainingLog, User } from '../../types';

export interface ScientificInsight {
  label: string;
  value: string | number;
  status: 'optimal' | 'warning' | 'danger' | 'calibration' | 'neutral';
  description: string;
  calculationLogic: string;
}

/**
 * Calculate the Acute:Chronic Workload Ratio (ACWR)
 * Acute: 7-day rolling average of training load (duration * intensity)
 * Chronic: 28-day rolling average of training load
 * Target: 0.8 - 1.3 (The "Sweet Spot")
 */
export const calculateACWR = (logs: TrainingLog[]): ScientificInsight => {
  if (logs.length < 14) {
    return {
      label: 'ACWR (Load Ratio)',
      value: 'Calibration',
      status: 'calibration',
      description: 'Insufficient data for reliable workload analysis. Requires 14+ days of consistent logging.',
      calculationLogic: 'ACWR = (7-day Average Load) / (28-day Average Load). Load = Duration × Intensity (RPE).'
    };
  }

  const now = new Date();
  const acuteDays = 7;
  const chronicDays = 28;

  const getAverageLoad = (days: number) => {
    const cutoff = subDays(now, days);
    const relevantLogs = logs.filter(log => isAfter(parseISO(log.date), cutoff));
    if (relevantLogs.length === 0) return 0;
    const totalLoad = relevantLogs.reduce((acc, log) => acc + (log.duration * log.intensity), 0);
    return totalLoad / days;
  };

  const acuteLoad = getAverageLoad(acuteDays);
  const chronicLoad = getAverageLoad(chronicDays);

  if (chronicLoad === 0) return {
    label: 'ACWR',
    value: 'N/A',
    status: 'neutral',
    description: 'No chronic load data available.',
    calculationLogic: 'ACWR = Acute Load / Chronic Load'
  };

  const ratio = acuteLoad / chronicLoad;
  
  let status: ScientificInsight['status'] = 'optimal';
  let description = 'Workload is in the optimal "Sweet Spot" for adaptation.';

  if (ratio < 0.8) {
    status = 'warning';
    description = 'Under-training. Risk of detraining or loss of fitness.';
  } else if (ratio > 1.3 && ratio <= 1.5) {
    status = 'warning';
    description = 'High workload. Monitor for fatigue.';
  } else if (ratio > 1.5) {
    status = 'danger';
    description = 'Spike in workload detected. Significant increase in injury risk.';
  }

  return {
    label: 'ACWR (Load Ratio)',
    value: ratio.toFixed(2),
    status,
    description,
    calculationLogic: `Acute Load (7d avg): ${acuteLoad.toFixed(1)} | Chronic Load (28d avg): ${chronicLoad.toFixed(1)} | Ratio: ${ratio.toFixed(2)}`
  };
};

/**
 * Calculate Recovery Score (0-100)
 * Factors: Sleep (40%), RHR Deviation (30%), Recent Load (30%)
 */
export const calculateRecoveryScore = (logs: TrainingLog[]): ScientificInsight => {
  const latestLog = logs[0];
  if (!latestLog || logs.length < 7) {
    return {
      label: 'Recovery Readiness',
      value: 'Calibration',
      status: 'calibration',
      description: 'Establishing baseline recovery metrics. Requires 7 days of sleep and RHR data.',
      calculationLogic: 'Weighted score based on Sleep Duration, Resting Heart Rate deviation, and 3-day training load.'
    };
  }

  // 1. Sleep Score (Target 8 hours)
  const sleep = latestLog.sleepHours || 8;
  const sleepScore = Math.min(100, (sleep / 8) * 100);

  // 2. RHR Score (Deviation from 7-day baseline)
  const rhrLogs = logs.filter(l => l.restingHeartRate).slice(0, 7);
  const avgRhr = rhrLogs.reduce((acc, l) => acc + (l.restingHeartRate || 60), 0) / rhrLogs.length;
  const currentRhr = latestLog.restingHeartRate || avgRhr;
  const rhrDeviation = ((currentRhr - avgRhr) / avgRhr) * 100;
  // Lower RHR or stable RHR is better. Significant increase (>5%) indicates fatigue.
  const rhrScore = Math.max(0, 100 - (rhrDeviation > 0 ? rhrDeviation * 5 : 0));

  // 3. Load Score (Inverse of recent 3-day load)
  const recentLogs = logs.slice(0, 3);
  const recentLoad = recentLogs.reduce((acc, l) => acc + (l.duration * l.intensity), 0) / 3;
  const loadScore = Math.max(0, 100 - (recentLoad / 10)); // Arbitrary normalization for demo

  const totalScore = Math.round((sleepScore * 0.4) + (rhrScore * 0.3) + (loadScore * 0.3));

  let status: ScientificInsight['status'] = 'optimal';
  if (totalScore < 50) status = 'danger';
  else if (totalScore < 75) status = 'warning';

  return {
    label: 'Recovery Readiness',
    value: `${totalScore}%`,
    status,
    description: status === 'optimal' ? 'Body is well-recovered and ready for high intensity.' : 'Consider a recovery session or reduced intensity today.',
    calculationLogic: `Sleep (${sleep}h): ${sleepScore.toFixed(0)}pts | RHR Dev (${rhrDeviation.toFixed(1)}%): ${rhrScore.toFixed(0)}pts | Load Factor: ${loadScore.toFixed(0)}pts`
  };
};

export const getCalibrationStatus = (user: User): { isCalibrating: boolean; daysRemaining: number } => {
  const joinedDate = parseISO(user.joinedAt);
  const daysSinceJoined = differenceInDays(new Date(), joinedDate);
  const calibrationPeriod = 14;
  
  return {
    isCalibrating: daysSinceJoined < calibrationPeriod,
    daysRemaining: Math.max(0, calibrationPeriod - daysSinceJoined)
  };
};

export const validateTrainingInput = (log: Partial<TrainingLog>): string | null => {
  if (log.duration && (log.duration < 1 || log.duration > 480)) {
    return "Duration must be between 1 and 480 minutes.";
  }
  if (log.intensity && (log.intensity < 1 || log.intensity > 10)) {
    return "Intensity must be between 1 and 10.";
  }
  if (log.sleepHours && (log.sleepHours < 0 || log.sleepHours > 24)) {
    return "Sleep hours must be between 0 and 24.";
  }
  if (log.restingHeartRate && (log.restingHeartRate < 30 || log.restingHeartRate > 200)) {
    return "Resting Heart Rate seems unrealistic (30-200 bpm).";
  }
  return null;
};
