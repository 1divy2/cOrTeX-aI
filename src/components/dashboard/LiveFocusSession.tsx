"use client";

import { motion } from "framer-motion";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useFocusStore,
} from "@/store/focus-store";

type FocusSession = {
  id: string;
  startedAt: number;
  endedAt: number;
  duration: number;
  rating:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8;
};

type DayData = {
  day: string;
  sessions: FocusSession[];
  total: number;
};

const DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function getQuality(
  rating: number
) {
  if (rating >= 7) {
    return "Elite";
  }

  if (rating >= 5) {
    return "Great";
  }

  if (rating >= 3) {
    return "Good";
  }

  return "Low";
}

export default function LiveFocusSession() {
  const {
    currentSessionSeconds,
    sessions,
  } = useFocusStore();

  const [
    weekOffset,
    setWeekOffset,
  ] = useState(0);

  const formattedTime =
    useMemo(() => {
      const hrs =
        Math.floor(
          currentSessionSeconds /
            3600
        );

      const mins =
        Math.floor(
          (
            currentSessionSeconds %
            3600
          ) / 60
        );

      const secs =
        currentSessionSeconds %
        60;

      return `${String(
        hrs
      ).padStart(
        2,
        "0"
      )}:${String(
        mins
      ).padStart(
        2,
        "0"
      )}:${String(
        secs
      ).padStart(
        2,
        "0"
      )}`;
    }, [
      currentSessionSeconds,
    ]);

  const weeklyData =
    useMemo<
      DayData[]
    >(() => {
      const data:
        DayData[] =
        DAYS.map(
          (
            day
          ) => ({
            day,
            sessions: [],
            total: 0,
          })
        );

      const now =
        new Date();

      now.setDate(
        now.getDate() +
          weekOffset * 7
      );

      const startOfWeek =
        new Date(now);

      startOfWeek.setHours(
        0,
        0,
        0,
        0
      );

      startOfWeek.setDate(
        now.getDate() -
          now.getDay()
      );

      const endOfWeek =
        new Date(
          startOfWeek
        );

      endOfWeek.setDate(
        startOfWeek.getDate() +
          7
      );

      (
        sessions as FocusSession[]
      ).forEach(
        (
          session
        ) => {
          const date =
            new Date(
              session.endedAt
            );

          if (
            date <
              startOfWeek ||
            date >= endOfWeek
          ) {
            return;
          }

          const index =
            date.getDay();

          data[
            index
          ].sessions.push(
            session
          );

          data[
            index
          ].total +=
            session.duration;
        }
      );

      return data;
    }, [
      sessions,
      weekOffset,
    ]);

  const visibleSessions =
    weeklyData.reduce(
      (
        acc,
        day
      ) =>
        acc +
        day.sessions.length,
      0
    );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="overflow-visible rounded-[32px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-3xl"
    >

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

        <div>

          <h3 className="text-3xl font-black tracking-tight text-white">

            Live Focus Session

          </h3>

          <p className="mt-2 text-lg text-zinc-500">

            Real-time session tracking and activity

          </p>

        </div>

        <div className="flex flex-wrap items-center gap-3">

          <button
  onClick={() =>
    setWeekOffset(
      (
        prev
      ) => prev - 1
    )
  }
  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition-all hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10 hover:text-white"
>

  <ChevronLeft className="h-5 w-5" />

</button>

          <button
            onClick={() =>
              setWeekOffset(0)
            }
            className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-6 py-3 text-sm text-cyan-300"
          >

            Current Week

          </button>

          <button
  onClick={() =>
    setWeekOffset(
      (
        prev
      ) => prev + 1
    )
  }
  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition-all hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10 hover:text-white"
>

  <ChevronRight className="h-5 w-5" />

</button>

          <div className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-5 py-3 text-sm text-fuchsia-300">

            {(() => {
              const now =
                new Date();

              now.setDate(
                now.getDate() +
                  weekOffset * 7
              );

              const start =
                new Date(now);

              start.setDate(
                now.getDate() -
                  now.getDay()
              );

              const end =
                new Date(start);

              end.setDate(
                start.getDate() +
                  6
              );

              return `${start.toLocaleDateString(
                "en-US",
                {
                  month:
                    "short",
                  day:
                    "numeric",
                }
              )} - ${end.toLocaleDateString(
                "en-US",
                {
                  month:
                    "short",
                  day:
                    "numeric",
                }
              )}`;
            })()}

          </div>

        </div>

      </div>

      <div className="mt-16">

        <p className="text-sm text-zinc-500">

          Current Session

        </p>

        <h1 className="mt-3 text-7xl font-black tracking-tight text-white">

          {formattedTime}

        </h1>

      </div>

      <div className="mt-16">

        <div className="relative z-[120] grid grid-cols-7 gap-5 overflow-visible">

          {weeklyData.map(
            (
              item,
              dayIndex
            ) => (
              <div
                key={dayIndex}
                className="flex flex-col items-center"
              >

                <div className="relative flex h-[240px] w-full flex-col justify-end overflow-visible rounded-[32px] border border-white/5 bg-white/[0.02] px-3 py-4">

                  <div className="absolute inset-0 rounded-[32px] bg-[linear-gradient(to_top,rgba(168,85,247,0.05),transparent_45%)]" />

                  <div className="relative flex flex-wrap items-end gap-2 overflow-visible">

                    {item.sessions.length ? (
                      item.sessions
                        .slice(-18)
                        .map(
                          (
                            session,
                            index
                          ) => {
                            const size =
                              Math.max(
                                12,
                                Math.min(
                                  20,
                                  session.duration /
                                    25
                                )
                              );

                            const isLeftSide =
                              dayIndex <=
                              1;

                            return (
                              <motion.div
                                key={
                                  session.id
                                }
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
                                    index *
                                    0.03,
                                }}
                                className="group relative overflow-visible"
                              >

                                <div
                                  className="rounded-full transition-all duration-300 hover:scale-125"
                                  style={{
                                    width:
                                      size,

                                    height:
                                      size,

                                    background:
                                      session.rating >=
                                      6
                                        ? "linear-gradient(135deg,#d946ef,#22d3ee)"
                                        : session.rating >=
                                          4
                                        ? "#a855f7"
                                        : "#334155",

                                    boxShadow:
                                      session.rating >=
                                      6
                                        ? "0 0 20px rgba(217,70,239,0.5)"
                                        : "none",
                                  }}
                                />

                                <div
                                  className={`pointer-events-none absolute top-1/2 z-[999999] w-72 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#080811]/95 p-6 opacity-0 shadow-[0_0_80px_rgba(168,85,247,0.25)] backdrop-blur-3xl transition-all duration-200 group-hover:opacity-100 ${
                                    isLeftSide
                                      ? "left-8 group-hover:translate-x-2"
                                      : "right-8 group-hover:-translate-x-2"
                                  }`}
                                >

                                  <div className="flex items-center justify-between">

                                    <div>

                                      <p className="text-xl font-bold text-white">

                                        Focus Session

                                      </p>

                                      <p className="mt-1 text-xs text-zinc-500">

                                        Deep work analytics

                                      </p>

                                    </div>

                                    <div className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-[10px] text-fuchsia-300">

                                      LIVE

                                    </div>

                                  </div>

                                  <div className="mt-6 space-y-4">

                                    <div className="flex items-center justify-between">

                                      <span className="text-sm text-zinc-500">

                                        Duration

                                      </span>

                                      <span className="text-lg text-cyan-300">

                                        {Math.max(
                                          1,
                                          Math.floor(
                                            session.duration /
                                              60
                                          )
                                        )}
                                        m

                                      </span>

                                    </div>

                                    <div className="flex items-center justify-between">

                                      <span className="text-sm text-zinc-500">

                                        Productivity

                                      </span>

                                      <span className="text-lg text-pink-300">

                                        {Math.min(
                                          100,
                                          session.rating *
                                            12.5
                                        )}
                                        %

                                      </span>

                                    </div>

                                    <div className="flex items-center justify-between">

                                      <span className="text-sm text-zinc-500">

                                        Quality

                                      </span>

                                      <span className="text-lg text-emerald-300">

                                        {getQuality(
                                          session.rating
                                        )}

                                      </span>

                                    </div>

                                    <div className="flex items-center justify-between">

                                      <span className="text-sm text-zinc-500">

                                        Rating

                                      </span>

                                      <span className="text-lg text-white">

                                        {
                                          session.rating
                                        }
                                        /8

                                      </span>

                                    </div>

                                  </div>

                                </div>

                              </motion.div>
                            );
                          }
                        )
                    ) : (
                      <div className="text-xs text-zinc-700">

                        —

                      </div>
                    )}

                  </div>

                </div>

                <span className="mt-4 text-sm text-zinc-500">

                  {item.day}

                </span>

              </div>
            )
          )}

        </div>

        <div className="mt-10 flex items-center justify-between">

          <div className="flex items-center gap-4 text-sm text-zinc-500">

            <div className="h-3 w-3 rounded-full bg-cyan-400" />

            Lower focus

            <div className="ml-4 h-3 w-3 rounded-full bg-fuchsia-400" />

            Higher focus

          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-zinc-400">

            {visibleSessions} sessions

          </div>

        </div>

      </div>

    </motion.div>
  );
}