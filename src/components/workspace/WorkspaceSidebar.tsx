import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Brain,
  Settings,
  Sparkles,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import logo from "@/assets/logo.png";

import {
  Link,
  useRouterState,
} from "@tanstack/react-router";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

const items = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    to: "/workspace",
  },
  {
    icon: FileText,
    label: "Notes",
    to: "/notes",
  },
  {
    icon: CheckSquare,
    label: "Tasks",
    to: "/tasks",
  },
  {
    icon: Brain,
    label: "AI Assistant",
    to: "/assistant",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    to: "/analytics",
  },
  {
    icon: Settings,
    label: "Settings",
    to: "/settings",
  },
];

export default function WorkspaceSidebar() {
  const pathname =
    useRouterState({
      select: (s) =>
        s.location.pathname,
    });

  const [
    collapsed,
    setCollapsed,
  ] = useState(false);

  useEffect(() => {
    const stored =
      localStorage.getItem(
        "sidebar-collapsed"
      );

    if (stored) {
      setCollapsed(
        stored === "true"
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "sidebar-collapsed",
      String(collapsed)
    );
  }, [collapsed]);

  return (
    <motion.aside
      animate={{
  width:
    typeof window !== "undefined" &&
    window.innerWidth < 1024
      ? "100%"
      : collapsed
      ? 96
      : 280,
}}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed bottom-0 left-0 top-auto z-[50] flex h-20 w-full shrink-0 overflow-hidden border-t border-white/[0.06] bg-[rgba(8,8,14,0.82)] backdrop-blur-[30px] lg:top-0 lg:h-screen lg:w-auto lg:border-r lg:border-t-0"
    >

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_38%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.12),transparent_35%)]" />

      <div className="relative flex h-full w-full flex-row overflow-hidden lg:h-screen lg:flex-col">

        <div className="hidden shrink-0 border-b border-white/10 px-4 py-5 lg:block">

          <div
            className={`flex items-center ${
              collapsed
                ? "justify-center"
                : "justify-between"
            }`}
          >

            <Link
              to="/"
              className="group flex items-center gap-3 overflow-hidden"
            >

              <div className="flex h-14 w-14 min-w-[56px] items-center justify-center overflow-hidden rounded-2xl bg-black transition duration-300 group-hover:scale-105">

  <img
    src={logo}
    alt="corTeX.ai logo"
    className="h-[92%] w-[92%] object-contain"
  />

</div>

              <AnimatePresence mode="wait">

                {!collapsed && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -10,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  >

                    <h2 className="font-display text-xl font-semibold text-white">

                      corTeX.ai

                    </h2>

                    <p className="text-sm text-zinc-400">

                      Deep Work OS

                    </p>

                  </motion.div>
                )}

              </AnimatePresence>

            </Link>

            {!collapsed && (
              <button
                onClick={() =>
                  setCollapsed(
                    true
                  )
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
              >

                <PanelLeftClose className="h-4 w-4" />

              </button>
            )}

          </div>

          {collapsed && (
            <button
              onClick={() =>
                setCollapsed(
                  false
                )
              }
              className="mx-auto mt-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
            >

              <PanelLeftOpen className="h-4 w-4" />

            </button>
          )}

        </div>

        <div className="flex-1 overflow-y-auto overflow-x-visible scrollbar-none">

          <div className="flex min-h-full flex-col justify-between">

          <div className="flex w-full flex-row items-center justify-around gap-1 px-2 py-2 lg:flex-col lg:gap-2 lg:px-3 lg:py-6">

              {items.map(
                (
                  item
                ) => {
                  const Icon =
                    item.icon;

                  const active =
                    pathname ===
                    item.to;

                  return (
                    <Link
                      key={
                        item.label
                      }
                      to={item.to}
                      className={`group relative flex items-center overflow-visible rounded-2xl transition-all duration-300 ${
                        collapsed
  ? "justify-center px-0 py-3 lg:py-4"
  : "justify-center px-2 py-3 lg:justify-start lg:gap-4 lg:px-4 lg:py-4"
                      } ${
                        active
                          ? "bg-white/[0.06] text-white shadow-[0_0_30px_rgba(168,85,247,0.12)]"
                          : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >

                      {active && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10"
                        />
                      )}

                      <div className="relative z-10 flex items-center">

                        <Icon
                          className={`h-5 w-5 ${
                            active
                              ? "text-purple-300"
                              : ""
                          }`}
                        />

                      </div>

                      <AnimatePresence mode="wait">

                        {!collapsed &&
typeof window !== "undefined" &&
window.innerWidth >= 1024 && (
                          <motion.span
                            initial={{
                              opacity: 0,
                              x: -8,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            exit={{
                              opacity: 0,
                              x: -8,
                            }}
                            transition={{
                              duration: 0.2,
                            }}
                            className="relative z-10 whitespace-nowrap font-medium"
                          >

                            {item.label}

                          </motion.span>
                        )}

                      </AnimatePresence>

                    </Link>
                  );
                }
              )}

            </div>

            {!collapsed &&
typeof window !== "undefined" &&
window.innerWidth >= 1024 && (
              <div className="p-4 pt-0">

                <AnimatePresence>

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                    }}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-2xl"
                  >

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_55%)]" />

                    <div className="relative">

                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                        Workspace

                      </p>

                      <h3 className="mt-3 text-lg font-semibold text-white">

                        Deep Work Mode

                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">

                        Organize thoughts, track focus and build your second brain.

                      </p>

                    </div>

                  </motion.div>

                </AnimatePresence>

              </div>
            )}

          </div>

        </div>

      </div>

    </motion.aside>
  );
}