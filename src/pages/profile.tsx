import {
  motion,
} from "framer-motion";

import {
  Brain,
  Flame,
  Sparkles,
  Clock3,
  Activity,
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { useProductivityStore } from "@/store/productivity-store";
import { useNotesStore } from "@/store/notes-store";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const productivity = useProductivityStore();
  const notes = useNotesStore((state) => state.notes);

  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "Recently";

  return (
    <div className="min-h-screen overflow-hidden bg-[#05010a] text-white">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_35%)]" />

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
          className="overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl"
        >

          <div className="relative h-64 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.35),transparent_55%),radial-gradient(circle_at_right,rgba(34,211,238,0.2),transparent_45%)]">

            <div className="absolute inset-0 bg-grid-white/[0.03]" />

          </div>

          <div className="relative px-8 pb-10">

            <div className="-mt-20 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-end">

                <div className="relative">

                  <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[36px] border-4 border-[#05010a] bg-white/10 shadow-[0_0_60px_rgba(168,85,247,0.25)]">

                    {user?.photoURL ? (
                      <img
                        src={
                          user.photoURL
                        }
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl font-black text-white">

                        {user?.displayName
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "U"}

                      </span>
                    )}

                  </div>

                  <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-emerald-500 shadow-lg shadow-emerald-500/30">

                    <Activity className="h-5 w-5 text-white" />

                  </div>

                </div>

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300">

                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />

                    Neural Workspace Identity

                  </div>

                  <h1 className="mt-6 text-5xl font-black tracking-tight lg:text-6xl">
                    {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.displayName || user?.email?.split('@')[0] || "Anonymous"}
                  </h1>

                  <p className="mt-4 text-lg text-zinc-400">

                    {user?.email}

                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                {[
                  {
                    label: "Focus Streak",
                    value: `${productivity.streak}d`,
                    icon: Flame,
                  },
                  {
                    label: "AI Actions",
                    value: `${productivity.aiInteractions}`,
                    icon: Brain,
                  },
                  {
                    label: "Deep Work",
                    value: `${Math.round(productivity.getTotalFocusHours())}h`,
                    icon: Clock3,
                  },
                  {
                    label: "Knowledge Nodes",
                    value: `${notes.length}`,
                    icon: Sparkles,
                  },
                ].map((stat) => {
                    const Icon =
                      stat.icon;

                    return (
                      <div
                        key={
                          stat.label
                        }
                        className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl"
                      >

                        <Icon className="h-5 w-5 text-purple-300" />

                        <p className="mt-4 text-3xl font-black">

                          {
                            stat.value
                          }

                        </p>

                        <p className="mt-2 text-sm text-zinc-500">

                          {
                            stat.label
                          }

                        </p>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">

              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">

                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">

                  Workspace Role

                </p>

                <h2 className="mt-4 text-3xl font-bold">
                  Workspace Owner
                </h2>
                <p className="mt-4 text-zinc-400">
                  Primary administrator and architect of this neural workspace.
                </p>

              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">

                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">

                  Joined

                </p>

                <h2 className="mt-4 text-3xl font-bold">

                  {joined}

                </h2>

                <p className="mt-4 text-zinc-400">

                  Your neural workspace journey started here.

                </p>

              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">

                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">

                  Workspace Status

                </p>

                <h2 className="mt-4 text-3xl font-bold text-emerald-400">

                  Active

                </h2>

                <p className="mt-4 text-zinc-400">

                  AI systems synchronized and operational.

                </p>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}