import {
  Bell,
  Search,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useAuthStore,
} from "@/store/auth-store";

import {
  useWorkspaceStore,
} from "@/store/workspace-store";

export default function WorkspaceHeader() {
  const { user } =
    useAuthStore();

const {
  sidebarCollapsed,
} = useWorkspaceStore();

  const displayName =
    (user as any)
      ?.displayName ||
    user?.email?.split(
      "@"
    )[0] ||
    "Deep Worker";

  return (
    <motion.header
      animate={{
        left:
          sidebarCollapsed
            ? 96
            : 280,

        width:
          sidebarCollapsed
            ? "calc(100% - 96px)"
            : "calc(100% - 280px)",
      }}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
  fixed
  top-0
  min-w-0
  overflow-hidden
        z-[45]
        border-b
        border-white/10
        bg-[rgba(8,8,14,0.58)]
        backdrop-blur-[28px]
      "
    >

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_40%),radial-gradient(circle_at_right,rgba(34,211,238,0.08),transparent_30%)]" />

      <div className="relative overflow-hidden">

        <div className="relative flex min-w-0 items-center justify-between gap-6 px-8 py-5">

          <div className="min-w-0 flex-1">

            <p className="text-sm text-zinc-500">

              Welcome back

            </p>

          <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-white">

              {displayName}

            </h1>

          </div>

          <div className="flex items-center gap-4">

            <div className="relative shrink-0">

              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

              <input
                placeholder="Search notes, tasks..."
                className="
                  h-12
                  w-[290px]
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  transition-all
                  placeholder:text-zinc-500
                  focus:border-purple-500/30
                  focus:bg-white/[0.07]
                  focus:shadow-[0_0_25px_rgba(168,85,247,0.12)]
                "
              />

            </div>

            <button
              className="
                group
                relative
                flex
                h-12
                w-12
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                text-zinc-400
                transition-all
                duration-300
                hover:border-purple-500/30
                hover:bg-white/[0.08]
                hover:text-white
                hover:shadow-[0_0_20px_rgba(168,85,247,0.14)]
              "
            >

              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(168,85,247,0.22),transparent_70%)] opacity-0 transition duration-300 group-hover:opacity-100" />

              <Bell className="relative z-10 h-5 w-5" />

            </button>

          </div>

        </div>

      </div>

    </motion.header>
  );
}