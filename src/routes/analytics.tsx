import { createFileRoute } from "@tanstack/react-router";

import {
  Brain,
  Flame,
  Sparkles,
  TrendingUp,
  Activity,
  Clock3,
  Target,
  Zap,
  CalendarDays,
  Orbit,
  BarChart3,
  Gauge,
} from "lucide-react";

import {
  motion,
} from "framer-motion";


import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";

import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";

import {
  useProductivityStore,
} from "@/store/productivity-store";

import {
  useNotesStore,
} from "@/store/notes-store";
import {
  generateInsights,
} from "@/lib/analytics-insights";

export const Route =
  createFileRoute("/analytics")({
    component: AnalyticsPage,
  });

const days = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function AnalyticsPage() {
  const productivity =
    useProductivityStore() as any;

  const notesStore =
    useNotesStore();

  const notes =
    notesStore?.notes || [];

  const lifetimeStats =
  productivity.getLifetimeStats();

const sessions =
  productivity.getSessions();

const totalFocusHours =
  lifetimeStats.focusHours;

const completedSessions =
  lifetimeStats.sessions;

 const streak =
  productivity.streak || 0;

  const weeklyActivity =
    getWeeklyActivity(
      sessions
    );

  const weeklyMax =
    Math.max(
      ...weeklyActivity,
      1
    );

  const productivityScore =
    calculateProductivityScore(
      totalFocusHours,
      completedSessions,
      streak,
      notes.length
    );

  const distribution =
    getFocusDistribution(
      sessions
    );

  const contributionData =
    getContributionData(
      sessions
    );

  const hourlyHeat =
    getHourlyHeat(
      sessions
    );

  const peakDay =
    getPeakDay(
      weeklyActivity
    );

  const momentum =
    getMomentum(
      sessions
    );

  const intensityTimeline =
    getIntensityTimeline(
      sessions
    );
  const dailyAnalytics =
  productivity.getDailyAnalytics();

const last7Days =
  [...dailyAnalytics]
    .sort(
      (
        a: any,
        b: any
      ) =>
        new Date(
          a.date
        ).getTime() -
        new Date(
          b.date
        ).getTime()
    )
    .slice(-7);
 const aiInsights =
  generateInsights(
    sessions,
    dailyAnalytics
  );   

  return (
    <div className="min-h-screen bg-background text-white">

      <WorkspaceSidebar />

      <div className="ml-[84px] lg:ml-[280px]">

        <WorkspaceHeader />

        <main className="relative overflow-y-auto pt-28">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_25%)]" />

          <div className="relative z-10 mx-auto max-w-[1900px] px-8 pb-20">

            <section className="relative overflow-hidden rounded-[42px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-3xl">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_45%)]" />

              <div className="relative flex flex-col gap-14 xl:flex-row xl:items-end xl:justify-between">

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />

                    Advanced Intelligence Layer

                  </div>

                  <h1 className="mt-6 text-6xl font-black leading-[0.9] tracking-tight">

                    Neural

                    <br />

                    <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">

                      analytics
                    </span>

                  </h1>

                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">

                    Real-time cognitive metrics generated
                    directly from your actual productivity behavior.

                  </p>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <GlassMetric
                    icon={Flame}
                    label="Current Streak"
                    value={`${streak}d`}
                  />

                  <GlassMetric
                    icon={Brain}
                    label="Knowledge Nodes"
                    value={`${notes.length}`}
                  />

                  <GlassMetric
                    icon={Gauge}
                    label="Momentum"
                    value={`${momentum}%`}
                  />

                  <GlassMetric
                    icon={Target}
                    label="Peak Day"
                    value={peakDay}
                  />

                </div>

              </div>

            </section>

            <section className="mt-8">

              <ContributionGraph
                data={
                  contributionData
                }
              />

            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">

              <VelocityGraph
                weeklyActivity={
                  weeklyActivity
                }
                weeklyMax={
                  weeklyMax
                }
              />

              <CognitiveCard
                score={
                  productivityScore
                }
                momentum={
                  momentum
                }
              />

            </section>

           <section className="mt-8">

  <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">

          Weekly Evolution

        </p>

        <h2 className="mt-3 text-3xl font-black text-white">

          7-Day Productivity Trend

        </h2>

      </div>

      <TrendingUp className="h-8 w-8 text-cyan-400" />

    </div>

    <div className="mt-12 flex h-[300px] items-end gap-4">

      {last7Days.map(
        (
          day: any,
          index: number
        ) => (

          <div
            key={day.date}
            className="flex flex-1 flex-col items-center"
          >

            <motion.div
              initial={{
                height: 0,
              }}
              animate={{
                height:
                  Math.max(
                    24,
                    Math.min(
  day.focusHours *
    42,
  260
)
                  ),
              }}
              transition={{
                duration: 0.7,
                delay:
                  index * 0.08,
              }}
              className="w-full rounded-t-[28px] bg-gradient-to-t from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_40px_rgba(168,85,247,0.35)]"
            />

            <p className="mt-4 text-xs text-zinc-500">

              {
                new Date(
                  day.date
                ).toLocaleDateString(
                  "en-US",
                  {
                    weekday:
                      "short",
                  }
                )
              }

            </p>

            <p className="mt-2 text-sm font-bold text-white">

              {
                day.focusHours
              }h

            </p>

          </div>
        )
      )}

    </div>

  </div>

</section>

<section className="mt-8 grid gap-6 xl:grid-cols-2">

  <HourlyHeatmap
    data={
      hourlyHeat
    }
  />

  <SessionTimeline
    timeline={
      intensityTimeline
    }
  />

</section>

    <section className="mt-8">

  <div className="rounded-[42px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

    <div className="flex items-center justify-between">

      <div>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />

          Adaptive Intelligence Layer

        </div>

        <h2 className="mt-5 text-5xl font-black tracking-tight text-white">

          AI Productivity

          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">

            {" "}
            insights

          </span>

        </h2>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400">

          Real-time behavioral intelligence generated from your productivity patterns, focus sessions and cognitive momentum.

        </p>

      </div>

      <div className="hidden h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 xl:flex">

        <Brain className="h-10 w-10 text-cyan-300" />

      </div>

    </div>

    <div className="mt-12 grid gap-6 xl:grid-cols-2">

      {aiInsights.map(
        (
          insight: any,
          index: number
        ) => {

          const colors =
            insight.type ===
            "success"
              ? "from-emerald-500/20 to-cyan-500/10 border-emerald-400/20"
              : insight.type ===
                "warning"
              ? "from-orange-500/20 to-red-500/10 border-orange-400/20"
              : "from-purple-500/20 to-cyan-500/10 border-purple-400/20";

          return (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay:
                  index * 0.08,
              }}
              className={`rounded-[32px] border bg-gradient-to-br ${colors} p-7 backdrop-blur-3xl`}
            >

              <div className="flex items-start justify-between">

                <div>

                  <h3 className="text-2xl font-black text-white">

                    {insight.title}

                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">

                    {insight.description}

                  </p>

                </div>

                <div className="ml-6 rounded-2xl border border-white/10 bg-white/5 p-3">

                  <Sparkles className="h-5 w-5 text-cyan-300" />

                </div>

              </div>

            </motion.div>
          );
        }
      )}

    </div>

  </div>

</section>

<section className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr_0.8fr]">

  <DistributionCard
    data={
      distribution
    }
  />

  <PatternInsights
    sessions={
      sessions
    }
  />

  <div className="space-y-6">

    <InsightPanel
      title="Peak Focus Window"
      icon={Orbit}
      value={`${hourlyHeat.peakHour}:00`}
      desc="Derived from real session timing patterns."
    />

    <InsightPanel
      title="Session Density"
      icon={BarChart3}
      value={`${completedSessions}`}
      desc="Tracks the intensity of your real deep work flow."
    />

    <InsightPanel
      title="Knowledge Flow"
      icon={Brain}
      value={`${notes.length} Notes`}
      desc="Knowledge growth directly linked with productivity sessions."
    />

  </div>

</section>

<section className="mt-8">

  <KnowledgeConstellation
    notes={notes}
    sessions={sessions}
  />

</section>

          </div>

        </main>

      </div>

    </div>
  );
}

function calculateProductivityScore(
  hours: number,
  sessions: number,
  streak: number,
  notes: number
) {
  const raw =
    hours * 8 +
    sessions * 2 +
    streak * 4 +
    notes * 0.7;

  return Math.min(
    100,
    Math.round(raw)
  );
}


function getWeeklyActivity(
  sessions: any[]
) {
  const result =
    Array(7).fill(0);

  sessions.forEach(
    (session: any) => {
      const date =
        new Date(
          session.completedAt ||
            Date.now()
        );

      result[
        date.getDay()
      ] += 1;
    }
  );

  return result;
}

function getContributionData(
  sessions: any[]
) {
  const map =
    new Map();

  sessions.forEach(
    (session: any) => {
      const date =
        new Date(
          session.completedAt ||
            Date.now()
        )
          .toISOString()
          .split("T")[0];

      map.set(
        date,
        (map.get(date) || 0) + 1
      );
    }
  );

  return map;
}

function getFocusDistribution(
  sessions: any[]
) {
  const buckets = {
    Morning: 0,
    Afternoon: 0,
    Evening: 0,
    Night: 0,
  };

  sessions.forEach(
    (session: any) => {
      const hour =
        new Date(
          session.completedAt ||
            Date.now()
        ).getHours();

      if (
        hour >= 6 &&
        hour < 12
      )
        buckets.Morning++;
      else if (
        hour >= 12 &&
        hour < 17
      )
        buckets.Afternoon++;
      else if (
        hour >= 17 &&
        hour < 22
      )
        buckets.Evening++;
      else buckets.Night++;
    }
  );

  const total =
    Object.values(
      buckets
    ).reduce(
      (a, b) => a + b,
      0
    ) || 1;

  return Object.entries(
    buckets
  ).map(([k, v]) => ({
    label: k,
    value: Math.round(
      (v / total) * 100
    ),
  }));
}

function getHourlyHeat(
  sessions: any[]
) {
  const hours =
    Array(24).fill(0);

  sessions.forEach(
    (session: any) => {
      const hour =
        new Date(
          session.completedAt ||
            Date.now()
        ).getHours();

      hours[hour]++;
    }
  );

  const peak =
    hours.indexOf(
      Math.max(...hours)
    );

  return {
    hours,
    peakHour: peak,
  };
}

function getPeakDay(
  weekly: number[]
) {
  const max =
    Math.max(...weekly);

  return days[
    weekly.indexOf(max)
  ];
}

function getMomentum(
  sessions: any[]
) {
  if (
    !sessions.length
  )
    return 0;

  return Math.min(
    100,
    Math.round(
      sessions.length * 4
    )
  );
}

function getIntensityTimeline(
  sessions: any[]
) {
  return sessions
    .slice(0, 12)
    .map(
      (
        session: any,
        index: number
      ) => ({
        id: index,
        value:
          session.duration ||
          25,
      })
    );
}

function GlassMetric({
  icon: Icon,
  label,
  value,
}: any) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10">

        <Icon className="h-5 w-5 text-purple-300" />

      </div>

      <p className="mt-5 text-sm text-zinc-500">

        {label}

      </p>

      <h3 className="mt-2 text-4xl font-black text-white">

        {value}

      </h3>

    </div>
  );
}

function VelocityGraph({
  weeklyActivity,
  weeklyMax,
}: any) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold text-white">

            Productivity Velocity

          </h2>

          <p className="mt-2 text-zinc-500">

            Weekly cognitive acceleration

          </p>

        </div>

        <TrendingUp className="h-7 w-7 text-purple-300" />

      </div>

      <div className="mt-14 flex h-[340px] items-end gap-4">

        {weeklyActivity.map(
          (
            value: number,
            index: number
          ) => {
            const height =
              (value /
                weeklyMax) *
              100;

            return (
              <div
                key={index}
                className="flex flex-1 flex-col items-center"
              >

                <motion.div
                  initial={{
                    height: 0,
                  }}
                  animate={{
                    height: `${Math.max(
                      height,
                      6
                    )}%`,
                  }}
                  transition={{
                    duration: 0.8,
                    delay:
                      index *
                      0.05,
                  }}
                  className="w-full rounded-t-[28px] bg-gradient-to-t from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_40px_rgba(168,85,247,0.35)]"
                />

                <p className="mt-4 text-sm text-zinc-500">

                  {
                    days[
                      index
                    ]
                  }

                </p>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

function CognitiveCard({
  score,
  momentum,
}: any) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

      <div className="text-center">

        <h3 className="text-3xl font-bold text-white">

          Neural Score

        </h3>

        <p className="mt-2 text-zinc-500">

          Real cognitive momentum

        </p>

        <div className="relative mx-auto mt-10 flex h-72 w-72 items-center justify-center rounded-full border border-purple-500/20">

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat:
                Infinity,
              duration: 18,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-t border-purple-400/50"
          />

          <div>

            <h2 className="text-7xl font-black text-white">

              {score}

            </h2>

            <p className="mt-3 text-zinc-400">

              Momentum {momentum}%

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

function HourlyHeatmap({
  data,
}: any) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

      <h3 className="text-3xl font-bold text-white">

        Peak Focus Hours

      </h3>

      <p className="mt-2 text-zinc-500">

        Real session timing analytics

      </p>

      <div className="mt-10 grid grid-cols-6 gap-3">

        {data.hours.map(
          (
            value: number,
            index: number
          ) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.05,
              }}
              className="rounded-2xl border border-white/10 p-4 text-center backdrop-blur-xl"
              style={{
                background:
                  value > 0
                    ? `rgba(168,85,247,${
                        0.12 +
                        value *
                          0.08
                      })`
                    : "rgba(255,255,255,0.03)",
              }}
            >

              <p className="text-xs text-zinc-500">

                {index}:00

              </p>

              <h4 className="mt-3 text-2xl font-black text-white">

                {value}

              </h4>

            </motion.div>
          )
        )}

      </div>

    </div>
  );
}

function SessionTimeline({
  timeline,
}: any) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

      <h3 className="text-3xl font-bold text-white">

        Session Intensity

      </h3>

      <p className="mt-2 text-zinc-500">

        Rolling deep work intensity

      </p>

      <div className="mt-12 flex items-end gap-3">

        {timeline.map(
          (
            item: any
          ) => (
            <motion.div
              key={item.id}
              initial={{
                height: 0,
              }}
              animate={{
                height: `${Math.min(
                  item.value * 3,
                  260
                )}px`,
              }}
              className="flex-1 rounded-t-[20px] bg-gradient-to-t from-cyan-500 via-purple-500 to-pink-500"
            />
          )
        )}

      </div>

    </div>
  );
}

function PatternInsights({
  sessions,
}: any) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

      <h3 className="text-3xl font-bold text-white">

        Pattern Recognition

      </h3>

      <p className="mt-2 text-zinc-500">

        AI-derived behavioral analysis

      </p>

      <div className="mt-10 space-y-6">

        <InsightLine
          label="Most productive state"
          value={
            sessions.length > 8
              ? "Deep Flow"
              : "Building Flow"
          }
        />

        <InsightLine
          label="Session stability"
          value={`${Math.min(
            100,
            sessions.length *
              5
          )}%`}
        />

        <InsightLine
          label="Cognitive consistency"
          value={`${Math.min(
            100,
            sessions.length *
              4
          )}%`}
        />

        <InsightLine
          label="Knowledge integration"
          value="Active"
        />

      </div>

    </div>
  );
}

function InsightLine({
  label,
  value,
}: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

      <p className="text-sm text-zinc-500">

        {label}

      </p>

      <h4 className="mt-3 text-2xl font-bold text-white">

        {value}

      </h4>

    </div>
  );
}

function InsightPanel({
  title,
  value,
  desc,
  icon: Icon,
}: any) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-zinc-500">

            {title}

          </p>

          <h3 className="mt-2 text-3xl font-black text-white">

            {value}

          </h3>

        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">

          <Icon className="h-6 w-6 text-purple-300" />

        </div>

      </div>

      <p className="mt-5 text-sm leading-relaxed text-zinc-400">

        {desc}

      </p>

    </div>
  );
}

function ContributionGraph({
  data,
}: any) {
  const weeks = 20;

  const today =
    new Date();

  const cells: {
    date: string;
    value: number;
  }[] = [];

  for (
    let i = weeks * 7;
    i >= 0;
    i--
  ) {
    const date =
      new Date();

    date.setDate(
      today.getDate() - i
    );

    const key =
      date
        .toISOString()
        .split("T")[0];

    const value =
      data.get(key) || 0;

    cells.push({
      date: key,
      value,
    });
  }

  const intensity = (
    value: number
  ) => {
    if (value === 0)
      return "bg-white/[0.05]";

    if (value === 1)
      return "bg-purple-500/30";

    if (value === 2)
      return "bg-purple-500/50";

    if (value === 3)
      return "bg-pink-500/70";

    return "bg-cyan-400";
  };

  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

      <h3 className="text-3xl font-bold text-white">

        Focus Consistency

      </h3>

      <p className="mt-2 text-zinc-500">

        Real tracked contribution activity

      </p>

      <div className="mt-10 flex gap-[5px] overflow-x-auto">

        {Array.from({
          length: weeks,
        }).map(
          (
            _,
            weekIndex
          ) => (
            <div
              key={weekIndex}
              className="flex flex-col gap-[5px]"
            >

              {Array.from({
                length: 7,
              }).map(
                (
                  __,
                  dayIndex
                ) => {
                  const cell =
                    cells[
                      weekIndex *
                        7 +
                        dayIndex
                    ];

                  return (
                    <motion.div
                      key={
                        cell.date
                      }
                      whileHover={{
                        scale: 1.3,
                      }}
                      className={`h-4 w-4 rounded-[4px] transition-all duration-200 ${intensity(
                        cell.value
                      )}`}
                    />
                  );
                }
              )}

            </div>
          )
        )}

      </div>

    </div>
  );
}

function DistributionCard({
  data,
}: any) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

      <h3 className="text-3xl font-bold text-white">

        Focus Distribution

      </h3>

      <p className="mt-2 text-zinc-500">

        Derived from real sessions

      </p>

      <div className="mt-10 space-y-8">

        {data.map(
          (
            item: any,
            index: number
          ) => (
            <div
              key={
                item.label
              }
            >

              <div className="mb-3 flex items-center justify-between">

                <p className="text-sm text-zinc-400">

                  {
                    item.label
                  }

                </p>

                <p className="text-sm text-white">

                  {
                    item.value
                  }
                  %

                </p>

              </div>

              <div className="h-4 overflow-hidden rounded-full bg-white/5">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${item.value}%`,
                  }}
                  transition={{
                    duration: 1,
                    delay:
                      index *
                      0.08,
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400"
                />

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

function KnowledgeConstellation({
  notes,
  sessions,
}: any) {
    if (!notes.length) {
  return (
    <div className="rounded-[42px] border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-3xl">

      <h2 className="text-4xl font-black text-white">

        Knowledge Constellation

      </h2>

      <p className="mt-6 text-zinc-500">

        Start creating notes to build your neural knowledge graph.

      </p>

    </div>
  );
}
  const nodes =
  
    notes.map(
        
      (
        note: any,
        index: number
      ) => {
        const angle =
          (index /
            Math.max(
              notes.length,
              1
            )) *
          Math.PI *
          2;

        const radius =
          220 +
          (index % 3) * 70;

        const x =
          Math.cos(angle) *
          radius;

        const y =
          Math.sin(angle) *
          radius;

        const connections =
          notes.filter(
            (
              other: any
            ) =>
              other.id !==
                note.id &&
              (
                other.category ===
                  note.category ||
                other.tags?.some(
                  (
                    tag: string
                  ) =>
                    note.tags?.includes(
                      tag
                    )
                )
              )
          );

        return {
          ...note,
          x,
          y,
          connections:
            connections.length,
        };
      }
    );

    

  const totalConnections =
    nodes.reduce(
      (
        acc: number,
        node: any
      ) =>
        acc +
        node.connections,
      0
    );

  const neuralDensity =
    Math.min(
      100,
      Math.round(
        totalConnections *
          4 +
          sessions.length *
            2
      )
    );
    


  return (
    <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_30%)]" />

      <div className="relative z-10">

        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

              <Orbit className="h-3.5 w-3.5 text-purple-400" />

              Neural Knowledge System

            </div>

            <h2 className="mt-6 text-5xl font-black tracking-tight text-white">

              Knowledge

              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">

                {" "}
                constellation
              </span>

            </h2>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400">

              Real-time visualization of your connected thinking architecture generated from actual notes, sessions and semantic relationships.

            </p>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <ConstellationMetric
              label="Knowledge Nodes"
              value={`${notes.length}`}
              color="from-purple-500 to-pink-500"
            />

            <ConstellationMetric
              label="Neural Density"
              value={`${neuralDensity}%`}
              color="from-cyan-400 to-blue-500"
            />

            <ConstellationMetric
              label="Connections"
              value={`${totalConnections}`}
              color="from-pink-500 to-orange-400"
            />

            <ConstellationMetric
              label="Live Sessions"
              value={`${sessions.length}`}
              color="from-emerald-400 to-cyan-400"
            />

          </div>

        </div>

        <div className="relative mt-16 h-[720px] overflow-hidden rounded-[38px] border border-white/10 bg-black/30">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_45%)]" />

          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          {nodes.map(
            (
              node: any,
              index: number
            ) =>
              nodes.map(
                (
                  target: any,
                  targetIndex: number
                ) => {
                  if (
                    index >=
                    targetIndex
                  )
                    return null;

                  const sharedCategory =
                    node.category ===
                    target.category;

                  const sharedTag =
                    node.tags?.some(
                      (
                        tag: string
                      ) =>
                        target.tags?.includes(
                          tag
                        )
                    );

                  if (
                    !sharedCategory &&
                    !sharedTag
                  )
                    return null;

                  return (
                    <svg
  key={`${node.id}-${target.id}`}
  className="pointer-events-none absolute inset-0 h-full w-full"
>

  <line
    x1={node.x + 760}
    y1={360 + node.y}
    x2={target.x + 760}
    y2={360 + target.y}
    stroke={
      sharedCategory
        ? "rgba(168,85,247,0.35)"
        : "rgba(34,211,238,0.28)"
    }
    strokeWidth="1.5"
  />

</svg>
                  );
                }
              )
          )}

          <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-purple-500/20 bg-black/60 backdrop-blur-3xl">

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat:
                  Infinity,
                duration: 28,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border-t border-purple-400/50"
            />

            <div className="text-center">

              <h3 className="text-4xl font-black text-white">

                {notes.length}

              </h3>

              <p className="mt-1 text-xs uppercase tracking-[0.3em] text-zinc-500">

                Nodes

              </p>

            </div>

          </div>

          {nodes.map(
            (
              node: any,
              index: number
            ) => (
              <motion.div
                key={node.id}
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay:
                    index * 0.04,
                  duration: 0.45,
                }}
                whileHover={{
                  scale: 1.12,
                }}
                className="group absolute"
                style={{
                  left: `calc(50% + ${node.x}px)`,
                  top: `calc(50% + ${node.y}px)`,
                  transform:
                    "translate(-50%, -50%)",
                }}
              >

                <div className="relative">

                  <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-2xl transition-all duration-300 group-hover:bg-cyan-400/40" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/70 backdrop-blur-3xl">

                    <Brain className="h-8 w-8 text-purple-300" />

                  </div>

                  <div className="pointer-events-none absolute left-1/2 top-[110%] z-50 w-64 -translate-x-1/2 rounded-3xl border border-white/10 bg-[#09090f]/95 p-5 opacity-0 shadow-2xl shadow-purple-500/20 backdrop-blur-3xl transition-all duration-300 group-hover:translate-y-2 group-hover:opacity-100">

                    <h4 className="text-lg font-bold text-white">

                      {node.title ||
                        "Untitled Note"}

                    </h4>

                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-zinc-400">

                      {node.plainText ||
                        "No content available"}

                    </p>

                    <div className="mt-4 flex items-center justify-between">

                      <div className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-300">

                        {node.connections} Links

                      </div>

                      <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">

                        Live Node

                      </div>

                    </div>

                  </div>

                </div>

              </motion.div>
            )
          )}

        </div>

      </div>

    </div>
  );
}

function ConstellationMetric({
  label,
  value,
  color,
}: any) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl">

      <div className={`h-2 w-full rounded-full bg-gradient-to-r ${color}`} />

      <p className="mt-5 text-sm text-zinc-500">

        {label}

      </p>

      <h3 className="mt-2 text-4xl font-black text-white">

        {value}

      </h3>

    </div>
  );
}

export default AnalyticsPage;