import {
  createFileRoute,
  Navigate,
} from "@tanstack/react-router";

import {
  Brain,
  Sparkles,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useAuthStore,
} from "@/store/auth-store";

export const Route =
  createFileRoute(
    "/workspace/"
  )({
    component: Workspace,
  });

function Workspace() {
  const {
    user,
    loading,
  } =
    useAuthStore();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-white">

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear",
          }}
          className="h-12 w-12 rounded-2xl border border-white/10 border-t-white/80"
        />

      </div>
    );
  }

  if (!user) {
    return (
      <Navigate to="/" />
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_40%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="glass-strong flex items-center justify-between rounded-[32px] border border-white/10 px-6 py-4"
        >

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-aurora shadow-glow">

              <Brain className="h-5 w-5 text-black" />

            </div>

            <div>

              <h1 className="font-display text-2xl font-semibold">

                corTeX.ai Workspace

              </h1>

              <p className="text-sm text-muted-foreground">

                Welcome back{user.displayName ? `, ${user.displayName}` : ""}

              </p>

            </div>

          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground">

            Open Beta

          </div>

        </motion.div>

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
            delay: 0.1,
            duration: 0.6,
          }}
          className="mt-8 grid gap-6 lg:grid-cols-3"
        >

          <div className="glass-strong rounded-[32px] border border-white/10 p-6 transition hover:-translate-y-1 hover:border-purple-500/20">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20">

              <Sparkles className="h-5 w-5 text-purple-300" />

            </div>

            <h2 className="mt-5 text-2xl font-semibold">

              AI Workspace

            </h2>

            <p className="mt-2 text-muted-foreground">

              Your intelligent second brain for deep work and creative thinking.

            </p>

          </div>

          <div className="glass-strong rounded-[32px] border border-white/10 p-6 transition hover:-translate-y-1 hover:border-cyan-500/20">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20">

              <Clock3 className="h-5 w-5 text-cyan-300" />

            </div>

            <h2 className="mt-5 text-2xl font-semibold">

              Focus System

            </h2>

            <p className="mt-2 text-muted-foreground">

              Track deep work sessions and productivity patterns beautifully.

            </p>

          </div>

          <div className="glass-strong rounded-[32px] border border-white/10 p-6 transition hover:-translate-y-1 hover:border-pink-500/20">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/20">

              <CheckCircle2 className="h-5 w-5 text-pink-300" />

            </div>

            <h2 className="mt-5 text-2xl font-semibold">

              Smart Tasks

            </h2>

            <p className="mt-2 text-muted-foreground">

              Organize projects, priorities and execution flows intelligently.

            </p>

          </div>

        </motion.div>

      </div>

    </div>
  );
}