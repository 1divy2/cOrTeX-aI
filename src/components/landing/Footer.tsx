import { Brain, Code2, MessageCircle, Send } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: ["Features", "Workspace AI", "Focus", "Analytics", "Roadmap"],
  },
  {
    title: "Community",
    links: ["Open beta", "Manifesto", "Changelog", "Contributors", "Brand"],
  },
  {
    title: "Resources",
    links: ["Docs", "Templates", "Guides", "Press kit", "Status"],
  },
];

export function Footer() {
  return (
    <footer className="relative px-6 pt-20 pb-10 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--violet)]/40 to-transparent" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-80 w-[800px] rounded-full bg-[var(--violet)]/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-14">
          <div className="col-span-2 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-aurora flex items-center justify-center shadow-glow">
                <Brain className="h-4 w-4 text-background" strokeWidth={2.5} />
              </div>
              <span className="font-display font-semibold text-lg">
                corTeX<span className="text-gradient">.ai</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              An open, AI-native operating system for deep work. Built in public,
              free forever, by and for thinkers.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Code2, label: "GitHub" },
                { icon: MessageCircle, label: "Discord" },
                { icon: Send, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="h-9 w-9 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-xs uppercase tracking-[0.18em] text-foreground/80 mb-4">{col.title}</div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-foreground transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© 2026 corTeX.ai · Open beta · Free forever</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
            All systems calm
          </div>
        </div>
      </div>
    </footer>
  );
}
