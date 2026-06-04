import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Command as CommandIcon,
  FileText,
  LayoutDashboard,
  CheckSquare,
  Plus,
  Search,
  Brain,
  BarChart3,
  Zap,
  Star,
  Clock3,
  Network,
  Sparkles,
  ArrowRight,
  Settings,
} from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { useNotesStore } from "@/store/notes-store";
import { useTasksStore } from "@/store/tasks-store";

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const navigate = useNavigate();

  const { createNote, searchNotes, getRecentNotes, getFavoriteNotes, setActiveNote } = useNotesStore();
  const { tasks } = useTasksStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const goTo = (path: string) => {
    navigate({ to: path });
    setOpen(false);
    setQuery("");
  };

  const openNote = (id: string) => {
    setActiveNote(id);
    navigate({ to: "/notes" });
    setOpen(false);
    setQuery("");
  };

  const createNewNote = () => {
    createNote();
    navigate({ to: "/notes" });
    setOpen(false);
    setQuery("");
  };

  const safeQuery = (query || "").toLowerCase();

  const matchingNotes = React.useMemo(() => {
    if (!safeQuery.trim()) return [];
    try {
      return searchNotes(safeQuery).filter((n) => n && typeof n.id === "string");
    } catch {
      return [];
    }
  }, [safeQuery, searchNotes]);

  const matchingTasks = React.useMemo(() => {
    if (!safeQuery.trim()) return [];
    return tasks.filter((t) => t.title.toLowerCase().includes(safeQuery));
  }, [safeQuery, tasks]);

  const recentNotes = React.useMemo(() => {
    try {
      const results = getRecentNotes();
      return Array.isArray(results) ? results.filter((n) => n && typeof n.id === "string") : [];
    } catch {
      return [];
    }
  }, [getRecentNotes]);

  const favoriteNotes = React.useMemo(() => {
    try {
      const results = getFavoriteNotes();
      return Array.isArray(results) ? results.filter((n) => n && typeof n.id === "string") : [];
    } catch {
      return [];
    }
  }, [getFavoriteNotes]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-start justify-center pt-[12vh] bg-background/50 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-[24px] border border-border bg-secondary shadow-2xl"
          >
            <CommandPrimitive shouldFilter={false} className="flex h-full w-full flex-col">
              <div className="relative border-b border-border px-5 py-4 flex items-center gap-3">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <CommandPrimitive.Input
                  autoFocus
                  value={query || ""}
                  onValueChange={(val) => setQuery(val || "")}
                  placeholder="Search notes, tasks, or type a command..."
                  className="flex-1 bg-transparent text-lg font-medium text-foreground outline-none placeholder:text-muted-foreground"
                />
                <div className="rounded-md border border-border bg-background px-2 py-1 text-xs font-bold text-muted-foreground">
                  ESC
                </div>
              </div>

              <CommandPrimitive.List className="max-h-[50vh] overflow-y-auto p-3 custom-scrollbar">
                <CommandPrimitive.Empty className="py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground">No results found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Try searching notes, tasks or commands</p>
                </CommandPrimitive.Empty>

                {matchingNotes.length > 0 && (
                  <Section title="Knowledge Search">
                    {matchingNotes.slice(0, 4).map((note) => (
                      <PaletteItem
                        key={note.id}
                        icon={FileText}
                        label={note.title || "Untitled Note"}
                        desc={note.plainText?.slice(0, 60) || "Knowledge note"}
                        onSelect={() => openNote(note.id)}
                      />
                    ))}
                  </Section>
                )}

                {matchingTasks.length > 0 && (
                  <Section title="Tasks Search">
                    {matchingTasks.slice(0, 4).map((task) => (
                      <PaletteItem
                        key={task.id}
                        icon={CheckSquare}
                        label={task.title}
                        desc={task.completed ? "Completed task" : "Pending task"}
                        onSelect={() => goTo("/tasks")}
                      />
                    ))}
                  </Section>
                )}

                {!safeQuery && (
                  <>
                    <Section title="Navigation">
                      <PaletteItem icon={LayoutDashboard} label="Workspace Dashboard" onSelect={() => goTo("/workspace")} />
                      <PaletteItem icon={FileText} label="Knowledge Base" onSelect={() => goTo("/notes")} />
                      <PaletteItem icon={CheckSquare} label="Task Execution" onSelect={() => goTo("/tasks")} />
                      <PaletteItem icon={BarChart3} label="Analytics & Insights" onSelect={() => goTo("/analytics")} />
                      <PaletteItem icon={Settings} label="Workspace Settings" onSelect={() => goTo("/settings")} />
                    </Section>

                    <Section title="Quick Actions">
                      <PaletteItem icon={Plus} label="Create New Note" desc="Instantly capture an idea" onSelect={createNewNote} />
                      <PaletteItem icon={Zap} label="Start AI Focus Session" desc="Begin deep work" onSelect={() => goTo("/workspace")} />
                    </Section>

                    {recentNotes.length > 0 && (
                      <Section title="Recent Notes">
                        {recentNotes.slice(0, 3).map((note) => (
                          <PaletteItem key={note.id} icon={Clock3} label={note.title || "Untitled Note"} desc="Recently updated" onSelect={() => openNote(note.id)} />
                        ))}
                      </Section>
                    )}
                  </>
                )}
              </CommandPrimitive.List>
            </CommandPrimitive>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-4">
      <div className="mb-2 px-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function PaletteItem({ icon: Icon, label, desc, onSelect }: any) {
  return (
    <CommandPrimitive.Item
      onSelect={onSelect}
      className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-3 outline-none transition-colors hover:bg-background data-[selected=true]:bg-background"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background border border-border group-hover:border-accent/30 transition-colors">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground group-hover:text-accent transition-colors">{label}</p>
          {desc && <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">{desc}</p>}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </CommandPrimitive.Item>
  );
}