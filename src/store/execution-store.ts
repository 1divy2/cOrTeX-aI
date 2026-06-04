import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";

export type Domain = {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: number;
};

export type Project = {
  id: string;
  domainId: string | null;
  name: string;
  description: string | null;
  status: 'active' | 'completed' | 'stalled' | 'archived';
  healthScore: number;
  createdAt: number;
  updatedAt: number;
};

export type Habit = {
  id: string;
  domainId: string | null;
  name: string;
  frequency: string;
  streak: number;
  createdAt: number;
};

type ExecutionState = {
  domains: Domain[];
  projects: Project[];
  habits: Habit[];
  isLoading: boolean;
  
  fetchExecutionData: () => Promise<void>;
  
  addDomain: (name: string, icon: string, color: string) => Promise<void>;
  addProject: (name: string, description: string | null, domainId: string | null) => Promise<void>;
  updateProjectStatus: (id: string, status: Project['status']) => Promise<void>;
  
  addHabit: (name: string, frequency: string, domainId: string | null) => Promise<void>;
  logHabit: (habitId: string, completed: boolean) => Promise<void>;
  
  habitLogs: { habitId: string; date: string; completed: boolean }[];
};

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  domains: [],
  projects: [],
  habits: [],
  habitLogs: [],
  isLoading: false,

  fetchExecutionData: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    try {
      const [domainsRes, projectsRes, habitsRes, logsRes] = await Promise.all([
        supabase.from('domains').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
        supabase.from('projects').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }),
        supabase.from('habits').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
        supabase.from('habit_logs').select('*').eq('user_id', user.id)
      ]);

      set({
        domains: (domainsRes.data || []).map((d: any) => ({
          id: d.id, name: d.name, icon: d.icon, color: d.color, createdAt: d.created_at
        })),
        projects: (projectsRes.data || []).map((p: any) => ({
          id: p.id, domainId: p.domain_id, name: p.name, description: p.description,
          status: p.status, healthScore: p.health_score, createdAt: p.created_at, updatedAt: p.updated_at
        })),
        habits: (habitsRes.data || []).map((h: any) => ({
          id: h.id, domainId: h.domain_id, name: h.name, frequency: h.frequency,
          streak: h.streak, createdAt: h.created_at
        })),
        habitLogs: (logsRes.data || []).map((l: any) => ({
          habitId: l.habit_id, date: l.date, completed: l.completed
        })),
      });
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },

  addDomain: async (name, icon, color) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newDomain: Domain = {
      id: crypto.randomUUID(), name, icon, color, createdAt: Date.now()
    };

    set(state => ({ domains: [...state.domains, newDomain] }));

    await supabase.from('domains').insert({
      id: newDomain.id, user_id: user.id, name, icon, color, created_at: newDomain.createdAt
    });
  },

  addProject: async (name, description, domainId) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newProject: Project = {
      id: crypto.randomUUID(), domainId, name, description, status: 'active', healthScore: 100, createdAt: Date.now(), updatedAt: Date.now()
    };

    set(state => ({ projects: [newProject, ...state.projects] }));

    await supabase.from('projects').insert({
      id: newProject.id, user_id: user.id, domain_id: domainId, name, description, status: newProject.status, health_score: newProject.healthScore, created_at: newProject.createdAt, updated_at: newProject.updatedAt
    });
  },

  updateProjectStatus: async (id, status) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set(state => ({
      projects: state.projects.map(p => p.id === id ? { ...p, status, updatedAt: Date.now() } : p)
    }));

    await supabase.from('projects').update({ status, updated_at: Date.now() }).eq('id', id).eq('user_id', user.id);
  },

  addHabit: async (name, frequency, domainId) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newHabit: Habit = {
      id: crypto.randomUUID(), domainId, name, frequency, streak: 0, createdAt: Date.now()
    };

    set(state => ({ habits: [...state.habits, newHabit] }));

    await supabase.from('habits').insert({
      id: newHabit.id, user_id: user.id, domain_id: domainId, name, frequency, streak: newHabit.streak, created_at: newHabit.createdAt
    });
  },

  logHabit: async (habitId, completed) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const existingLog = get().habitLogs.find(l => l.habitId === habitId && l.date === today);
    const isActuallyCompleted = completed;
    
    // Optimistically update logs and streak
    set(state => {
      let newLogs = [...state.habitLogs];
      if (existingLog) {
        newLogs = newLogs.map(l => (l.habitId === habitId && l.date === today) ? { ...l, completed: isActuallyCompleted } : l);
      } else {
        newLogs.push({ habitId, date: today, completed: isActuallyCompleted });
      }

      return {
        habitLogs: newLogs,
        habits: state.habits.map(h => {
          if (h.id === habitId) {
            // Very naive streak calculation for now, just incrementing/decrementing for UI
            return { ...h, streak: isActuallyCompleted ? h.streak + 1 : Math.max(0, h.streak - 1) };
          }
          return h;
        })
      };
    });

    await supabase.from('habit_logs').upsert({
      id: existingLog ? undefined : crypto.randomUUID(), // supabase will handle if ID isn't required for composite, but we use a unique constraint or something. Actually, let's just use habit_id and date as unique.
      habit_id: habitId,
      user_id: user.id,
      date: today,
      completed: isActuallyCompleted,
      created_at: Date.now()
    }, { onConflict: 'habit_id, date, user_id' });
    
    // Server logic for streak could be complex, keeping simple client estimation for now.
  }
}));
