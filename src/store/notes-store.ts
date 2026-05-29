import { create } from "zustand";

import { persist } from "zustand/middleware";

export type NoteLink = {
  targetNoteId: string;

  createdAt: number;
};

export type Note = {
  id: string;

  title: string;

  content: string;

  plainText: string;

  createdAt: number;

  updatedAt: number;

  favorite: boolean;

  pinned: boolean;

  archived: boolean;

  category: string;

  tags: string[];

  backlinks: NoteLink[];

  outgoingLinks: NoteLink[];

  wordCount: number;

  readingTime: number;

  aiGenerated: boolean;

  lastOpenedAt: number;
};

type NotesAnalytics = {
  totalNotes: number;

  totalWords: number;

  totalReadingTime: number;

  favoritesCount: number;

  archivedCount: number;

  averageWordsPerNote: number;
};

type NotesState = {
  notes: Note[];

  activeNoteId: string | null;

  analytics: NotesAnalytics;

  createNote: (
    overrides?: Partial<Note>
  ) => void;

  deleteNote: (
    id: string
  ) => void;

  archiveNote: (
    id: string
  ) => void;

  restoreNote: (
    id: string
  ) => void;

  updateNote: (
    id: string,
    updates: Partial<Note>
  ) => void;

  setActiveNote: (
    id: string
  ) => void;

  toggleFavorite: (
    id: string
  ) => void;

  togglePinned: (
    id: string
  ) => void;

  addTag: (
    id: string,
    tag: string
  ) => void;

  removeTag: (
    id: string,
    tag: string
  ) => void;

  linkNotes: (
    sourceId: string,
    targetId: string
  ) => void;

  searchNotes: (
    query: string
  ) => Note[];

  getRecentNotes: () => Note[];

  getFavoriteNotes: () => Note[];

  getPinnedNotes: () => Note[];

  getArchivedNotes: () => Note[];

  getRelatedNotes: (
    noteId: string
  ) => Note[];

  recalculateAnalytics:
    () => void;
};

function stripHtml(
  html: string
) {
  return html.replace(
    /<[^>]*>?/gm,
    ""
  );
}

function calculateWordCount(
  text: string
) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function calculateReadingTime(
  words: number
) {
  return Math.max(
    1,
    Math.ceil(words / 200)
  );
}

const starterContent =
  `# Welcome to corTeX.ai

Your second brain is now fully upgraded.

You can now:
- Create connected notes
- Build knowledge graphs
- Organize ideas with tags
- Track note intelligence
- Build an AI-ready workspace

Everything autosaves instantly.`;

const starterPlain =
  stripHtml(
    starterContent
  );

const starterWords =
  calculateWordCount(
    starterPlain
  );

const starterNote: Note = {
  id: `${Date.now()}-${Math.random()}`,

  title:
    "Welcome to corTeX.ai",

  content:
    starterContent,

  plainText:
    starterPlain,

  createdAt:
    Date.now(),

  updatedAt:
    Date.now(),

  favorite: true,

  pinned: true,

  archived: false,

  category:
    "General",

  tags: [
    "welcome",
    "knowledge",
    "second-brain",
  ],

  backlinks: [],

  outgoingLinks: [],

  wordCount:
    starterWords,

  readingTime:
    calculateReadingTime(
      starterWords
    ),

  aiGenerated:
    true,

  lastOpenedAt:
    Date.now(),
};

export const useNotesStore =
  create<NotesState>()(
    persist(
      (set, get) => ({
        notes: [starterNote],

        activeNoteId:
          starterNote.id,

        analytics: {
          totalNotes: 1,

          totalWords:
            starterWords,

          totalReadingTime:
            calculateReadingTime(
              starterWords
            ),

          favoritesCount: 1,

          archivedCount: 0,

          averageWordsPerNote:
            starterWords,
        },

        createNote: (
          overrides = {}
        ) => {
          const now =
            Date.now();

          const content =
            overrides.content ||
            "";

          const plainText =
            stripHtml(
              content
            );

          const words =
            calculateWordCount(
              plainText
            );

          const note: Note = {
            id: crypto.randomUUID(),

            title:
              overrides.title ||
              "Untitled Note",

            content,

            plainText,

            createdAt:
              now,

            updatedAt:
              now,

            favorite:
              false,

            pinned:
              false,

            archived:
              false,

            category:
              overrides.category ||
              "General",

            tags:
              overrides.tags ||
              [],

            backlinks:
              [],

            outgoingLinks:
              [],

            wordCount:
              words,

            readingTime:
              calculateReadingTime(
                words
              ),

            aiGenerated:
              false,

            lastOpenedAt:
              now,
          };

          set({
            notes: [
              note,
              ...get().notes,
            ],

            activeNoteId:
              note.id,
          });

          get()
            .recalculateAnalytics();
        },

        deleteNote: (
          id
        ) => {
          const filtered =
            get().notes.filter(
              (note) =>
                note.id !== id
            );

          set({
            notes: filtered,

            activeNoteId:
              filtered[0]
                ?.id || null,
          });

          get()
            .recalculateAnalytics();
        },

        archiveNote: (
          id
        ) => {
          set({
            notes:
              get().notes.map(
                (note) =>
                  note.id ===
                  id
                    ? {
                        ...note,

                        archived:
                          true,

                        updatedAt:
                          Date.now(),
                      }
                    : note
              ),
          });

          get()
            .recalculateAnalytics();
        },

        restoreNote: (
          id
        ) => {
          set({
            notes:
              get().notes.map(
                (note) =>
                  note.id ===
                  id
                    ? {
                        ...note,

                        archived:
                          false,

                        updatedAt:
                          Date.now(),
                      }
                    : note
              ),
          });

          get()
            .recalculateAnalytics();
        },

        updateNote: (
          id,
          updates
        ) => {
          set({
            notes:
              get().notes.map(
                (note) => {
                  if (
                    note.id !==
                    id
                  ) {
                    return note;
                  }

                  const content =
                    updates.content ??
                    note.content;

                  const plainText =
                    stripHtml(
                      content
                    );

                  const words =
                    calculateWordCount(
                      plainText
                    );

                  return {
                    ...note,

                    ...updates,

                    plainText,

                    wordCount:
                      words,

                    readingTime:
                      calculateReadingTime(
                        words
                      ),

                    updatedAt:
                      Date.now(),
                  };
                }
              ),
          });

          get()
            .recalculateAnalytics();
        },

        setActiveNote: (
          id
        ) => {
          set({
            activeNoteId:
              id,

            notes:
              get().notes.map(
                (note) =>
                  note.id ===
                  id
                    ? {
                        ...note,

                        lastOpenedAt:
                          Date.now(),
                      }
                    : note
              ),
          });
        },

        toggleFavorite: (
          id
        ) => {
          set({
            notes:
              get().notes.map(
                (note) =>
                  note.id ===
                  id
                    ? {
                        ...note,

                        favorite:
                          !note.favorite,

                        updatedAt:
                          Date.now(),
                      }
                    : note
              ),
          });

          get()
            .recalculateAnalytics();
        },

        togglePinned: (
          id
        ) => {
          set({
            notes:
              get().notes.map(
                (note) =>
                  note.id ===
                  id
                    ? {
                        ...note,

                        pinned:
                          !note.pinned,

                        updatedAt:
                          Date.now(),
                      }
                    : note
              ),
          });
        },

        addTag: (
          id,
          tag
        ) => {
          set({
            notes:
              get().notes.map(
                (note) =>
                  note.id ===
                    id &&
                  !note.tags.includes(
                    tag
                  )
                    ? {
                        ...note,

                        tags: [
                          ...note.tags,
                          tag,
                        ],

                        updatedAt:
                          Date.now(),
                      }
                    : note
              ),
          });
        },

        removeTag: (
          id,
          tag
        ) => {
          set({
            notes:
              get().notes.map(
                (note) =>
                  note.id ===
                  id
                    ? {
                        ...note,

                        tags:
                          note.tags.filter(
                            (
                              t
                            ) =>
                              t !==
                              tag
                          ),

                        updatedAt:
                          Date.now(),
                      }
                    : note
              ),
          });
        },

        linkNotes: (
          sourceId,
          targetId
        ) => {
          const now =
            Date.now();

          set({
            notes:
              get().notes.map(
                (note) => {
                  if (
                    note.id ===
                    sourceId
                  ) {
                    return {
                      ...note,

                      outgoingLinks:
                        [
                          ...note.outgoingLinks,
                          {
                            targetNoteId:
                              targetId,

                            createdAt:
                              now,
                          },
                        ],
                    };
                  }

                  if (
                    note.id ===
                    targetId
                  ) {
                    return {
                      ...note,

                      backlinks:
                        [
                          ...note.backlinks,
                          {
                            targetNoteId:
                              sourceId,

                            createdAt:
                              now,
                          },
                        ],
                    };
                  }

                  return note;
                }
              ),
          });
        },

        searchNotes: (
          query
        ) => {
          if (
            !query.trim()
          ) {
            return get().notes;
          }

          const normalized =
            query.toLowerCase();

          return get()
            .notes
            .filter(
              (note) => {
                return (
                  note.title
                    .toLowerCase()
                    .includes(
                      normalized
                    ) ||
                  note.plainText
                    .toLowerCase()
                    .includes(
                      normalized
                    ) ||
                  note.category
                    .toLowerCase()
                    .includes(
                      normalized
                    ) ||
                  note.tags.some(
                    (
                      tag
                    ) =>
                      tag
                        .toLowerCase()
                        .includes(
                          normalized
                        )
                  )
                );
              }
            )
            .sort(
              (a, b) =>
                b.updatedAt -
                a.updatedAt
            );
        },

        getRecentNotes:
          () => {
            return [
              ...get().notes,
            ]
              .filter(
                (
                  note
                ) =>
                  !note.archived
              )
              .sort(
                (a, b) =>
                  b.updatedAt -
                  a.updatedAt
              )
              .slice(0, 10);
          },

        getFavoriteNotes:
          () => {
            return get().notes.filter(
              (note) =>
                note.favorite
            );
          },

        getPinnedNotes:
          () => {
            return get().notes.filter(
              (note) =>
                note.pinned
            );
          },

        getArchivedNotes:
          () => {
            return get().notes.filter(
              (note) =>
                note.archived
            );
          },

        getRelatedNotes:
          (
            noteId
          ) => {
            const current =
              get().notes.find(
                (
                  n
                ) =>
                  n.id ===
                  noteId
              );

            if (
              !current
            ) {
              return [];
            }

            return get().notes.filter(
              (
                note
              ) => {
                if (
                  note.id ===
                  noteId
                ) {
                  return false;
                }

                const sharedTags =
                  note.tags.some(
                    (
                      tag
                    ) =>
                      current.tags.includes(
                        tag
                      )
                  );

                return (
                  sharedTags
                );
              }
            );
          },

        recalculateAnalytics:
          () => {
            const notes =
              get().notes;

            const totalWords =
              notes.reduce(
                (
                  acc,
                  note
                ) =>
                  acc +
                  note.wordCount,
                0
              );

            const totalReadingTime =
              notes.reduce(
                (
                  acc,
                  note
                ) =>
                  acc +
                  note.readingTime,
                0
              );

            const favoritesCount =
              notes.filter(
                (
                  note
                ) =>
                  note.favorite
              ).length;

            const archivedCount =
              notes.filter(
                (
                  note
                ) =>
                  note.archived
              ).length;

            set({
              analytics: {
                totalNotes:
                  notes.length,

                totalWords,

                totalReadingTime,

                favoritesCount,

                archivedCount,

                averageWordsPerNote:
                  notes.length >
                  0
                    ? Math.round(
                        totalWords /
                          notes.length
                      )
                    : 0,
              },
            });
          },
      }),
      {
        name:
          "notes-storage",
      }
    )
  );