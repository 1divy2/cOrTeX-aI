import { createFileRoute } from "@tanstack/react-router";
import { User, Moon, Timer, Sparkles, Shield, Brain, Laptop, Trash2, Download, Upload, Check, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import { useSettingsStore } from "@/store/settings-store";
import { useWorkspaceStore } from "@/store/workspace-store";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const TABS = [
  { id: "account", label: "Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Moon },
  { id: "productivity", label: "Productivity", icon: Timer },
  { id: "ai", label: "AI Preferences", icon: Brain },
  { id: "workspace", label: "Workspace", icon: Laptop },
  { id: "data", label: "Data Management", icon: Shield },
];

function SettingsPage() {
  const { sidebarCollapsed } = useWorkspaceStore();
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
    updateUsername,
    setTheme,
    setFocusDuration,
    setBreakDuration,
    setDailyGoalHours,
    toggleCompactSidebar,
    toggleAmbientMode,
    toggleSoundEffects,
    toggleNotifications,
    setLanguage,
  } = useSettingsStore();

  const [aiMemory, setAiMemory] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [activeTab, setActiveTab] = useState("appearance");
  const fileRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
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
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "coretex-settings.json";
    a.click();
    URL.revokeObjectURL(url);
    setSaveStatus("Settings exported");
    setTimeout(() => setSaveStatus(""), 2500);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.username) updateUsername(parsed.username);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.focusDuration) setFocusDuration(parsed.focusDuration);
        if (parsed.breakDuration) setBreakDuration(parsed.breakDuration);
        if (parsed.dailyGoalHours) setDailyGoalHours(parsed.dailyGoalHours);
        if (parsed.language) setLanguage(parsed.language);
        
        setSaveStatus("Settings imported");
        setTimeout(() => setSaveStatus(""), 2500);
      } catch {
        setSaveStatus("Invalid settings file");
      }
    };
    reader.readAsText(file);
  };

  const resetWorkspace = () => {
    localStorage.clear();
    location.reload();
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <WorkspaceSidebar />
      <motion.div
        className="relative z-10"
        animate={{ marginLeft: sidebarCollapsed ? 96 : 280 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <WorkspaceHeader />
        <main className="relative h-screen overflow-y-auto pt-28">
          <div className="relative z-10 mx-auto max-w-[1200px] px-8 pb-28">
            <section className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Configuration
                </div>
                <h1 className="mt-4 text-5xl font-display font-bold leading-[0.95] tracking-tight text-foreground">
                  Workspace <span className="italic text-accent">settings</span>
                </h1>
              </div>
              {saveStatus && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-secondary px-6 py-3 font-bold text-accent">
                  {saveStatus}
                </motion.div>
              )}
            </section>

            <div className="flex flex-col gap-10 lg:flex-row">
              {/* Sidebar Navigation */}
              <aside className="w-full shrink-0 lg:w-64">
                <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-between whitespace-nowrap rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-foreground text-background shadow-sm"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-background" : "text-muted-foreground"}`} />
                        {tab.label}
                      </div>
                      {activeTab === tab.id && <ChevronRight className="hidden h-4 w-4 lg:block" />}
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Settings Content */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {activeTab === "account" && (
                      <SettingsCard icon={User} title="Profile" desc="Identity and personalization">
                        <div className="mt-6 space-y-5">
                          <InputRow label="Username" value={username} onChange={updateUsername} />
                          <SelectRow label="Language" value={language} onChange={setLanguage} options={["English", "Japanese", "German", "French"]} />
                        </div>
                      </SettingsCard>
                    )}

                    {activeTab === "appearance" && (
                      <SettingsCard icon={Moon} title="Appearance" desc="Theme and visual controls">
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {["light", "dark", "system"].map((mode) => (
                            <ThemeCard key={mode} active={theme === mode} title={mode} onClick={() => setTheme(mode as any)} />
                          ))}
                        </div>
                      </SettingsCard>
                    )}

                    {activeTab === "productivity" && (
                      <SettingsCard icon={Timer} title="Focus Sessions" desc="Deep work timing controls">
                        <div className="mt-6 space-y-8">
                          <SliderInput label="Focus Duration" value={focusDuration} suffix="min" min={15} max={120} onChange={setFocusDuration} />
                          <SliderInput label="Break Duration" value={breakDuration} suffix="min" min={5} max={45} onChange={setBreakDuration} />
                          <SliderInput label="Daily Goal" value={dailyGoalHours} suffix="hrs" min={1} max={12} onChange={setDailyGoalHours} />
                        </div>
                      </SettingsCard>
                    )}

                    {activeTab === "ai" && (
                      <SettingsCard icon={Brain} title="AI Preferences" desc="AI system controls">
                        <div className="mt-6 space-y-4">
                          <ToggleRow label="AI Memory" enabled={aiMemory} onToggle={() => setAiMemory(!aiMemory)} />
                          <ToggleRow label="Auto Save Insights" enabled={autoSave} onToggle={() => setAutoSave(!autoSave)} />
                          <ToggleRow label="Advanced Analytics" enabled={analytics} onToggle={() => setAnalytics(!analytics)} />
                        </div>
                      </SettingsCard>
                    )}

                    {activeTab === "workspace" && (
                      <SettingsCard icon={Laptop} title="Workspace" desc="Desktop experience">
                        <div className="mt-6 space-y-4">
                          <ToggleRow label="Compact Sidebar" enabled={compactSidebar} onToggle={toggleCompactSidebar} />
                          <ToggleRow label="Ambient Texture" enabled={ambientMode} onToggle={toggleAmbientMode} />
                          <ToggleRow label="Sound Effects" enabled={soundEffects} onToggle={toggleSoundEffects} />
                          <ToggleRow label="Notifications" enabled={notifications} onToggle={toggleNotifications} />
                        </div>
                      </SettingsCard>
                    )}

                    {activeTab === "data" && (
                      <SettingsCard icon={Shield} title="Data Management" desc="Import export and reset">
                        <div className="mt-6 space-y-4">
                          <button onClick={exportData} className="group flex w-full items-center justify-between rounded-xl border border-border bg-secondary px-5 py-4 font-bold transition-all hover:border-accent hover:bg-background">
                            <div className="flex items-center gap-3 text-foreground">
                              <Download className="h-5 w-5 text-accent" />
                              Export Settings
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </button>
                          <button onClick={() => fileRef.current?.click()} className="group flex w-full items-center justify-between rounded-xl border border-border bg-secondary px-5 py-4 font-bold transition-all hover:border-accent hover:bg-background">
                            <div className="flex items-center gap-3 text-foreground">
                              <Upload className="h-5 w-5 text-accent" />
                              Import Settings
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </button>
                          <input ref={fileRef} type="file" accept=".json" hidden onChange={importData} />
                          
                          <div className="my-6 h-px w-full bg-border" />
                          
                          <button onClick={resetWorkspace} className="flex w-full items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 font-bold text-red-600 transition-all hover:bg-red-500/20">
                            <Trash2 className="h-5 w-5" />
                            Reset Workspace
                          </button>
                        </div>
                      </SettingsCard>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, desc, children }: any) {
  return (
    <div className="paper-panel rounded-[24px] border border-border p-8 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function InputRow({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 h-12 w-full rounded-xl border border-border bg-background px-4 font-semibold text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

function SelectRow({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="relative mt-3">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-xl border border-border bg-background px-4 font-semibold text-foreground outline-none transition-all cursor-pointer focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          {options.map((item: string) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <ChevronRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted-foreground" />
      </div>
    </div>
  );
}

function ThemeCard({ title, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`group rounded-xl border p-5 text-left transition-all duration-300 ${
        active
          ? "border-accent bg-background shadow-md ring-1 ring-accent"
          : "border-border bg-secondary hover:border-accent/50 hover:bg-background"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold capitalize text-foreground group-hover:text-accent transition-colors">{title}</span>
        {active && <Check className="h-5 w-5 text-accent" />}
      </div>
    </button>
  );
}

function SliderInput({ label, value, suffix, min, max, onChange }: any) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
        <div className="rounded-lg border border-border bg-background px-3 py-1 text-sm font-bold text-foreground">
          {value} {suffix}
        </div>
      </div>
      <div className="relative flex items-center py-2">
        <div className="absolute h-2 w-full rounded-full bg-border" />
        <div className="absolute h-2 rounded-full bg-foreground transition-all" style={{ width: `${percentage}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10 h-2 w-full cursor-pointer appearance-none bg-transparent opacity-0 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none"
        />
        <div 
          className="absolute h-5 w-5 -translate-x-1/2 rounded-full border-2 border-foreground bg-background shadow-md transition-shadow hover:shadow-lg"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ToggleRow({ label, enabled, onToggle }: any) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="group flex w-full items-center justify-between rounded-xl border border-border bg-secondary px-5 py-4 transition-all hover:bg-background hover:border-accent/50 text-left"
    >
      <div>
        <p className="font-bold text-foreground group-hover:text-accent transition-colors">{label}</p>
        <p className="mt-1 text-xs font-medium text-muted-foreground">{enabled ? "Enabled" : "Disabled"}</p>
      </div>
      <div
        className={`relative flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          enabled ? "bg-accent" : "bg-border"
        }`}
      >
        <div className={`absolute h-4 w-4 rounded-full bg-background transition-transform duration-300 ${enabled ? "translate-x-6" : "translate-x-1"}`} />
      </div>
    </button>
  );
}

export default SettingsPage;