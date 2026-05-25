import { createFileRoute } from "@tanstack/react-router";

import {
  Search,
  Plus,
  Sparkles,
  Clock3,
  Star,
  Trash2,
  FileText,
  Brain,
  Layers3,
  Pin,
  Wand2,
  FolderOpen,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import WorkspaceShell from "@/components/workspace/WorkspaceShell";

import NoteEditor from "@/components/workspace/NoteEditor";

import {
  useNotesStore,
} from "@/store/notes-store";

export const Route =
  createFileRoute("/notes")({
    component: NotesPage,
  });

function formatDate(
  timestamp: number
) {
  return new Date(
    timestamp
  ).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function stripHtml(
  html: string
) {
  return html.replace(
    /<[^>]*>?/gm,
    ""
  );
}

function NotesPage() {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedTab,
    setSelectedTab,
  ] = useState<
    "all" | "favorites"
  >("all");

  const {
    notes,
    activeNoteId,
    createNote,
    deleteNote,
    updateNote,
    setActiveNote,
    toggleFavorite,
  } = useNotesStore();

  const activeNote =
    notes.find(
      (n) =>
        n.id ===
        activeNoteId
    ) || notes[0];

  const filteredNotes =
    useMemo(() => {
      return notes.filter(
        (note) => {
          const matchesSearch =
            note.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            stripHtml(
              note.content
            )
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesTab =
            selectedTab ===
            "favorites"
              ? note.favorite
              : true;

          return (
            matchesSearch &&
            matchesTab
          );
        }
      );
    }, [
      notes,
      search,
      selectedTab,
    ]);

  const favoriteCount =
    notes.filter(
      (n) => n.favorite
    ).length;

  const totalWords =
    notes.reduce(
      (acc, note) =>
        acc +
        stripHtml(
          note.content
        )
          .split(/\s+/)
          .filter(Boolean)
          .length,
      0
    );

  const estimatedReading =
    Math.max(
      1,
      Math.floor(
        totalWords / 220
      )
    );

  return (
    <WorkspaceShell>

      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_45%)]" />

        <div className="relative flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

              <Sparkles className="h-3.5 w-3.5 text-purple-400" />

              AI Knowledge Workspace

            </div>

            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight xl:text-7xl">

              Your

              <br />

              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">

                second brain

              </span>

            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400">

              Capture ideas, organize knowledge and build
              an intelligent connected thinking system.

            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-4">

            <StatsCard
              icon={FileText}
              label="Notes"
              value={
                notes.length.toString()
              }
            />

            <StatsCard
              icon={Star}
              label="Favorites"
              value={
                favoriteCount.toString()
              }
            />

            <StatsCard
              icon={Brain}
              label="Words"
              value={
                totalWords.toString()
              }
            />

            <StatsCard
              icon={Clock3}
              label="Reading"
              value={`${estimatedReading}m`}
            />

          </div>

        </div>

      </section>

      <section className="grid gap-6 xl:grid-cols-[390px_1fr]">

        <div className="space-y-6">

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-white">

                  Knowledge Base

                </h2>

                <p className="mt-1 text-sm text-zinc-500">

                  Organize your thoughts

                </p>

              </div>

 <button
  onClick={() => {
    createNote();
  }}
  className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-[0_0_40px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(168,85,247,0.55)] active:scale-95"
>

  <Plus className="h-5 w-5 transition-all duration-300 group-hover:rotate-90" />

</button>

            </div>

            <div className="relative mt-6">

              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search notes..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500/40"
              />

            </div>

            <div className="mt-5 flex gap-3">

              <button
                onClick={() =>
                  setSelectedTab(
                    "all"
                  )
                }
                className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  selectedTab ===
                  "all"
                    ? "border-purple-500/30 bg-purple-500/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
                }`}
              >

                All Notes

              </button>

              <button
                onClick={() =>
                  setSelectedTab(
                    "favorites"
                  )
                }
                className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  selectedTab ===
                  "favorites"
                    ? "border-purple-500/30 bg-purple-500/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
                }`}
              >

                Favorites

              </button>

            </div>

          </div>

         <div
  className="
    max-h-[calc(100vh-340px)]
    overflow-y-auto
    space-y-3
    pr-2
    custom-scrollbar
  "
>

            {filteredNotes.map(
              (note) => (
                <button
                  key={note.id}
                  onClick={() =>
                    setActiveNote(
                      note.id
                    )
                  }
                  className={`group relative w-full overflow-hidden rounded-[30px] border p-5 text-left transition-all duration-300 ${
                    activeNote?.id ===
                    note.id
                      ? "border-purple-500/30 bg-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.08)]"
                      : "border-white/10 bg-white/[0.03] hover:border-purple-500/20 hover:bg-white/[0.05]"
                  }`}
                >

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_40%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                  <div className="relative flex items-start justify-between gap-4">

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/10">

                          <Layers3 className="h-5 w-5 text-purple-300" />

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center gap-2">

                            <h3 className="line-clamp-1 text-lg font-semibold text-white">

                              {
                                note.title
                              }

                            </h3>

                            {note.favorite && (
                              <Pin className="h-3.5 w-3.5 text-yellow-400" />
                            )}

                          </div>

                          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">

                            <Clock3 className="h-3 w-3" />

                            {formatDate(
                              note.updatedAt
                            )}

                          </div>

                        </div>

                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-zinc-400">

                        {stripHtml(
                          note.content
                        ) ||
                          "Empty note"}

                      </p>

                    </div>

                    <div className="flex flex-col items-center gap-3">

                      <button
                        onClick={(
                          e
                        ) => {
                          e.stopPropagation();

                          toggleFavorite(
                            note.id
                          );
                        }}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-2 transition hover:bg-white/[0.08]"
                      >

                        <Star
                          className={`h-4 w-4 ${
                            note.favorite
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-zinc-500"
                          }`}
                        />

                      </button>

                      <button
                        onClick={(
                          e
                        ) => {
                          e.stopPropagation();

                          deleteNote(
                            note.id
                          );
                        }}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-500 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                      >

                        <Trash2 className="h-4 w-4" />

                      </button>

                    </div>

                  </div>

                </button>
              )
            )}

            {filteredNotes.length ===
              0 && (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] text-center">

                <FolderOpen className="h-10 w-10 text-zinc-700" />

                <p className="mt-5 text-lg font-medium text-zinc-400">

                  No notes found

                </p>

                <p className="mt-2 max-w-sm text-sm text-zinc-600">

                  Start creating intelligent connected notes
                  for your second brain.

                </p>

              </div>
            )}

          </div>

        </div>

        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-3xl">

          {activeNote ? (
            <div className="flex h-full flex-col">

              <div className="border-b border-white/10 p-8">

                <div className="flex items-start justify-between gap-5">

                  <div className="flex-1">

                    <input
                      value={
                        activeNote.title
                      }
                      onChange={(e) =>
                        updateNote(
                          activeNote.id,
                          {
                            title:
                              e.target
                                .value,
                          }
                        )
                      }
                      placeholder="Untitled Note"
                      className="w-full bg-transparent text-5xl font-black tracking-tight text-white outline-none placeholder:text-zinc-600"
                    />

                    <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-500">

                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">

                        <Clock3 className="h-3 w-3" />

                        Updated{" "}
                        {formatDate(
                          activeNote.updatedAt
                        )}

                      </div>

                      <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-purple-300">

                        <Brain className="h-3 w-3" />

                        Connected Knowledge

                      </div>

                      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-cyan-300">

                        <Wand2 className="h-3 w-3" />

                        AI Ready

                      </div>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      toggleFavorite(
                        activeNote.id
                      )
                    }
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.08]"
                  >

                    <Star
                      className={`h-5 w-5 ${
                        activeNote.favorite
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-zinc-500"
                      }`}
                    />

                  </button>

                </div>

              </div>

              <div className="flex-1 overflow-hidden">

                <NoteEditor
                  content={
                    activeNote.content
                  }
                  onChange={(
                    value
                  ) =>
                    updateNote(
                      activeNote.id,
                      {
                        content:
                          value,
                      }
                    )
                  }
                />

              </div>

            </div>
          ) : (
            <div className="flex min-h-[700px] flex-col items-center justify-center text-center">

              <Brain className="h-12 w-12 text-zinc-700" />

              <p className="mt-5 text-2xl font-semibold text-zinc-400">

                Create your first note

              </p>

              <p className="mt-2 max-w-md text-sm text-zinc-600">

                Start building your intelligent second brain
                with connected knowledge.

              </p>

            </div>
          )}

        </div>

      </section>

    </WorkspaceShell>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl transition hover:-translate-y-1">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/10">

        <Icon className="h-5 w-5 text-purple-300" />

      </div>

      <p className="mt-4 text-sm text-zinc-500">

        {label}

      </p>

      <h3 className="mt-1 text-4xl font-black text-white">

        {value}

      </h3>

    </div>
  );
}

export default NotesPage;