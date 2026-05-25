import {
  motion,
} from "framer-motion";

import {
  Brain,
  Bell,
  Monitor,
  Shield,
  Sparkles,
  ChevronRight,
  Check,
} from "lucide-react";

import {
  useSettingsStore,
} from "@/store/settings-store";

const sections = [
  {
    title:
      "AI Preferences",

    description:
      "Customize your intelligence layer.",

    icon: Brain,

    items: [
      "AI Response Style",
      "Creativity Level",
      "Memory Awareness",
      "Smart Suggestions",
    ],
  },

  {
    title:
      "Workspace",

    description:
      "Personalize your environment.",

    icon: Monitor,

    items: [
      "Theme",
      "Animations",
      "Focus Mode",
      "Sidebar Behavior",
    ],
  },

  {
    title:
      "Notifications",

    description:
      "Control updates and reminders.",

    icon: Bell,

    items: [
      "Email Notifications",
      "Session Alerts",
      "Focus Reminders",
      "Weekly Reports",
    ],
  },

  {
    title:
      "Privacy & Security",

    description:
      "Manage your account security.",

    icon: Shield,

    items: [
      "Export Workspace",
      "Backup Notes",
      "Reset Workspace",
      "Logout",
    ],
  },
];

function Toggle({
  enabled,
  onClick,
  color,
}: {
  enabled: boolean;

  onClick: () => void;

  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative h-7 w-14 rounded-full transition-all duration-300 ${
        enabled
          ? color
          : "bg-zinc-700"
      }`}
    >

      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className={`absolute top-1 h-5 w-5 rounded-full bg-white ${
          enabled
            ? "left-8"
            : "left-1"
        }`}
      />

    </button>
  );
}

export default function SettingsPage() {
  const {
    ambientMode,
    notifications,
    soundEffects,
    
    accentColor,
    theme,
    toggleAmbientMode,
    toggleNotifications,
    toggleSoundEffects,
    
    setTheme,
    setAccentColor,
  } = useSettingsStore();

  return (
    <div className="min-h-screen overflow-hidden bg-[#05010a] text-white">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300 backdrop-blur-xl">

            <Sparkles className="h-3.5 w-3.5 text-purple-400" />

            Workspace Preferences

          </div>

          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <h1 className="text-6xl font-black tracking-tight lg:text-7xl">

                Settings

              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">

                Configure your AI workspace, productivity environment and intelligence preferences.

              </p>

            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 backdrop-blur-xl">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20">

                <Check className="h-5 w-5 text-emerald-300" />

              </div>

              <div>

                <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">

                  System Status

                </p>

                <p className="mt-1 text-sm text-zinc-200">

                  All preferences synced

                </p>

              </div>

            </div>

          </div>

        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">

          {sections.map(
            (
              section,
              index
            ) => {
              const Icon =
                section.icon;

              return (
                <motion.div
                  key={
                    section.title
                  }
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.08,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl"
                >

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">

                    <div className="flex items-start justify-between">

                      <div>

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

                          <Icon className="h-6 w-6 text-purple-300" />

                        </div>

                        <h2 className="mt-6 text-3xl font-bold">

                          {section.title}

                        </h2>

                        <p className="mt-3 text-zinc-400">

                          {
                            section.description
                          }

                        </p>

                      </div>

                    </div>

                    <div className="mt-10 space-y-4">

                      {section.items.map(
                        (
                          item
                        ) => {
                          const isAmbient =
                            item ===
                            "Animations";

                          const isNotifications =
                            item ===
                            "Email Notifications";

                          const isSound =
                            item ===
                            "Session Alerts";


                          return (
                            <motion.div
                              key={item}
                              whileHover={{
                                x: 6,
                              }}
                              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4 transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-500/10"
                            >

                              <div>

                                <p className="text-sm font-medium text-zinc-200">

                                  {item}

                                </p>

                                <p className="mt-1 text-xs text-zinc-500">

                                  {isAmbient &&
                                    "Enable immersive ambient effects"}

                                  {isNotifications &&
                                    "Receive productivity notifications"}

                                  {isSound &&
                                    "Workspace interaction audio"}

                                  

                                  {!isAmbient &&
                                    !isNotifications &&
                                    !isSound &&
                                    
                                    "Advanced configuration option"}

                                </p>

                              </div>

                              {isAmbient && (
                                <Toggle
                                  enabled={
                                    ambientMode
                                  }
                                  onClick={
                                    toggleAmbientMode
                                  }
                                  color="bg-purple-500"
                                />
                              )}

                              {isNotifications && (
                                <Toggle
                                  enabled={
                                    notifications
                                  }
                                  onClick={
                                    toggleNotifications
                                  }
                                  color="bg-cyan-500"
                                />
                              )}

                              {isSound && (
                                <Toggle
                                  enabled={
                                    soundEffects
                                  }
                                  onClick={
                                    toggleSoundEffects
                                  }
                                  color="bg-pink-500"
                                />
                              )}

                              

                              {!isAmbient &&
  !isNotifications &&
  !isSound && (
    <ChevronRight className="h-4 w-4 text-zinc-500 transition-transform duration-300 group-hover:translate-x-1" />
)}

                            </motion.div>
                          );
                        }
                      )}

                    </div>

                    {section.title ===
                      "Workspace" && (
                      <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">

                        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">

                          Active Theme

                        </p>

                        <div className="mt-4 flex gap-3">

                          <button
                            onClick={() =>
                              setTheme(
                                "dark"
                              )
                            }
                            className={`rounded-2xl border px-5 py-3 text-sm transition-all ${
                              theme ===
                              "dark"
                                ? "border-purple-500 bg-purple-500/20 text-white"
                                : "border-white/10 bg-white/[0.03] text-zinc-400"
                            }`}
                          >

                            Dark

                          </button>

                          <button
                            onClick={() =>
                              setTheme(
                                "midnight"
                              )
                            }
                            className={`rounded-2xl border px-5 py-3 text-sm transition-all ${
                              theme ===
                              "midnight"
                                ? "border-cyan-500 bg-cyan-500/20 text-white"
                                : "border-white/10 bg-white/[0.03] text-zinc-400"
                            }`}
                          >

                            Midnight

                          </button>

                        </div>

                        <div className="mt-6">

                          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">

                            Accent Color

                          </p>

                          <div className="mt-4 flex gap-3">

                            {[
                              "#a855f7",
                              "#22d3ee",
                              "#ec4899",
                              "#10b981",
                            ].map(
                              (
                                color
                              ) => (
                                <button
                                  key={
                                    color
                                  }
                                  onClick={() =>
                                    setAccentColor(
                                      color
                                    )
                                  }
                                  className={`h-10 w-10 rounded-full border-2 transition-all ${
                                    accentColor ===
                                    color
                                      ? "scale-110 border-white"
                                      : "border-transparent"
                                  }`}
                                  style={{
                                    background:
                                      color,
                                  }}
                                />
                              )
                            )}

                          </div>

                        </div>

                      </div>
                    )}

                  </div>

                </motion.div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}