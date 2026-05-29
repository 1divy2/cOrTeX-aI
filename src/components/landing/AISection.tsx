import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const messages = [
  { role: "user", text: "Summarize my research notes from this week." },
  { role: "ai", text: "You explored 3 themes: attention residue, ambient computing, and post-Notion editors. The strongest thread connects 8 notes — want me to draft a synthesis?" },
  { role: "user", text: "Yes, and schedule deep work for it tomorrow." },
  { role: "ai", text: "Done. Synthesis drafted in /Research/Weekly. Two 90-min focus blocks scheduled at 9:00 and 14:30 — your peak attention windows." },
];

export function AISection() {
  return (
    <section id="ai" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--pink)] mb-4">Workspace AI</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.05]">
            An assistant that <span className="text-gradient">actually knows you</span>.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed text-lg">
            corTeX builds a private semantic memory of your notes, tasks and focus patterns.
            Ask it to summarize, plan, explain, rewrite — it answers with context, not generic guesses.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Context-aware across your entire workspace",
              "Summaries, flashcards and study plans on demand",
              "Schedules deep work around your real attention curve",
              "Private by default — your second brain stays yours",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-aurora shrink-0" />
                <span className="text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-aurora opacity-20 blur-3xl rounded-3xl" />
          <div className="relative glass-strong rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 px-2 pb-3 border-b border-white/5">
              <div className="h-7 w-7 rounded-lg bg-aurora flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-background" />
              </div>
              <div>
                <div className="text-sm font-medium">corTeX Assistant</div>
                <div className="text-[10px] text-muted-foreground">connected to your workspace</div>
              </div>
            </div>

            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-white/5 text-foreground"
                      : "bg-aurora/10 border border-[var(--violet)]/20 text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}

            <div className="pt-2">
              <div className="glass rounded-full px-4 py-2.5 flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-[var(--violet)]" />
                Ask anything about your workspace...
                <span className="ml-auto text-xs">↵</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
