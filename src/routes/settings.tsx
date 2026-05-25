import { createFileRoute } from "@tanstack/react-router";

import {
  User,
  Moon,
  Timer,
  Sparkles,
  Shield,
  Brain,
  Laptop,
  Trash2,
  Download,
  Upload,
  Check,
} from "lucide-react";

import {
  useRef,
  useState,
} from "react";

import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";

import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";

import {
  useSettingsStore,
} from "@/store/settings-store";

export const Route =
  createFileRoute("/settings")({
    component: SettingsPage,
  });

function SettingsPage() {
  const {
    username,
    theme,
    focusDuration,
    breakDuration,
    dailyGoalHours,

    compactSidebar,
    ambientMode,
    soundEffects,

    notifications,
    language,
    accentColor,

    updateUsername,
    setTheme,
    setFocusDuration,
    setBreakDuration,
    setDailyGoalHours,

    toggleCompactSidebar,
    toggleAmbientMode,
    toggleSoundEffects,
    toggleNotifications,

    setAccentColor,
    setLanguage,
  } =
    useSettingsStore();

  const [
    aiMemory,
    setAiMemory,
  ] = useState(true);

  const [
    autoSave,
    setAutoSave,
  ] = useState(true);

  const [
    analytics,
    setAnalytics,
  ] = useState(false);

  const [
    saveStatus,
    setSaveStatus,
  ] = useState("");

  const fileRef =
    useRef<HTMLInputElement>(
      null
    );

  const exportData =
    () => {
      const data = {
        username,
        theme,
        focusDuration,
        breakDuration,
        dailyGoalHours,
        compactSidebar,
        ambientMode,
        soundEffects,
        notifications,
        language,
        accentColor,
      };

      const blob =
        new Blob(
          [
            JSON.stringify(
              data,
              null,
              2
            ),
          ],
          {
            type: "application/json",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        "coretex-settings.json";

      a.click();

      URL.revokeObjectURL(
        url
      );

      setSaveStatus(
        "Settings exported"
      );

      setTimeout(() => {
        setSaveStatus("");
      }, 2500);
    };

  const importData =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload =
        (
          event
        ) => {
          try {
            const parsed =
              JSON.parse(
                event
                  .target
                  ?.result as string
              );

            if (
              parsed.username
            )
              updateUsername(
                parsed.username
              );

            if (
              parsed.theme
            )
              setTheme(
                parsed.theme
              );

            if (
              parsed.focusDuration
            )
              setFocusDuration(
                parsed.focusDuration
              );

            if (
              parsed.breakDuration
            )
              setBreakDuration(
                parsed.breakDuration
              );

            if (
              parsed.dailyGoalHours
            )
              setDailyGoalHours(
                parsed.dailyGoalHours
              );

            if (
              parsed.language
            )
              setLanguage(
                parsed.language
              );

            if (
              parsed.accentColor
            )
              setAccentColor(
                parsed.accentColor
              );

            setSaveStatus(
              "Settings imported"
            );

            setTimeout(() => {
              setSaveStatus(
                ""
              );
            }, 2500);
          } catch {
            setSaveStatus(
              "Invalid settings file"
            );
          }
        };

      reader.readAsText(
        file
      );
    };

  const resetWorkspace =
    () => {
      localStorage.clear();

      location.reload();
    };

  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-white">

      <WorkspaceSidebar />

      <div className="relative z-10 ml-[84px] lg:ml-[280px]">

        <WorkspaceHeader />

        <main className="relative h-screen overflow-y-auto pt-28">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_25%)]" />

          <div className="relative z-10 mx-auto max-w-[1800px] px-8 pb-28">

            <section className="rounded-[40px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

              <div className="flex items-center justify-between">

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />

                    Workspace Configuration

                  </div>

                  <h1 className="mt-6 text-6xl font-black leading-[0.95] tracking-tight">

                    Settings

                    <br />

                    <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">

                      control center

                    </span>

                  </h1>

                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 px-6 py-5">

                  <p className="text-sm text-zinc-500">

                    System Status

                  </p>

                  <h3 className="mt-2 text-3xl font-black text-emerald-400">

                    Operational

                  </h3>

                  {saveStatus && (
                    <p className="mt-3 text-sm text-cyan-300">

                      {saveStatus}

                    </p>
                  )}

                </div>

              </div>

            </section>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

              <div className="space-y-6">

                <SettingsCard
                  icon={User}
                  title="Profile"
                  desc="Identity and personalization"
                >

                  <div className="mt-6 space-y-5">

                    <InputRow
                      label="Username"
                      value={username}
                      onChange={
                        updateUsername
                      }
                    />

                    <SelectRow
                      label="Language"
                      value={language}
                      onChange={
                        setLanguage
                      }
                      options={[
                        "English",
                        "Japanese",
                        "German",
                        "French",
                      ]}
                    />

                  </div>

                </SettingsCard>

                <SettingsCard
                  icon={Moon}
                  title="Appearance"
                  desc="Theme and visual controls"
                >

                  <div className="mt-6 grid grid-cols-3 gap-4">

                    {[
                      "dark",
                      "midnight",
                      "system",
                    ].map((mode) => (
                      <ThemeCard
                        key={mode}
                        active={
                          theme === mode
                        }
                        title={mode}
                        onClick={() =>
                          setTheme(
                            mode as any
                          )
                        }
                      />
                    ))}

                  </div>

                  <div className="mt-8">

                    <p className="mb-4 text-sm text-zinc-400">

                      Accent Color

                    </p>

                    <div className="flex flex-wrap gap-3">

                      {[
                        "Purple",
                        "Cyan",
                        "Pink",
                        "Emerald",
                      ].map(
                        (
                          item
                        ) => (
                          <button
                            key={item}
                            onClick={() =>
                              setAccentColor(
                                item
                              )
                            }
                            className={`rounded-2xl border px-4 py-3 text-sm transition-all duration-300 ${
                              accentColor ===
                              item
                                ? "border-purple-500/30 bg-purple-500/10 text-white shadow-[0_0_25px_rgba(168,85,247,0.25)]"
                                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
                            }`}
                          >

                            {item}

                          </button>
                        )
                      )}

                    </div>

                  </div>

                </SettingsCard>

                <SettingsCard
                  icon={Timer}
                  title="Focus Sessions"
                  desc="Deep work timing controls"
                >

                  <div className="mt-6 space-y-8">

                    <SliderInput
                      label="Focus Duration"
                      value={
                        focusDuration
                      }
                      suffix="min"
                      min={15}
                      max={120}
                      onChange={
                        setFocusDuration
                      }
                    />

                    <SliderInput
                      label="Break Duration"
                      value={
                        breakDuration
                      }
                      suffix="min"
                      min={5}
                      max={45}
                      onChange={
                        setBreakDuration
                      }
                    />

                    <SliderInput
                      label="Daily Goal"
                      value={
                        dailyGoalHours
                      }
                      suffix="hrs"
                      min={1}
                      max={12}
                      onChange={
                        setDailyGoalHours
                      }
                    />

                  </div>

                </SettingsCard>

              </div>

              <div className="space-y-6">

                <SettingsCard
                  icon={Brain}
                  title="AI Preferences"
                  desc="AI system controls"
                >

                  <div className="mt-6 space-y-4">

                    <ToggleRow
                      label="AI Memory"
                      enabled={
                        aiMemory
                      }
                      onToggle={() =>
                        setAiMemory(
                          !aiMemory
                        )
                      }
                    />

                    <ToggleRow
                      label="Auto Save"
                      enabled={
                        autoSave
                      }
                      onToggle={() =>
                        setAutoSave(
                          !autoSave
                        )
                      }
                    />

                    <ToggleRow
                      label="Analytics Sharing"
                      enabled={
                        analytics
                      }
                      onToggle={() =>
                        setAnalytics(
                          !analytics
                        )
                      }
                    />

                  </div>

                </SettingsCard>

                <SettingsCard
                  icon={Laptop}
                  title="Workspace"
                  desc="Desktop experience"
                >

                  <div className="mt-6 space-y-4">

                    <ToggleRow
                      label="Compact Sidebar"
                      enabled={
                        compactSidebar
                      }
                      onToggle={
                        toggleCompactSidebar
                      }
                    />

                    <ToggleRow
                      label="Ambient Mode"
                      enabled={
                        ambientMode
                      }
                      onToggle={
                        toggleAmbientMode
                      }
                    />

                    <ToggleRow
                      label="Sound Effects"
                      enabled={
                        soundEffects
                      }
                      onToggle={
                        toggleSoundEffects
                      }
                    />

                    <ToggleRow
                      label="Notifications"
                      enabled={
                        notifications
                      }
                      onToggle={
                        toggleNotifications
                      }
                    />

                  </div>

                </SettingsCard>

                <SettingsCard
                  icon={Shield}
                  title="Data Management"
                  desc="Import export and reset"
                >

                  <div className="mt-6 space-y-4">

                    <button
                      onClick={
                        exportData
                      }
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:bg-white/[0.06]"
                    >

                      <Download className="h-5 w-5 text-cyan-300" />

                      Export Settings

                    </button>

                    <button
                      onClick={() =>
                        fileRef.current?.click()
                      }
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:bg-white/[0.06]"
                    >

                      <Upload className="h-5 w-5 text-purple-300" />

                      Import Settings

                    </button>

                    <input
                      ref={fileRef}
                      type="file"
                      accept=".json"
                      hidden
                      onChange={
                        importData
                      }
                    />

                    <button
                      onClick={
                        resetWorkspace
                      }
                      className="flex w-full items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300 transition hover:bg-red-500/20"
                    >

                      <Trash2 className="h-5 w-5" />

                      Reset Workspace

                    </button>

                  </div>

                </SettingsCard>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  desc,
  children,
}: any) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-3xl">

      <div className="flex items-start gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">

          <Icon className="h-6 w-6 text-purple-300" />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">

            {title}

          </h2>

          <p className="mt-1 text-sm text-zinc-500">

            {desc}

          </p>

        </div>

      </div>

      {children}

    </div>
  );
}

function InputRow({
  label,
  value,
  onChange,
}: any) {
  return (
    <div>
      <label className="text-sm text-zinc-400">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white outline-none"
      />
    </div>
  );
}

function SelectRow({
  label,
  value,
  onChange,
  options,
}: any) {
  return (
    <div>
      <label className="text-sm text-zinc-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white outline-none"
      >
        {options.map(
          (item: string) => (
            <option
              key={item}
            >
              {item}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function ThemeCard({
  title,
  active,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-3xl border p-5 transition-all duration-300 ${
        active
          ? "border-purple-500/30 bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.25)]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="mb-5 flex gap-2">
        <div className="h-3 w-3 rounded-full bg-purple-400" />
        <div className="h-3 w-3 rounded-full bg-pink-400" />
        <div className="h-3 w-3 rounded-full bg-cyan-400" />
      </div>

      <div className="flex items-center justify-between">
        <span className="capitalize text-white">
          {title}
        </span>

        {active && (
          <Check className="h-4 w-4 text-purple-300" />
        )}
      </div>
    </button>
  );
}

function SliderInput({
  label,
  value,
  suffix,
  min,
  max,
  onChange,
}: any) {
  const percentage =
    ((value - min) /
      (max - min)) *
    100;

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <label className="text-sm font-medium text-zinc-300">
          {label}
        </label>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-semibold text-white">
          {value} {suffix}
        </div>

      </div>

      <div className="relative flex items-center">

        <div className="absolute h-2 w-full rounded-full bg-white/5" />

        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400"
          style={{
            width: `${percentage}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) =>
            onChange(
              Number(
                e.target.value
              )
            )
          }
          className="relative z-10 h-2 w-full cursor-pointer appearance-none bg-transparent"
        />

      </div>

    </div>
  );
}

function ToggleRow({
  label,
  enabled,
  onToggle,
}: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">

      <div>

        <p className="text-sm font-semibold text-white">
          {label}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          {enabled
            ? "Enabled"
            : "Disabled"}
        </p>

      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`relative flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
          enabled
            ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400"
            : "bg-white/10"
        }`}
      >

        <div
          className={`absolute h-5 w-5 rounded-full bg-white transition-all duration-300 ${
            enabled
              ? "translate-x-8"
              : "translate-x-1"
          }`}
        />

      </button>

    </div>
  );
}

export default SettingsPage;