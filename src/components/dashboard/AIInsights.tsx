import {
  Brain,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Zap,
  Flame,
  Moon,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useMemo,
} from "react";

import {
  useFocusStore,
} from "@/store/focus-store";

import {
  useProductivityStore,
} from "@/store/productivity-store";

export default function AIInsights() {
  const {
    currentSessionSeconds,
    isRunning,
    sessions,
  } = useFocusStore();

  const {
    completedTasks,
    aiInteractions,
  } =
    useProductivityStore();

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todaySessions =
    sessions.filter(
      (session) =>
        new Date(
          session.endedAt
        )
          .toISOString()
          .split("T")[0] ===
        today
    );

  const todayTotalSessions =
    todaySessions.length;

  const todayFocusHours =
    Number(
      (
        todaySessions.reduce(
          (
            total,
            session
          ) =>
            total +
            session.duration,
          0
        ) / 3600
      ).toFixed(2)
    );

 const todayProductivity =

  todayTotalSessions > 0

    ? Math.round(

        todaySessions.reduce(

          (

            total,

            session

          ) =>

            total +

            (

              (session.rating ||

                5) *

              12.5

            ),

          0

        ) /

          todayTotalSessions

      )

    : 0;

  const streak =
    useMemo(() => {
      const sortedSessions =
        [...sessions].sort(
          (a, b) =>
            b.endedAt -
            a.endedAt
        );

      let streakCount = 0;

      const todayDate =
        new Date();

      for (
        let i = 0;
        i < 365;
        i++
      ) {
        const checkDate =
          new Date();

        checkDate.setDate(
          todayDate.getDate() -
            i
        );

        const key =
          checkDate
            .toISOString()
            .split("T")[0];

        const hasSession =
          sortedSessions.some(
            (session) =>
              new Date(
                session.endedAt
              )
                .toISOString()
                .split("T")[0] ===
              key
          );

        if (hasSession) {
          streakCount++;
        } else {
          break;
        }
      }

      return streakCount;
    }, [sessions]);

  const insightData =
    useMemo(() => {
      const energyLevel =
        todayFocusHours >= 8
          ? "Peak"
          : todayFocusHours >= 5
          ? "High"
          : todayFocusHours >= 2
          ? "Stable"
          : todayFocusHours >= 1
          ? "Low"
          : "Idle";

      const focusTrend =
        todayTotalSessions >=
        10
          ? "Accelerating"
          : todayTotalSessions >=
            6
          ? "Improving"
          : todayTotalSessions >=
            3
          ? "Building"
          : todayTotalSessions >=
            1
          ? "Starting"
          : "Inactive";

      const recommendation =
        todayProductivity >=
        85
          ? "You are in a deep focus rhythm. Protect this momentum by avoiding distractions."
          : todayProductivity >=
            65
          ? "Your productivity is stable. A longer uninterrupted session may improve output."
          : todayProductivity >=
            40
          ? "Try reducing context switching and task hopping during work sessions."
          : todayTotalSessions > 0
          ? "Your workflow appears fragmented. A short reset break may help restore focus."
          : "Start a focused session to activate live productivity intelligence.";

      const sessionMood =
        todayProductivity >=
        90
          ? "Elite"
          : todayProductivity >=
            75
          ? "Locked In"
          : todayProductivity >=
            55
          ? "Focused"
          : todayProductivity >=
            35
          ? "Distracted"
          : isRunning
          ? "Warming Up"
          : "Idle";

      return {
        energyLevel,
        focusTrend,
        recommendation,
        sessionMood,
      };
    }, [
      todayProductivity,
      todayFocusHours,
      todayTotalSessions,
      isRunning,
      currentSessionSeconds,
    ]);

  const cards = [
    {
      title: "Energy",
      value:
        insightData.energyLevel,
      icon: Zap,
      color:
        "from-cyan-500/20 to-cyan-400/5",
      text: "text-cyan-300",
    },
    {
      title: "Focus Trend",
      value:
        insightData.focusTrend,
      icon:
        todayProductivity >=
        60
          ? TrendingUp
          : TrendingDown,
      color:
        "from-purple-500/20 to-pink-500/5",
      text: "text-purple-300",
    },
    {
      title: "Session Mood",
      value:
        insightData.sessionMood,
      icon:
        isRunning
          ? Flame
          : Moon,
      color:
        "from-pink-500/20 to-orange-500/5",
      text: "text-pink-300",
    },
  ];

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-5 lg:p-7 backdrop-blur-3xl">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/10">
          <Brain className="h-6 w-6 text-purple-300" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            AI Insights
          </h2>

          <p className="text-sm text-zinc-500">
            Adaptive productivity intelligence
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {cards.map(
          (
            card,
            i
          ) => {
            const Icon =
              card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    i * 0.08,
                }}
                className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${card.color} p-5`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_45%)]" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-400">
                      {card.title}
                    </p>

                    <Icon
                      className={`h-5 w-5 ${card.text}`}
                    />
                  </div>

                  <h3 className={`mt-5 text-2xl font-black ${card.text}`}>
                    {card.value}
                  </h3>
                </div>
              </motion.div>
            );
          }
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-300" />

          <h3 className="text-lg font-semibold text-white">
            AI Recommendation
          </h3>
        </div>

        <p className="mt-4 leading-relaxed text-zinc-300">
          {
            insightData.recommendation
          }
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <MiniStat
          label="Sessions"
          value={
            todayTotalSessions
          }
        />

        <MiniStat
          label="Focus Hours"
          value={`${todayFocusHours}h`}
        />

        <MiniStat
          label="Tasks Done"
          value={
            completedTasks
          }
        />

        <MiniStat
          label="AI Uses"
          value={
            aiInteractions
          }
        />
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">
              Focus Performance
            </p>

            <h3 className="mt-2 text-4xl font-black text-white">
              {
                todayProductivity
              }
              %
            </h3>
          </div>

          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <span className="text-lg font-bold text-cyan-300">
              {streak}d
            </span>
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/[0.04]">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${todayProductivity}%`,
            }}
            transition={{
              duration: 1,
            }}
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400"
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
          <span>
            Avg Session:{" "}
            {todayTotalSessions >
            0
              ? (
                  (
                    todayFocusHours /
                    Math.max(
                      todayTotalSessions,
                      1
                    )
                  ) * 60
                ).toFixed(0)
              : 0}{" "}
            min
          </span>

          <span>
            Productivity AI
            Active
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-white">
        {value}
      </h3>
    </div>
  );
}