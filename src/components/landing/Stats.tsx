import { motion } from "framer-motion";

import {
  Brain,
  Clock3,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  Activity,
  CheckCircle2,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEYS = {
  notes: "cortex-notes",
  tasks: "cortex-tasks",
  focus: "cortex-focus-sessions",
  ai: "cortex-ai-actions",
};

type StatCard = {
  icon: any;
  value: string;
  label: string;
};

type MiniStat = {
  icon: any;
  label: string;
  value: string;
};

export function Stats() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [miniStats, setMiniStats] = useState<MiniStat[]>([]);

  const productivity = useMemo(() => {
    const completed = Number(miniStats.find((item) => item.label === "Tasks completed")?.value || 0);
    const notes = Number(miniStats.find((item) => item.label === "Notes created")?.value || 0);

    if (completed === 0 && notes === 0) {
      return "0%";
    }

    const score = Math.min(100, Math.floor(completed * 2 + notes * 1.5));
    return `${score}%`;
  }, [miniStats]);

  useEffect(() => {
    const getArray = (key: string) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        return JSON.parse(raw);
      } catch {
        return [];
      }
    };

    const notes = getArray(STORAGE_KEYS.notes);
    const tasks = getArray(STORAGE_KEYS.tasks);
    const focus = getArray(STORAGE_KEYS.focus);
    const aiActions = getArray(STORAGE_KEYS.ai);

    const completedTasks = tasks.filter((task: any) => task.completed === true).length;

    const focusHours = (
      focus.reduce((acc: number, session: any) => acc + (session.duration || 0), 0) / 60
    ).toFixed(1);

    setStats([
      {
        icon: Brain,
        value: `${aiActions.length}`,
        label: "Workflows executed",
      },
      {
        icon: Clock3,
        value: `${focusHours}h`,
        label: "Deep work hours tracked",
      },
      {
        icon: Target,
        value: productivity,
        label: "Average productivity boost",
      },
      {
        icon: CheckCircle2,
        value: `${completedTasks}`,
        label: "Tasks completed",
      },
    ]);

    setMiniStats([
      {
        icon: Activity,
        label: "Live focus sessions",
        value: `${focus.length}`,
      },
      {
        icon: Sparkles,
        label: "Notes created",
        value: `${notes.length}`,
      },
      {
        icon: TrendingUp,
        label: "Tasks completed",
        value: `${completedTasks}`,
      },
      {
        icon: Zap,
        label: "Commands executed",
        value: `${aiActions.length}`,
      },
    ]);
  }, [productivity]);

  return (
    <section id="analytics" className="relative overflow-hidden px-6 py-32 bg-background">
      <div className="absolute inset-0 opacity-[0.4] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:70px_70px]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Real-time productivity metrics
          </div>

          <h2 className="text-5xl font-display font-bold tracking-tight text-foreground md:text-6xl">
            Built for modern
            <span className="italic text-accent">
              {" "}deep work
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-[1.9] text-muted-foreground">
            corTeX dynamically tracks your
            productivity, focus sessions, notes,
            and task execution directly
            from your workspace activity.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group paper-panel relative overflow-hidden rounded-[24px] border border-border bg-background p-7 transition-all duration-500 hover:-translate-y-2 hover:border-foreground hover:shadow-md"
            >
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-border bg-secondary transition-colors group-hover:bg-foreground group-hover:text-background">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="mt-8 text-5xl font-bold tracking-tight text-foreground">
                  {item.value}
                </div>
                <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="paper-panel mt-16 overflow-hidden rounded-[32px] border border-border bg-background p-8 shadow-sm"
        >
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-accent" />
                Live workspace telemetry
              </div>
              <h3 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Your productivity,
                measured in real time.
              </h3>
              <p className="mt-5 text-base font-medium leading-[1.9] text-muted-foreground">
                Every note, task completion,
                workflow and focus session
                contributes to your analytics
                dashboard automatically.
              </p>
            </div>

            <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-[420px]">
              {miniStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[16px] border border-border bg-secondary p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border">
                      <item.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      {item.value}
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}