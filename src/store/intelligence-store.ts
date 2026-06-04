import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";

export type GoalType = 'daily' | 'weekly' | 'monthly';

export type Goal = {
  id: string;
  type: GoalType;
  targetHours: number;
  targetSessions: number;
  createdAt: number;
  updatedAt: number;
};

export type Milestone = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number;
};

export type SessionReview = {
  id: string;
  sessionId: string;
  classification: string;
  improvements: string;
  trend: 'up' | 'down' | 'flat';
  createdAt: number;
};

type IntelligenceState = {
  goals: Goal[];
  milestones: Milestone[];
  sessionReviews: SessionReview[];

  deepWorkScore: number;
  productivityScore: number;
  momentumScore: number;
  
  isBurnedOut: boolean;
  burnoutWarning: string | null;

  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  
  unlockMilestone: (title: string, description: string, icon: string) => Promise<void>;
  
  addSessionReview: (review: Omit<SessionReview, 'id' | 'createdAt'>) => Promise<void>;
  
  calculateScores: () => void;
  detectBurnout: () => void;

  syncIntelligence: (userId: string) => Promise<void>;
};

export const useIntelligenceStore = create<IntelligenceState>()(
  persist(
    (set, get) => ({
      goals: [],
      milestones: [],
      sessionReviews: [],
      
      deepWorkScore: 0,
      productivityScore: 0,
      momentumScore: 0,

      isBurnedOut: false,
      burnoutWarning: null,

      setGoals: (goals) => set({ goals }),
      
      addGoal: async (goalData) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        const newGoal: Goal = {
          ...goalData,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        set({ goals: [...get().goals, newGoal] });

        try {
          await supabase.from('goals').insert({
            id: newGoal.id,
            user_id: user.id,
            type: newGoal.type,
            target_hours: newGoal.targetHours,
            target_sessions: newGoal.targetSessions,
            created_at: newGoal.createdAt,
            updated_at: newGoal.updatedAt
          });
        } catch (e) {
          console.error("Failed to sync goal", e);
        }
      },

      updateGoal: async (id, updates) => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        set({
          goals: get().goals.map(g => g.id === id ? { ...g, ...updates, updatedAt: Date.now() } : g)
        });

        try {
          const updated = get().goals.find(g => g.id === id);
          if (updated) {
            await supabase.from('goals').update({
              target_hours: updated.targetHours,
              target_sessions: updated.targetSessions,
              updated_at: updated.updatedAt
            }).eq('id', id);
          }
        } catch (e) {
          console.error("Failed to update goal", e);
        }
      },

      unlockMilestone: async (title, description, icon) => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        // Check if already unlocked
        if (get().milestones.some(m => m.title === title)) return;

        const milestone: Milestone = {
          id: crypto.randomUUID(),
          title,
          description,
          icon,
          unlockedAt: Date.now()
        };

        set({ milestones: [...get().milestones, milestone] });

        try {
          await supabase.from('milestones').insert({
            id: milestone.id,
            user_id: user.id,
            title: milestone.title,
            description: milestone.description,
            icon: milestone.icon,
            unlocked_at: milestone.unlockedAt
          });
        } catch (e) {
          console.error("Failed to sync milestone", e);
        }
      },

      addSessionReview: async (reviewData) => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        const newReview: SessionReview = {
          ...reviewData,
          id: crypto.randomUUID(),
          createdAt: Date.now()
        };

        set({ sessionReviews: [newReview, ...get().sessionReviews] });

        try {
          await supabase.from('session_reviews').insert({
            id: newReview.id,
            user_id: user.id,
            session_id: newReview.sessionId,
            classification: newReview.classification,
            improvements: newReview.improvements,
            trend: newReview.trend,
            created_at: newReview.createdAt
          });
        } catch (e) {
          console.error("Failed to sync session review", e);
        }
      },

      calculateScores: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        // Implement actual logic based on sessionReviews and goals
        const reviews = get().sessionReviews;
        
        let deepWorkScore = 80;
        let productivityScore = 70;
        let momentumScore = 60;

        if (reviews.length > 0) {
          const recentReviews = reviews.slice(0, 5);
          const flowCount = recentReviews.filter(r => r.classification === 'Deep Flow').length;
          deepWorkScore = Math.min(100, 50 + (flowCount * 10));
          
          const upTrendCount = recentReviews.filter(r => r.trend === 'up').length;
          momentumScore = Math.min(100, 40 + (upTrendCount * 12));
          
          productivityScore = Math.floor((deepWorkScore + momentumScore) / 2) + 10;
        }

        set({ deepWorkScore, productivityScore, momentumScore });

        // Update daily_analytics
        try {
          const analyticsDate = new Date().toLocaleDateString('en-CA');
          const { data: existingAnalytics } = await supabase
            .from('daily_analytics')
            .select('*')
            .eq('user_id', user.id)
            .eq('analytics_date', analyticsDate)
            .maybeSingle();
            
          if (existingAnalytics) {
            await supabase.from('daily_analytics').update({
              deep_work_score: deepWorkScore,
              productivity_score: productivityScore,
              momentum_score: momentumScore
            }).eq('id', existingAnalytics.id);
          }
        } catch (e) {
          console.error("Failed to update daily scores", e);
        }
      },

      detectBurnout: () => {
        // Analyze if the user is burned out
        set({
          isBurnedOut: false,
          burnoutWarning: null
        });
      },

      syncIntelligence: async (userId) => {
        try {
          const [goalsRes, milestonesRes, reviewsRes] = await Promise.all([
            supabase.from('goals').select('*').eq('user_id', userId),
            supabase.from('milestones').select('*').eq('user_id', userId),
            supabase.from('session_reviews').select('*').eq('user_id', userId).order('created_at', { ascending: false })
          ]);

          if (goalsRes.data) {
            set({
              goals: goalsRes.data.map(g => ({
                id: g.id,
                type: g.type as GoalType,
                targetHours: Number(g.target_hours),
                targetSessions: g.target_sessions,
                createdAt: g.created_at,
                updatedAt: g.updated_at
              }))
            });
          }

          if (milestonesRes.data) {
            set({
              milestones: milestonesRes.data.map(m => ({
                id: m.id,
                title: m.title,
                description: m.description,
                icon: m.icon,
                unlockedAt: m.unlocked_at
              }))
            });
          }

          if (reviewsRes.data) {
            set({
              sessionReviews: reviewsRes.data.map(r => ({
                id: r.id,
                sessionId: r.session_id,
                classification: r.classification,
                improvements: r.improvements,
                trend: r.trend as 'up' | 'down' | 'flat',
                createdAt: r.created_at
              }))
            });
          }

          get().calculateScores();
          get().detectBurnout();
        } catch (e) {
          console.error("Failed to sync intelligence data", e);
        }
      }
    }),
    {
      name: "intelligence-storage"
    }
  )
);
