import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Clock3, TrendingUp, Sparkles, Brain } from "lucide-react";

type SessionReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    duration: number; // in seconds
    xpGained: number;
    notesCreated: number;
  };
};

export default function SessionReviewModal({
  isOpen,
  onClose,
  sessionData,
}: SessionReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Auto-close if rating is submitted
  const handleSubmit = () => {
    // In a real implementation, we'd save the rating to the store here
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center pt-[5vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-[32px] border border-border bg-secondary shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border bg-background px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
                  <Brain className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Session Review</h3>
                  <p className="text-xs font-semibold text-muted-foreground">Neural analysis complete</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-border transition-colors"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-background p-5 text-center">
                  <Clock3 className="mx-auto h-6 w-6 text-accent mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Focus Time</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{Math.round(sessionData.duration / 60)}m</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-5 text-center">
                  <TrendingUp className="mx-auto h-6 w-6 text-accent mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Productivity</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">+{sessionData.xpGained} XP</p>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-center text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Rate your focus depth
                </h4>
                <div className="mt-4 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          (hoverRating || rating) >= star
                            ? "fill-accent text-accent"
                            : "text-border"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-[20px] border border-border bg-background p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Sparkles className="h-4 w-4 text-accent" />
                  AI Insight
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Excellent flow state maintained during this block. Try to carry this momentum into your next session after a 5-minute break.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!rating}
                className="mt-8 w-full rounded-xl bg-foreground py-4 text-sm font-bold text-background transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                Complete Review
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
