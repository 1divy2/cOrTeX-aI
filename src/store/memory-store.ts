import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";

export type MemoryType = 'goal' | 'project' | 'topic' | 'preference' | 'fact';

export type Memory = {
  id: string;
  type: MemoryType;
  content: string;
  importance: number;
  createdAt: number;
  updatedAt: number;
};

type MemoryState = {
  memories: Memory[];
  isLoading: boolean;
  
  fetchMemories: () => Promise<void>;
  addMemory: (type: MemoryType, content: string, importance?: number) => Promise<void>;
  updateMemory: (id: string, content: string) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  clearMemories: () => void;
};

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memories: [],
  isLoading: false,

  fetchMemories: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('ai_memories')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        set({
          memories: data.map((item: any) => ({
            id: item.id,
            type: item.type,
            content: item.content,
            importance: item.importance,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }))
        });
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addMemory: async (type, content, importance = 1) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newMemory: Memory = {
      id: crypto.randomUUID(),
      type,
      content,
      importance,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((state) => ({ memories: [newMemory, ...state.memories] }));

    try {
      const { error } = await supabase.from('ai_memories').insert({
        id: newMemory.id,
        user_id: user.id,
        type: newMemory.type,
        content: newMemory.content,
        importance: newMemory.importance,
        created_at: newMemory.createdAt,
        updated_at: newMemory.updatedAt,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding memory:', error);
      // Revert optimism if failed
      set((state) => ({ memories: state.memories.filter((m) => m.id !== newMemory.id) }));
    }
  },

  updateMemory: async (id, content) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const now = Date.now();
    set((state) => ({
      memories: state.memories.map((m) => m.id === id ? { ...m, content, updatedAt: now } : m)
    }));

    try {
      const { error } = await supabase
        .from('ai_memories')
        .update({ content, updated_at: now })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  },

  deleteMemory: async (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id)
    }));

    try {
      const { error } = await supabase
        .from('ai_memories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  },

  clearMemories: () => set({ memories: [] })
}));
