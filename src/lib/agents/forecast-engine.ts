import { Project } from "@/store/execution-store";
import { TimeBlock } from "@/store/calendar-store";

export type Prediction = {
  id: string;
  targetType: 'project' | 'goal' | 'habit' | 'focus' | 'anomaly';
  targetId?: string;
  metricName: string;
  predictedValue: number;
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  insights: string;
  createdAt: number;
};

// Mock Forecasting Engine for Phase 7
// In a production system, this would use machine learning models on the backend.
// For CorTeX.ai, we generate predictive models based on user data heuristics.

export const generateProjectForecast = (project: Project, relatedBlocks: TimeBlock[]): Prediction => {
  const now = Date.now();
  
  // Example heuristic: A project with low health and no recent blocks is at high risk
  const hasRecentActivity = relatedBlocks.some(b => b.completed && b.endTime > now - (7 * 24 * 60 * 60 * 1000));
  
  let riskLevel: Prediction['riskLevel'] = 'low';
  let probability = project.healthScore;
  let insight = "Project is on track based on current velocity.";

  if (project.healthScore < 40) {
    riskLevel = 'critical';
    probability = Math.max(10, project.healthScore - 20);
    insight = "Project health is critically low. Stagnation detected.";
  } else if (!hasRecentActivity && project.status === 'active') {
    riskLevel = 'high';
    probability -= 15;
    insight = "Project has stalled. No deep work blocks completed in the last 7 days.";
  } else if (project.healthScore < 70) {
    riskLevel = 'medium';
    insight = "Project momentum is slowing down. Consider scheduling a focus block.";
  }

  return {
    id: crypto.randomUUID(),
    targetType: 'project',
    targetId: project.id,
    metricName: 'Completion Probability',
    predictedValue: probability,
    confidenceScore: 85,
    riskLevel,
    insights: insight,
    createdAt: now
  };
};

export const generateFocusForecast = (recentBlocks: TimeBlock[]): Prediction => {
  const now = Date.now();
  
  // Calculate average daily focus hours over last 7 days
  const completedFocusBlocks = recentBlocks.filter(b => b.completed && b.type === 'focus');
  let totalHours = 0;
  completedFocusBlocks.forEach(b => {
    totalHours += (b.endTime - b.startTime) / (1000 * 60 * 60);
  });
  
  const dailyAverage = totalHours / 7;
  
  // Predict next week's capacity
  const predictedWeeklyCapacity = dailyAverage * 7 * 1.05; // Assuming 5% growth trend
  
  return {
    id: crypto.randomUUID(),
    targetType: 'focus',
    metricName: 'Next Week Focus Capacity',
    predictedValue: Math.round(predictedWeeklyCapacity * 10) / 10,
    confidenceScore: 78,
    riskLevel: dailyAverage < 1 ? 'high' : 'low',
    insights: dailyAverage < 1 
      ? "Burnout or distraction risk detected. Focus capacity is tracking unusually low."
      : "Strong deep work momentum. You are projected to maintain high output next week.",
    createdAt: now
  };
};
