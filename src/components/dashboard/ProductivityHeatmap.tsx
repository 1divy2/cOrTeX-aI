import {
  motion,
} from "framer-motion";

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

function getColor(
  value: number
) {
  if (value === 0) {
    return "bg-white/[0.04]";
  }

  if (value <= 2) {
    return "bg-cyan-500/30";
  }

  if (value <= 4) {
    return "bg-purple-500/40";
  }

  if (value <= 6) {
    return "bg-pink-500/50";
  }

  return "bg-gradient-to-br from-pink-500 to-cyan-400";
}

export default function ProductivityHeatmap() {
 const { sessions } =
  useFocusStore();

  const [
    weekOffset,
    setWeekOffset,
  ] = useState(0);

 const contributionData =
  useMemo(() => {
    const map =
      new Map<
        string,
        number
      >();

    sessions.forEach(
      (session) => {
        const key =
          new Date(
            session.endedAt
          )
            .toISOString()
            .split("T")[0];

        map.set(
          key,
          (map.get(key) || 0) +
            1
        );
      }
    );

    return map;
  }, [sessions]);

  const totalColumns =
    30;

  const totalDays =
    totalColumns * 7;

  const days =
    useMemo(() => {
      const today =
        new Date();

      today.setDate(
        today.getDate() +
          weekOffset * 7
      );

      const arr = [];

      for (
        let i =
          totalDays - 1;
        i >= 0;
        i--
      ) {
        const d =
          new Date(today);

        d.setDate(
          today.getDate() -
            i
        );

        const key =
          d.toLocaleDateString(
            "en-CA"
          );

        const value =
          contributionData.get(
            key
          ) || 0;

        arr.push({
          date: key,
          value,
        });
      }

      return arr;
    }, [
      contributionData,
      weekOffset,
    ]);

  const currentRange =
    useMemo(() => {
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
          day: "numeric",
        }
      )} - ${end.toLocaleDateString(
        "en-US",
        {
          month:
            "short",
          day: "numeric",
        }
      )}`;
    }, [
      weekOffset,
    ]);

  return (
    <div className="relative overflow-visible rounded-[32px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-3xl">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_35%)]" />

      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

        <div>

          <h2 className="text-3xl font-black text-white">

            Productivity Heatmap

          </h2>

          <p className="mt-2 text-lg text-zinc-500">

            Daily deep work contribution graph

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

            {currentRange}

          </div>

        </div>

      </div>

      <div className="relative mt-10 overflow-visible">

        <div className="mb-6 hidden items-center gap-2 text-xs text-zinc-500 lg:flex">

          <span>

            Less

          </span>

          <div className="h-4 w-4 rounded-md bg-white/[0.04]" />

          <div className="h-4 w-4 rounded-md bg-cyan-500/30" />

          <div className="h-4 w-4 rounded-md bg-purple-500/40" />

          <div className="h-4 w-4 rounded-md bg-pink-500/50" />

          <div className="h-4 w-4 rounded-md bg-gradient-to-br from-pink-500 to-cyan-400" />

          <span>

            More

          </span>

        </div>

        <div className="relative grid grid-flow-col grid-rows-7 gap-2 overflow-visible">

          {days.map(
            (
              day,
              i
            ) => {
              const isRightSide =
                i >
                totalDays - 35;

              const isToday =
                day.date ===
                new Date().toLocaleDateString(
                  "en-CA"
                ) &&
                weekOffset === 0;

              return (
                <motion.div
                  key={
                    `${day.date}-${i}`
                  }
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay:
                      i * 0.0008,
                  }}
                  className="group relative overflow-visible"
                >

                  <div
                    className={`relative h-4 w-4 rounded-[4px] border border-white/5 transition-all duration-200 hover:z-20 hover:scale-125 ${getColor(
                      day.value
                    )} ${
                      isToday
                        ? "shadow-[0_0_18px_rgba(34,211,238,0.45)]"
                        : ""
                    }`}
                  >

                    {isToday && (
                      <div className="absolute inset-0 animate-pulse rounded-[4px] bg-cyan-400/10" />
                    )}

                  </div>

                  <div
                    className={`pointer-events-none absolute top-1/2 z-[99999] w-56 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#09090f]/98 p-4 opacity-0 shadow-[0_0_60px_rgba(168,85,247,0.18)] backdrop-blur-3xl transition-all duration-200 group-hover:opacity-100 ${
                      isRightSide
                        ? "right-8 group-hover:-translate-x-2"
                        : "left-8 group-hover:translate-x-2"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <p className="text-sm font-semibold text-white">

                        Daily Activity

                      </p>

                      <div className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-1 text-[10px] text-purple-300">

                        LIVE

                      </div>

                    </div>

                    <div className="mt-4 space-y-3">

                      <div className="flex items-center justify-between">

                        <span className="text-xs text-zinc-500">

                          Date

                        </span>

                        <span className="text-sm text-white">

                          {day.date}

                        </span>

                      </div>

                      <div className="flex items-center justify-between">

                        <span className="text-xs text-zinc-500">

                          Sessions

                        </span>

                        <span className="text-sm text-cyan-300">

                          {day.value}

                        </span>

                      </div>

                      {isToday && (
                        <div className="pt-2 text-[10px] uppercase tracking-[0.25em] text-cyan-300">

                          Current Day

                        </div>
                      )}

                    </div>

                  </div>

                </motion.div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}