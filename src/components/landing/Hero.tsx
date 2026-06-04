import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Command, Brain, FileText, CheckSquare, LayoutDashboard, X, TimerReset, Stars, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const [openPalette, setOpenPalette] = useState(false);
  const [currentText, setCurrentText] = useState(0);

  const rotatingTexts = ["students", "builders", "researchers", "creators"];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpenPalette(true);
      }
      if (e.key === "Escape") {
        setOpenPalette(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const navigation = [
    { icon: LayoutDashboard, title: "Dashboard", desc: "Open workspace dashboard", href: "/workspace" },
    { icon: FileText, title: "Notes", desc: "View and manage notes", href: "/notes" },
    { icon: CheckSquare, title: "Tasks", desc: "Track your tasks", href: "/tasks" },
    { icon: Brain, title: "AI Assistant", desc: "Open AI workspace", href: "/assistant" },
  ];

  const actions = [
    { title: "Create note", href: "/notes" },
    { title: "Create task", href: "/tasks" },
    { title: "Start focus session", href: "/workspace" },
    { title: "Open AI workspace", href: "/assistant" },
  ];

  return (
    <>
      <section className="relative flex min-h-screen overflow-hidden px-6 pb-10 pt-14 bg-background transition-colors duration-500">
        <div className="absolute inset-0 opacity-[0.4] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Focus & Flow State Workspace
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="text-6xl font-display font-bold leading-[1.1] tracking-tight text-foreground md:text-8xl xl:text-[8rem]"
            >
              The operating system
              <br />
              for{" "}
              <span className="italic text-accent">
                deep work.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="mx-auto mt-10 max-w-3xl text-lg font-medium leading-[1.9] text-muted-foreground md:text-xl"
            >
              corTeX unifies your notes, tasks,
              and focus sessions into
              one calm, distraction-free workspace —
              built for{" "}
              <span className="relative inline-flex min-w-[140px] justify-center font-bold text-foreground">
                <motion.span
                  key={currentText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  {rotatingTexts[currentText]}
                </motion.span>
              </span>
              .
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/workspace"
                className="group relative flex h-16 items-center gap-3 overflow-hidden rounded-[16px] bg-foreground px-8 text-base font-bold text-background shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-accent hover:text-background"
              >
                <Sparkles className="relative h-5 w-5" />
                <span className="relative">Start building your second brain</span>
                <ArrowRight className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() => setOpenPalette(true)}
                className="group flex h-16 items-center gap-3 rounded-[16px] border border-border bg-background px-7 text-base font-bold text-foreground shadow-sm transition-all duration-300 hover:border-foreground hover:bg-secondary"
              >
                <Command className="h-5 w-5" />
                Open command palette
                <div className="rounded-md border border-border bg-secondary px-2 py-1 text-xs font-bold text-muted-foreground">
                  ⌘K
                </div>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 transition-colors">
                <Stars className="h-4 w-4 text-accent" />
                No distractions
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 transition-colors">
                <Cpu className="h-4 w-4 text-accent" />
                Real-time sync
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1.5, duration: 1 },
            y: { repeat: Infinity, duration: 2 },
          }}
          className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-muted-foreground md:flex"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.35em]">
            Scroll
          </span>
          <div className="flex h-14 w-8 justify-center rounded-full border border-border bg-secondary p-2 shadow-sm">
            <motion.div
              animate={{ y: [0, 18, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="h-2 w-2 rounded-full bg-accent"
            />
          </div>
        </motion.div>
      </section>

      {openPalette && (
        <div
          onClick={() => setOpenPalette(false)}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden paper-panel rounded-[24px] border border-border bg-background shadow-lg"
          >
            <button
              onClick={() => setOpenPalette(false)}
              className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative border-b border-border p-5 bg-secondary/50">
              <div className="flex items-center gap-3 rounded-[16px] border border-border bg-background px-5 py-4 shadow-sm focus-within:border-accent transition-colors">
                <Command className="h-5 w-5 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search commands, notes, tasks..."
                  className="flex-1 bg-transparent font-medium text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="custom-scrollbar relative max-h-[520px] overflow-y-auto p-5 bg-background">
              <p className="mb-4 px-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Navigation
              </p>
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    onClick={() => setOpenPalette(false)}
                    className="flex w-full items-center justify-between rounded-[16px] border border-transparent bg-secondary/50 px-5 py-4 text-left transition-colors hover:border-border hover:bg-secondary"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background">
                        <item.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>

              <p className="mb-4 mt-8 px-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Quick Actions
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {actions.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    onClick={() => setOpenPalette(false)}
                    className="group rounded-[16px] border border-transparent bg-secondary/50 p-5 text-left transition-colors hover:border-border hover:bg-secondary"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">
                        {item.title}
                      </p>
                      <TimerReset className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}