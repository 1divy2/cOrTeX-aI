"use client";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Play,
  Pause,
  RotateCcw,
  Timer,
  X,
  Check,
  Sparkles,
  Brain,
  Flame,
  Zap,
  Coffee,
  Smartphone,
  BatteryCharging,
  CheckCircle2,
  Frown,
  Moon,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useFocusStore,
} from "@/store/focus-store";

import {
  useAuthStore,
} from "@/store/auth-store";

type SessionRating =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8;

const ratings = [
  {
    value: 1,
    label:
      "Could not focus",
    icon: Frown,
    desc:
      "Very distracted session",
  },
  {
    value: 2,
    label:
      "Phone distracted me",
    icon: Smartphone,
    desc:
      "Too many interruptions",
  },
  {
    value: 3,
    label:
      "Distracted",
    icon: Coffee,
    desc:
      "Focus kept breaking",
  },
  {
    value: 4,
    label:
      "Average",
    icon:
      BatteryCharging,
    desc:
      "Some productive moments",
  },
  {
    value: 5,
    label:
      "Good",
    icon:
      CheckCircle2,
    desc:
      "Mostly productive",
  },
  {
    value: 6,
    label:
      "Great",
    icon: Zap,
    desc:
      "Strong workflow momentum",
  },
  {
    value: 7,
    label:
      "Deep Flow",
    icon: Flame,
    desc:
      "Highly focused session",
  },
  {
    value: 8,
    label:
      "Locked In",
    icon: Brain,
    desc:
      "Peak concentration achieved",
  },
] as const;

export default function FloatingTimer() {
  const [open, setOpen] =
    useState(false);

  const [
    showRating,
    setShowRating,
  ] = useState(false);

  const [
    completedAnimation,
    setCompletedAnimation,
  ] = useState(false);

  const {
    isRunning,
    isPaused,
    currentSessionSeconds,

    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tick,
    completeSession,
  } = useFocusStore();

  const {
    user,
  } =
    useAuthStore();

  useEffect(() => {
    let interval:
      | NodeJS.Timeout
      | undefined;

    if (
      isRunning &&
      !isPaused
    ) {
      interval =
        setInterval(() => {
          tick();
        }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(
          interval
        );
      }
    };
  }, [
    isRunning,
    isPaused,
    tick,
  ]);

  const hrs = Math.floor(
    currentSessionSeconds /
      3600
  );

  const mins = Math.floor(
    (currentSessionSeconds %
      3600) /
      60
  );

  const secs =
    currentSessionSeconds %
    60;

  const formatted =
    `${hrs}`.padStart(
      2,
      "0"
    ) +
    ":" +
    `${mins}`.padStart(
      2,
      "0"
    ) +
    ":" +
    `${secs}`.padStart(
      2,
      "0"
    );

  const timerStatus =
    useMemo(() => {
      if (
        isRunning &&
        !isPaused
      ) {
        return "Running";
      }

      if (isPaused) {
        return "Paused";
      }

      return "Ready";
    }, [
      isRunning,
      isPaused,
    ]);

  const finishSession =
    async (
      rating: SessionRating
    ) => {
      try {
        if (
          typeof completeSession ===
          "function"
        ) {
          await completeSession(
            rating,
            user?.uid
          );
        }

        setCompletedAnimation(
          true
        );

        setTimeout(() => {
          setCompletedAnimation(
            false
          );

          resetTimer();

          setShowRating(
            false
          );

          setOpen(false);
        }, 1800);
      } catch (err) {
        console.error(
          "Session save failed:",
          err
        );
      }
    };

  return (
    <>
      <AnimatePresence>

        {completedAnimation && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-xl"
          >

            <motion.div
              initial={{
                y: 40,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              className="rounded-[40px] border border-white/10 bg-black/60 p-12 text-center shadow-[0_0_80px_rgba(168,85,247,0.4)] backdrop-blur-3xl"
            >

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_60px_rgba(168,85,247,0.45)]">

                <Sparkles className="h-10 w-10 text-white" />

              </div>

              <h2 className="mt-8 text-4xl font-black text-white">

                Session Logged

              </h2>

              <p className="mt-3 text-zinc-400">

                Analytics updated successfully

              </p>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

      <AnimatePresence>

        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed bottom-24 right-6 z-[100] flex max-h-[calc(100vh-120px)] w-[380px] flex-col overflow-hidden rounded-[34px] border border-white/10 bg-black/50 shadow-[0_0_80px_rgba(168,85,247,0.28)] backdrop-blur-3xl"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_55%)]" />

            <div className="relative flex-1 overflow-y-auto p-7">

              <div className="flex items-center justify-between">

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-zinc-400">

                    <Moon className="h-3 w-3 text-fuchsia-300" />

                    Deep Work

                  </div>

                  <h2 className="mt-4 text-3xl font-black text-white">

                    Focus Timer

                  </h2>

                </div>

                <button
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
                >

                  <X className="h-4 w-4" />

                </button>

              </div>

              <div className="mt-5">

                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">

                  {timerStatus}

                </div>

              </div>

              <div className="mt-10 flex flex-col items-center">

                <div className="relative flex h-60 w-60 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] shadow-inner">

                  <motion.div
                    animate={{
                      rotate:
                        isRunning &&
                        !isPaused
                          ? 360
                          : 0,
                    }}
                    transition={{
                      repeat:
                        Infinity,
                      duration: 12,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border-t border-purple-400/40"
                  />

                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.18),transparent_70%)]" />

                  <div className="relative text-center">

                    <p className="text-sm text-zinc-500">

                      Elapsed Time

                    </p>

                    <h1 className="mt-3 text-5xl font-black tracking-tight text-white">

                      {formatted}

                    </h1>

                  </div>

                </div>

                <div className="mt-10 flex items-center gap-4">

                  {!isRunning &&
                  !isPaused ? (
                    <button
                      onClick={
                        startTimer
                      }
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition hover:scale-105"
                    >

                      <Play className="h-5 w-5" />

                    </button>
                  ) : isRunning &&
                    !isPaused ? (
                    <button
                      onClick={
                        pauseTimer
                      }
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg transition hover:scale-105"
                    >

                      <Pause className="h-5 w-5" />

                    </button>
                  ) : (
                    <button
                      onClick={
                        resumeTimer
                      }
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition hover:scale-105"
                    >

                      <Play className="h-5 w-5" />

                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (
                        currentSessionSeconds >
                        0
                      ) {
                        pauseTimer();

                        setShowRating(
                          true
                        );
                      }
                    }}
                    disabled={
                      currentSessionSeconds ===
                      0
                    }
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    <Check className="h-5 w-5" />

                  </button>

                  <button
                    onClick={
                      resetTimer
                    }
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:bg-white/[0.08]"
                  >

                    <RotateCcw className="h-5 w-5" />

                  </button>

                </div>

              </div>

              <AnimatePresence>

                {showRating && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 20,
                    }}
                    className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <h3 className="text-xl font-black text-white">

                          Session Review

                        </h3>

                        <p className="mt-1 text-sm text-zinc-400">

                          How productive was this session?

                        </p>

                      </div>

                      <button
                        onClick={() =>
                          setShowRating(
                            false
                          )
                        }
                        className="text-zinc-500 transition hover:text-white"
                      >

                        <X className="h-4 w-4" />

                      </button>

                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">

                      {ratings.map(
                        (
                          rating
                        ) => (
                          <button
                            key={
                              rating.value
                            }
                            onClick={() =>
                              finishSession(
                                rating.value as SessionRating
                              )
                            }
                            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-all hover:border-purple-500/40 hover:bg-purple-500/10"
                          >

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">

                              <rating.icon className="h-5 w-5 text-white" />

                            </div>

                            <p className="mt-4 text-sm font-semibold text-white">

                              {
                                rating.label
                              }

                            </p>

                            <p className="mt-1 text-xs leading-relaxed text-zinc-500">

                              {
                                rating.desc
                              }

                            </p>

                            <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">

                              Score{" "}
                              {
                                rating.value
                              }
                              /8

                            </div>

                          </button>
                        )
                      )}

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

      <motion.button
        whileTap={{
          scale: 0.95,
        }}
        whileHover={{
          scale: 1.05,
        }}
        onClick={() =>
          setOpen(!open)
        }
        className="fixed bottom-6 right-6 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-[0_0_60px_rgba(168,85,247,0.45)]"
      >

        <Timer className="h-6 w-6" />

      </motion.button>
    </>
  );
}