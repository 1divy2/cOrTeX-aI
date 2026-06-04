import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import { useExecutionStore } from "@/store/execution-store";
import { useCalendarStore } from "@/store/calendar-store";
import { useTasksStore } from "@/store/tasks-store";
import { motion } from "framer-motion";
import { Sun, Target, CheckCircle2, Circle, ArrowRight, Brain, Clock, Zap, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/command-center")({
  component: CommandCenterPage,
});

function CommandCenterPage() {
  const { projects, habits, fetchExecutionData } = useExecutionStore();
  const { blocks, fetchBlocks, toggleBlockCompletion } = useCalendarStore();
  const { tasks } = useTasksStore();
  const [greeting, setGreeting] = useState("Good morning");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    fetchExecutionData();
    const today = new Date().toISOString().split('T')[0];
    fetchBlocks(today, today);

    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");
      
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  // Calculate Real Execution Score (weighted average of completed blocks today + active habit streaks)
  const completedBlocks = blocks.filter(b => b.completed).length;
  const totalBlocks = blocks.length;
  const blocksScore = totalBlocks > 0 ? (completedBlocks / totalBlocks) * 100 : 100;
  
  const totalHabits = habits.length;
  const habitsScore = totalHabits > 0 
    ? (habits.reduce((acc, h) => acc + Math.min(h.streak, 7), 0) / (totalHabits * 7)) * 100
    : 100;

  const executionScore = totalBlocks > 0 || totalHabits > 0 
    ? Math.round((blocksScore * 0.6) + (habitsScore * 0.4)) 
    : 0;

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-7xl p-8 text-foreground selection:bg-accent/30">
        <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-2">{todayStr}</p>
              <h1 className="text-4xl font-display font-black tracking-tight flex items-center gap-3">
                {greeting}. <span className="text-muted-foreground">{currentTime}</span>
              </h1>
            </div>
            
            <div className="text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2">
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Execution Score: </span>
                <span className="font-mono text-lg font-bold text-accent">{executionScore}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Column: Priorities & Schedule */}
            <div className="col-span-8 flex flex-col gap-6">
              
              {/* Daily Schedule / Blocks */}
              <div className="paper-panel rounded-[24px] border border-border p-8 transition-colors duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold flex items-center gap-2 text-foreground">
                    <Clock className="h-5 w-5 text-accent" />
                    Today's Schedule
                  </h2>
                  <Link to="/planner" className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1 font-semibold">
                    Open Planner <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                
                {blocks.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center rounded-[16px] border border-dashed border-border bg-secondary/50 transition-colors">
                    <p className="text-muted-foreground font-medium">Your day is empty.</p>
                    <Link to="/planner" className="mt-2 text-sm text-accent font-bold hover:underline">Plan your day</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blocks.map(block => (
                      <div key={block.id} className={`flex items-center gap-4 rounded-[16px] border p-4 transition-colors ${block.completed ? 'border-accent bg-accent/5' : 'border-border bg-secondary hover:bg-background'}`}>
                        <button onClick={() => toggleBlockCompletion(block.id, !block.completed)} className="transition-transform active:scale-95">
                          {block.completed ? <CheckCircle2 className="h-6 w-6 text-accent" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold truncate ${block.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{block.title}</h3>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">{block.type} Block</p>
                        </div>
                        <div className="text-sm font-mono font-bold text-muted-foreground">
                          {new Date(block.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Active Projects */}
              <div className="paper-panel rounded-[24px] border border-border p-8 transition-colors duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold flex items-center gap-2 text-foreground">
                    <Target className="h-5 w-5 text-accent" />
                    Active Projects
                  </h2>
                  <Link to="/projects" className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1 font-semibold">
                    View All <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {projects.filter(p => p.status === 'active').slice(0,4).map(project => (
                    <div key={project.id} className="rounded-[16px] border border-border bg-secondary p-5 cursor-pointer hover:bg-background hover:border-accent/50 transition-colors shadow-sm">
                      <h3 className="font-bold text-lg mb-1 truncate text-foreground">{project.name}</h3>
                      <div className="w-full bg-background border border-border rounded-full h-2 mt-4">
                        <div className="bg-accent h-full rounded-full transition-all duration-1000" style={{ width: `${project.healthScore}%` }}></div>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase mt-3 font-bold tracking-wider">Health: {project.healthScore}%</p>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="col-span-2 p-8 text-center text-muted-foreground text-sm font-medium border border-dashed border-border rounded-[16px] bg-secondary/50">No active projects.</div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: AI Recommendations & Habits */}
            <div className="col-span-4 flex flex-col gap-6">
              
              {/* AI Execution Coach */}
              <div className="paper-panel rounded-[24px] border border-border bg-accent/5 p-8 relative overflow-hidden transition-colors duration-500">
                <div className="absolute top-0 right-0 p-3 opacity-[0.03]"><Brain className="h-32 w-32" /></div>
                <h2 className="text-xl font-display font-bold flex items-center gap-2 text-foreground relative z-10 mb-6">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Execution Coach
                </h2>
                <div className="space-y-4 relative z-10">
                  {projects.filter(p => p.status === 'active' && p.healthScore < 50).slice(0, 1).map(p => (
                    <div key={p.id} className="rounded-[16px] bg-background p-5 border border-border shadow-sm">
                      <p className="text-sm text-foreground">Project "{p.name}" has critically low health (<span className="font-bold text-red-500">{p.healthScore}%</span>). Recommend scheduling a Focus block today to regain momentum.</p>
                    </div>
                  ))}
                  {habits.filter(h => h.streak === 0).slice(0, 1).map(h => (
                    <div key={h.id} className="rounded-[16px] bg-background p-5 border border-border shadow-sm">
                      <p className="text-sm text-foreground">You lost your streak for "{h.name}". Rebuild consistency by completing it today.</p>
                    </div>
                  ))}
                  {projects.filter(p => p.status === 'active' && p.healthScore >= 50).length === 0 && habits.filter(h => h.streak === 0).length === 0 && (
                    <div className="rounded-[16px] bg-background p-5 border border-border shadow-sm">
                      <p className="text-sm text-foreground">Your systems are running optimally. No critical execution risks detected right now.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Habits */}
              <div className="paper-panel rounded-[24px] border border-border p-8 flex-1 transition-colors duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold flex items-center gap-2 text-foreground">
                    <Sun className="h-5 w-5 text-accent" />
                    Daily Habits
                  </h2>
                  <Link to="/habits" className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1 font-semibold">
                    Manage <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {habits.map(habit => (
                    <div key={habit.id} className="flex items-center justify-between rounded-[16px] border border-border bg-secondary hover:bg-background transition-colors p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <button className="h-5 w-5 rounded-[6px] border-2 border-border hover:border-accent/50 transition-colors"></button>
                        <span className="text-sm font-semibold text-foreground">{habit.name}</span>
                      </div>
                      <div className="text-xs font-mono font-bold text-muted-foreground bg-background border border-border px-2 py-1 rounded-[6px]">
                        🔥 {habit.streak}
                      </div>
                    </div>
                  ))}
                  {habits.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground text-sm font-medium border border-dashed border-border rounded-[16px] bg-secondary/50">
                      No daily habits yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
      </div>
    </WorkspaceShell>
  );
}
