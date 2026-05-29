import { create } from "zustand";

import { persist } from "zustand/middleware";

import { supabase } from "@/lib/supabase";

type SessionRating =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8;

type FocusSession = {
  id: string;

  startedAt: number;

  endedAt: number;

  duration: number;

  rating: SessionRating;

  analyticsDate: string;
};

type FocusStore = {
  isRunning: boolean;

  isPaused: boolean;

  startedAt: number | null;

  pausedAt: number | null;

  elapsedTime: number;

  totalSessions: number;

  totalFocusHours: number;

  productivityScore: number;

  currentSessionSeconds: number;

  sessions: FocusSession[];

  initialized: boolean;

  hydrated: boolean;

  setHydrated: (
    state: boolean
  ) => void;

  initializeSessions: (
    userId: string
  ) => Promise<void>;

  startTimer: () => void;

  pauseTimer: () => void;

  resumeTimer: () => void;

  resetTimer: () => void;

  tick: () => void;

  completeSession: (
    rating: SessionRating,
    userId?: string
  ) => Promise<void>;
};

function calculateProductivity(
  sessions: FocusSession[]
) {
  if (!sessions.length) {
    return 0;
  }

  const total =
    sessions.reduce(
      (
        acc,
        session
      ) =>
        acc +
        session.rating,
      0
    );

  const max =
    sessions.length * 8;

  return Math.round(
    (total / max) * 100
  );
}

function calculateHours(
  sessions: FocusSession[]
) {
  const total =
    sessions.reduce(
      (
        acc,
        session
      ) =>
        acc +
        session.duration /
          3600,
      0
    );

  return Number(
    total.toFixed(1)
  );
}

function getAnalyticsDate() {
  return new Date()
    .toLocaleDateString(
      "en-CA"
    );
}

export const useFocusStore =
  create<FocusStore>()(
    persist(
      (
        set,
        get
      ) => ({
        isRunning: false,

        isPaused: false,

        startedAt: null,

        pausedAt: null,

        elapsedTime: 0,

        totalSessions: 0,

        totalFocusHours: 0,

        productivityScore: 0,

        currentSessionSeconds: 0,

        sessions: [],

        initialized: false,

        hydrated: false,

        setHydrated: (
          state
        ) =>
          set({
            hydrated:
              state,
          }),

        initializeSessions:
          async (
            userId
          ) => {
            try {
              const {
                data,
                error,
              } =
                await supabase
                  .from(
                    "focus_sessions"
                  )
                  .select("*")
                  .eq(
                    "user_id",
                    userId
                  )
                  .order(
                    "ended_at",
                    {
                      ascending:
                        false,
                    }
                  );

              if (
                error
              ) {
                console.error(
                  "SUPABASE LOAD ERROR:",
                  error
                );

                return;
              }

              const sessions:
                FocusSession[] =
                (
                  data ||
                  []
                ).map(
                  (
                    session
                  ) => ({
                    id:
                      session.id,

                    startedAt:
                      session.started_at,

                    endedAt:
                      session.ended_at,

                    duration:
                      session.duration,

                    rating:
                      session.rating,

                    analyticsDate:
                      session.analytics_date ||
                      new Date(
                        session.ended_at
                      )
                        .toISOString()
                        .split(
                          "T"
                        )[0],
                  })
                );

              set({
                sessions,

                totalSessions:
                  sessions.length,

                totalFocusHours:
                  calculateHours(
                    sessions
                  ),

                productivityScore:
                  calculateProductivity(
                    sessions
                  ),

                initialized:
                  true,
              });
            } catch (
              error
            ) {
              console.error(
                "INITIALIZE SESSIONS ERROR:",
                error
              );
            }
          },

        startTimer: () => {
          set({
            isRunning: true,

            isPaused: false,

            startedAt:
              Date.now(),

            pausedAt: null,
          });
        },

        pauseTimer: () => {
          const {
            startedAt,
            elapsedTime,
          } = get();

          if (
            !startedAt
          ) {
            return;
          }

          const now =
            Date.now();

          const seconds =
            Math.floor(
              (
                now -
                startedAt
              ) / 1000
            ) + elapsedTime;

          set({
            isPaused: true,

            isRunning: false,

            pausedAt: now,

            elapsedTime:
              seconds,

            currentSessionSeconds:
              seconds,
          });
        },

        resumeTimer: () => {
          set(
            (
              state
            ) => ({
              isPaused: false,

              isRunning: true,

              pausedAt: null,

              startedAt:
                Date.now(),

              elapsedTime:
                state.currentSessionSeconds,
            })
          );
        },

        resetTimer: () => {
          set({
            isPaused: false,

            isRunning: false,

            startedAt: null,

            pausedAt: null,

            elapsedTime: 0,

            currentSessionSeconds: 0,
          });
        },

        tick: () => {
          const {
            isRunning,
            startedAt,
            elapsedTime,
          } = get();

          if (
            !isRunning ||
            !startedAt
          ) {
            return;
          }

          const now =
            Date.now();

          const seconds =
            Math.floor(
              (
                now -
                startedAt
              ) / 1000
            ) + elapsedTime;

          set({
            currentSessionSeconds:
              seconds,
          });
        },

        completeSession:
          async (
            rating,
            userId
          ) => {
            const {
              currentSessionSeconds,
              sessions,
            } = get();

            if (
              currentSessionSeconds <=
              0
            ) {
              return;
            }

            const now =
              Date.now();

            const sessionStart =
              now -
              currentSessionSeconds *
                1000;

            if (
              sessions.some(
                (
                  session
                ) =>
                  session.startedAt ===
                  sessionStart
              )
            ) {
              return;
            }

            const newSession: FocusSession =
              {
                id:
                  crypto.randomUUID(),

                startedAt:
                  sessionStart,

                endedAt: now,

                duration:
                  currentSessionSeconds,

                rating,

                analyticsDate:
                  getAnalyticsDate(),
              };

            const updatedSessions =
              [
                newSession,
                ...sessions.filter(
                  (
                    session
                  ) =>
                    session.id !==
                    newSession.id
                ),
              ];

            set({
              sessions:
                updatedSessions,

              totalSessions:
                updatedSessions.length,

              totalFocusHours:
                calculateHours(
                  updatedSessions
                ),

              productivityScore:
                calculateProductivity(
                  updatedSessions
                ),

              isRunning: false,

              isPaused: false,

              startedAt: null,

              pausedAt: null,

              elapsedTime: 0,

              currentSessionSeconds: 0,
            });

            if (
              !userId
            ) {
              return;
            }

            try {
              const {
                error,
              } =
                await supabase
                  .from(
                    "focus_sessions"
                  )
                  .insert({
                    id:
                      newSession.id,

                    user_id:
                      userId,

                    duration:
                      newSession.duration,

                    rating:
                      newSession.rating,

                    started_at:
                      newSession.startedAt,

                    ended_at:
                      newSession.endedAt,

                    analytics_date:
                      newSession.analyticsDate,
                  });

              if (
                error
              ) {
                console.error(
                  "SUPABASE INSERT ERROR:",
                  error
                );
              } else {
                const analyticsDate =
                  getAnalyticsDate();

                const {
                  data:
                    existingAnalytics,
                } =
                  await supabase
                    .from(
                      "daily_analytics"
                    )
                    .select(
                      "*"
                    )
                    .eq(
                      "user_id",
                      userId
                    )
                    .eq(
                      "analytics_date",
                      analyticsDate
                    )
                    .maybeSingle();

                if (
                  existingAnalytics
                ) {
                  await supabase
                    .from(
                      "daily_analytics"
                    )
                    .update({
                      sessions:
                        existingAnalytics.sessions +
                        1,

                      focus_hours:
                        Number(
                          existingAnalytics.focus_hours
                        ) +
                        Number(
                          (
                            newSession.duration /
                            3600
                          ).toFixed(
                            2
                          )
                        ),

                      productivity:
                        Math.round(
                          (
                            existingAnalytics.productivity +
                            newSession.rating *
                              12.5
                          ) / 2
                        ),
                    })
                    .eq(
                      "id",
                      existingAnalytics.id
                    );
                } else {
                  await supabase
                    .from(
                      "daily_analytics"
                    )
                    .insert({
                      user_id:
                        userId,

                      analytics_date:
                        analyticsDate,

                      sessions: 1,

                      focus_hours:
                        Number(
                          (
                            newSession.duration /
                            3600
                          ).toFixed(
                            2
                          )
                        ),

                      productivity:
                        Math.round(
                          newSession.rating *
                            12.5
                        ),

                      ai_uses: 0,

                      tasks_done: 0,
                    });
                }
              }
            } catch (
              error
            ) {
              console.error(
                "UPLOAD SESSION ERROR:",
                error
              );
            }
          },
      }),
      {
        name:
          "coretex-focus-storage",

        partialize: (
          state
        ) => ({
          isRunning:
            state.isRunning,

          isPaused:
            state.isPaused,

          startedAt:
            state.startedAt,

          pausedAt:
            state.pausedAt,

          elapsedTime:
            state.elapsedTime,

          currentSessionSeconds:
            state.currentSessionSeconds,
        }),

        onRehydrateStorage:
          () => (
            state
          ) => {
            state?.setHydrated(
              true
            );
          },
      }
    )
  );