import { createFileRoute } from "@tanstack/react-router";
import { Brain, Flame, Sparkles, TrendingUp, Orbit, BarChart3, Gauge, Target, Clock3, Activity, Zap, CalendarDays, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie } from "recharts";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";

import { useNotesStore } from "@/store/notes-store";
import { generateInsights } from "@/lib/analytics-insights";
import { useFocusStore } from "@/store/focus-store";
import { generateAnalytics } from "@/lib/analytics-engine";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useExecutionStore } from "@/store/execution-store";
import { useEffect } from "react";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
});

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function AnalyticsPage() {
  const notesStore = useNotesStore();
  const notes = notesStore?.notes || [];

  const { sessions } = useFocusStore();
  const { fetchExecutionData, habitLogs, projects } = useExecutionStore();
  const { sidebarCollapsed } = useWorkspaceStore();

  useEffect(() => {
    fetchExecutionData();
  }, []);

  const analytics = generateAnalytics(sessions, notes, habitLogs, []);

  const aiInsights = generateInsights({
    sessions,
    analytics,
    notesCount: notes.length,
  });

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <WorkspaceSidebar />

      <motion.main
        animate={{ paddingLeft: sidebarCollapsed ? 96 : 280 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-1 overflow-y-auto"
      >
        <WorkspaceHeader />

        <div className="relative z-10 mx-auto max-w-[1400px] px-8 pb-24 pt-28 space-y-16">
          
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-accent" />
              Intelligence Core
            </div>
            <h1 className="mt-6 text-6xl font-display font-bold leading-[0.9] tracking-tight text-foreground">
              Analytics <span className="italic text-accent">Command</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              A comprehensive, real-time intelligence report generated from your actual productivity patterns, focus sessions, and knowledge nodes.
            </p>
          </div>

          {/* SECTION 1 - EXECUTIVE SUMMARY */}
          <section className="space-y-6">
            <SectionHeader title="Executive Summary" desc="Your cognitive state and performance overview." />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ExecutiveMetric label="Productivity Score" value={`${analytics.productivityScore}%`} trend={+2.4} icon={Target} />
              <ExecutiveMetric label="Deep Work Hours" value={`${analytics.totalFocusHours}h`} trend={+1.1} icon={Clock3} />
              <ExecutiveMetric label="Momentum" value={`${analytics.momentum}%`} trend={+5.2} icon={Gauge} />
              <ExecutiveMetric label="Consistency" value={`${analytics.consistencyScore}%`} trend={-1.5} icon={Activity} />
            </div>
          </section>

          {/* SECTION 2 - MOMENTUM ENGINE */}
          <section className="space-y-6">
            <SectionHeader title="Momentum Engine" desc="Daily velocity and cognitive momentum shifts." />
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="paper-panel rounded-[24px] border border-border p-8">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="font-bold text-foreground">Velocity Trend</h3>
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.weeklyTrend} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 }} dy={10} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="var(--accent)" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorHours)" 
                        activeDot={{ r: 6, fill: "var(--background)", stroke: "var(--accent)", strokeWidth: 2 }} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="paper-panel rounded-[24px] border border-border p-8 bg-accent/5 relative overflow-hidden">
                <div className="relative z-10 flex flex-col h-full justify-center">
                  <h3 className="text-xl font-bold text-foreground mb-4">Momentum Shift</h3>
                  <p className="text-4xl font-display font-black text-accent">{analytics.momentum > 70 ? 'Accelerating' : analytics.momentum > 40 ? 'Stable' : 'Decelerating'}</p>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    Based on your recent focus history and completion rates, your momentum is {analytics.momentum > 70 ? 'building rapidly. Keep this pace up to reach peak flow.' : 'currently stabilizing. Try a 25-minute focus block to regain velocity.'}
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10">
                  <Gauge className="w-64 h-64 text-accent" />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3 - CONSISTENCY LAB */}
          <section className="space-y-6">
            <SectionHeader title="Consistency Lab" desc="Deep work reliability over the last 20 weeks." />
            <div className="paper-panel rounded-[24px] border border-border p-8">
               <ConsistencyHeatmap data={analytics.heatmap} />
            </div>
          </section>

          {/* SECTION 4 - DEEP WORK ANALYSIS */}
          <section className="space-y-6">
            <SectionHeader title="Deep Work Analysis" desc="Session duration, quality, and focus distribution." />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="paper-panel rounded-[24px] border border-border p-8">
                <h3 className="font-bold text-foreground mb-6">Focus Distribution</h3>
                <div className="h-[200px]">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Morning', value: analytics.focusDistribution.morning },
                          { name: 'Afternoon', value: analytics.focusDistribution.afternoon },
                          { name: 'Evening', value: analytics.focusDistribution.evening },
                          { name: 'Night', value: analytics.focusDistribution.night },
                        ]}
                        cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={4}
                      >
                        <Cell fill="var(--accent)" />
                        <Cell fill="var(--foreground)" />
                        <Cell fill="var(--muted)" />
                        <Cell fill="var(--border)" />
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold uppercase text-muted-foreground">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent" /> Morning</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-foreground" /> Afternoon</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-muted" /> Evening</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-border" /> Night</div>
                </div>
              </div>
              <div className="lg:col-span-2 paper-panel rounded-[24px] border border-border p-8">
                 <h3 className="font-bold text-foreground mb-6">Peak Productivity Window</h3>
                 <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.peakHoursMap} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tickFormatter={(h) => `${h}:00`} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} dy={10} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--secondary)', opacity: 0.5 }} />
                        <Bar 
                          dataKey="sessions" 
                          fill="var(--foreground)" 
                          radius={[6, 6, 0, 0]} 
                          activeBar={{ fill: 'var(--accent)', stroke: 'var(--accent)' }} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
            </div>
          </section>

          {/* SECTION 5 - PRODUCTIVITY TIMELINE */}
          <section className="space-y-6">
            <SectionHeader title="Productivity Timeline" desc="The chronological story of your deep work, notes, and habits." />
            <div className="paper-panel rounded-[24px] border border-border p-8 max-h-[500px] overflow-y-auto custom-scrollbar">
               <div className="relative border-l-2 border-border ml-4 space-y-8 pb-4">
                  {analytics.timeline.length === 0 ? (
                    <div className="pl-8 text-muted-foreground">No activity recorded yet. Start a focus session!</div>
                  ) : (
                    analytics.timeline.map((event, idx) => (
                      <div key={`${event.id}-${idx}`} className="relative pl-8">
                        <div className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full border-[3px] border-background ${event.type === 'session' ? 'bg-accent shadow-[0_0_8px_var(--accent)] shadow-accent/40' : event.type === 'note' ? 'bg-foreground' : 'bg-muted'}`} />
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                          <h4 className="text-lg font-bold text-foreground">{event.title}</h4>
                          {event.type === 'session' && (
                            <p className="text-sm font-medium text-muted-foreground">Duration: <span className="text-foreground">{Math.round(event.metadata.duration / 60)} mins</span> • Quality: <span className="text-foreground">{event.metadata.rating}/8</span></p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </section>

          {/* SECTION 6 - KNOWLEDGE ANALYTICS */}
          <section className="space-y-6">
            <SectionHeader title="Knowledge Analytics" desc="How your focus impacts your learning velocity." />
             <div className="grid gap-6 lg:grid-cols-3">
               <ExecutiveMetric label="Total Notes" value={notes.length} icon={Brain} trend={0} />
               <div className="lg:col-span-2 paper-panel rounded-[24px] border border-border p-8 bg-secondary/50 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-foreground">Learning Velocity</h3>
                  <p className="mt-2 text-muted-foreground">
                    You have generated {notes.length} knowledge nodes resulting from {analytics.totalSessions} focus sessions. This translates to an active cognitive synthesis rate of {(notes.length / Math.max(analytics.totalSessions, 1)).toFixed(2)} notes per session.
                  </p>
               </div>
             </div>
          </section>

          {/* SECTION 7 - STRATEGIC INSIGHTS */}
          <section className="space-y-6">
             <SectionHeader title="Strategic Insights" desc="Actionable, evidence-based AI observations." />
             <div className="grid gap-6 lg:grid-cols-2">
                {aiInsights.length === 0 && (
                  <div className="col-span-2 p-12 text-center border border-border rounded-[24px]">
                    <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
                    <p className="text-muted-foreground">Generating intelligence... (Complete more sessions for deeper insights)</p>
                  </div>
                )}
                {aiInsights.map((insight: any, index: number) => (
                  <div key={index} className="rounded-[24px] border border-border bg-background p-8 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-display font-bold text-foreground">{insight.title}</h3>
                      <div className="flex items-center justify-center rounded-lg bg-secondary p-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{insight.description}</p>
                  </div>
                ))}
             </div>
          </section>

        </div>
      </motion.main>
    </div>
  );
}

function SectionHeader({ title, desc }: { title: string, desc: string }) {
  return (
    <div>
      <h2 className="text-3xl font-display font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}

function ExecutiveMetric({ label, value, trend, icon: Icon }: any) {
  return (
    <div className="rounded-[24px] border border-border bg-background p-6 transition-colors paper-panel">
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        {trend !== 0 && (
          <div className={`px-2 py-1 rounded-md text-xs font-bold ${trend > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <h3 className="mt-1 text-3xl font-display font-bold text-foreground">{value}</h3>
    </div>
  );
}

function ConsistencyHeatmap({ data }: { data: any[] }) {
  const weeks = 36;
  const today = new Date();
  const startOffset = today.getDay();
  const totalDays = (weeks * 7) + startOffset;

  const cells: { date: string; value: number; minutes: number; notes: number }[] = [];

  for (let i = totalDays; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const key = date.toISOString().split("T")[0];
    const match = data.find((d) => d.date === key);
    cells.push({
      date: key,
      value: match?.sessions || 0,
      minutes: match?.minutes || 0,
      notes: match?.notes || 0,
    });
  }

  const intensity = (value: number) => {
    if (value === 0) return "bg-secondary/50 border-border/30";
    if (value === 1) return "bg-accent/30 border-accent/20";
    if (value === 2) return "bg-accent/60 border-accent/50";
    if (value >= 3) return "bg-accent border-accent shadow-[0_0_8px_var(--accent)] shadow-accent/20";
    return "bg-foreground border-foreground shadow-[0_0_12px_var(--foreground)] shadow-foreground/20";
  };

  const numCols = Math.ceil(cells.length / 7);

  const monthLabels: { label: string; colIndex: number }[] = [];
  let currentMonth = -1;
  for (let c = 0; c < numCols; c++) {
    const firstDayOfCol = cells[c * 7];
    if (firstDayOfCol) {
      const month = new Date(firstDayOfCol.date).getMonth();
      if (month !== currentMonth) {
        monthLabels.push({
          label: new Date(firstDayOfCol.date).toLocaleString("default", { month: "short" }),
          colIndex: c,
        });
        currentMonth = month;
      }
    }
  }

  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-4">
      <div className="min-w-max flex flex-col gap-2">
        <div className="flex relative h-4 text-[10px] font-bold text-muted-foreground ml-8">
          {monthLabels.map((m, i) => (
            <div key={i} className="absolute top-0" style={{ left: `${m.colIndex * 18}px` }}>
              {m.label}
            </div>
          ))}
        </div>

        <div className="flex gap-[4px]">
          <div className="flex flex-col gap-[4px] pr-2 text-[9px] font-bold text-muted-foreground justify-between py-1">
            <div className="h-[14px] leading-[14px]">Sun</div>
            <div className="h-[14px] leading-[14px]"></div>
            <div className="h-[14px] leading-[14px]">Tue</div>
            <div className="h-[14px] leading-[14px]"></div>
            <div className="h-[14px] leading-[14px]">Thu</div>
            <div className="h-[14px] leading-[14px]"></div>
            <div className="h-[14px] leading-[14px]">Sat</div>
          </div>

          {Array.from({ length: numCols }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-[4px]">
              {Array.from({ length: 7 }).map((__, rowIndex) => {
                const cell = cells[colIndex * 7 + rowIndex];
                if (!cell) return <div key={rowIndex} className="h-[14px] w-[14px]" />;

                return (
                  <div key={cell.date} className="group relative">
                    <div
                      className={`h-[14px] w-[14px] rounded-[4px] border transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-foreground/50 hover:scale-110 z-10 ${intensity(
                        cell.value
                      )}`}
                    />
                    <div className="pointer-events-none absolute bottom-[150%] left-1/2 z-50 hidden min-w-[160px] -translate-x-1/2 rounded-xl border border-border bg-background/95 backdrop-blur-md px-3 py-2.5 text-xs text-foreground shadow-xl group-hover:block whitespace-nowrap">
                      <p className="font-bold text-foreground mb-2 pb-2 border-b border-border">
                        {new Date(cell.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-muted-foreground">Focus Sessions</span>
                        <span className="font-bold">{cell.value}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-muted-foreground">Deep Work</span>
                        <span className="font-bold">{cell.minutes}m</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Knowledge Notes</span>
                        <span className="font-bold">{cell.notes}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-background/95 backdrop-blur-md p-4 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{label || payload[0].name || payload[0].payload.name}</p>
        <p className="text-2xl font-display font-bold text-foreground">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default AnalyticsPage;