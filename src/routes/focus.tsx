import { createFileRoute } from "@tanstack/react-router";

import {
  Brain,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  Maximize2,
  Minimize2,
  Coffee,
  Flame,
  Clock3,
  Zap,
  Headphones,
  Trophy,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";

import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";

import {
  useSettingsStore,
} from "@/store/settings-store";

import {
  useProductivityStore,
} from "@/store/productivity-store";

export const Route =
  createFileRoute("/focus")({
    component: FocusPage,
  });

function FocusPage() {
  const {
    focusDuration,
    breakDuration,
    ambientMode,
    soundEffects,

    focusMusic,
    setFocusMusic,

    autoResumeFocus,

    fullscreenFocus,
    toggleFullscreenFocus,

    addXP,
    totalXP,

    activeSession,
    setActiveSession,

    incrementInterruptions,

    completeSession:
      completeStoredSession,
  } =
    useSettingsStore();

  const productivity =
    useProductivityStore() as any;

  const [
    mode,
    setMode,
  ] = useState<
    "focus" | "break"
  >(
    activeSession
      ?.mode ||
      "focus"
  );

  const [
    running,
    setRunning,
  ] = useState(
    !!activeSession
  );

  const [
    fullscreen,
    setFullscreen,
  ] = useState(
    fullscreenFocus
  );

  const [
    sessionCount,
    setSessionCount,
  ] = useState(
    productivity
      ?.completedSessions ||
      0
  );

  const [
    seconds,
    setSeconds,
  ] = useState(
    activeSession
      ?.remainingSeconds ||
      focusDuration *
        60
  );

  const [
    pulse,
    setPulse,
  ] = useState(1);

  const [
    breathing,
    setBreathing,
  ] = useState(false);

  const [
    xpPopup,
    setXpPopup,
  ] = useState(false);

  useEffect(() => {
    if (
      !autoResumeFocus
    ) {
      setActiveSession(
        null
      );
    }
  }, []);

  useEffect(() => {
    document.title =
      running
        ? `${formatTime(
            seconds
          )} • Focus`
        : "corTeX.ai";
  }, [
    seconds,
    running,
  ]);

  useEffect(() => {
    const handleVisibility =
      () => {
        if (
          document.hidden &&
          running
        ) {
          incrementInterruptions();
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
  }, [running]);

  useEffect(() => {
    if (!running)
      return;

    const interval =
      setInterval(() => {
        setSeconds(
          (
            prev
          ) => {
            const next =
              prev - 1;

            setActiveSession(
              {
                startedAt:
                  Date.now(),

                mode,

                remainingSeconds:
                  next,
              }
            );

            if (
              next <= 0
            ) {
              completeFocusSession();

              return 0;
            }

            return next;
          }
        );
      }, 1000);

    return () =>
      clearInterval(
        interval
      );
  }, [
    running,
    mode,
  ]);

  useEffect(() => {
    if (!running)
      return;

    const pulseInterval =
      setInterval(() => {
        setPulse(
          1 +
            Math.random() *
              0.04
        );
      }, 1200);

    return () =>
      clearInterval(
        pulseInterval
      );
  }, [running]);

  useEffect(() => {
    if (!running) {
      setBreathing(
        false
      );

      return;
    }

    const interval =
      setInterval(() => {
        setBreathing(
          (
            prev
          ) => !prev
        );
      }, 4000);

    return () =>
      clearInterval(
        interval
      );
  }, [running]);

  useEffect(() => {
    if (
      fullscreen
    ) {
      document.documentElement.requestFullscreen?.();
    } else if (
      document.fullscreenElement
    ) {
      document.exitFullscreen?.();
    }
  }, [fullscreen]);

  const total =
    mode ===
    "focus"
      ? focusDuration *
        60
      : breakDuration *
        60;

  const progress =
    (
      seconds /
      total
    ) *
    100;

  const stroke =
    1256 -
    (1256 *
      progress) /
      100;

  const formatted =
    formatTime(
      seconds
    );

  const completeFocusSession =
    () => {
      setRunning(
        false
      );

      setActiveSession(
        null
      );

      completeStoredSession();

      if (
        mode ===
        "focus"
      ) {
        setSessionCount(
          (
            prev: number
          ) =>
            prev +
            1
        );

        addXP(25);

        setXpPopup(
          true
        );

        setTimeout(
          () =>
            setXpPopup(
              false
            ),
          2500
        );

        productivity?.addCompletedSession?.(
          {
            duration:
              focusDuration,

            completedAt:
              Date.now(),

            productivity: Math.max(0, 100 - ((useSettingsStore.getState().interruptionCount || 0) * 15)),
            mode: "focus",
            id: crypto.randomUUID(),
          }
        );
        useSettingsStore.setState({ interruptionCount: 0 });

        if (
          soundEffects
        ) {
          const audio =
            new Audio(
              "/notification.mp3"
            );

          audio.volume =
            0.4;

          audio.play();
        }

        setMode(
          "break"
        );

        setSeconds(
          breakDuration *
            60
        );
      } else {
        setMode(
          "focus"
        );

        setSeconds(
          focusDuration *
            60
        );
      }
    };

  const resetTimer =
    () => {
      setRunning(
        false
      );

      setActiveSession(
        null
      );

      setSeconds(
        mode ===
          "focus"
          ? focusDuration *
              60
          : breakDuration *
              60
      );
    };

  const toggleFullscreen =
    () => {
      toggleFullscreenFocus();

      setFullscreen(
        (
          prev
        ) => !prev
      );
    };

  const motivational =
    useMemo(
      () => {
        if (
          sessionCount >=
          10
        )
          return "Elite cognitive synchronization achieved.";

        if (
          sessionCount >=
          5
        )
          return "Momentum compounding beautifully.";

        if (
          sessionCount >=
          1
        )
          return "Deep work systems online.";

        return "Prepare for focused execution.";
      },
      [
        sessionCount,
      ]
    );

  return (
    <div
      className={`min-h-screen overflow-hidden bg-[#050816] text-white ${
        fullscreen
          ? "fixed inset-0 z-[999]"
          : ""
      }`}
    >

      {!fullscreen && (
        <WorkspaceSidebar />
      )}

      <div
        className={`relative z-10 ${
          fullscreen
            ? ""
            : "ml-[84px] lg:ml-[280px]"
        }`}
      >

        {!fullscreen && (
          <WorkspaceHeader />
        )}

        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-8 pt-24">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_25%)]" />

          {ambientMode && (
            <motion.div
              animate={{
                scale: [
                  1,
                  1.1,
                  1,
                ],
              }}
              transition={{
                duration: 8,
                repeat:
                  Infinity,
              }}
              className="absolute h-[700px] w-[700px] rounded-full bg-purple-500/10 blur-[140px]"
            />
          )}

          <AnimatePresence>

            {xpPopup && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                className="absolute right-10 top-10 z-50 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-5 backdrop-blur-3xl"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20">

                    <Trophy className="h-6 w-6 text-emerald-300" />

                  </div>

                  <div>

                    <p className="text-sm text-emerald-300">

                      Session Completed

                    </p>

                    <h3 className="mt-1 text-2xl font-black text-white">

                      +25 XP

                    </h3>

                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

          <div className="relative z-10 flex w-full max-w-[1600px] flex-col items-center">

            <div className="mb-10 flex flex-wrap items-center justify-center gap-4">

              <TopStat
                icon={Flame}
                label="Sessions"
                value={`${sessionCount}`}
              />

              <TopStat
                icon={Zap}
                label="XP"
                value={`${totalXP}`}
              />

              <TopStat
                icon={Brain}
                label="Mode"
                value={
                  mode ===
                  "focus"
                    ? "Deep Focus"
                    : "Recovery"
                }
              />

              <TopStat
                icon={Clock3}
                label="Duration"
                value={`${focusDuration}m`}
              />

            </div>

            <div className="relative flex items-center justify-center">

              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  repeat:
                    Infinity,
                  duration: 30,
                  ease: "linear",
                }}
                className="absolute h-[430px] w-[430px] rounded-full border border-purple-500/20"
              />

              <motion.div
                animate={{
                  scale:
                    running
                      ? pulse
                      : 1,
                }}
                transition={{
                  duration: 2,
                  repeat:
                    Infinity,
                }}
                className={`absolute h-[350px] w-[350px] rounded-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 blur-3xl transition-all duration-1000 ${
                  breathing
                    ? "scale-110 opacity-100"
                    : "scale-100 opacity-70"
                }`}
              />

              <svg
                className="relative z-10 h-[420px] w-[420px] -rotate-90"
                viewBox="0 0 440 440"
              >

                <circle
                  cx="220"
                  cy="220"
                  r="200"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="12"
                  fill="transparent"
                />

                <motion.circle
                  cx="220"
                  cy="220"
                  r="200"
                  stroke="url(#gradient)"
                  strokeWidth="14"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray="1256"
                  strokeDashoffset={
                    stroke
                  }
                />

                <defs>

                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >

                    <stop
                      offset="0%"
                      stopColor="#a855f7"
                    />

                    <stop
                      offset="50%"
                      stopColor="#ec4899"
                    />

                    <stop
                      offset="100%"
                      stopColor="#22d3ee"
                    />

                  </linearGradient>

                </defs>

              </svg>

              <div className="absolute z-20 text-center">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />

                  {mode ===
                  "focus"
                    ? "Deep Work Session"
                    : "Recovery Session"}

                </div>

                <h1 className="mt-8 text-8xl font-black tracking-tight">

                  {formatted}

                </h1>

                <p className="mt-4 text-lg text-zinc-400">

                  {
                    motivational
                  }

                </p>

              </div>

            </div>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-5">

              <ActionButton
                active={
                  running
                }
                onClick={() =>
                  setRunning(
                    (
                      prev
                    ) =>
                      !prev
                  )
                }
                icon={
                  running
                    ? Pause
                    : Play
                }
                label={
                  running
                    ? "Pause"
                    : "Start"
                }
              />

              <ActionButton
                onClick={
                  resetTimer
                }
                icon={
                  RotateCcw
                }
                label="Reset"
              />

              <ActionButton
                onClick={
                  toggleFullscreen
                }
                icon={
                  fullscreen
                    ? Minimize2
                    : Maximize2
                }
                label={
                  fullscreen
                    ? "Exit"
                    : "Focus"
                }
              />

            </div>

            <div className="mt-16 grid w-full max-w-5xl gap-6 xl:grid-cols-3">

              <InsightCard
                icon={Headphones}
                title="Soundscape"
                value={
                  focusMusic
                }
                desc="Current neural soundtrack."
              />

              <InsightCard
                icon={Coffee}
                title="Recovery"
                value={`${breakDuration}m`}
                desc="Optimized reset interval."
              />

              <InsightCard
                icon={Volume2}
                title="Ambient"
                value={
                  soundEffects
                    ? "Enabled"
                    : "Muted"
                }
                desc="Workspace sound system."
              />

            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              {[
                "Neural Ambient",
                "Deep Space",
                "Lo-Fi Flow",
                "Rain Focus",
              ].map(
                (
                  item
                ) => (
                  <button
                    key={item}
                    onClick={() =>
                      setFocusMusic(
                        item
                      )
                    }
                    className={`rounded-2xl border px-5 py-3 text-sm transition-all duration-300 ${
                      focusMusic ===
                      item
                        ? "border-purple-500/30 bg-purple-500/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-zinc-400"
                    }`}
                  >

                    {item}

                  </button>
                )
              )}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

function TopStat({
  icon: Icon,
  label,
  value,
}: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-3xl">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10">

          <Icon className="h-5 w-5 text-purple-300" />

        </div>

        <div>

          <p className="text-sm text-zinc-500">

            {label}

          </p>

          <h3 className="mt-1 text-2xl font-black text-white">

            {value}

          </h3>

        </div>

      </div>

    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  value,
  desc,
}: any) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-3xl">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">

        <Icon className="h-6 w-6 text-purple-300" />

      </div>

      <h3 className="mt-6 text-2xl font-bold text-white">

        {title}

      </h3>

      <p className="mt-4 text-4xl font-black text-white">

        {value}

      </p>

      <p className="mt-4 text-sm leading-relaxed text-zinc-500">

        {desc}

      </p>

    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  active,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-3xl border px-7 py-5 text-lg font-semibold transition-all duration-300 ${
        active
          ? "border-purple-500/30 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white shadow-[0_0_40px_rgba(168,85,247,0.35)]"
          : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
      }`}
    >

      <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

      {label}

    </button>
  );
}

function formatTime(
  total: number
) {
  const minutes =
    Math.floor(
      total / 60
    )
      .toString()
      .padStart(2, "0");

  const seconds =
    Math.floor(
      total % 60
    )
      .toString()
      .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export default FocusPage;