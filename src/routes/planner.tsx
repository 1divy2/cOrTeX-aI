import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import { useCalendarStore, TimeBlockType } from "@/store/calendar-store";
import { motion } from "framer-motion";
import { Clock, Plus, Calendar as CalendarIcon, CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
});

function PlannerPage() {
  const { blocks, fetchBlocks, addBlock, toggleBlockCompletion } = useCalendarStore();
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchBlocks(currentDate, currentDate);
  }, [currentDate]);

  const handleAddBlock = (type: TimeBlockType) => {
    const now = new Date();
    // Default 1 hour block
    addBlock({
      title: `New ${type} session`,
      type,
      startTime: now.getTime(),
      endTime: now.getTime() + 3600000,
      date: currentDate,
      linkedTaskId: null,
      linkedProjectId: null
    });
  };

  return (
    <WorkspaceShell>
      <div className="mx-auto w-full max-w-5xl p-8 flex flex-col flex-1 text-foreground selection:bg-accent/30">
        <div className="mb-10 flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-display font-black tracking-tight">Daily Planner</h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> {new Date(currentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2">
              <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 flex-1">
            {/* Time Blocking Column */}
            <div className="col-span-8 flex flex-col h-full paper-panel rounded-[24px] border border-border p-8 transition-colors duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold flex items-center gap-2 text-foreground">
                  <Clock className="h-5 w-5 text-accent" />
                  Time Blocks
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => handleAddBlock('focus')} className="bg-accent/10 text-accent hover:bg-accent/20 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"><Plus className="h-3 w-3"/> Focus</button>
                  <button onClick={() => handleAddBlock('work')} className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"><Plus className="h-3 w-3"/> Work</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {blocks.length === 0 ? (
                  <div className="flex h-64 flex-col items-center justify-center rounded-[16px] border border-dashed border-border text-center bg-secondary/50">
                    <p className="text-muted-foreground mb-4">No time blocks scheduled for this day.</p>
                  </div>
                ) : (
                  blocks.map(block => (
                    <div key={block.id} className={`flex items-center gap-4 rounded-[16px] border p-4 transition-colors ${block.completed ? 'border-accent bg-accent/5' : 'border-border bg-secondary hover:bg-background'}`}>
                      <button onClick={() => toggleBlockCompletion(block.id, !block.completed)}>
                        {block.completed ? <CheckCircle2 className="h-6 w-6 text-accent" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                      </button>
                      <div className="flex-1">
                        <input 
                          type="text" 
                          defaultValue={block.title} 
                          className={`bg-transparent outline-none w-full font-semibold ${block.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-[6px] ${
                            block.type === 'focus' ? 'bg-accent/20 text-accent' : 
                            block.type === 'work' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                          }`}>{block.type}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <input type="time" defaultValue={new Date(block.startTime).toTimeString().slice(0,5)} className="bg-transparent text-sm font-mono text-muted-foreground outline-none w-20 text-right" />
                        <span className="text-xs text-muted-foreground/60">to</span>
                        <input type="time" defaultValue={new Date(block.endTime).toTimeString().slice(0,5)} className="bg-transparent text-sm font-mono text-muted-foreground outline-none w-20 text-right" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Task Inbox Column */}
            <div className="col-span-4 rounded-[24px] paper-panel border border-border bg-secondary/30 p-8 transition-colors duration-500">
              <h2 className="text-xl font-display font-bold mb-4 text-foreground">Task Inbox</h2>
              <p className="text-xs text-muted-foreground mb-6 font-medium">Drag tasks here to schedule them.</p>
              
              <div className="space-y-3">
                <div className="p-4 border border-dashed border-border rounded-[16px] text-sm font-medium text-muted-foreground text-center opacity-70 cursor-move bg-background/50">
                  Example Task A
                </div>
                <div className="p-4 border border-dashed border-border rounded-[16px] text-sm font-medium text-muted-foreground text-center opacity-70 cursor-move bg-background/50">
                  Example Task B
                </div>
              </div>
            </div>

          </div>
      </div>
    </WorkspaceShell>
  );
}
