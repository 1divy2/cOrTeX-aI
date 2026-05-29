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

      <div className="absolute -inset-4 rounded-[2rem] bg-aurora opacity-30 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(10,10,18,0.82)] p-3 shadow-[0_0_80px_rgba(168,85,247,0.12)] backdrop-blur-3xl">

        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[oklch(0.11_0.02_280)]">

          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">

            <div className="flex gap-1.5">

              <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />

              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />

              <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />

            </div>

            <div className="mx-auto font-mono text-xs text-muted-foreground">

              cortex.ai / workspace / deep-work

            </div>

          </div>

          <div className="grid min-h-[640px] grid-cols-12">

            <aside className="col-span-3 flex flex-col justify-between border-r border-white/5 p-4 text-sm">

              <div className="space-y-1">

                <SidebarItem
                  icon={
                    <Brain className="h-3.5 w-3.5" />
                  }
                  label="Dashboard"
                  active
                />

                <SidebarItem
                  icon={
                    <FileText className="h-3.5 w-3.5" />
                  }
                  label="Notes"
                  badge="24"
                />

                <SidebarItem
                  icon={
                    <Target className="h-3.5 w-3.5" />
                  }
                  label="Tasks"
                  badge="7"
                />

                <SidebarItem
                  icon={
                    <Clock className="h-3.5 w-3.5" />
                  }
                  label="Focus"
                />

                <SidebarItem
                  icon={
                    <Activity className="h-3.5 w-3.5" />
                  }
                  label="Analytics"
                />

                <SidebarItem
                  icon={
                    <Sparkles className="h-3.5 w-3.5" />
                  }
                  label="AI Assistant"
                />

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                <div className="flex items-center gap-2">

                  <Zap className="h-4 w-4 text-[var(--cyan)]" />

                  <div className="text-xs font-medium">

                    AI Insight

                  </div>

                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">

                  Your focus performance increased
                  by 18% this week. Morning sessions
                  are producing your highest output.

                </p>

              </div>

            </aside>

            <main className="col-span-9 space-y-5 p-6">

              <div className="flex items-end justify-between">

                <div>

                  <div className="text-xs text-muted-foreground">

                    Saturday · May 23

                  </div>

                  <h3 className="mt-1 font-display text-4xl font-semibold tracking-[-0.03em]">

                    Good afternoon, Alex.

                  </h3>

                </div>

                <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs">

                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />

                  Focus session · 42:18

                </div>

              </div>

              <div className="grid grid-cols-4 gap-3">

                <StatCard
                  label="Deep work"
                  value="4.2h"
                  trend="+18%"
                  tone="violet"
                />

                <StatCard
                  label="Productivity"
                  value="87%"
                  trend="+4%"
                  tone="cyan"
                />

                <StatCard
                  label="Streak"
                  value="12 days"
                  trend="best yet"
                  tone="pink"
                />

                <StatCard
                  label="Tasks done"
                  value="18"
                  trend="+7 today"
                  tone="cyan"
                />

              </div>

              <div className="grid grid-cols-5 gap-3">

                <div className="col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <div className="flex items-center justify-between">

                    <div className="text-xs text-muted-foreground">

                      Focus this week

                    </div>

                    <div className="text-xs text-[var(--cyan)]">

                      +23%

                    </div>

                  </div>

                  <div className="mt-5">

                    <Sparkline />

                  </div>

                  <div className="mt-3 flex justify-between text-[10px] text-muted-foreground/70">

                    {[
                      "M",
                      "T",
                      "W",
                      "T",
                      "F",
                      "S",
                      "S",
                    ].map((d, i) => (
                      <span key={i}>
                        {d}
                      </span>
                    ))}

                  </div>

                </div>

                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <div className="flex items-center gap-2">

                    <Sparkles className="h-4 w-4 text-[var(--violet)]" />

                    <div className="text-xs text-muted-foreground">

                      AI suggestion

                    </div>

                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">

                    You focus best between{" "}

                    <span className="font-medium text-foreground">

                      9–11 AM

                    </span>

                    . Schedule research review
                    sessions during that period
                    for maximum retention.

                  </p>

                  <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-3">

                    <MessageSquare className="h-4 w-4 text-cyan-300" />

                    <div className="text-xs text-muted-foreground">

                      AI generated a smarter task schedule

                    </div>

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <div className="flex items-center justify-between">

                    <div className="text-sm font-medium">

                      Today's Tasks

                    </div>

                    <div className="text-xs text-muted-foreground">

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
                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2"
                      >

                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />

                        <span className="text-sm text-muted-foreground">

                          {task}

                        </span>

                      </div>
                    ))}

                  </div>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <div className="text-sm font-medium">

                    Neural Activity

                  </div>

                  <div className="mt-5 flex h-[180px] items-end gap-2">

                    {[42, 55, 38, 76, 62, 90, 70].map(
                      (h, i) => (
                        <motion.div
                          key={i}
                          initial={{
                            height: 0,
                          }}
                          animate={{
                            height: `${h}%`,
                          }}
                          transition={{
                            delay: i * 0.08,
                            duration: 0.5,
                          }}
                          className="flex-1 rounded-xl bg-gradient-to-t from-fuchsia-500 via-pink-400 to-cyan-300 opacity-80"
                        />
                      )
                    )}

                  </div>

                </div>

              </div>

            </main>

          </div>

        </div>

      </div>

      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-6 right-6 flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(10,10,18,0.9)] py-2 pl-2 pr-4 shadow-[0_0_50px_rgba(34,211,238,0.25)] backdrop-blur-2xl"
      >

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-aurora">

          <Clock className="h-3.5 w-3.5 text-background" />

        </div>

        <span className="font-mono text-sm">

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
      className={`flex cursor-default items-center justify-between rounded-xl px-3 py-2 transition-all ${
        active
          ? "bg-white/8 text-foreground"
          : "text-muted-foreground hover:bg-white/[0.03]"
      }`}
    >

      <div className="flex items-center gap-2.5">

        {icon}

        <span className="text-xs">

          {label}

        </span>

      </div>

      {badge && (
        <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-muted-foreground/70">

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
  tone,
}: {
  label: string;
  value: string;
  trend: string;
  tone: "violet" | "cyan" | "pink";
}) {
  const color =
    tone === "violet"
      ? "var(--violet)"
      : tone === "cyan"
      ? "var(--cyan)"
      : "var(--pink)";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4">

      <div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-40 blur-3xl"
        style={{
          background: color,
        }}
      />

      <div className="relative">

        <div className="text-xs text-muted-foreground">

          {label}

        </div>

        <div className="mt-1 font-display text-2xl font-semibold">

          {value}

        </div>

        <div
          className="mt-1 text-[10px]"
          style={{
            color,
          }}
        >

          {trend}

        </div>

      </div>

    </div>
  );
}

function Sparkline() {
  const points = [
    12,
    28,
    18,
    36,
    30,
    52,
    44,
  ];

  const max = 60;

  return (
    <div className="flex h-28 items-end gap-1.5">

      {points.map((p, i) => (
        <motion.div
          key={i}
          initial={{
            height: 0,
          }}
          animate={{
            height: `${(p / max) * 100}%`,
          }}
          transition={{
            delay: 0.8 + i * 0.08,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex-1 rounded-md bg-aurora opacity-80"
        />
      ))}

    </div>
  );
}