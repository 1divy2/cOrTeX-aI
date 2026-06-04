import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Brain,
  Settings,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "@/store/workspace-store";
import { Bot, Network, Target, Calendar, Sun, Activity, BookOpen } from "lucide-react";
import logo from "@/assets/logo.png";

const items = [
  { icon: LayoutDashboard, label: "Command Center", to: "/command-center" },
  { icon: Target, label: "Projects", to: "/projects" },
  { icon: Calendar, label: "Planner", to: "/planner" },
  { icon: Sun, label: "Habits", to: "/habits" },
  { icon: Bot, label: "AI Workspace", to: "/assistant" },
  { icon: Activity, label: "Forecast Center", to: "/forecast" },
  { icon: BookOpen, label: "Reviews", to: "/reviews" },
  { icon: Network, label: "Knowledge Graph", to: "/graph" },
  { icon: Brain, label: "Second Brain", to: "/knowledge" },
  { icon: FileText, label: "Notes", to: "/notes" },
  { icon: CheckSquare, label: "Tasks", to: "/tasks" },
  { icon: BarChart3, label: "Analytics", to: "/analytics" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export default function WorkspaceSidebar() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const { sidebarCollapsed, toggleSidebar } = useWorkspaceStore();
  const collapsed = sidebarCollapsed;

  return (
    <motion.aside
      layout
      animate={{ width: collapsed ? 96 : 280 }}
      transition={{ layout: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } }}
      className={`fixed left-0 top-0 z-[60] flex h-screen overflow-hidden border-r border-border bg-surface shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border px-4 py-5">
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            <Link to="/" className="group flex min-w-0 items-center gap-3 overflow-hidden">
              <motion.div
                layout
                className="flex h-12 w-12 min-w-[48px] items-center justify-center overflow-hidden rounded-xl bg-background border border-border"
              >
                <img src={logo} alt="corTeX.ai logo" className="h-[80%] w-[80%] object-contain opacity-90" />
              </motion.div>
              <motion.div
                animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -10 : 0, width: collapsed ? 0 : "auto" }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h2 className="font-display text-lg font-bold text-foreground">corTeX.ai</h2>
                <p className="text-xs text-muted-foreground font-medium">Deep Work OS</p>
              </motion.div>
            </Link>
            {!collapsed && (
              <motion.button
                layout
                onClick={toggleSidebar}
                whileTap={{ scale: 0.95 }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <PanelLeftClose className="h-4 w-4" />
              </motion.button>
            )}
          </div>
          {collapsed && (
            <motion.button
              layout
              onClick={toggleSidebar}
              whileTap={{ scale: 0.95 }}
              className="mx-auto mt-4 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </motion.button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none py-6">
          <div className="flex min-h-full flex-col justify-between">
            <div className="flex w-full flex-col gap-1.5 px-3">
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`group relative flex items-center overflow-hidden rounded-xl transition-colors duration-200 ${
                      collapsed ? "justify-center px-0 py-3.5" : "gap-3.5 px-4 py-3"
                    } ${
                      active
                        ? "bg-background text-foreground font-semibold shadow-sm"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-accent"
                      />
                    )}
                    <div className="relative z-10 flex shrink-0 items-center">
                      <Icon className={`h-5 w-5 ${active ? "text-accent" : ""}`} />
                    </div>
                    <motion.span
                      animate={{
                        opacity: collapsed ? 0 : 1,
                        x: collapsed ? -10 : 0,
                        width: collapsed ? 0 : "auto",
                      }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                );
              })}
            </div>

            <motion.div
              animate={{
                opacity: collapsed ? 0 : 1,
                y: collapsed ? 10 : 0,
                height: collapsed ? 0 : "auto",
              }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 mt-6">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-sm">
                  <div className="relative">
                    <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-accent">Workspace</p>
                    <h3 className="mt-2 text-base font-bold text-foreground">Deep Work Mode</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      Organize thoughts, track focus and build your second brain.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}