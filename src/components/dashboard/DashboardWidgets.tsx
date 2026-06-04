import { CheckSquare, Clock3, Flame, FileText, Activity, BrainCircuit, Zap, Award } from "lucide-react";
import { motion } from "framer-motion";

export function DailyGoalWidget({ hours, goal }: { hours: number; goal: number }) {
  const percentage = Math.min(100, Math.round((hours / goal) * 100)) || 0;
  return (
    <div className="paper-panel rounded-[24px] border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
          <Clock3 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Daily Focus Goal</h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progress today</p>
        </div>
      </div>
      
      <div className="flex items-end justify-between mb-2">
        <span className="text-3xl font-display font-bold text-foreground">{hours} <span className="text-sm font-medium text-muted-foreground">/ {goal}h</span></span>
        <span className="text-xl font-bold text-accent">{percentage}%</span>
      </div>
      
      <div className="relative h-3 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute h-full rounded-full bg-accent"
        />
      </div>
    </div>
  );
}

export function StreakWidget({ streak }: { streak: number }) {
  return (
    <div className="paper-panel rounded-[24px] border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
          <Flame className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Current Streak</h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Consistency</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-5xl font-display font-bold text-foreground">{streak}</span>
        <span className="text-xl font-bold text-muted-foreground mt-2">Days</span>
      </div>
    </div>
  );
}

export function PriorityTasksWidget({ tasks, onComplete }: { tasks: any[]; onComplete: (id: string) => void }) {
  return (
    <div className="paper-panel rounded-[24px] border border-border p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
          <CheckSquare className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Priority Tasks</h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action items</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.length > 0 ? tasks.map((task) => (
          <div key={task.id} className="group flex items-center justify-between rounded-xl border border-border bg-background p-3 transition-colors hover:border-accent/50">
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={() => onComplete(task.id)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border transition-colors hover:border-accent"
              >
                {task.completed && <CheckSquare className="h-3 w-3 text-accent" />}
              </button>
              <span className={`truncate text-sm font-semibold ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {task.title}
              </span>
            </div>
          </div>
        )) : (
          <div className="py-6 text-center text-sm font-medium text-muted-foreground">
            No priority tasks left today.
          </div>
        )}
      </div>
    </div>
  );
}

export function RecentNotesWidget({ notes, onOpen }: { notes: any[]; onOpen: (id: string) => void }) {
  return (
    <div className="paper-panel rounded-[24px] border border-border p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
          <FileText className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Recent Notes</h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Knowledge capture</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {notes.length > 0 ? notes.map((note) => (
          <button 
            key={note.id}
            onClick={() => onOpen(note.id)}
            className="group flex w-full items-center justify-between rounded-xl border border-border bg-background p-3 text-left transition-colors hover:border-accent/50 hover:bg-secondary/30"
          >
            <div className="min-w-0">
              <span className="truncate block text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                {note.title || "Untitled Note"}
              </span>
              <span className="truncate block text-xs font-medium text-muted-foreground mt-0.5">
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </button>
        )) : (
          <div className="py-6 text-center text-sm font-medium text-muted-foreground">
            No recent notes.
          </div>
        )}
      </div>
    </div>
  );
}

export function IntelligenceWidget({ 
  title, 
  subtitle, 
  score, 
  icon: Icon,
  trend
}: { 
  title: string; 
  subtitle: string; 
  score: string | number; 
  icon: any;
  trend?: 'up' | 'down' | 'flat';
}) {
  return (
    <div className="paper-panel rounded-[24px] border border-border p-6 h-full flex flex-col justify-between transition-transform hover:scale-[1.02]">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <span className="text-5xl font-display font-bold text-foreground">{score}</span>
        {trend && (
          <span className={`text-sm font-bold ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
            {trend === 'up' ? '↑ Rising' : trend === 'down' ? '↓ Falling' : '→ Stable'}
          </span>
        )}
      </div>
    </div>
  );
}

export function MilestonesWidget({ milestones }: { milestones: any[] }) {
  return (
    <div className="paper-panel rounded-[24px] border border-border p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
          <Award className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Milestones</h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Achievements unlocked</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {milestones.length > 0 ? milestones.slice(0, 3).map((m: any) => (
          <div key={m.id} className="group flex items-center justify-between rounded-xl border border-border bg-background p-3 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl">{m.icon}</span>
              <div>
                <span className="block text-sm font-bold text-foreground">{m.title}</span>
                <span className="block text-xs font-medium text-muted-foreground">{m.description}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-6 text-center text-sm font-medium text-muted-foreground">
            Complete sessions to unlock milestones.
          </div>
        )}
      </div>
    </div>
  );
}
