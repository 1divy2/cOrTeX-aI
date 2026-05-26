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

import logo from "@/assets/logo.png";

import {

  Link,

  useRouterState,

} from "@tanstack/react-router";

import {

  motion,

} from "framer-motion";

import { useWorkspaceStore } from "@/store/workspace-store";

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

  const {

    sidebarCollapsed,

    toggleSidebar,

  } = useWorkspaceStore();

  const collapsed =

    sidebarCollapsed;

  return (

    <motion.aside

      layout

      animate={{

        width: collapsed

          ? 96

          : 280,

      }}

      transition={{

        layout: {

          duration: 0.34,

          ease: [

            0.22,

            1,

            0.36,

            1,

          ],

        },

      }}

      className={`

fixed

left-0

top-0

z-[60]

flex

h-screen

overflow-hidden

border-r

border-white/[0.06]

bg-[rgba(8,8,14,0.82)]

backdrop-blur-[30px]

`}

    >

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_38%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.12),transparent_35%)]" />

      <div className="relative flex h-full w-full flex-col overflow-hidden">

        <div className="shrink-0 border-b border-white/10 px-4 py-5">

          <div

            className={`flex items-center ${

              collapsed

                ? "justify-center"

                : "justify-between"

            }`}

          >

            <Link

              to="/"

              className="group flex min-w-0 items-center gap-3 overflow-hidden"

            >

              <motion.div

                layout

                className="flex h-14 w-14 min-w-[56px] items-center justify-center overflow-hidden rounded-2xl bg-black"

              >

                <img

                  src={logo}

                  alt="corTeX.ai logo"

                  className="h-[92%] w-[92%] object-contain"

                />

              </motion.div>

              <motion.div

                animate={{

                  opacity:

                    collapsed

                      ? 0

                      : 1,

                  x:

                    collapsed

                      ? -10

                      : 0,

                  width:

                    collapsed

                      ? 0

                      : "auto",

                }}

                transition={{

                  duration: 0.2,

                }}

                className="overflow-hidden whitespace-nowrap"

              >

                <h2 className="font-display text-xl font-semibold text-white">

                  corTeX.ai

                </h2>

                <p className="text-sm text-zinc-400">

                  Deep Work OS

                </p>

              </motion.div>

            </Link>

            {!collapsed && (

              <motion.button

                layout

                onClick={

                  toggleSidebar

                }

                whileTap={{

                  scale: 0.95,

                }}

                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"

              >

                <PanelLeftClose className="h-4 w-4" />

              </motion.button>

            )}

          </div>

          {collapsed && (

            <motion.button

              layout

              onClick={

                toggleSidebar

              }

              whileTap={{

                scale: 0.95,

              }}

              className="mx-auto mt-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"

            >

              <PanelLeftOpen className="h-4 w-4" />

            </motion.button>

          )}

        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">

          <div className="flex min-h-full flex-col justify-between">

            <div className="flex w-full flex-col gap-2 px-3 py-6">

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

                      className={`

group

relative

flex

items-center

overflow-hidden

rounded-2xl

transition-all

duration-300

${

  collapsed

    ? "justify-center px-0 py-4"

    : "gap-4 px-4 py-4"

}

${

  active

    ? "bg-white/[0.06] text-white shadow-[0_0_30px_rgba(168,85,247,0.12)]"

    : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"

}

`}

                    >

                      {active && (

                        <motion.div

                          layoutId="sidebar-active"

                          className="absolute inset-0 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10"

                        />

                      )}

                      <div className="relative z-10 flex shrink-0 items-center">

                        <Icon

                          className={`h-5 w-5 ${

                            active

                              ? "text-purple-300"

                              : ""

                          }`}

                        />

                      </div>

                      <motion.span

                        animate={{

                          opacity:

                            collapsed

                              ? 0

                              : 1,

                          x:

                            collapsed

                              ? -10

                              : 0,

                          width:

                            collapsed

                              ? 0

                              : "auto",

                        }}

                        transition={{

                          duration: 0.2,

                        }}

                        className="relative z-10 overflow-hidden whitespace-nowrap font-medium"

                      >

                        {item.label}

                      </motion.span>

                    </Link>

                  );

                }

              )}

            </div>

            <motion.div

              animate={{

                opacity:

                  collapsed

                    ? 0

                    : 1,

                y:

                  collapsed

                    ? 10

                    : 0,

                height:

                  collapsed

                    ? 0

                    : "auto",

              }}

              transition={{

                duration: 0.22,

              }}

              className="overflow-hidden"

            >

              <div className="p-4 pt-0">

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-2xl">

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_55%)]" />

                  <div className="relative">

                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                      Workspace

                    </p>

                    <h3 className="mt-3 text-lg font-semibold text-white">

                      Deep Work Mode

                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">

                      Organize thoughts,

                      track focus and

                      build your second

                      brain.

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