import { create } from "zustand";

import { persist } from "zustand/middleware";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export type TaskStatus =
  | "active"
  | "completed"
  | "archived";

export type Task = {
  id: string;

  title: string;

  description?: string;

  completed: boolean;

  priority: TaskPriority;

  status: TaskStatus;

  createdAt: number;

  updatedAt: number;

  completedAt?: number;

  dueDate?: number;

  tags?: string[];
};

type TasksState = {
  tasks: Task[];

  archivedTasks: Task[];

  completedToday: number;

  totalCompleted: number;

  completionRate: number;

  executionVelocity: number;

  createTask: (
    task: {
      title: string;

      description?: string;

      priority?: TaskPriority;

      dueDate?: number;

      tags?: string[];
    }
  ) => void;

  toggleTask: (
    id: string
  ) => void;

  deleteTask: (
    id: string
  ) => void;

  archiveTask: (
    id: string
  ) => void;

  updateTask: (
    id: string,
    updates: Partial<Task>
  ) => void;

  clearCompleted: () => void;

  getActiveTasks: () => Task[];

  getCompletedTasks: () => Task[];

  getOverdueTasks: () => Task[];

  getTasksCompletedThisWeek:
    () => number;

  recalculateMetrics:
    () => void;
};

export const useTasksStore =
  create<TasksState>()(
    persist(
      (set, get) => ({
        tasks: [],

        archivedTasks: [],

        completedToday: 0,

        totalCompleted: 0,

        completionRate: 0,

        executionVelocity: 0,

        createTask: ({
          title,
          description,
          priority =
            "medium",
          dueDate,
          tags = [],
        }) => {
          const now =
            Date.now();

          const task: Task = {
            id: crypto.randomUUID(),

            title,

            description,

            completed:
              false,

            priority,

            status:
              "active",

            createdAt:
              now,

            updatedAt:
              now,

            dueDate,

            tags,
          };

          set({
            tasks: [
              task,
              ...get()
                .tasks,
            ],
          });

          get()
            .recalculateMetrics();
        },

        toggleTask:
          (id) => {
            const now =
              Date.now();

            const updated =
              get().tasks.map(
                (
                  task
                ) => {
                  if (
                    task.id !==
                    id
                  ) {
                    return task;
                  }

                  const completed =
                    !task.completed;

                  const status: TaskStatus =
                    completed
                      ? "completed"
                      : "active";

                  return {
                    ...task,

                    completed,

                    completedAt:
                      completed
                        ? now
                        : undefined,

                    status,

                    updatedAt:
                      now,
                  };
                }
              );

            set({
              tasks:
                updated,
            });

            get()
              .recalculateMetrics();
          },

        deleteTask:
          (id) => {
            set({
              tasks:
                get().tasks.filter(
                  (
                    task
                  ) =>
                    task.id !==
                    id
                ),
            });

            get()
              .recalculateMetrics();
          },

        archiveTask:
          (id) => {
            const task =
              get().tasks.find(
                (
                  t
                ) =>
                  t.id ===
                  id
              );

            if (
              !task
            ) {
              return;
            }

            set({
              tasks:
                get().tasks.filter(
                  (
                    t
                  ) =>
                    t.id !==
                    id
                ),

              archivedTasks:
                [
                  task,
                  ...get()
                    .archivedTasks,
                ],
            });

            get()
              .recalculateMetrics();
          },

        updateTask:
          (
            id,
            updates
          ) => {
            set({
              tasks:
                get().tasks.map(
                  (
                    task
                  ) =>
                    task.id ===
                    id
                      ? {
                          ...task,

                          ...updates,

                          updatedAt:
                            Date.now(),
                        }
                      : task
                ),
            });

            get()
              .recalculateMetrics();
          },

        clearCompleted:
          () => {
            set({
              tasks:
                get().tasks.filter(
                  (
                    task
                  ) =>
                    !task.completed
                ),
            });

            get()
              .recalculateMetrics();
          },

        getActiveTasks:
          () => {
            return get().tasks.filter(
              (
                task
              ) =>
                !task.completed
            );
          },

        getCompletedTasks:
          () => {
            return get().tasks.filter(
              (
                task
              ) =>
                task.completed
            );
          },

        getOverdueTasks:
          () => {
            const now =
              Date.now();

            return get().tasks.filter(
              (
                task
              ) =>
                !task.completed &&
                !!task.dueDate &&
                task.dueDate <
                  now
            );
          },

        getTasksCompletedThisWeek:
          () => {
            const now =
              Date.now();

            const weekAgo =
              now -
              1000 *
                60 *
                60 *
                24 *
                7;

            return get().tasks.filter(
              (
                task
              ) =>
                !!task.completedAt &&
                task.completedAt >=
                  weekAgo
            ).length;
          },

        recalculateMetrics:
          () => {
            const tasks =
              get().tasks;

            const completed =
              tasks.filter(
                (
                  task
                ) =>
                  task.completed
              );

            const total =
              tasks.length;

            const completionRate =
              total > 0
                ? Math.round(
                    (completed.length /
                      total) *
                      100
                  )
                : 0;

            const today =
              new Date();

            const completedToday =
              completed.filter(
                (
                  task
                ) => {
                  if (
                    !task.completedAt
                  ) {
                    return false;
                  }

                  const date =
                    new Date(
                      task.completedAt
                    );

                  return (
                    date.getDate() ===
                      today.getDate() &&
                    date.getMonth() ===
                      today.getMonth() &&
                    date.getFullYear() ===
                      today.getFullYear()
                  );
                }
              ).length;

            const weekCompleted =
              get().getTasksCompletedThisWeek();

            const executionVelocity =
              Number(
                (
                  weekCompleted /
                  7
                ).toFixed(1)
              );

            set({
              totalCompleted:
                completed.length,

              completionRate,

              completedToday,

              executionVelocity,
            });
          },
      }),
      {
        name:
          "tasks-storage",
      }
    )
  );
