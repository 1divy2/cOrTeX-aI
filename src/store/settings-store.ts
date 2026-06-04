import { create } from "zustand";

import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";

export type ThemeMode = "light" | "dark" | "system";

type SettingsState = {
  username: string;

  theme: ThemeMode;

  focusDuration: number;

  breakDuration: number;

  dailyGoalHours: number;

  compactSidebar: boolean;

  ambientMode: boolean;

  soundEffects: boolean;

  notifications: boolean;

  accentColor: string;

  language: string;

  focusMusic: string;

  autoResumeFocus: boolean;

  fullscreenFocus: boolean;

  interruptionCount: number;

  totalXP: number;

  lastSessionCompletedAt:
    number | null;

  activeSession:
    | {
        startedAt: number;

        mode:
          | "focus"
          | "break";

        remainingSeconds: number;
      }
    | null;

  updateUsername: (
    username: string
  ) => void;

  setTheme: (
    theme: ThemeMode
  ) => void;

  setFocusDuration: (
    duration: number
  ) => void;

  setBreakDuration: (
    duration: number
  ) => void;

  setDailyGoalHours: (
    hours: number
  ) => void;

  toggleCompactSidebar: () => void;

  toggleAmbientMode: () => void;

  toggleSoundEffects: () => void;

  toggleNotifications: () => void;

  setAccentColor: (
    color: string
  ) => void;

  setLanguage: (
    language: string
  ) => void;

  setFocusMusic: (
    music: string
  ) => void;

  toggleAutoResumeFocus: () => void;

  toggleFullscreenFocus: () => void;

  incrementInterruptions:
    () => void;

  addXP: (
    amount: number
  ) => void;

  setActiveSession: (
    session: SettingsState["activeSession"]
  ) => void;

  completeSession: () => void;
  syncSettings: (userId: string) => Promise<void>;
};


const _syncSettingsToSupabase = async (state: SettingsState) => {
  const user = useAuthStore.getState().user;
  if (!user?.id) return;
  try {
    await supabase.from('settings').upsert({
      user_id: user.id,
      username: state.username,
      theme: state.theme,
      focus_duration: state.focusDuration,
      break_duration: state.breakDuration,
      daily_goal_hours: state.dailyGoalHours,
      compact_sidebar: state.compactSidebar,
      ambient_mode: state.ambientMode,
      sound_effects: state.soundEffects,
      notifications: state.notifications,
      language: state.language,
      updated_at: Date.now()
    });
  } catch (e) {
    console.error("Failed to sync settings", e);
  }
};

export const useSettingsStore =
  create<SettingsState>()(
    persist(
      (set, get) => {
        const syncSet = (args) => {
          set(args);
          // Don't sync activeSession or temporary states, but it's fine since _syncSettingsToSupabase only saves the persistent keys
          _syncSettingsToSupabase(get());
        };
        return {
        username:
          "Deep Worker",

        theme: "system",

        focusDuration: 50,

        breakDuration: 10,

        dailyGoalHours: 4,

        compactSidebar: false,

        ambientMode: true,

        soundEffects: false,

        notifications: true,

        accentColor:
          "Purple",

        language:
          "English",

        focusMusic:
          "Neural Ambient",

        autoResumeFocus: true,

        fullscreenFocus: false,

        interruptionCount: 0,

        totalXP: 0,

        lastSessionCompletedAt:
          null,

        activeSession: null,

        syncSettings: async (userId) => {
          const { data, error } = await supabase.from('settings').select('*').eq('user_id', userId).maybeSingle();
          if (data && !error) {
            set({
              username: data.username || get().username,
              theme: data.theme || get().theme,
              focusDuration: data.focus_duration || get().focusDuration,
              breakDuration: data.break_duration || get().breakDuration,
              dailyGoalHours: data.daily_goal_hours || get().dailyGoalHours,
              compactSidebar: data.compact_sidebar ?? get().compactSidebar,
              ambientMode: data.ambient_mode ?? get().ambientMode,
              soundEffects: data.sound_effects ?? get().soundEffects,
              notifications: data.notifications ?? get().notifications,
              language: data.language || get().language
            });
          }
        },

        updateUsername: (
          username
        ) => {
          set({
            username,
          });
        },

        setTheme: (
          theme
        ) => {
          set({
            theme,
          });
        },

        setFocusDuration: (
          duration
        ) => {
          set({
            focusDuration:
              duration,
          });
        },

        setBreakDuration: (
          duration
        ) => {
          set({
            breakDuration:
              duration,
          });
        },

        setDailyGoalHours: (
          hours
        ) => {
          set({
            dailyGoalHours:
              hours,
          });
        },

        toggleCompactSidebar:
          () => {
            set({
              compactSidebar:
                !get()
                  .compactSidebar,
            });
          },

        toggleAmbientMode:
          () => {
            const next =
              !get()
                .ambientMode;

            document.body.style.filter =
              next
                ? "saturate(1.05)"
                : "none";

            set({
              ambientMode:
                next,
            });
          },

        toggleSoundEffects:
          () => {
            set({
              soundEffects:
                !get()
                  .soundEffects,
            });
          },

        toggleNotifications:
          () => {
            set({
              notifications:
                !get()
                  .notifications,
            });
          },

        setAccentColor: (
          color
        ) => {
          const accentMap: Record<
            string,
            string
          > = {
            Purple:
              "#a855f7",

            Cyan:
              "#06b6d4",

            Pink:
              "#ec4899",

            Emerald:
              "#10b981",
          };

          document.documentElement.style.setProperty(
            "--accent-color",
            accentMap[
              color
            ] ||
              "#a855f7"
          );

          set({
            accentColor:
              color,
          });
        },

        setLanguage: (
          language
        ) => {
          set({
            language,
          });
        },

        setFocusMusic: (
          music
        ) => {
          set({
            focusMusic:
              music,
          });
        },

        toggleAutoResumeFocus:
          () => {
            set({
              autoResumeFocus:
                !get()
                  .autoResumeFocus,
            });
          },

        toggleFullscreenFocus:
          () => {
            set({
              fullscreenFocus:
                !get()
                  .fullscreenFocus,
            });
          },

        incrementInterruptions:
          () => {
            set({
              interruptionCount:
                get()
                  .interruptionCount +
                1,
            });
          },

        addXP: (
          amount
        ) => {
          set({
            totalXP:
              get()
                .totalXP +
              amount,
          });
        },

        setActiveSession: (
          session
        ) => {
          set({
            activeSession:
              session,
          });
        },

        completeSession:
          () => {
            set({
              lastSessionCompletedAt:
                Date.now(),

              activeSession:
                null,

              totalXP:
                get()
                  .totalXP +
                25,
            });
          },
      };
      },
      {
        name:
          "settings-storage",
      }
    )
  );