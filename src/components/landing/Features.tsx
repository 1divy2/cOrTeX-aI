import { motion } from "framer-motion";

import {
  Brain,
  Clock,
  FileText,
  Network,
  Search,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Notion-grade editor",
    desc: "Slash commands, blocks, markdown and live AI rewrites — built for thinking, not formatting.",
    tone: "violet",
  },
  {
    icon: Sparkles,
    title: "Workspace AI",
    desc: "An assistant that remembers your notes, tasks and sessions. Ask it anything, anywhere.",
    tone: "cyan",
  },
  {
    icon: Clock,
    title: "Focus sessions",
    desc: "Floating timer, ambient modes, productivity polls — engineered for state of flow.",
    tone: "pink",
  },
  {
    icon: Target,
    title: "Tasks & planning",
    desc: "Linear-fast capture, AI prioritization and automatic scheduling around your focus.",
    tone: "violet",
  },
  {
    icon: Network,
    title: "Knowledge graph",
    desc: "See how your ideas connect. Backlinks, clusters and semantic relationships.",
    tone: "cyan",
  },
  {
    icon: Search,
    title: "Semantic search",
    desc: "Find anything by meaning, not keywords. Your second brain, indexed.",
    tone: "pink",
  },
  {
    icon: Brain,
    title: "Deep work analytics",
    desc: "Heatmaps, streaks and weekly AI reports on how you actually spend your attention.",
    tone: "violet",
  },
  {
    icon: Zap,
    title: "Command everything",
    desc: "Raycast-style palette. Navigate, create and act with the keyboard alone.",
    tone: "cyan",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative z-10 px-6 py-32"
    >

      <div className="mx-auto max-w-6xl">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-100px",
          }}
          transition={{
            duration: 0.7,
          }}
          className="max-w-2xl"
        >

          <div className="mb-4 text-xs uppercase tracking-[0.25em] text-[var(--cyan)]">

            The workspace

          </div>

          <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-5xl">

            Every tool a deep worker needs.{" "}

            <span className="text-gradient">

              None of the noise.

            </span>

          </h2>

          <p className="mt-5 leading-relaxed text-muted-foreground">

            corTeX.ai replaces a dozen disconnected apps with one fluid,
            AI-native workspace. Designed to fade into the background so
            your thinking takes the foreground.

          </p>

        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {features.map(
            (f, i) => {
              const color =
                f.tone ===
                "violet"
                  ? "var(--violet)"
                  : f.tone ===
                      "cyan"
                    ? "var(--cyan)"
                    : "var(--pink)";

              return (
                <motion.div
                  key={f.title}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    margin:
                      "-50px",
                  }}
                  transition={{
                    delay:
                      i * 0.05,
                    duration:
                      0.55,
                  }}
                  whileHover={{
                    y: -6,
                    scale: 1.01,
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-2xl transition-all duration-500 hover:border-white/12 hover:bg-white/[0.05]"
                >

                  <div
                    className="absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
                    style={{
                      background:
                        color,
                    }}
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.03),transparent,transparent)] opacity-50" />

                  <div
                    className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_30px_rgba(255,255,255,0.03)]"
                    style={{
                      color,
                    }}
                  >

                    <f.icon className="h-5 w-5" />

                  </div>

                  <h3 className="relative mb-2 font-display text-lg font-semibold text-white">

                    {f.title}

                  </h3>

                  <p className="relative text-sm leading-relaxed text-muted-foreground">

                    {f.desc}

                  </p>

                </motion.div>
              );
            }
          )}

        </div>

      </div>

    </section>
  );
}