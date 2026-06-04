import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Sparkles, Send, X } from "lucide-react";
import { useNotesStore } from "@/store/notes-store";
import { useWorkspaceStore } from "@/store/workspace-store";

export default function QuickCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { createNote } = useNotesStore();
  const { activeCollectionId } = useWorkspaceStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!content.trim()) return;

    createNote({
      title: "Quick Capture",
      content: content,
      category: activeCollectionId === "default-research" ? "Research" : "General"
    });
    
    setContent("");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl -translate-x-1/2 rounded-[24px] border border-white/10 bg-black/80 p-2 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex flex-col gap-2 rounded-[20px] border border-white/5 bg-secondary/50 p-4">
              <div className="flex items-center justify-between px-2 pb-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Command className="h-4 w-4 text-accent" />
                  Quick Capture
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <textarea
                ref={inputRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Type your thought... (Press Cmd+Enter to save)"
                className="min-h-[120px] w-full resize-none bg-transparent px-2 text-lg text-white placeholder-muted-foreground outline-none"
              />
              <div className="flex items-center justify-between border-t border-white/10 pt-3 px-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  Supports markdown and [[Bidirectional Links]]
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent/90 disabled:opacity-50"
                >
                  Save <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
