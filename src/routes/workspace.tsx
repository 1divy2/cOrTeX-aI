import {
  createFileRoute,
  Navigate,
  useNavigate
} from "@tanstack/react-router";
import { motion } from "framer-motion";

import {
  Brain,
  Clock3,
  TrendingUp,
  Sparkles,
  Activity,
  BrainCircuit,
  Zap,
} from "lucide-react";

import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import FloatingTimer from "@/components/workspace/FloatingTimer";

import { DailyGoalWidget, StreakWidget, PriorityTasksWidget, RecentNotesWidget, IntelligenceWidget, MilestonesWidget } from "@/components/dashboard/DashboardWidgets";

import { useProductivityStore } from "@/store/productivity-store";
import { useAuthStore } from "@/store/auth-store";
import { useFocusStore } from "@/store/focus-store";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useSettingsStore } from "@/store/settings-store";
import { useIntelligenceStore } from "@/store/intelligence-store";
import { useTasksStore } from "@/store/tasks-store";
import { useNotesStore } from "@/store/notes-store";

function ProtectedWorkspace() {
  const {
    user,
    initialized,
  } = useAuthStore();

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <WorkspacePage />;
}

export const Route =
  createFileRoute("/workspace")({
    component:
      ProtectedWorkspace,
  });

function WorkspacePage() {
  const navigate = useNavigate();
  const { sessions } = useFocusStore();

  const {
    completedTasks,
    aiInteractions,
    streak,
  } = useProductivityStore();
  
  const { deepWorkScore, productivityScore, momentumScore, milestones } = useIntelligenceStore();

  const { sidebarCollapsed } = useWorkspaceStore();
  
  const { dailyGoalHours } = useSettingsStore();
  
  const { tasks, toggleTask } = useTasksStore();
  const priorityTasks = tasks.filter((t) => !t.completed).slice(0, 5);
  
  const { notes, setActiveNote } = useNotesStore();
  const recentNotesList = notes.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todaySessions =
    sessions.filter(
      (session) =>
        new Date(
          session.endedAt
        )
          .toISOString()
          .split("T")[0] ===
        today
    );

  const todayFocusSeconds =
    todaySessions.reduce(
      (acc, session) =>
        acc +
        session.duration,
      0
    );

  const todayFocusHours =
    Number(
      (
        todayFocusSeconds /
        3600
      ).toFixed(2)
    );

  const todayProductivity =
    todaySessions.length > 0
      ? Math.round(
          todaySessions.reduce(
            (
              acc,
              session
            ) =>
              acc +
              session.rating,
            0
          ) /
            todaySessions.length *
            12.5
        )
      : 0;

  const todayStats = {
    sessions:
      todaySessions.length,

    focusHours:
      todayFocusHours,

    productivity:
      todayProductivity,

    aiInteractions,

    completedTasks,
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-500">
      <WorkspaceSidebar />

      <motion.main
        animate={{ paddingLeft: sidebarCollapsed ? 96 : 280 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-screen overflow-x-visible overflow-y-auto"
      >
        <WorkspaceHeader />

        <div className="relative z-10 flex w-full min-w-0 flex-col gap-6 px-4 pb-24 pt-24 lg:px-8 lg:pb-10 lg:pt-28 mx-auto max-w-[1900px]">
          <section className="relative overflow-visible paper-panel rounded-[24px] border border-border p-5 lg:p-8 transition-colors duration-500">
            <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  AI Productivity Workspace
                </div>

                <h1 className="mt-5 text-4xl font-display font-bold leading-[0.95] tracking-tight sm:text-5xl xl:text-6xl text-foreground">
                  Welcome back,
                  <br />
                  <span className="italic text-accent">
                    deep worker
                  </span>
                </h1>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
                <StatCard
                  icon={<Brain className="h-5 w-5 text-accent" />}
                  title="Today's Sessions"
                  value={todayStats.sessions}
                />
                <StatCard
                  icon={<Clock3 className="h-5 w-5 text-accent" />}
                  title="Today's Focus"
                  value={`${todayStats.focusHours}h`}
                />
                <StatCard
                  icon={<TrendingUp className="h-5 w-5 text-accent" />}
                  title="Productivity"
                  value={`${todayStats.productivity}%`}
                />
                <StatCard
                  icon={<Sparkles className="h-5 w-5 text-accent" />}
                  title="AI + Tasks"
                  value={todayStats.aiInteractions + todayStats.completedTasks}
                />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <DailyGoalWidget hours={todayStats.focusHours} goal={dailyGoalHours} />
            </div>
            <div className="col-span-1 md:col-span-2">
              <StreakWidget streak={streak} />
            </div>
            
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <IntelligenceWidget 
                title="Deep Work" 
                subtitle="Focus Intensity" 
                score={deepWorkScore} 
                icon={BrainCircuit}
                trend="up" 
              />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <IntelligenceWidget 
                title="Productivity" 
                subtitle="Efficiency Score" 
                score={productivityScore} 
                icon={Activity}
                trend="up" 
              />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <IntelligenceWidget 
                title="Momentum" 
                subtitle="Growth Trend" 
                score={momentumScore} 
                icon={Zap}
                trend="flat" 
              />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <MilestonesWidget milestones={milestones} />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <PriorityTasksWidget 
              tasks={priorityTasks} 
              onComplete={toggleTask} 
            />
            <RecentNotesWidget 
              notes={recentNotesList} 
              onOpen={(id) => {
                setActiveNote(id);
                navigate({ to: "/notes" });
              }} 
            />
          </section>
        </div>

        <FloatingTimer />
      </motion.main>
    </div>
  );
}

function StatCard({ icon, title, value }: any) {
  return (
    <div className="rounded-[20px] border border-border bg-secondary p-5 transition-colors">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border">
        {icon}
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <h2 className="mt-2 text-3xl font-display font-bold text-foreground">
        {value}
      </h2>
    </div>
  );
}

export default WorkspacePage;