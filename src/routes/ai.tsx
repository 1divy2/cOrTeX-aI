import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Send, FileText, CheckSquare, BarChart3, Zap, Bot, User } from "lucide-react";
import { useMemo, useState } from "react";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import { useNotesStore } from "@/store/notes-store";
import { useTasksStore } from "@/store/tasks-store";
import { useProductivityStore } from "@/store/productivity-store";
import { useWorkspaceStore } from "@/store/workspace-store";

export const Route = createFileRoute("/ai")({
  component: AIPage,
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

function AIPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      createdAt: Date.now(),
      content: "Welcome to corTeX AI.\n\nI can understand your notes, tasks, focus sessions and productivity patterns to help you think, plan and execute better.",
    },
  ]);

  const { notes, analytics: notesAnalytics } = useNotesStore();
  const { tasks, completedToday, completionRate, executionVelocity } = useTasksStore();
  const { completedSessions, totalFocusHours, focusScore, streak } = useProductivityStore();
  const { sidebarCollapsed } = useWorkspaceStore();

  const workspaceContext = useMemo(() => {
    return {
      notesCount: notes.length,
      tasksCount: tasks.length,
      completedTasks: tasks.filter((task) => task.completed).length,
      focusHours: totalFocusHours,
      focusScore,
      streak,
      completedSessions,
      completedToday,
      completionRate,
      executionVelocity,
      totalWords: notesAnalytics.totalWords,
      recentNotes: notes.slice(0, 5).map((note) => ({
        title: note.title,
        tags: note.tags,
      })),
    };
  }, [
    notes,
    tasks,
    completedToday,
    completionRate,
    executionVelocity,
    notesAnalytics,
    totalFocusHours,
    focusScore,
    streak,
    completedSessions,
  ]);

  const generateAIResponse = async (prompt: string) => {
    try {
      const { askGemini } = await import("@/lib/gemini");
      const { generateAnalytics } = await import("@/lib/analytics-engine");
      const { useIntelligenceStore } = await import("@/store/intelligence-store");
      const { useFocusStore } = await import("@/store/focus-store");
      
      const intel = useIntelligenceStore.getState();
      const analytics = generateAnalytics(useFocusStore.getState().sessions);

      const systemPrompt = `
You are corTeX.ai, a futuristic AI productivity assistant. 
The user is asking a question or requesting a report in their productivity workspace.

Current workspace context:
Completed Sessions: ${completedSessions}
Total Focus Hours: ${analytics.totalFocusHours}
Deep Work Score: ${intel.deepWorkScore}
Productivity Score: ${intel.productivityScore}
Burnout Risk: ${analytics.burnoutRisk}%

Tasks: ${tasks.length} total, ${completedToday} completed today.
Notes: ${notes.length} total.

User Prompt: ${prompt}

If the user asks for a productivity report, give them a highly analytical, deep work breakdown based on their scores, tasks, and burnout risk. Use markdown.
      `;

      return await askGemini(systemPrompt);
    } catch (e) {
      console.error(e);
      return "I'm sorry, I am having trouble connecting to my neural core right now.";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const prompt = input;
    setInput("");
    setLoading(true);

    const response = await generateAIResponse(prompt);
    const aiMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: response,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <WorkspaceSidebar />
      <motion.main
        animate={{ paddingLeft: sidebarCollapsed ? 96 : 280 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-1 overflow-hidden"
      >
        <WorkspaceHeader />
        <div className="relative z-10 flex h-screen flex-col px-8 pb-8 pt-28 max-w-[1800px] mx-auto">
          
          <section className="relative overflow-hidden paper-panel rounded-[24px] border border-border p-8 transition-colors duration-500">
            <div className="relative flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Workspace Intelligence
                </div>
                <h1 className="mt-5 text-5xl font-display font-bold tracking-tight text-foreground">
                  corTeX<span className="italic text-accent">.ai</span>
                </h1>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  AI-aware workspace assistant connected to your notes, tasks, focus sessions and productivity intelligence.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AIStat icon={FileText} label="Knowledge" value={`${notes.length}`} />
                <AIStat icon={CheckSquare} label="Tasks" value={`${tasks.length}`} />
                <AIStat icon={BarChart3} label="Focus" value={`${focusScore}`} />
                <AIStat icon={Zap} label="Streak" value={`${streak}d`} />
              </div>
            </div>
          </section>

          <section className="mt-6 flex min-h-0 flex-1 gap-6">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden paper-panel rounded-[24px] border border-border bg-background transition-colors duration-500">
              <div className="border-b border-border px-6 py-5 bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border">
                    <Brain className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">AI Workspace Assistant</h2>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Connected to your second brain</p>
                  </div>
                </div>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-[20px] p-5 shadow-sm border transition-colors ${
                            message.role === "assistant"
                              ? "border-border bg-secondary text-foreground"
                              : "border-transparent bg-foreground text-background"
                          }`}
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                              message.role === "assistant" 
                                ? "border-border bg-background" 
                                : "border-background/20 bg-background/10"
                            }`}>
                              {message.role === "assistant" ? (
                                <Bot className="h-4 w-4 text-accent" />
                              ) : (
                                <User className="h-4 w-4 text-background" />
                              )}
                            </div>
                            <p className={`text-sm font-bold ${message.role === "assistant" ? "text-foreground" : "text-background"}`}>
                              {message.role === "assistant" ? "corTeX AI" : "You"}
                            </p>
                          </div>
                          <p className={`whitespace-pre-wrap text-sm leading-relaxed ${message.role === "assistant" ? "text-foreground/90" : "text-background/90"}`}>
                            {message.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="rounded-[20px] border border-border bg-secondary px-6 py-5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-accent" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:120ms]" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-accent/60 [animation-delay:240ms]" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="border-t border-border p-5 bg-background">
                <div className="flex items-end gap-4">
                  <div className="relative flex-1">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Ask your workspace anything..."
                      className="min-h-[64px] w-full resize-none rounded-[20px] border border-border bg-secondary px-5 py-4 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[16px] bg-foreground shadow-sm transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    <Send className="h-5 w-5 text-background" />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="w-[360px] space-y-6">
              <AIInsightCard
                title="Workspace Memory"
                value={`${notes.length} Notes`}
                desc={`${notesAnalytics.totalWords} words indexed into your second brain.`}
              />
              <AIInsightCard
                title="Execution Engine"
                value={`${completionRate}%`}
                desc={`${completedToday} tasks completed today with ${executionVelocity}/day execution velocity.`}
              />
              <AIInsightCard
                title="Focus Intelligence"
                value={`${focusScore}/100`}
                desc={`${completedSessions} tracked focus sessions with ${totalFocusHours} focus hours.`}
              />

              <div className="paper-panel rounded-[24px] border border-border bg-background p-6 transition-colors duration-500">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">AI Context Layer</h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live workspace injection</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-sm font-medium text-muted-foreground">
                  <p>• Notes indexed for semantic recall</p>
                  <p>• Task execution patterns tracked</p>
                  <p>• Productivity metrics injected</p>
                  <p>• Ready for OpenAI integration</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.main>
    </div>
  );
}

function AIStat({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-[20px] border border-border bg-secondary p-4 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border">
          <Icon className="h-4 w-4 text-accent" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <h3 className="mt-3 text-2xl font-display font-bold text-foreground">{value}</h3>
    </div>
  );
}

function AIInsightCard({ title, value, desc }: any) {
  return (
    <div className="paper-panel rounded-[24px] border border-border p-6 transition-colors duration-500">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      <h3 className="mt-3 text-3xl font-display font-bold text-foreground">{value}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

export default AIPage;