import { useEffect, useState } from "react";

import { Link } from "@tanstack/react-router";

import {
  ArrowRight,
  Sparkles,
  Command,
  Brain,
  FileText,
  CheckSquare,
  LayoutDashboard,
  X,
  TimerReset,
  Stars,
  Cpu,
} from "lucide-react";

import { motion } from "framer-motion";

export default function Hero() {
  const [
    openPalette,
    setOpenPalette,
  ] = useState(false);

  const [
    currentText,
    setCurrentText,
  ] = useState(0);

  const rotatingTexts = [
    "students",
    "builders",
    "researchers",
    "creators",
  ];

  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (
        (e.metaKey ||
          e.ctrlKey) &&
        e.key === "k"
      ) {
        e.preventDefault();

        setOpenPalette(true);
      }

      if (
        e.key === "Escape"
      ) {
        setOpenPalette(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  useEffect(() => {
    const interval =
      setInterval(() => {
        setCurrentText(
          (
            prev
          ) =>
            (prev + 1) %
            rotatingTexts.length
        );
      }, 2200);

    return () =>
      clearInterval(
        interval
      );
  }, []);

  const navigation =
    [
      {
        icon:
          LayoutDashboard,
        title:
          "Dashboard",
        desc:
          "Open workspace dashboard",
        href:
          "/workspace",
      },
      {
        icon:
          FileText,
        title:
          "Notes",
        desc:
          "View and manage notes",
        href:
          "/notes",
      },
      {
        icon:
          CheckSquare,
        title:
          "Tasks",
        desc:
          "Track your tasks",
        href:
          "/tasks",
      },
      {
        icon:
          Brain,
        title:
          "AI Assistant",
        desc:
          "Open AI workspace",
        href:
          "/assistant",
      },
    ];

  const actions = [
    {
      title:
        "Create note",
      href:
        "/notes",
    },
    {
      title:
        "Create task",
      href:
        "/tasks",
    },
    {
      title:
        "Start focus session",
      href:
        "/workspace",
    },
    {
      title:
        "Open AI workspace",
      href:
        "/assistant",
    },
  ];

  return (
    <>
      <section className="relative flex min-h-screen overflow-hidden px-6 pb-10 pt-14">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_35%),radial-gradient(circle_at_right,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_left_bottom,rgba(236,72,153,0.12),transparent_30%)]" />

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.45, 0.7, 0.45],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[140px]"
        />

        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
          }}
          className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-cyan-500/10 blur-[120px]"
        />

        <motion.div
          animate={{
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 7,
          }}
          className="absolute bottom-[10%] right-[8%] h-72 w-72 rounded-full bg-pink-500/10 blur-[120px]"
        />

        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="max-w-6xl text-center"
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
                duration: 0.6,
              }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-xs uppercase tracking-[0.25em] text-zinc-400 backdrop-blur-xl"
            >

              <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />

              AI-powered productivity workspace

            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.9,
              }}
              className="text-6xl font-black leading-[0.9] tracking-[-0.05em] text-white md:text-8xl xl:text-[8rem]"
            >

              The operating system

              <br />

              for{" "}

              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">

                deep work.

              </span>

            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.35,
                duration: 0.7,
              }}
              className="mx-auto mt-10 max-w-3xl text-lg leading-[1.9] text-zinc-400 md:text-xl"
            >

              corTeX.ai unifies your notes, tasks,
              focus sessions and AI workflows into
              one calm, intelligent workspace —
              built for{" "}

              <span className="relative inline-flex min-w-[140px] justify-center font-medium text-white">

                <motion.span
                  key={
                    currentText
                  }
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >

                  {
                    rotatingTexts[
                      currentText
                    ]
                  }

                </motion.span>

              </span>

              .

            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.5,
                duration: 0.7,
              }}
              className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >

              <Link
                to="/workspace"
                className="group relative flex h-16 items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 px-8 text-base font-semibold text-white shadow-[0_0_60px_rgba(168,85,247,0.45)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_90px_rgba(168,85,247,0.7)]"
              >

                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-white/10" />

                <Sparkles className="relative h-5 w-5" />

                <span className="relative">

                  Start building your second brain

                </span>

                <ArrowRight className="relative h-5 w-5 transition group-hover:translate-x-1" />

              </Link>

              <button
                onClick={() =>
                  setOpenPalette(true)
                }
                className="group flex h-16 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-7 text-base font-medium text-zinc-300 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.05] hover:text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]"
              >

                <Command className="h-5 w-5" />

                Open command palette

                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-zinc-500">

                  ⌘K

                </div>

              </button>

            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7,
                duration: 0.6,
              }}
              className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500"
            >

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl">

                <Stars className="h-4 w-4 text-fuchsia-300" />

                Real-time workspace intelligence

              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl">

                <Cpu className="h-4 w-4 text-cyan-300" />

                AI-native productivity system

              </div>

            </motion.div>

          </motion.div>

        </div>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            y: [0, 8, 0],
          }}
          transition={{
            opacity: {
              delay: 1.5,
              duration: 1,
            },
            y: {
              repeat: Infinity,
              duration: 2,
            },
          }}
          className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-zinc-500 md:flex"
        >

          <span className="text-[10px] uppercase tracking-[0.35em]">

            Scroll

          </span>

          <div className="flex h-14 w-8 justify-center rounded-full border border-white/10 bg-white/[0.02] p-2">

            <motion.div
              animate={{
                y: [0, 18, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
              }}
              className="h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400"
            />

          </div>

        </motion.div>

        <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-b from-transparent to-[#050510]" />

      </section>

      {openPalette && (
        <div
          onClick={() =>
            setOpenPalette(false)
          }
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-2xl"
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="relative w-full max-w-2xl overflow-hidden rounded-[36px] border border-purple-500/20 bg-[#09090b]/95 shadow-[0_0_120px_rgba(168,85,247,0.35)]"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_45%)]" />

            <button
              onClick={() =>
                setOpenPalette(false)
              }
              className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:text-white"
            >

              <X className="h-4 w-4" />

            </button>

            <div className="relative border-b border-white/10 p-5">

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">

                <Command className="h-5 w-5 text-zinc-500" />

                <input
                  autoFocus
                  placeholder="Search commands, notes, tasks..."
                  className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
                />

              </div>

            </div>

            <div className="relative max-h-[520px] overflow-y-auto p-5">

              <p className="mb-4 px-2 text-xs uppercase tracking-[0.25em] text-zinc-500">

                Navigation

              </p>

              <div className="space-y-2">

                {navigation.map(
                  (
                    item
                  ) => (
                    <Link
                      key={
                        item.title
                      }
                      to={
                        item.href
                      }
                      onClick={() =>
                        setOpenPalette(false)
                      }
                      className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 text-left transition hover:border-purple-500/20 hover:bg-purple-500/10"
                    >

                      <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04]">

                          <item.icon className="h-5 w-5 text-purple-300" />

                        </div>

                        <div>

                          <p className="text-sm font-medium text-white">

                            {
                              item.title
                            }

                          </p>

                          <p className="mt-1 text-xs text-zinc-500">

                            {
                              item.desc
                            }

                          </p>

                        </div>

                      </div>

                      <ArrowRight className="h-4 w-4 text-zinc-500" />

                    </Link>
                  )
                )}

              </div>

              <p className="mb-4 mt-8 px-2 text-xs uppercase tracking-[0.25em] text-zinc-500">

                Quick Actions

              </p>

              <div className="grid gap-3 md:grid-cols-2">

                {actions.map(
                  (
                    item
                  ) => (
                    <Link
                      key={
                        item.title
                      }
                      to={
                        item.href
                      }
                      onClick={() =>
                        setOpenPalette(false)
                      }
                      className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-left transition hover:border-cyan-500/20 hover:bg-cyan-500/10"
                    >

                      <div className="flex items-center justify-between">

                        <p className="text-sm font-medium text-white">

                          {
                            item.title
                          }

                        </p>

                        <TimerReset className="h-4 w-4 text-zinc-500 transition group-hover:text-cyan-300" />

                      </div>

                    </Link>
                  )
                )}

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}