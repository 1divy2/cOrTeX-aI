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
    <section id="ai" className="relative py-32 px-6 bg-background">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Workspace AI</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.05] text-foreground">
            An assistant that <span className="italic text-accent">actually knows you</span>.
          </h2>
          <p className="mt-5 text-muted-foreground font-medium leading-relaxed text-lg">
            corTeX builds a private semantic memory of your notes, tasks and focus patterns.
            Ask it to summarize, plan, explain, rewrite — it answers with context, not generic guesses.
          </p>

          <ul className="mt-8 space-y-3 text-sm font-medium">
            {[
              "Context-aware across your entire workspace",
              "Summaries, flashcards and study plans on demand",
              "Schedules deep work around your real attention curve",
              "Private by default — your second brain stays yours",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
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
          <div className="relative paper-panel rounded-[24px] border border-border bg-background p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-3 px-2 pb-3 border-b border-border">
              <div className="h-8 w-8 rounded-xl bg-foreground flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-background" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">corTeX Assistant</div>
                <div className="text-xs font-medium text-muted-foreground">connected to your workspace</div>
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
                  className={`max-w-[85%] rounded-[16px] px-4 py-3 text-sm font-medium leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-secondary border border-border text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}

            <div className="pt-2">
              <div className="rounded-[16px] border border-border bg-secondary px-4 py-3 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground">
                <Sparkles className="h-4 w-4 text-accent" />
                Ask anything about your workspace...
                <span className="ml-auto text-xs font-bold bg-background border border-border rounded-md px-1.5 py-0.5">↵</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
