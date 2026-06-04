import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Brain, Network, Zap, Target, Activity, Flame } from "lucide-react";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import { useNotesStore } from "@/store/notes-store";

export const Route = createFileRoute("/knowledge")({
  component: KnowledgeDashboard,
});

function KnowledgeDashboard() {
  const { notes } = useNotesStore();

  const metrics = useMemo(() => {
    let totalLinks = 0;
    notes.forEach(n => {
      totalLinks += (n.outgoingLinks?.length || 0);
    });

    const words = notes.reduce((acc, note) => acc + note.wordCount, 0);
    
    // Knowledge Score: heavily weights connections
    const connectivityScore = totalLinks > 0 ? (totalLinks / notes.length) * 10 : 0;
    const healthScore = Math.min(Math.round((notes.length * 2) + (connectivityScore * 20)), 100);

    return { totalLinks, words, healthScore };
  }, [notes]);

  return (
    <WorkspaceShell>
      <div className="flex min-w-0 flex-col gap-8">
        <section className="relative overflow-hidden paper-panel rounded-[24px] border border-border p-8 transition-colors duration-500">
          <div className="relative z-10 flex min-w-0 flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Brain className="h-3.5 w-3.5 text-accent" />
                Knowledge Intelligence
              </div>
              <h1 className="mt-6 text-4xl font-display font-bold leading-[1.1] tracking-tight sm:text-5xl text-foreground">
                Second Brain <span className="text-accent italic">Analytics</span>
              </h1>
              <p className="mt-4 text-base text-muted-foreground">
                Track the growth, connectivity, and health of your personal knowledge base.
              </p>
            </div>
            
            <div className="flex shrink-0 items-center justify-center rounded-full border-[8px] border-secondary bg-background h-48 w-48 shadow-xl">
              <div className="text-center">
                <div className="text-5xl font-black text-accent">{metrics.healthScore}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Health Score</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard 
            icon={Network} 
            label="Total Connections" 
            value={metrics.totalLinks.toString()} 
            trend="+12 this week"
            color="text-purple-500"
          />
          <MetricCard 
            icon={Zap} 
            label="Learning Velocity" 
            value={Math.round(metrics.words / 100) + " pts"} 
            trend="Active"
            color="text-cyan-500"
          />
          <MetricCard 
            icon={Flame} 
            label="Knowledge Streak" 
            value="3 Days" 
            trend="Keep it up!"
            color="text-pink-500"
          />
        </section>

        <section className="paper-panel rounded-[24px] border border-border p-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Recent Neural Activity</h2>
          <div className="space-y-4">
            {notes.slice(0, 5).map(note => (
              <div key={note.id} className="flex items-center gap-4 rounded-xl border border-border bg-secondary/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background border border-border">
                  <Activity className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground truncate">{note.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {note.outgoingLinks?.length || 0} connections • {note.wordCount} words
                  </p>
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No recent activity. Capture some notes!
              </div>
            )}
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}

function MetricCard({ icon: Icon, label, value, trend, color }: any) {
  return (
    <div className="paper-panel relative overflow-hidden rounded-[24px] border border-border p-6 transition-colors hover:border-accent">
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-1 rounded-md">{trend}</div>
        </div>
        <h3 className="mt-5 text-3xl font-black text-foreground">{value}</h3>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default KnowledgeDashboard;
