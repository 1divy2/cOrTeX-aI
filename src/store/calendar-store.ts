import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";

export type TimeBlockType = 'focus' | 'work' | 'study' | 'planning' | 'break';

export type TimeBlock = {
  id: string;
  title: string;
  type: TimeBlockType;
  startTime: number;
  endTime: number;
  date: string; // YYYY-MM-DD
  linkedTaskId: string | null;
  linkedProjectId: string | null;
  completed: boolean;
  createdAt: number;
};

type CalendarState = {
  blocks: TimeBlock[];
  isLoading: boolean;
  
  fetchBlocks: (startDate: string, endDate: string) => Promise<void>;
  addBlock: (block: Omit<TimeBlock, 'id' | 'createdAt' | 'completed'>) => Promise<void>;
  updateBlock: (id: string, updates: Partial<TimeBlock>) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  toggleBlockCompletion: (id: string, completed: boolean) => Promise<void>;
};

export const useCalendarStore = create<CalendarState>((set, get) => ({
  blocks: [],
  isLoading: false,

  fetchBlocks: async (startDate, endDate) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('time_blocks')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('start_time', { ascending: true });

      if (error) throw error;

      if (data) {
        set({
          blocks: data.map((item: any) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            startTime: item.start_time,
            endTime: item.end_time,
            date: item.date,
            linkedTaskId: item.linked_task_id,
            linkedProjectId: item.linked_project_id,
            completed: item.completed,
            createdAt: item.created_at,
          }))
        });
      }
    } catch (error) {
      console.error('Error fetching time blocks:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addBlock: async (blockData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newBlock: TimeBlock = {
      ...blockData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now()
    };

    set(state => ({ blocks: [...state.blocks, newBlock] }));

    await supabase.from('time_blocks').insert({
      id: newBlock.id,
      user_id: user.id,
      title: newBlock.title,
      type: newBlock.type,
      start_time: newBlock.startTime,
      end_time: newBlock.endTime,
      date: newBlock.date,
      linked_task_id: newBlock.linkedTaskId,
      linked_project_id: newBlock.linkedProjectId,
      completed: newBlock.completed,
      created_at: newBlock.createdAt
    });
  },

  updateBlock: async (id, updates) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set(state => ({
      blocks: state.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
    }));

    const updatePayload: any = {};
    if (updates.title !== undefined) updatePayload.title = updates.title;
    if (updates.startTime !== undefined) updatePayload.start_time = updates.startTime;
    if (updates.endTime !== undefined) updatePayload.end_time = updates.endTime;
    if (updates.date !== undefined) updatePayload.date = updates.date;

    if (Object.keys(updatePayload).length > 0) {
      await supabase.from('time_blocks').update(updatePayload).eq('id', id).eq('user_id', user.id);
    }
  },

  deleteBlock: async (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set(state => ({ blocks: state.blocks.filter(b => b.id !== id) }));
    await supabase.from('time_blocks').delete().eq('id', id).eq('user_id', user.id);
  },

  toggleBlockCompletion: async (id, completed) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set(state => ({
      blocks: state.blocks.map(b => b.id === id ? { ...b, completed } : b)
    }));
    await supabase.from('time_blocks').update({ completed }).eq('id', id).eq('user_id', user.id);
  }
}));
