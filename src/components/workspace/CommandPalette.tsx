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
} from "lucide-react";

import {
  Command as CommandPrimitive,
} from "cmdk";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useNotesStore,
} from "@/store/notes-store";

export default function CommandPalette() {
  const [open, setOpen] =
    React.useState(false);

  const [query, setQuery] =
    React.useState("");

  const navigate =
    useNavigate();

  const {
    createNote,
    searchNotes,
    getRecentNotes,
    getFavoriteNotes,
    setActiveNote,
  } = useNotesStore();

  React.useEffect(() => {
    const down = (
      e: KeyboardEvent
    ) => {
      if (
        (e.metaKey ||
          e.ctrlKey) &&
        e.key.toLowerCase() ===
          "k"
      ) {
        e.preventDefault();

        setOpen(
          (o) => !o
        );
      }

      if (
        e.key === "Escape"
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      down
    );

    return () =>
      document.removeEventListener(
        "keydown",
        down
      );
  }, []);

  const goTo = (
    path: string
  ) => {
    navigate({
      to: path,
    });

    setOpen(false);

    setQuery("");
  };

  const openNote = (
    id: string
  ) => {
    setActiveNote(id);

    navigate({
      to: "/notes",
    });

    setOpen(false);

    setQuery("");
  };

  const createNewNote =
    () => {
      createNote();

      navigate({
        to: "/notes",
      });

      setOpen(false);

      setQuery("");
    };

  const safeQuery =
    (
      query || ""
    ).toLowerCase();

  const matchingNotes =
    React.useMemo(() => {
      try {
        if (
          !safeQuery.trim()
        ) {
          return [];
        }

        const results =
          searchNotes(
            safeQuery
          );

        if (
          !Array.isArray(
            results
          )
        ) {
          return [];
        }

        return results.filter(
          (note) =>
            note &&
            typeof note.id ===
              "string"
        );
      } catch (
        error
      ) {
        console.error(
          "Palette search error:",
          error
        );

        return [];
      }
    }, [
      safeQuery,
      searchNotes,
    ]);

  const recentNotes =
    React.useMemo(() => {
      try {
        const results =
          getRecentNotes();

        return Array.isArray(
          results
        )
          ? results.filter(
              (note) =>
                note &&
                typeof note.id ===
                  "string"
            )
          : [];
      } catch {
        return [];
      }
    }, [getRecentNotes]);

  const favoriteNotes =
    React.useMemo(() => {
      try {
        const results =
          getFavoriteNotes();

        return Array.isArray(
          results
        )
          ? results.filter(
              (note) =>
                note &&
                typeof note.id ===
                  "string"
            )
          : [];
      } catch {
        return [];
      }
    }, [getFavoriteNotes]);

  return (
    <>
      <AnimatePresence>

        {open && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-xl"
            onClick={() =>
              setOpen(false)
            }
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 24,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 24,
              }}
              transition={{
                duration: 0.22,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="absolute left-1/2 top-[12%] w-full max-w-3xl -translate-x-1/2 overflow-hidden rounded-[34px] border border-white/10 bg-[#09090b]/95 shadow-[0_0_120px_rgba(168,85,247,0.25)] backdrop-blur-3xl"
            >

              <CommandPrimitive
                shouldFilter={
                  false
                }
                className="w-full"
              >

                <div className="relative border-b border-white/10 px-6 py-5">

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_55%)]" />

                  <div className="relative flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10">

                      <Search className="h-5 w-5 text-purple-300" />

                    </div>

                    <CommandPrimitive.Input
                      autoFocus
                      value={
                        query || ""
                      }
                      onValueChange={(
                        value
                      ) =>
                        setQuery(
                          value || ""
                        )
                      }
                      placeholder="Search anything across your workspace..."
                      className="h-11 w-full bg-transparent text-base text-white outline-none placeholder:text-zinc-500"
                    />

                  </div>

                </div>

                <CommandPrimitive.List className="max-h-[620px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                  <CommandPrimitive.Empty className="py-16 text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.03]">

                      <Search className="h-8 w-8 text-zinc-600" />

                    </div>

                    <h3 className="mt-6 text-xl font-bold text-white">

                      No results found

                    </h3>

                    <p className="mt-2 text-sm text-zinc-500">

                      Try searching notes, tasks or commands

                    </p>

                  </CommandPrimitive.Empty>

                  {matchingNotes.length >
                    0 && (
                    <Section
                      title="Knowledge Search"
                    >

                      {matchingNotes
                        .slice(0, 6)
                        .map(
                          (
                            note
                          ) => (
                            <PaletteItem
                              key={
                                note.id
                              }
                              icon={
                                FileText
                              }
                              color="text-cyan-300"
                              label={
                                note.title ||
                                "Untitled Note"
                              }
                              desc={
                                note.plainText?.slice(
                                  0,
                                  90
                                ) ||
                                "Knowledge note"
                              }
                              onSelect={() =>
                                openNote(
                                  note.id
                                )
                              }
                            />
                          )
                        )}

                    </Section>
                  )}

                  <Section title="Navigation">

                    <PaletteItem
                      icon={
                        LayoutDashboard
                      }
                      color="text-purple-300"
                      label="Workspace"
                      desc="Open productivity dashboard"
                      onSelect={() =>
                        goTo(
                          "/workspace"
                        )
                      }
                    />

                    <PaletteItem
                      icon={
                        FileText
                      }
                      color="text-cyan-300"
                      label="Notes"
                      desc="Open second brain workspace"
                      onSelect={() =>
                        goTo(
                          "/notes"
                        )
                      }
                    />

                    <PaletteItem
                      icon={
                        CheckSquare
                      }
                      color="text-pink-300"
                      label="Tasks"
                      desc="Manage execution system"
                      onSelect={() =>
                        goTo(
                          "/tasks"
                        )
                      }
                    />

                    <PaletteItem
                      icon={
                        BarChart3
                      }
                      color="text-emerald-300"
                      label="Analytics"
                      desc="View productivity insights"
                      onSelect={() =>
                        goTo(
                          "/analytics"
                        )
                      }
                    />

                    <PaletteItem
                      icon={
                        Network
                      }
                      color="text-orange-300"
                      label="Knowledge Graph"
                      desc="Visualize note relationships"
                      onSelect={() =>
                        goTo(
                          "/graph"
                        )
                      }
                    />

                  </Section>

                  <Section title="Quick Actions">

                    <PaletteItem
                      icon={Plus}
                      color="text-cyan-300"
                      label="Create New Note"
                      desc="Instantly create a knowledge entry"
                      onSelect={
                        createNewNote
                      }
                    />

                    <PaletteItem
                      icon={Zap}
                      color="text-yellow-300"
                      label="AI Focus Session"
                      desc="Begin a new tracked focus session"
                      onSelect={() =>
                        goTo(
                          "/workspace"
                        )
                      }
                    />

                  </Section>

                  {recentNotes.length >
                    0 && (
                    <Section title="Recent Notes">

                      {recentNotes
                        .slice(0, 4)
                        .map(
                          (
                            note
                          ) => (
                            <PaletteItem
                              key={
                                note.id
                              }
                              icon={
                                Clock3
                              }
                              color="text-zinc-300"
                              label={
                                note.title ||
                                "Untitled Note"
                              }
                              desc="Recently updated"
                              onSelect={() =>
                                openNote(
                                  note.id
                                )
                              }
                            />
                          )
                        )}

                    </Section>
                  )}

                  {favoriteNotes.length >
                    0 && (
                    <Section title="Favorite Notes">

                      {favoriteNotes
                        .slice(0, 4)
                        .map(
                          (
                            note
                          ) => (
                            <PaletteItem
                              key={
                                note.id
                              }
                              icon={
                                Star
                              }
                              color="text-yellow-300"
                              label={
                                note.title ||
                                "Untitled Note"
                              }
                              desc="Favorited knowledge"
                              onSelect={() =>
                                openNote(
                                  note.id
                                )
                              }
                            />
                          )
                        )}

                    </Section>
                  )}

                  <div className="relative mt-6 overflow-hidden rounded-[30px] border border-purple-500/20 bg-purple-500/10 p-5">

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_55%)]" />

                    <div className="relative flex items-start gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20">

                        <Brain className="h-6 w-6 text-purple-300" />

                      </div>

                      <div className="flex-1">

                        <div className="flex items-center gap-2">

                          <p className="text-lg font-bold text-white">

                            corTeX AI

                          </p>

                          <Sparkles className="h-4 w-4 text-purple-300" />

                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-zinc-400">

                          Your intelligent workspace layer for notes, analytics, execution and connected thinking.

                        </p>

                      </div>

                    </div>

                  </div>

                </CommandPrimitive.List>

                <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-xs text-zinc-500">

                  <div className="flex items-center gap-3">

                    <kbd className="rounded border border-white/10 px-2 py-1">

                      ↑↓

                    </kbd>

                    Navigate

                  </div>

                  <div className="flex items-center gap-3">

                    <kbd className="rounded border border-white/10 px-2 py-1">

                      ↵

                    </kbd>

                    Open

                  </div>

                  <div className="flex items-center gap-3">

                    <kbd className="rounded border border-white/10 px-2 py-1">

                      esc

                    </kbd>

                    Close

                  </div>

                </div>

              </CommandPrimitive>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}

function Section({
  title,
  children,
}: any) {
  return (
    <div className="mb-6">

      <div className="mb-3 px-2">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">

          {title}

        </p>

      </div>

      <div className="space-y-2">

        {children}

      </div>

    </div>
  );
}

function PaletteItem({
  icon: Icon,
  color,
  label,
  desc,
  onSelect,
}: any) {
  return (
    <CommandPrimitive.Item
      onSelect={onSelect}
      className="group flex cursor-pointer items-center gap-4 rounded-[26px] border border-transparent px-4 py-4 text-zinc-300 outline-none transition-all duration-200 hover:border-white/10 hover:bg-white/[0.05] hover:text-white data-[selected=true]:border-white/10 data-[selected=true]:bg-white/[0.06]"
    >

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03]">

        <Icon
          className={`h-5 w-5 ${color}`}
        />

      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-center justify-between gap-4">

          <p className="truncate text-sm font-semibold text-white">

            {label}

          </p>

          <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />

        </div>

        <p className="mt-1 truncate text-xs text-zinc-500">

          {desc}

        </p>

      </div>

    </CommandPrimitive.Item>
  );
}