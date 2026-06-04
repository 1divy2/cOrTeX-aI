import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Brain, Sparkles, Clock3, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/workspace/")({
  component: Workspace,
});

function Workspace() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="h-12 w-12 rounded-2xl border border-border border-t-accent"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="paper-panel flex flex-col md:flex-row md:items-center justify-between rounded-2xl p-8 gap-6"
        >
          <div className="flex items-start md:items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary border border-border">
              <Brain className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
                Workspace
              </h1>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Welcome back{user.displayName ? `, ${user.displayName}` : ""}
              </p>
            </div>
          </div>
          <div className="shrink-0 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent">
            Research Mode Active
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-8 grid gap-6 lg:grid-cols-3"
        >
          <div className="paper-card rounded-2xl p-8 transition-transform hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-foreground">
              AI Intelligence
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your intelligent thought partner for deep work, analysis, and creative thinking.
            </p>
          </div>

          <div className="paper-card rounded-2xl p-8 transition-transform hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border">
              <Clock3 className="h-5 w-5 text-accent" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-foreground">
              Focus System
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Track deep work sessions, optimize your environment, and visualize productivity patterns.
            </p>
          </div>

          <div className="paper-card rounded-2xl p-8 transition-transform hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border">
              <CheckCircle2 className="h-5 w-5 text-accent" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-foreground">
              Smart Tasks
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Organize projects and execution flows like a premium daily agenda.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}