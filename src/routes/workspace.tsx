import {
  createFileRoute,
  Navigate,
} from "@tanstack/react-router";
import { motion } from "framer-motion";

import {
  Brain,
  Clock3,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import FloatingTimer from "@/components/workspace/FloatingTimer";

import AIInsights from "@/components/dashboard/AIInsights";
import ProductivityHeatmap from "@/components/dashboard/ProductivityHeatmap";
import CognitiveRadar from "@/components/dashboard/CognitiveRadar";
import LiveFocusSession from "@/components/dashboard/LiveFocusSession";

import { useProductivityStore } from "@/store/productivity-store";
import { useAuthStore } from "@/store/auth-store";
import { useFocusStore } from "@/store/focus-store";
import { useWorkspaceStore } from "@/store/workspace-store";

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
  const {
    sessions,
    productivityScore,
  } = useFocusStore();

  const {
    completedTasks,
    aiInteractions,
  } = useProductivityStore();

  const {
    sidebarCollapsed,
  } = useWorkspaceStore();

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
    <div className="min-h-screen overflow-x-hidden bg-background text-white">

      <WorkspaceSidebar />

      <motion.main
  animate={{
    paddingLeft:
      sidebarCollapsed
        ? 96
        : 280,
  }}
  transition={{
    duration: 0.28,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="
    relative
    min-h-screen
    overflow-x-visible
    overflow-y-auto
  "
>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_25%)]" />

        <WorkspaceHeader />

        <div className="relative z-10 flex w-full min-w-0 flex-col gap-6 px-4 pb-24 pt-24 lg:px-8 lg:pb-10 lg:pt-28">

          <section className="relative overflow-visible rounded-[36px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-3xl lg:p-8">

            <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

              <div className="max-w-3xl">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />

                  AI Productivity Workspace

                </div>

                <h1 className="mt-5 text-3xl font-black leading-[0.95] tracking-tight sm:text-5xl xl:text-6xl">

                  Welcome back

                  <br />

                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">

                    deep worker

                  </span>

                </h1>

              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">

                <StatCard
                  icon={
                    <Brain className="h-6 w-6 text-purple-400" />
                  }
                  title="Today's Sessions"
                  value={
                    todayStats.sessions
                  }
                />

                <StatCard
                  icon={
                    <Clock3 className="h-6 w-6 text-cyan-400" />
                  }
                  title="Today's Focus"
                  value={`${todayStats.focusHours}h`}
                />

                <StatCard
                  icon={
                    <TrendingUp className="h-6 w-6 text-pink-400" />
                  }
                  title="Today's Productivity"
                  value={`${todayStats.productivity}%`}
                />

                <StatCard
                  icon={
                    <Sparkles className="h-6 w-6 text-emerald-400" />
                  }
                  title="Today's AI + Tasks"
                  value={
                    todayStats.aiInteractions +
                    todayStats.completedTasks
                  }
                />

              </div>

            </div>

          </section>

          <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.6fr_0.9fr]">

            <div className="space-y-6 overflow-visible">

              <LiveFocusSession />

              <CognitiveRadar />

            </div>

            <div className="space-y-6 overflow-visible">

              <AIInsights />

              <ProductivityHeatmap />

            </div>

          </section>

        </div>

        <FloatingTimer />

      </motion.main>

    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl lg:p-5">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">

        {icon}

      </div>

      <p className="mt-4 text-sm text-zinc-400">

        {title}

      </p>

      <h2 className="mt-1 text-3xl font-black lg:text-4xl">

        {value}

      </h2>

    </div>
  );
}

export default WorkspacePage;