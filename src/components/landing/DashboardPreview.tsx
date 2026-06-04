import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  Clock,
  FileText,
  Sparkles,
  Target,
  Zap,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

export function DashboardPreview() {
  return (
    <div className="relative mx-auto -mt-40 max-w-7xl px-6">
      <div className="relative overflow-hidden rounded-[32px] border border-border bg-background p-3 shadow-2xl">
        <div className="overflow-hidden rounded-[24px] border border-border bg-background">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full border border-border bg-background" />
              <div className="h-2.5 w-2.5 rounded-full border border-border bg-background" />
              <div className="h-2.5 w-2.5 rounded-full border border-border bg-background" />
            </div>
            <div className="mx-auto font-mono text-xs font-medium text-muted-foreground">
              cortex.ai / workspace / deep-work
            </div>
          </div>

          <div className="grid min-h-[640px] grid-cols-12">
            <aside className="col-span-3 flex flex-col justify-between border-r border-border bg-secondary/30 p-4 text-sm">
              <div className="space-y-1">
                <SidebarItem
                  icon={<Brain className="h-3.5 w-3.5" />}
                  label="Dashboard"
                  active
                />
                <SidebarItem
                  icon={<FileText className="h-3.5 w-3.5" />}
                  label="Notes"
                  badge="24"
                />
                <SidebarItem
                  icon={<Target className="h-3.5 w-3.5" />}
                  label="Tasks"
                  badge="7"
                />
                <SidebarItem
                  icon={<Clock className="h-3.5 w-3.5" />}
                  label="Focus"
                />
                <SidebarItem
                  icon={<Activity className="h-3.5 w-3.5" />}
                  label="Analytics"
                />
                <SidebarItem
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  label="AI Assistant"
                />
              </div>

              <div className="rounded-[16px] border border-border bg-background p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <div className="text-xs font-bold text-foreground">
                    AI Insight
                  </div>
                </div>
                <p className="mt-3 text-xs font-medium leading-relaxed text-muted-foreground">
                  Your focus performance increased
                  by 18% this week. Morning sessions
                  are producing your highest output.
                </p>
              </div>
            </aside>

            <main className="col-span-9 space-y-5 p-6 bg-background">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Saturday · May 23
                  </div>
                  <h3 className="mt-1 font-display text-4xl font-bold tracking-tight text-foreground">
                    Good afternoon, Alex.
                  </h3>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-bold text-foreground">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                  Focus session · 42:18
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <StatCard label="Deep work" value="4.2h" trend="+18%" />
                <StatCard label="Productivity" value="87%" trend="+4%" />
                <StatCard label="Streak" value="12 days" trend="best yet" />
                <StatCard label="Tasks done" value="18" trend="+7 today" />
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-3 rounded-[24px] border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Focus this week
                    </div>
                    <div className="text-xs font-bold text-accent">
                      +23%
                    </div>
                  </div>
                  <div className="mt-5">
                    <Sparkline />
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] font-bold text-muted-foreground">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <span key={i}>{d}</span>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 rounded-[24px] border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      AI suggestion
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground">
                    You focus best between{" "}
                    <span className="font-bold text-foreground">
                      9–11 AM
                    </span>
                    . Schedule research review
                    sessions during that period
                    for maximum retention.
                  </p>

                  <div className="mt-6 flex items-center gap-2 rounded-[16px] border border-border bg-secondary p-3">
                    <MessageSquare className="h-4 w-4 text-foreground" />
                    <div className="text-xs font-medium text-muted-foreground">
                      AI generated a smarter task schedule
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[24px] border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-foreground">
                      Today's Tasks
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      4 completed
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      "Finish AI research notes",
                      "Complete analytics redesign",
                      "Review productivity streak",
                    ].map((task) => (
                      <div
                        key={task}
                        className="flex items-center gap-3 rounded-[16px] border border-border bg-secondary px-3 py-2"
                      >
                        <CheckCircle2 className="h-4 w-4 text-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-border bg-background p-5 shadow-sm">
                  <div className="text-sm font-bold text-foreground">
                    Neural Activity
                  </div>
                  <div className="mt-5 flex h-[180px] items-end gap-2">
                    {[42, 55, 38, 76, 62, 90, 70].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        className="flex-1 rounded-t-lg bg-foreground"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-6 right-6 flex items-center gap-2 rounded-full border border-border bg-background py-2 pl-2 pr-4 shadow-lg"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
          <Clock className="h-3.5 w-3.5" />
        </div>
        <span className="font-mono text-sm font-bold text-foreground">
          42:18
        </span>
      </motion.div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  badge,
}: {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`flex cursor-default items-center justify-between rounded-[12px] px-3 py-2 transition-all ${
        active
          ? "bg-secondary text-foreground font-bold"
          : "text-muted-foreground hover:bg-secondary font-medium"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      {badge && (
        <span className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
          {badge}
        </span>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-border bg-secondary p-4 transition-colors hover:border-foreground hover:bg-background shadow-sm">
      <div className="relative">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 font-display text-2xl font-bold text-foreground">
          {value}
        </div>
        <div className="mt-1 text-[10px] font-bold text-accent">
          {trend}
        </div>
      </div>
    </div>
  );
}

function Sparkline() {
  const points = [12, 28, 18, 36, 30, 52, 44];
  const max = 60;

  return (
    <div className="flex h-28 items-end gap-1.5">
      {points.map((p, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(p / max) * 100}%` }}
          transition={{
            delay: 0.8 + i * 0.08,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex-1 rounded-t-md bg-foreground"
        />
      ))}
    </div>
  );
}