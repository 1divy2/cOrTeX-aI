import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";
import { askGemini } from "@/lib/gemini";
import { useNotesStore } from "@/store/notes-store";
import { useProductivityStore } from "@/store/productivity-store";
import { useFocusStore } from "@/store/focus-store";
import { useMemoryStore } from "@/store/memory-store";

export type ReportType = 'daily' | 'weekly' | 'monthly';

export type AIReport = {
  id: string;
  type: ReportType;
  date: string;
  content: string;
  createdAt: number;
};

type ReportsState = {
  reports: AIReport[];
  isLoading: boolean;
  isGenerating: boolean;
  
  fetchReports: () => Promise<void>;
  generateReport: (type: ReportType) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
};

export const useReportsStore = create<ReportsState>((set, get) => ({
  reports: [],
  isLoading: false,
  isGenerating: false,

  fetchReports: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        set({
          reports: data.map((item: any) => ({
            id: item.id,
            type: item.type,
            date: item.date,
            content: item.content,
            createdAt: item.created_at,
          }))
        });
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  generateReport: async (type) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isGenerating: true });
    
    try {
      const notesStore = useNotesStore.getState();
      const productivityStore = useProductivityStore.getState() as any;
      const focusStore = useFocusStore.getState();
      const memoryStore = useMemoryStore.getState();

      const notesCtx = (Array.isArray(notesStore.notes) ? notesStore.notes : [])
        .slice(0, 20)
        .map((n) => `[NOTE: ${n.title}] Category: ${n.category}`)
        .join("\n");
        
      const memoryCtx = memoryStore.memories
        .map(m => `[MEMORY: ${m.type.toUpperCase()}] ${m.content}`)
        .join("\n");

      const statsCtx = `
Completed Sessions: ${productivityStore.getCompletedSessions?.() || 0}
Total Focus Hours: ${productivityStore.totalFocusHours || 0}
      `;

      let prompt = "";
      if (type === 'daily') {
        prompt = `Generate a Daily Briefing for me. Include tasks due, goals remaining, streak status, focus recommendations, and recent AI observations. Be highly actionable and act as an executive coach. Formatting should be clean markdown.`;
      } else if (type === 'weekly') {
        prompt = `Generate a Weekly Executive Report for me. Analyze my productivity trends, goal completion, focus improvements, and knowledge growth. Provide strategic recommendations for next week.`;
      } else {
        prompt = `Generate a Monthly Intelligence Report for me. Summarize my productivity growth, behavioral changes, major accomplishments, and long-term areas for improvement based on my memory and notes.`;
      }

      const fullContext = `
WORKSPACE CONTEXT:
${statsCtx}
${memoryCtx}
${notesCtx}
      `;

      const content = await askGemini(prompt, 'coach', fullContext);

      const newReport: AIReport = {
        id: crypto.randomUUID(),
        type,
        date: new Date().toISOString().split('T')[0],
        content,
        createdAt: Date.now(),
      };

      set((state) => ({ reports: [newReport, ...state.reports] }));

      await supabase.from('ai_reports').insert({
        id: newReport.id,
        user_id: user.id,
        type: newReport.type,
        date: newReport.date,
        content: newReport.content,
        created_at: newReport.createdAt,
      });

    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      set({ isGenerating: false });
    }
  },

  deleteReport: async (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set((state) => ({
      reports: state.reports.filter((r) => r.id !== id)
    }));

    try {
      await supabase
        .from('ai_reports')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  },
}));
