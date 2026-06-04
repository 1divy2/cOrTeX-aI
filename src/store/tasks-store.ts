import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "active" | "completed" | "archived";

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
  createTask: (task: { title: string; description?: string; priority?: TaskPriority; dueDate?: number; tags?: string[]; }) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  archiveTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  clearCompleted: () => void;
  getActiveTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getTasksCompletedThisWeek: () => number;
  recalculateMetrics: () => void;
  syncTasks: (userId: string) => Promise<void>;
};

const _syncTaskToSupabase = async (task: Task) => {
  const user = useAuthStore.getState().user;
  if (!user?.id) return;
  try {
    await supabase.from('tasks').upsert({
      id: task.id,
      user_id: user.id,
      title: task.title,
      completed: task.completed,
      priority: task.priority,
      due_date: task.dueDate?.toString() || null,
      created_at: task.createdAt
    });
  } catch (e) {
    console.error("Failed to sync task", e);
  }
};

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      archivedTasks: [],
      completedToday: 0,
      totalCompleted: 0,
      completionRate: 0,
      executionVelocity: 0,

      syncTasks: async (userId) => {
        const { data, error } = await supabase.from('tasks').select('*').eq('user_id', userId);
        if (data && !error) {
          const tasks: Task[] = data.map(t => ({
            id: t.id,
            title: t.title,
            completed: t.completed,
            priority: t.priority as TaskPriority,
            status: t.completed ? 'completed' : 'active',
            createdAt: t.created_at,
            updatedAt: t.created_at,
            dueDate: t.due_date ? parseInt(t.due_date) : undefined
          }));
          set({ tasks });
          get().recalculateMetrics();
        }
      },

      createTask: ({ title, description, priority = "medium", dueDate, tags = [] }) => {
        const now = Date.now();
        const task: Task = {
          id: crypto.randomUUID(),
          title,
          description,
          completed: false,
          priority,
          status: "active",
          createdAt: now,
          updatedAt: now,
          dueDate,
          tags,
        };
        set({ tasks: [task, ...get().tasks] });
        _syncTaskToSupabase(task);
        get().recalculateMetrics();
      },

      toggleTask: (id) => {
        const now = Date.now();
        set({
          tasks: get().tasks.map(t => {
            if (t.id === id) {
              const completed = !t.completed;
              return {
                ...t,
                completed,
                status: completed ? 'completed' : 'active',
                completedAt: completed ? now : undefined,
                updatedAt: now
              };
            }
            return t;
          })
        });
        const _t = get().tasks.find(t => t.id === id);
        if (_t) _syncTaskToSupabase(_t);
        get().recalculateMetrics();
      },

      deleteTask: (id) => {
        set({
          tasks: get().tasks.filter(t => t.id !== id),
        });
        const user = useAuthStore.getState().user;
        if (user?.id) supabase.from('tasks').delete().eq('id', id).then();
        get().recalculateMetrics();
      },

      archiveTask: (id) => {
        set({
          tasks: get().tasks.map(t => t.id === id ? { ...t, status: 'archived' as TaskStatus, updatedAt: Date.now() } : t)
        });
        const _t = get().tasks.find(t => t.id === id);
        if (_t) _syncTaskToSupabase(_t);
        get().recalculateMetrics();
      },

      updateTask: (id, updates) => {
        set({
          tasks: get().tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t)
        });
        const _t = get().tasks.find(t => t.id === id);
        if (_t) _syncTaskToSupabase(_t);
        get().recalculateMetrics();
      },

      clearCompleted: () => {
        set({
          tasks: get().tasks.filter(t => !t.completed)
        });
        const user = useAuthStore.getState().user;
        if (user?.id) supabase.from('tasks').delete().eq('user_id', user.id).eq('completed', true).then();
        get().recalculateMetrics();
      },

      getActiveTasks: () => get().tasks.filter(task => !task.completed),
      getCompletedTasks: () => get().tasks.filter(task => task.completed),
      
      getOverdueTasks: () => {
        const now = Date.now();
        return get().tasks.filter(task => !task.completed && !!task.dueDate && task.dueDate < now);
      },

      getTasksCompletedThisWeek: () => {
        const now = Date.now();
        const weekAgo = now - 1000 * 60 * 60 * 24 * 7;
        return get().tasks.filter(task => !!task.completedAt && task.completedAt >= weekAgo).length;
      },

      recalculateMetrics: () => {
        const tasks = get().tasks;
        const completed = tasks.filter(task => task.completed);
        const total = tasks.length;
        const completionRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;
        
        const today = new Date();
        const completedToday = completed.filter(task => {
          if (!task.completedAt) return false;
          const date = new Date(task.completedAt);
          return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          );
        }).length;

        const weekCompleted = get().getTasksCompletedThisWeek();
        const executionVelocity = Number((weekCompleted / 7).toFixed(1));

        set({
          totalCompleted: completed.length,
          completionRate,
          completedToday,
          executionVelocity,
        });
      },
    }),
    {
      name: "tasks-storage",
    }
  )
);