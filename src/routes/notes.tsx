import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus, Sparkles, Clock3, Star, Trash2, FileText, Brain, Layers3, Pin, Wand2, FolderOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import NoteEditor from "@/components/workspace/NoteEditor";
import TemplateSelector from "@/components/notes/TemplateSelector";
import { useNotesStore } from "@/store/notes-store";
import { useWorkspaceStore } from "@/store/workspace-store";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
});

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "");
}

function NotesPage() {
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "favorites">("all");
  const { sidebarCollapsed } = useWorkspaceStore();
  const { notes, activeNoteId, createNote, deleteNote, updateNote, setActiveNote, toggleFavorite } = useNotesStore();

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        stripHtml(note.content).toLowerCase().includes(search.toLowerCase());
      const matchesTab = selectedTab === "favorites" ? note.favorite : true;
      return matchesSearch && matchesTab;
    });
  }, [notes, search, selectedTab]);

  const favoriteCount = notes.filter((n) => n.favorite).length;
  const totalWords = notes.reduce(
    (acc, note) => acc + stripHtml(note.content).split(/\s+/).filter(Boolean).length,
    0
  );
  const estimatedReading = Math.max(1, Math.floor(totalWords / 220));

  return (
    <WorkspaceShell>
      <motion.div
        layout
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-w-0 flex-col gap-6 overflow-visible"
      >
        <section className="relative overflow-hidden paper-panel rounded-[24px] border border-border p-5 lg:p-8 transition-colors duration-500">
          <div className="relative flex min-w-0 flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Knowledge Workspace
              </div>
              <h1 className="mt-6 break-words text-4xl font-display font-bold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl text-foreground">
                Your <span className="text-accent italic">second brain</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Capture ideas, organize knowledge and build an intelligent connected thinking system on paper.
              </p>
            </div>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <StatsCard icon={FileText} label="Notes" value={notes.length.toString()} />
              <StatsCard icon={Star} label="Favorites" value={favoriteCount.toString()} />
              <StatsCard icon={Brain} label="Words" value={totalWords.toString()} />
              <StatsCard icon={Clock3} label="Reading" value={`${estimatedReading}m`} />
            </div>
          </div>
        </section>

        <section className="grid min-w-0 gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
          <motion.div layout className="min-w-0 space-y-6 overflow-visible">
            <div className="paper-panel rounded-[24px] border border-border p-6 transition-colors duration-500">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold text-foreground">Knowledge Base</h2>
                  <p className="mt-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">Organize your thoughts</p>
                </div>
                <button
                  onClick={() => createNote()}
                  className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-sm transition-all duration-300 hover:bg-accent hover:text-white hover:scale-105 active:scale-95"
                >
                  <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>
              <div className="relative mt-6">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notes..."
                  className="h-11 w-full rounded-xl border border-border bg-secondary pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                />
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setSelectedTab("all")}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    selectedTab === "all"
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-secondary text-muted-foreground hover:bg-background"
                  }`}
                >
                  All Notes
                </button>
                <button
                  onClick={() => setSelectedTab("favorites")}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    selectedTab === "favorites"
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-secondary text-muted-foreground hover:bg-background"
                  }`}
                >
                  Favorites
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-340px)] overflow-y-auto overflow-x-visible space-y-3 pr-2 custom-scrollbar">
              {filteredNotes.map((note) => (
                <motion.button
                  layout
                  key={note.id}
                  onClick={() => setActiveNote(note.id)}
                  whileHover={{ y: -2 }}
                  className={`group relative w-full overflow-visible rounded-[20px] border p-5 text-left transition-all duration-200 ${
                    activeNote?.id === note.id
                      ? "border-accent bg-secondary shadow-sm"
                      : "border-border bg-background hover:border-accent/50 hover:bg-secondary/50"
                  }`}
                >
                  <div className="relative flex min-w-0 items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background border border-border group-hover:border-accent/30 transition-colors">
                          <Layers3 className="h-4 w-4 text-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center gap-2">
                            <h3 className="truncate text-base font-bold text-foreground">{note.title}</h3>
                            {note.favorite && <Pin className="h-3 w-3 shrink-0 text-accent" />}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Clock3 className="h-3 w-3 shrink-0" />
                            {formatDate(note.updatedAt)}
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 line-clamp-3 break-words text-sm leading-relaxed text-muted-foreground">
                        {stripHtml(note.content) || "Empty note"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(note.id);
                        }}
                        className="rounded-lg border border-border bg-background p-2 transition-colors hover:bg-secondary"
                      >
                        <Star className={`h-4 w-4 ${note.favorite ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="rounded-lg border border-border bg-background p-2 text-muted-foreground transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.button>
              ))}

              {filteredNotes.length === 0 && (
                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-secondary text-center">
                  <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-5 text-base font-bold text-foreground">No notes found</p>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">Start creating intelligent connected notes for your second brain.</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div layout className="min-w-0 overflow-hidden rounded-[24px] paper-panel border border-border transition-colors duration-500">
            {activeNote ? (
              <div className="flex h-full min-w-0 flex-col">
                <div className="border-b border-border p-5 lg:p-8">
                  <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <input
                        value={activeNote.title}
                        onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                        placeholder="Untitled Note"
                        className="w-full min-w-0 truncate bg-transparent text-3xl font-display font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground lg:text-4xl"
                      />
                      <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1">
                          <Clock3 className="h-3 w-3" />
                          Updated {formatDate(activeNote.updatedAt)}
                        </div>
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1 text-accent">
                          <Brain className="h-3 w-3" />
                          Connected Knowledge
                        </div>
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1">
                          <Wand2 className="h-3 w-3" />
                          AI Ready
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(activeNote.id)}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background transition-colors hover:bg-secondary"
                    >
                      <Star className={`h-5 w-5 ${activeNote.favorite ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto relative">
                  {stripHtml(activeNote.content).trim() === "" && (
                    <TemplateSelector onSelect={(content) => updateNote(activeNote.id, { content })} />
                  )}
                  <NoteEditor
                    content={activeNote.content}
                    onChange={(value) => updateNote(activeNote.id, { content: value })}
                  />
                  
                  {activeNote.backlinks && activeNote.backlinks.length > 0 && (
                    <div className="border-t border-border bg-secondary/30 p-6 lg:px-8 lg:py-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Layers3 className="h-4 w-4 text-accent" />
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Referenced By</h4>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {activeNote.backlinks.map((link) => {
                          const backlinkNote = notes.find((n) => n.id === link.targetNoteId);
                          if (!backlinkNote) return null;
                          return (
                            <button
                              key={link.targetNoteId}
                              onClick={() => setActiveNote(link.targetNoteId)}
                              className="group flex flex-col items-start gap-1 rounded-xl border border-border bg-background p-4 text-left transition hover:border-accent hover:shadow-sm"
                            >
                              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                                {backlinkNote.title}
                              </span>
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                {stripHtml(backlinkNote.content) || "Empty note"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[700px] flex-col items-center justify-center px-6 text-center">
                <Brain className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-5 text-xl font-bold text-foreground">Create your first note</p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">Start building your intelligent second brain with connected knowledge.</p>
              </div>
            )}
          </motion.div>
        </section>
      </motion.div>
    </WorkspaceShell>
  );
}

function StatsCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="paper-card rounded-[20px] border border-border bg-background p-5 transition-colors duration-500"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <h3 className="mt-1 truncate text-3xl font-display font-bold text-foreground">{value}</h3>
    </motion.div>
  );
}

export default NotesPage;