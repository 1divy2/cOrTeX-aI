import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import { useExecutionStore } from "@/store/execution-store";
import { useCalendarStore } from "@/store/calendar-store";
import { generateProjectForecast, generateFocusForecast, Prediction } from "@/lib/agents/forecast-engine";
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Target, Zap } from "lucide-react";

export const Route = createFileRoute("/forecast")({
  component: ForecastPage,
});

function ForecastPage() {
  const { projects, fetchExecutionData } = useExecutionStore();
  const { blocks, fetchBlocks } = useCalendarStore();
  
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  
  useEffect(() => {
    fetchExecutionData();
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    fetchBlocks(lastWeek, today);
  }, []);

  useEffect(() => {
    if (projects.length > 0 && blocks.length > 0) {
      const newPredictions: Prediction[] = [];
      
      // Generate Focus Forecast
      newPredictions.push(generateFocusForecast(blocks));
      
      // Generate Project Forecasts
      projects.filter(p => p.status === 'active').forEach(project => {
        const relatedBlocks = blocks.filter(b => b.linkedProjectId === project.id);
        newPredictions.push(generateProjectForecast(project, relatedBlocks));
      });
      
      setPredictions(newPredictions);
    }
  }, [projects, blocks]);

  const criticalCount = predictions.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').length;

  return (
    <WorkspaceShell>
      <div className="mx-auto w-full max-w-6xl p-8 flex flex-col flex-1 text-white selection:bg-purple-500/30">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <Activity className="h-10 w-10 text-orange-400" /> Prediction Center
            </h1>
            <p className="text-zinc-400 mt-2">AI-powered forecasts and risk detection based on your habits.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <span className="text-sm font-bold text-zinc-300">System Status:</span>
            {criticalCount > 0 ? (
              <span className="flex items-center gap-1 text-red-400 text-sm font-bold"><AlertTriangle className="h-4 w-4"/> {criticalCount} Warnings</span>
            ) : (
              <span className="flex items-center gap-1 text-green-400 text-sm font-bold"><Zap className="h-4 w-4"/> Optimal</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {predictions.length === 0 ? (
            <div className="col-span-2 p-12 text-center rounded-3xl border border-dashed border-white/20 bg-white/[0.02]">
              <Activity className="h-8 w-8 text-zinc-600 mx-auto mb-4 animate-pulse" />
              <p className="text-zinc-500">Aggregating historical data and building models...</p>
            </div>
          ) : (
            predictions.map(pred => (
              <div key={pred.id} className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-xl flex flex-col hover:border-orange-500/30 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    pred.targetType === 'project' ? 'bg-cyan-500/10 text-cyan-400' :
                    pred.targetType === 'focus' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-zinc-500/10 text-zinc-400'
                  }`}>
                    {pred.targetType === 'project' ? <Target className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                  </div>
                  
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    pred.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                    pred.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {pred.riskLevel} Risk
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-1">{pred.metricName}</h3>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl font-black font-mono">{pred.predictedValue}{pred.targetType === 'project' ? '%' : 'h'}</span>
                  <span className="text-sm text-zinc-500 mb-1">Forecast</span>
                </div>
                
                <div className="flex-1 bg-black/40 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-transparent"></div>
                   <p className="text-sm text-zinc-300 leading-relaxed ml-2">{pred.insights}</p>
                </div>
                
                <div className="mt-4 flex justify-between items-center text-xs text-zinc-500">
                  <span>Confidence Score: {pred.confidenceScore}%</span>
                  <span>Model: GPT-4o-Mini + Heuristics</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
