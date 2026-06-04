import { create } from "zustand";

import { persist } from "zustand/middleware";

import {
  useFocusStore,
} from "@/store/focus-store";

import { supabase } from "@/lib/supabase";

import { useAuthStore } from "@/store/auth-store";

export type FocusSession = {
  id: string;

  duration: number;

  rating: number;

  completed: boolean;

  createdAt: number;

  completedAt: number;
};

type WeeklyData = {
  day: string;

  hours: number;

  sessions: FocusSession[];
};

type Stats = {
  sessions: number;

  focusHours: number;

  productivity: number;

  aiInteractions: number;

  completedTasks: number;
};

type DailyAnalytics = {
  date: string;

  sessions: number;

  focusHours: number;

  productivity: number;
};

type ProductivityState = {
  aiInteractions: number;

  completedTasks: number;

  streak: number;

  longestStreak: number;

  averageSessionLength: number;

  totalFocusMinutes: number;

  addAIInteraction: () => void;

  incrementTasks: () => void;

  calculateStreak: () => void;

  initializeMetrics: (
    userId: string
  ) => Promise<void>;

  syncMetrics: (
    userId: string
  ) => Promise<void>;

  getSessions: () => FocusSession[];

  getTodayStats: () => Stats;

  getLifetimeStats: () => Stats;

  getDailyAnalytics:
    () => DailyAnalytics[];

  getTotalFocusHours:
    () => number;

  getCompletedSessions:
    () => number;

  getFocusScore:
    () => number;

  getWeeklyData:
    () => WeeklyData[];

  getContributionData:
    () => Map<
      string,
      number
    >;

  getFocusDistribution:
    () => {
      label: string;

      value: number;
    }[];
};

const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function formatLocalDate(
  timestamp: number
) {
  return new Date(
    timestamp
  ).toLocaleDateString(
    "en-CA"
  );
}

function getSessions() {
  return (
    useFocusStore
      .getState()
      .sessions.map(
        (
          session
        ) => ({
          id: session.id,

          duration:
            Math.max(
              1,
              Math.floor(
                session.duration /
                  60
              )
            ),

          rating:
            session.rating,

          completed:
            true,

          createdAt:
            session.startedAt,

          completedAt:
            session.endedAt,
        })
      ) || []
  );
}

function calculateProductivity(
  sessions: FocusSession[]
) {
  if (!sessions.length) {
    return 0;
  }

  const avg =
    sessions.reduce(
      (
        acc,
        s
      ) =>
        acc +
        s.rating,
      0
    ) / sessions.length;

  return Math.min(
    100,
    Math.round(
      (avg / 8) * 100
    )
  );
}

function getTodaySessions() {
  const today =
    new Date().toLocaleDateString(
      "en-CA"
    );

  return getSessions().filter(
    (
      session
    ) =>
      formatLocalDate(
        session.completedAt
      ) === today
  );
}

export const useProductivityStore =
  create<ProductivityState>()(
    persist(
      (
        set,
        get
      ) => ({
        aiInteractions: 0,

        completedTasks: 0,

        streak: 0,

        longestStreak: 0,

        averageSessionLength: 0,

        totalFocusMinutes: 0,

        initializeMetrics:
          async (
            userId: string
          ) => {
            try {
              const {
                data,
              } =
                await supabase
                  .from(
                    "user_metrics"
                  )
                  .select("*")
                  .eq(
                    "user_id",
                    userId
                  )
                  .maybeSingle();

              if (
                !data
              ) {
                await supabase
                  .from(
                    "user_metrics"
                  )
                  .insert({
                    user_id:
                      userId,
                  });

                return;
              }

              set({
                aiInteractions:
                  data.ai_interactions ||
                  0,

                completedTasks:
                  data.completed_tasks ||
                  0,

                streak:
                  data.streak ||
                  0,

                longestStreak:
                  data.longest_streak ||
                  0,
              });
            } catch (
              error
            ) {
              console.error(
                "INITIALIZE METRICS ERROR:",
                error
              );
            }
          },

        syncMetrics:
          async (
            userId: string
          ) => {
            try {
              const state =
                get();

              await supabase
                .from(
                  "user_metrics"
                )
                .upsert({
                  user_id:
                    userId,

                  ai_interactions:
                    state.aiInteractions,

                  completed_tasks:
                    state.completedTasks,

                  streak:
                    state.streak,

                  longest_streak:
                    state.longestStreak,
                });
            } catch (
              error
            ) {
              console.error(
                "SYNC METRICS ERROR:",
                error
              );
            }
          },

        addAIInteraction:
          () => {
            set({
              aiInteractions:
                get()
                  .aiInteractions +
                1,
            });

            const user =
              useAuthStore.getState().user;

            if (
              user?.id
            ) {
              get().syncMetrics(
                user.id
              );
            }
          },

        incrementTasks:
          () => {
            set({
              completedTasks:
                get()
                  .completedTasks +
                1,
            });

            const user =
              useAuthStore.getState().user;

            if (
              user?.id
            ) {
              get().syncMetrics(
                user.id
              );
            }
          },

        calculateStreak:
          () => {
            const streak =
              calculateCurrentStreak(
                getSessions()
              );

            set({
              streak,

              longestStreak:
                Math.max(
                  get()
                    .longestStreak,
                  streak
                ),
            });

            const user =
              useAuthStore.getState().user;

            if (
              user?.id
            ) {
              get().syncMetrics(
                user.id
              );
            }
          },

        getSessions:
          () =>
            getSessions(),

        getTodayStats:
          () => {
            const sessions =
              getTodaySessions();

            const totalMinutes =
              sessions.reduce(
                (
                  acc,
                  s
                ) =>
                  acc +
                  s.duration,
                0
              );

            return {
              sessions:
                sessions.length,

              focusHours:
                Number(
                  (
                    totalMinutes /
                    60
                  ).toFixed(1)
                ),

              productivity:
                calculateProductivity(
                  sessions
                ),

              aiInteractions:
                get()
                  .aiInteractions,

              completedTasks:
                get()
                  .completedTasks,
            };
          },

        getLifetimeStats:
          () => {
            const sessions =
              getSessions();

            const totalMinutes =
              sessions.reduce(
                (
                  acc,
                  s
                ) =>
                  acc +
                  s.duration,
                0
              );

            return {
              sessions:
                sessions.length,

              focusHours:
                Number(
                  (
                    totalMinutes /
                    60
                  ).toFixed(1)
                ),

              productivity:
                calculateProductivity(
                  sessions
                ),

              aiInteractions:
                get()
                  .aiInteractions,

              completedTasks:
                get()
                  .completedTasks,
            };
          },

        getDailyAnalytics:
          () => {
            const grouped =
              new Map<
                string,
                FocusSession[]
              >();

            getSessions().forEach(
              (
                session
              ) => {
                const key =
                  formatLocalDate(
                    session.completedAt
                  );

                if (
                  !grouped.has(
                    key
                  )
                ) {
                  grouped.set(
                    key,
                    []
                  );
                }

                grouped
                  .get(key)!
                  .push(
                    session
                  );
              }
            );

            return Array.from(
              grouped.entries()
            ).map(
              ([
                date,
                sessions,
              ]) => {
                const totalMinutes =
                  sessions.reduce(
                    (
                      acc,
                      s
                    ) =>
                      acc +
                      s.duration,
                    0
                  );

                return {
                  date,

                  sessions:
                    sessions.length,

                  focusHours:
                    Number(
                      (
                        totalMinutes /
                        60
                      ).toFixed(
                        1
                      )
                    ),

                  productivity:
                    calculateProductivity(
                      sessions
                    ),
                };
              }
            );
          },

        getTotalFocusHours:
          () => {
            const sessions =
              getSessions();

            const totalMinutes =
              sessions.reduce(
                (
                  acc,
                  s
                ) =>
                  acc +
                  s.duration,
                0
              );

            return Number(
              (
                totalMinutes /
                60
              ).toFixed(1)
            );
          },

        getCompletedSessions:
          () =>
            getSessions()
              .length,

        getFocusScore:
          () => {
            const sessions =
              getSessions();

            if (
              !sessions.length
            ) {
              return 0;
            }

            const totalHours =
              get()
                .getTotalFocusHours();

            const avgRating =
              sessions.reduce(
                (
                  acc,
                  s
                ) =>
                  acc +
                  s.rating,
                0
              ) /
              sessions.length;

            const streak =
              calculateCurrentStreak(
                sessions
              );

            return Math.min(
              100,
              Math.round(
                totalHours *
                  3 +
                  sessions.length *
                    1.5 +
                  avgRating *
                    6 +
                  streak *
                    2
              )
            );
          },

        getWeeklyData:
          () => {
            const data: WeeklyData[] =
              weekDays.map(
                (
                  day
                ) => ({
                  day,

                  hours: 0,

                  sessions:
                    [],
                })
              );

            getSessions().forEach(
              (
                session
              ) => {
                const date =
                  new Date(
                    session.completedAt
                  );

                const index =
                  date.getDay();

                data[
                  index
                ].hours +=
                  session.duration /
                  60;

                data[
                  index
                ].sessions.push(
                  session
                );
              }
            );

            data.forEach(
              (
                item
              ) => {
                item.hours =
                  Number(
                    item.hours.toFixed(
                      1
                    )
                  );
              }
            );

            return data;
          },

        getContributionData:
          () => {
            const map =
              new Map<
                string,
                number
              >();

            getSessions().forEach(
              (
                session
              ) => {
                const key =
                  formatLocalDate(
                    session.completedAt
                  );

                map.set(
                  key,
                  (map.get(
                    key
                  ) || 0) +
                    1
                );
              }
            );

            return map;
          },

        getFocusDistribution:
          () => {
            const buckets = {
              Morning: 0,

              Afternoon: 0,

              Evening: 0,

              Night: 0,
            };

            getSessions().forEach(
              (
                session
              ) => {
                const hour =
                  new Date(
                    session.completedAt
                  ).getHours();

                if (
                  hour >= 6 &&
                  hour < 12
                ) {
                  buckets.Morning++;
                } else if (
                  hour >= 12 &&
                  hour < 17
                ) {
                  buckets.Afternoon++;
                } else if (
                  hour >= 17 &&
                  hour < 22
                ) {
                  buckets.Evening++;
                } else {
                  buckets.Night++;
                }
              }
            );

            const total =
              Object.values(
                buckets
              ).reduce(
                (
                  a,
                  b
                ) =>
                  a + b,
                0
              ) || 1;

            return Object.entries(
              buckets
            ).map(
              ([
                label,
                value,
              ]) => ({
                label,

                value:
                  Math.round(
                    (value /
                      total) *
                      100
                  ),
              })
            );
          },
      }),
      {
        name:
          "productivity-storage",

        partialize: (
          state
        ) => ({
          aiInteractions:
            state.aiInteractions,

          completedTasks:
            state.completedTasks,

          streak:
            state.streak,

          longestStreak:
            state.longestStreak,

          averageSessionLength:
            state.averageSessionLength,

          totalFocusMinutes:
            state.totalFocusMinutes,
        }),
      }
    )
  );

function calculateCurrentStreak(
  sessions: FocusSession[]
) {
  if (
    sessions.length === 0
  ) {
    return 0;
  }

  const uniqueDays =
    new Set(
      sessions.map(
        (
          session
        ) =>
          formatLocalDate(
            session.completedAt
          )
      )
    );

  const sortedDays =
    Array.from(
      uniqueDays
    ).sort(
      (
        a,
        b
      ) =>
        new Date(
          b
        ).getTime() -
        new Date(
          a
        ).getTime()
    );

  let streak = 1;

  for (
    let i = 1;
    i <
    sortedDays.length;
    i++
  ) {
    const current =
      new Date(
        sortedDays[
          i - 1
        ]
      );

    const previous =
      new Date(
        sortedDays[i]
      );

    const diff =
      Math.floor(
        (
          current.getTime() -
          previous.getTime()
        ) /
          (
            1000 *
            60 *
            60 *
            24
          )
      );

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}