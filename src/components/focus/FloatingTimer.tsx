"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Timer, X, Check, Brain, Clock3, TrendingUp, Sparkles, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFocusStore } from "@/store/focus-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import SessionReviewModal from "../dashboard/SessionReviewModal";

export default function FloatingTimer() {
  const [open, setOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [sessionData, setSessionData] = useState({ duration: 0, xpGained: 0, notesCreated: 0 });

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

  const { user } = useAuthStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning && !isPaused) {
      interval = setInterval(() => tick(), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isRunning, isPaused, tick]);

  const hrs = Math.floor(currentSessionSeconds / 3600);
  const mins = Math.floor((currentSessionSeconds % 3600) / 60);
  const secs = currentSessionSeconds % 60;
  const formatted = `${hrs}`.padStart(2, "0") + ":" + `${mins}`.padStart(2, "0") + ":" + `${secs}`.padStart(2, "0");

  const timerStatus = useMemo(() => {
    if (isRunning && !isPaused) return "Deep Work";
    if (isPaused) return "Paused";
    return "Ready to focus";
  }, [isRunning, isPaused]);

  const handleFinish = async () => {
    if (currentSessionSeconds > 0) {
      pauseTimer();
      setSessionData({
        duration: currentSessionSeconds,
        xpGained: Math.round(currentSessionSeconds / 60) * 5, // example calculation
        notesCreated: 0
      });
      setShowReview(true);
    }
  };

  const handleReviewClose = async () => {
    setShowReview(false);
    try {
      if (typeof completeSession === "function") {
        await completeSession(8, user?.id); // defaults to 8 in this simplified version to match focus-store types
      }
      toast.success("Session logged successfully", {
        description: `You focused for ${Math.round(currentSessionSeconds / 60)} minutes.`,
        icon: <Brain className="h-4 w-4 text-accent" />
      });
      resetTimer();
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 z-[100] flex w-[360px] flex-col overflow-hidden rounded-[28px] paper-panel shadow-2xl lg:bottom-6 lg:right-24"
          >
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground font-bold">
                    <Brain className="h-3 w-3 text-accent" />
                    {timerStatus}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-border"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[8px] border-secondary bg-background shadow-inner">
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">Time Elapsed</p>
                    <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">{formatted}</h1>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  {!isRunning && !isPaused ? (
                    <button
                      onClick={startTimer}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm transition hover:scale-105"
                    >
                      <Play className="h-5 w-5" />
                    </button>
                  ) : isRunning && !isPaused ? (
                    <button
                      onClick={pauseTimer}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-sm transition hover:scale-105"
                    >
                      <Pause className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={resumeTimer}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm transition hover:scale-105"
                    >
                      <Play className="h-5 w-5" />
                    </button>
                  )}

                  <button
                    onClick={handleFinish}
                    disabled={currentSessionSeconds === 0}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border text-foreground transition-all hover:bg-border disabled:opacity-50"
                  >
                    <Check className="h-5 w-5 text-accent" />
                  </button>

                  <button
                    onClick={resetTimer}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border text-muted-foreground transition hover:bg-border hover:text-foreground"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-4 z-[99] flex h-14 w-14 items-center justify-center rounded-2xl lg:bottom-6 lg:right-6 lg:h-16 lg:w-16 bg-foreground text-background shadow-lg transition-colors"
      >
        <Timer className="h-6 w-6" />
      </motion.button>
      
      <SessionReviewModal 
        isOpen={showReview} 
        onClose={handleReviewClose} 
        sessionData={sessionData} 
      />
    </>
  );
}