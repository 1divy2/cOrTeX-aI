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
  glow: string;
};

type MiniStat = {
  icon: any;
  label: string;
  value: string;
};

export function Stats() {
  const [
    stats,
    setStats,
  ] = useState<
    StatCard[]
  >([]);

  const [
    miniStats,
    setMiniStats,
  ] = useState<
    MiniStat[]
  >([]);

  const productivity =
    useMemo(() => {
      const completed =
        Number(
          miniStats.find(
            (
              item
            ) =>
              item.label ===
              "Tasks completed"
          )?.value || 0
        );

      const notes =
        Number(
          miniStats.find(
            (
              item
            ) =>
              item.label ===
              "Notes created"
          )?.value || 0
        );

      if (
        completed === 0 &&
        notes === 0
      ) {
        return "0%";
      }

      const score =
        Math.min(
          100,
          Math.floor(
            completed * 2 +
              notes * 1.5
          )
        );

      return `${score}%`;
    }, [miniStats]);

  useEffect(() => {
    const getArray =
      (
        key: string
      ) => {
        try {
          const raw =
            localStorage.getItem(
              key
            );

          if (!raw) {
            return [];
          }

          return JSON.parse(
            raw
          );
        } catch {
          return [];
        }
      };

    const notes =
      getArray(
        STORAGE_KEYS.notes
      );

    const tasks =
      getArray(
        STORAGE_KEYS.tasks
      );

    const focus =
      getArray(
        STORAGE_KEYS.focus
      );

    const aiActions =
      getArray(
        STORAGE_KEYS.ai
      );

    const completedTasks =
      tasks.filter(
        (
          task: any
        ) =>
          task.completed ===
          true
      ).length;

    const focusHours =
      (
        focus.reduce(
          (
            acc: number,
            session: any
          ) =>
            acc +
            (
              session.duration ||
              0
            ),
          0
        ) / 60
      ).toFixed(1);

    setStats([
      {
        icon: Brain,
        value: `${aiActions.length}`,
        label:
          "AI workflows executed",
        glow:
          "from-fuchsia-500/20 to-pink-500/10",
      },
      {
        icon: Clock3,
        value: `${focusHours}h`,
        label:
          "Deep work hours tracked",
        glow:
          "from-cyan-500/20 to-blue-500/10",
      },
      {
        icon: Target,
        value:
          productivity,
        label:
          "Average productivity boost",
        glow:
          "from-violet-500/20 to-fuchsia-500/10",
      },
      {
        icon:
          CheckCircle2,
        value: `${completedTasks}`,
        label:
          "Tasks completed",
        glow:
          "from-emerald-500/20 to-cyan-500/10",
      },
    ]);

    setMiniStats([
      {
        icon: Activity,
        label:
          "Live focus sessions",
        value: `${focus.length}`,
      },
      {
        icon: Sparkles,
        label:
          "Notes created",
        value: `${notes.length}`,
      },
      {
        icon:
          TrendingUp,
        label:
          "Tasks completed",
        value: `${completedTasks}`,
      },
      {
        icon: Zap,
        label:
          "AI actions used",
        value: `${aiActions.length}`,
      },
    ]);
  }, [productivity]);

  return (
    <section className="relative overflow-hidden px-6 py-32">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:70px_70px]" />

      <div className="relative mx-auto max-w-7xl">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mx-auto max-w-3xl text-center"
        >

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-xs uppercase tracking-[0.25em] text-zinc-400 backdrop-blur-xl">

            <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />

            Real-time productivity metrics

          </div>

          <h2 className="text-5xl font-black tracking-[-0.04em] text-white md:text-6xl">

            Built for modern

            <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">

              {" "}deep work

            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-[1.9] text-zinc-400">

            corTeX.ai dynamically tracks your
            productivity, focus sessions, notes,
            AI usage and task execution directly
            from your workspace activity.

          </p>

        </motion.div>

        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {stats.map(
            (
              item,
              index
            ) => (
              <motion.div
                key={
                  item.label
                }
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay:
                    index * 0.1,
                  duration: 0.6,
                }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-fuchsia-500/20"
              >

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.glow} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">

                    <item.icon className="h-6 w-6 text-white" />

                  </div>

                  <div className="mt-8 text-5xl font-black tracking-[-0.05em] text-white">

                    {item.value}

                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">

                    {item.label}

                  </p>

                </div>

              </motion.div>
            )
          )}

        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.2,
            duration: 0.7,
          }}
          className="mt-16 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[rgba(12,12,20,0.82)] p-8 shadow-[0_0_80px_rgba(168,85,247,0.08)] backdrop-blur-3xl"
        >

          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cyan-300">

                <Zap className="h-3.5 w-3.5" />

                Live workspace telemetry

              </div>

              <h3 className="mt-6 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">

                Your productivity,
                measured in real time.

              </h3>

              <p className="mt-5 text-base leading-[1.9] text-zinc-400">

                Every note, task completion,
                AI workflow and focus session
                contributes to your analytics
                dashboard automatically.

              </p>

            </div>

            <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-[420px]">

              {miniStats.map(
                (
                  item
                ) => (
                  <div
                    key={
                      item.label
                    }
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">

                        <item.icon className="h-5 w-5 text-cyan-300" />

                      </div>

                      <div className="text-2xl font-black tracking-[-0.04em] text-white">

                        {item.value}

                      </div>

                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-zinc-400">

                      {item.label}

                    </p>

                  </div>
                )
              )}

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}