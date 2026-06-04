import { FileText, Calendar, Beaker, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const templates = [
  {
    id: "meeting",
    name: "Meeting Notes",
    icon: Users,
    description: "Capture attendees, action items, and decisions.",
    content: "<h2>Attendees</h2><ul><li><p></p></li></ul><h2>Agenda</h2><ol><li><p></p></li></ol><h2>Action Items</h2><ul data-type=\"taskList\"><li data-type=\"taskItem\" data-checked=\"false\"><p></p></li></ul>"
  },
  {
    id: "journal",
    name: "Daily Journal",
    icon: Calendar,
    description: "Reflect on your day and track your habits.",
    content: "<h2>Intentions for Today</h2><ul><li><p></p></li></ul><h2>What happened?</h2><p></p><h2>Gratitude</h2><ul><li><p></p></li></ul>"
  },
  {
    id: "research",
    name: "Research Log",
    icon: Beaker,
    description: "Document sources, hypotheses, and findings.",
    content: "<h2>Topic</h2><p></p><h2>Sources</h2><ul><li><p></p></li></ul><h2>Key Findings</h2><p></p>"
  },
  {
    id: "blank",
    name: "Blank Note",
    icon: FileText,
    description: "Start from scratch.",
    content: ""
  }
];

export default function TemplateSelector({ onSelect }: { onSelect: (content: string) => void }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-3xl font-black text-foreground">Choose a Template</h2>
        <p className="mt-2 text-muted-foreground">Start your note with a pre-designed structure.</p>
        
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {templates.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onSelect(t.content)}
                className="group relative flex items-center gap-4 rounded-2xl border border-border bg-secondary/50 p-4 text-left transition hover:border-accent hover:bg-secondary"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background border border-border group-hover:border-accent/30">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground">{t.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{t.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100 group-hover:text-accent" />
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
