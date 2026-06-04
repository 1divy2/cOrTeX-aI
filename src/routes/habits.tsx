import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import { useExecutionStore } from "@/store/execution-store";
import { Sun, Plus, Flame, Check } from "lucide-react";

export const Route = createFileRoute("/habits")({
  component: HabitsPage,
});

function HabitsPage() {
  const { habits, addHabit, logHabit, fetchExecutionData } = useExecutionStore();
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchExecutionData();
  }, []);

  const handleAdd = () => {
    if (newTitle.trim()) {
      addHabit(newTitle.trim(), "daily", null);
      setNewTitle("");
      setShowNew(false);
    }
  };

  // Generate fake last 7 days for the heatmap grid
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  });

  return (
    <WorkspaceShell>
      <div className="mx-auto w-full max-w-5xl p-8 flex flex-col flex-1 text-white selection:bg-purple-500/30">
        <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                <Sun className="h-10 w-10 text-pink-400" /> Habits & Routines
              </h1>
              <p className="text-zinc-400 mt-2">Build consistency through daily and weekly tracking.</p>
            </div>
            <button 
              onClick={() => setShowNew(true)}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" /> New Habit
            </button>
          </div>

          {showNew && (
            <div className="mb-8 rounded-2xl border border-pink-500/30 bg-pink-500/5 p-6 backdrop-blur-md">
              <h3 className="mb-4 text-lg font-bold text-pink-400">Create New Habit</h3>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="E.g., Read 10 pages..."
                  className="flex-1 rounded-xl bg-black/50 border border-white/10 px-4 py-2 outline-none focus:border-pink-500 transition-colors"
                  autoFocus
                />
                <button onClick={handleAdd} className="bg-pink-500 text-black px-6 font-bold rounded-xl hover:bg-pink-400">Create</button>
                <button onClick={() => setShowNew(false)} className="bg-white/10 px-6 font-bold rounded-xl hover:bg-white/20">Cancel</button>
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-4 font-semibold text-zinc-400 text-sm">Habit</th>
                  <th className="p-4 font-semibold text-zinc-400 text-sm text-center">Streak</th>
                  {last7Days.map(day => (
                    <th key={day} className="p-4 font-semibold text-zinc-500 text-xs text-center uppercase tracking-wider">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map((habit, index) => (
                  <tr key={habit.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{habit.name}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">Daily</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-400 px-2 py-1 rounded-md text-xs font-mono font-bold border border-orange-500/20">
                        <Flame className="h-3 w-3" /> {habit.streak}
                      </div>
                    </td>
                    {last7Days.map((_, i) => {
                      const isToday = i === 6;
                      const dateObj = new Date();
                      dateObj.setDate(dateObj.getDate() - (6 - i));
                      const dateStr = dateObj.toISOString().split('T')[0];
                      
                      // Check if habit was completed on this date
                      const log = useExecutionStore.getState().habitLogs?.find(l => l.habitId === habit.id && l.date === dateStr);
                      const isCompleted = log?.completed;
                      
                      return (
                        <td key={i} className="p-4 text-center">
                          {isToday ? (
                            <button 
                              onClick={() => logHabit(habit.id, !isCompleted)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors mx-auto ${isCompleted ? 'bg-pink-500 border-pink-500' : 'border border-white/20 hover:bg-white/10'}`}
                            >
                              <Check className={`h-4 w-4 ${isCompleted ? 'text-black opacity-100' : 'text-zinc-600 opacity-0 hover:opacity-100'}`} />
                            </button>
                          ) : (
                            <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center ${isCompleted ? 'bg-pink-500/20 border border-pink-500/30' : 'bg-white/5 border border-white/5'}`}>
                              {isCompleted && <Check className="h-4 w-4 text-pink-400" />}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {habits.length === 0 && !showNew && (
               <div className="p-12 text-center text-zinc-500">No habits tracked yet. Start building consistency!</div>
            )}
          </div>
      </div>
    </WorkspaceShell>
  );
}
