import { motion } from "framer-motion";
import { Brain, Clock, FileText, Network, Search, Sparkles, Target, Zap } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Notion-grade editor",
    desc: "Slash commands, blocks, markdown and live rewrites — built for thinking, not formatting.",
  },
  {
    icon: Sparkles,
    title: "Workspace Intelligence",
    desc: "An intelligent system that remembers your notes, tasks and sessions. Ask it anything, anywhere.",
  },
  {
    icon: Clock,
    title: "Focus sessions",
    desc: "Floating timer, ambient modes, productivity polls — engineered for state of flow.",
  },
  {
    icon: Target,
    title: "Tasks & planning",
    desc: "Linear-fast capture, smart prioritization and automatic scheduling around your focus.",
  },
  {
    icon: Network,
    title: "Knowledge graph",
    desc: "See how your ideas connect. Backlinks, clusters and semantic relationships.",
  },
  {
    icon: Search,
    title: "Semantic search",
    desc: "Find anything by meaning, not keywords. Your second brain, indexed.",
  },
  {
    icon: Brain,
    title: "Deep work analytics",
    desc: "Heatmaps, streaks and weekly analytics reports on how you actually spend your attention.",
  },
  {
    icon: Zap,
    title: "Command everything",
    desc: "Raycast-style palette. Navigate, create and act with the keyboard alone.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative z-10 px-6 py-32 bg-background">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
            The workspace
          </div>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl text-foreground">
            Every tool a deep worker needs.{" "}
            <span className="italic text-accent">
              None of the noise.
            </span>
          </h2>
          <p className="mt-5 text-lg font-medium leading-relaxed text-muted-foreground">
            corTeX replaces a dozen disconnected apps with one fluid,
            distraction-free workspace. Designed to fade into the background so
            your thinking takes the foreground.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, duration: 0.55 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group paper-panel relative overflow-hidden rounded-[24px] border border-border bg-background p-6 transition-all duration-500 hover:border-foreground hover:shadow-md"
            >
              <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-[16px] border border-border bg-secondary transition-colors group-hover:bg-foreground group-hover:text-background">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="relative mb-2 font-display text-lg font-bold text-foreground">
                {f.title}
              </h3>
              <p className="relative text-sm font-medium leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}