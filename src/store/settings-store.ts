import { create } from "zustand";

import { persist } from "zustand/middleware";

export type ThemeMode =
  | "dark"
  | "midnight"
  | "system";

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

  completeSession:
    () => void;
};

export const useSettingsStore =
  create<SettingsState>()(
    persist(
      (set, get) => ({
        username:
          "Deep Worker",

        theme: "dark",

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
          document.documentElement.setAttribute(
            "data-theme",
            theme
          );

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
      }),
      {
        name:
          "settings-storage",
      }
    )
  );