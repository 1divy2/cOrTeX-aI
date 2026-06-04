import { Bell, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { useWorkspaceStore } from "@/store/workspace-store";

export default function WorkspaceHeader() {
  const { user } = useAuthStore();
  const { sidebarCollapsed } = useWorkspaceStore();

  const displayName = (user as any)?.displayName || user?.email?.split("@")[0] || "Deep Worker";

  return (
    <motion.header
      animate={{
        left: sidebarCollapsed ? 96 : 280,
        width: sidebarCollapsed ? "calc(100% - 96px)" : "calc(100% - 280px)",
      }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 min-w-0 overflow-hidden z-[45] border-b border-border bg-background"
    >
      <div className="relative overflow-hidden">
        <div className="relative flex min-w-0 items-center justify-between gap-6 px-8 py-5">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Welcome back
            </p>
            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-foreground">
              {displayName}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search notes, tasks..."
                className="h-11 w-[290px] rounded-xl border border-border bg-secondary pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
              />
            </div>
            <button className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary text-muted-foreground transition-colors hover:border-accent hover:text-foreground">
              <Bell className="relative z-10 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}