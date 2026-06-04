import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Send, Bot, User, Trash2, Brain, Wand2, Zap, Clock3, Flame, ChevronRight, Plus, Copy, RefreshCw, PenTool, BookOpen, Target, Settings2, CheckCircle2, Network, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNotesStore } from "@/store/notes-store";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import { streamGemini, AgentMode } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useProductivityStore } from "@/store/productivity-store";
import { useIntelligenceStore } from "@/store/intelligence-store";
import { useFocusStore } from "@/store/focus-store";
import { useMemoryStore } from "@/store/memory-store";
import { generateAnalytics } from "@/lib/analytics-engine";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useAuthStore } from "@/store/auth-store";
import { useExecutionStore } from "@/store/execution-store";
import { useCalendarStore } from "@/store/calendar-store";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
};

export const Route = createFileRoute("/assistant")({
  component: AssistantPage,
});

const createInitialConversation = (): Conversation => ({
  id: crypto.randomUUID(),
  title: "New Conversation",
  createdAt: Date.now(),
  messages: [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "# Welcome back to corTeX.ai\n\nYour AI workspace is synced and ready.\n\nI can help you:\n\n- Think clearly\n- Organize ideas\n- Plan intelligently\n- Summarize notes\n- Optimize deep work sessions\n- Build systems and workflows",
      createdAt: Date.now(),
    },
  ],
});

function AssistantPage() {
  const productivity = useProductivityStore() as any;
  const notesStore = useNotesStore();
  const memoryStore = useMemoryStore();
  const executionStore = useExecutionStore();
  const calendarStore = useCalendarStore();
  const { user } = useAuthStore();

  const [agentMode, setAgentMode] = useState<AgentMode>('default');

  const notes = Array.isArray(notesStore?.notes) ? notesStore.notes : [];
  const memories = Array.isArray(memoryStore?.memories) ? memoryStore.memories : [];

  const workspaceContext = useMemo(() => {
    const notesCtx = notes
      .filter((note) => note && !note.archived)
      .slice(0, 10)
      .map((n) => `[NOTE: ${n.title}]\nCategory: ${n.category}\nTags: ${n.tags?.join(", ")}\nContent: ${typeof n.plainText === "string" ? n.plainText.slice(0, 1000) : ""}`)
      .join("\n\n");
    
    const memoryCtx = memories
      .map(m => `[MEMORY: ${m.type.toUpperCase()}]\n${m.content}`)
      .join("\n\n");

    return `
### RECENT NOTES
${notesCtx}

### AI MEMORIES (Things to remember about the user)
${memoryCtx}
    `.trim();
  }, [notes, memories]);

  const [conversations, setConversations] = useState<Conversation[]>([createInitialConversation()]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("assistant-conversations");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConversations(parsed);
          setActiveConversationId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoaded(true);

    // Fetch memories
    memoryStore.fetchMemories();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("assistant-conversations", JSON.stringify(conversations));
    
    // Sync to Supabase
    if (user?.id) {
      const syncActive = async () => {
        const active = conversations.find(c => c.id === activeConversationId) || conversations[0];
        if (!active) return;
        try {
          await supabase.from('assistant_conversations').upsert({
            id: active.id,
            user_id: user.id,
            title: active.title,
            messages: active.messages,
            created_at: active.createdAt,
            updated_at: Date.now()
          });
        } catch (e) {
          console.error(e);
        }
      };
      syncActive();
    }
  }, [conversations, activeConversationId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, streamingText]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 220) + "px";
  }, [input]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) || conversations[0],
    [conversations, activeConversationId]
  );

  const messages = activeConversation?.messages || [];

  const suggestions = useMemo(
    () => [
      "Plan my ideal deep work day",
      "Summarize my productivity patterns",
      "Generate startup ideas",
      "Build a learning roadmap for AI engineering",
    ],
    []
  );

  const createConversation = useCallback(() => {
    const newConversation = createInitialConversation();
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  }, []);

  const clearChat = useCallback(() => {
    const fresh = createInitialConversation();
    setConversations([fresh]);
    setActiveConversationId(fresh.id);
    localStorage.removeItem("assistant-conversations");
    
    if (user?.id) {
      supabase.from('assistant_conversations').delete().eq('user_id', user.id).then();
    }
  }, [user]);

  const copyMessage = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId("");
    }, 2000);
  };

  const sendMessage = useCallback(
    async (preset?: string) => {
      const content = preset || input;
      if (!content.trim() || loading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: Date.now(),
      };

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === activeConversationId
            ? { ...conversation, messages: [...conversation.messages, userMessage] }
            : conversation
        )
      );
      setInput("");
      setLoading(true);

      try {
        setStreamingText("");
        const conversationContext = messages
          .slice(-12)
          .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
          .join("\n\n");

        const intelligenceStore = useIntelligenceStore.getState();
        const focusStore = useFocusStore.getState();
        const analytics = generateAnalytics(focusStore.sessions);
        
        const systemContext = `
Current workspace context:
Completed Sessions: ${productivity?.getCompletedSessions?.() || 0}
Total Focus Hours: ${analytics?.totalFocusHours || 0}
Deep Work Score: ${intelligenceStore?.deepWorkScore || 0}
Productivity Score: ${intelligenceStore?.productivityScore || 0}
Momentum Score: ${intelligenceStore?.momentumScore || 0}
Burnout Risk: ${analytics?.burnoutRisk || 0}%

Recent Session Reviews:
${(intelligenceStore?.sessionReviews || []).slice(0, 3).map(r => `- ${r.classification}: ${r.improvements}`).join('\n')}

Conversation History:
${conversationContext}

${workspaceContext}

Latest User Prompt:
${content}
        `.trim();

        const fullResponse = await streamGemini(
          systemContext,
          (partial) => {
            setStreamingText(partial);
          },
          agentMode,
          workspaceContext
        );

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: fullResponse,
          createdAt: Date.now(),
        };

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === activeConversationId
              ? {
                  ...conversation,
                  title: conversation.messages.length <= 2 ? content.slice(0, 40) : conversation.title,
                  messages: [...conversation.messages, assistantMessage],
                }
              : conversation
          )
        );
        setStreamingText("");
      } catch (error) {
        console.error(error);
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "## Error\n\ncorTeX.ai encountered an issue while generating a response.\n\nPlease try again.",
          createdAt: Date.now(),
        };
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === activeConversationId
              ? { ...conversation, messages: [...conversation.messages, errorMessage] }
              : conversation
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, productivity, activeConversationId, workspaceContext, agentMode]
  );

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <WorkspaceSidebar />
      <motion.div
        animate={{ marginLeft: useWorkspaceStore().sidebarCollapsed ? 96 : 280 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <WorkspaceHeader />
        <main className="relative h-screen overflow-hidden pt-20">
          <div className="relative z-10 flex h-[calc(100vh-80px)] overflow-hidden">
            <aside className="hidden w-[360px] shrink-0 border-r border-border bg-secondary/30 xl:flex xl:flex-col transition-colors duration-500">
              <div className="border-b border-border p-6">
                <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Agent Workspace
                </div>
                <h1 className="mt-6 text-5xl font-display font-bold leading-[1.1] tracking-tight text-foreground">
                  corTeX<br /><span className="italic text-accent">intelligence</span>
                </h1>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
                <div className="paper-panel rounded-[24px] border border-border p-6 mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">Agent Mode</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'default', icon: Bot, label: 'Default' },
                      { id: 'planner', icon: Target, label: 'Planning Agent' },
                      { id: 'researcher', icon: Search, label: 'Research Agent' },
                      { id: 'productivity', icon: Zap, label: 'Productivity Agent' },
                      { id: 'knowledge', icon: Network, label: 'Knowledge Agent' },
                      { id: 'review', icon: BookOpen, label: 'Review Agent' },
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setAgentMode(mode.id as AgentMode)}
                        className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-colors ${
                          agentMode === mode.id
                            ? 'border-accent bg-accent/10 text-accent font-bold shadow-sm'
                            : 'border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                      >
                        <mode.icon className="h-4 w-4 shrink-0" />
                        <span className="text-xs truncate">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="paper-panel rounded-[24px] border border-border p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">AI Memory</h2>
                    <div className="rounded-full bg-accent/20 px-2 py-1 text-[10px] font-black text-accent uppercase tracking-widest">
                      {memories.length} Items
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                    {memories.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No memories yet. Tell the AI what to remember.</p>
                    ) : (
                      memories.map(memory => (
                        <div key={memory.id} className="rounded-xl border border-border bg-background p-3 flex justify-between gap-2 group">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">{memory.type}</span>
                            <p className="text-sm text-foreground line-clamp-2">{memory.content}</p>
                          </div>
                          <button 
                            onClick={() => memoryStore.deleteMemory(memory.id)}
                            className="shrink-0 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Neural Sessions</p>
                    <button
                      onClick={createConversation}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-secondary"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New
                    </button>
                  </div>
                  <div className="custom-scrollbar max-h-[200px] space-y-2 overflow-y-auto pr-2">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => setActiveConversationId(conversation.id)}
                        className={`w-full rounded-[16px] border p-4 text-left transition-all duration-200 ${
                          activeConversationId === conversation.id
                            ? "border-accent bg-accent text-white shadow-sm"
                            : "border-border bg-background hover:bg-secondary/50 text-foreground"
                        }`}
                      >
                        <p className={`truncate text-sm font-bold ${activeConversationId === conversation.id ? "text-white" : "text-foreground"}`}>
                          {conversation.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-6 bg-background">
                <button
                  onClick={clearChat}
                  className="flex w-full items-center justify-center gap-2 rounded-[16px] border border-red-500/20 bg-red-500/10 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Conversation
                </button>
              </div>
            </aside>

            <section className="relative flex min-w-0 flex-1 flex-col">
              <div className="custom-scrollbar flex-1 overflow-y-auto px-6 pb-44 pt-10">
                <div className="mx-auto flex max-w-4xl flex-col gap-6">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`group relative max-w-[85%] rounded-[24px] border p-6 shadow-sm ${
                            message.role === "user"
                              ? "border-transparent bg-foreground text-background"
                              : "border-border bg-background text-foreground"
                          }`}
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                                  message.role === "user"
                                    ? "border-background/20 bg-background/10"
                                    : "border-border bg-secondary"
                                }`}
                              >
                                {message.role === "user" ? (
                                  <User className={`h-5 w-5 ${message.role === "user" ? "text-background" : "text-foreground"}`} />
                                ) : (
                                  <Bot className="h-5 w-5 text-accent" />
                                )}
                              </div>
                              <div>
                                <p className={`text-sm font-bold ${message.role === "user" ? "text-background" : "text-foreground"}`}>
                                  {message.role === "user" ? "You" : "corTeX Agent"}
                                </p>
                                <p className={`text-xs font-semibold ${message.role === "user" ? "text-background/70" : "text-muted-foreground"}`}>
                                  {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={() => copyMessage(message.id, message.content)}
                                className={`rounded-lg border p-2 transition-colors ${
                                  message.role === "user"
                                    ? "border-background/20 hover:bg-background/20 text-background"
                                    : "border-border hover:bg-secondary text-muted-foreground"
                                }`}
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {copiedId === message.id && (
                            <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-500">
                              Copied to clipboard
                            </div>
                          )}

                          <MarkdownRenderer content={message.content} isUser={message.role === "user"} />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {loading && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-[24px] border border-border bg-background p-6 shadow-sm min-w-[300px]">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary">
                            <Brain className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">corTeX Agent</p>
                            <p className="text-xs font-semibold text-muted-foreground">Thinking...</p>
                          </div>
                        </div>
                        <div className="space-y-3 mt-4">
                          <div className="h-4 w-3/4 rounded bg-secondary animate-pulse"></div>
                          <div className="h-4 w-full rounded bg-secondary animate-pulse"></div>
                          <div className="h-4 w-5/6 rounded bg-secondary animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-md pb-6 pt-4">
                <div className="mx-auto max-w-4xl px-6">
                  <div className="paper-panel rounded-[24px] border border-border bg-background p-3 shadow-sm transition-all focus-within:border-accent">
                    <div className="flex items-end gap-3">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder={`Ask corTeX ${agentMode !== 'default' ? agentMode.charAt(0).toUpperCase() + agentMode.slice(1) : 'AI'} anything...`}
                        className="max-h-[220px] min-h-[50px] flex-1 resize-none bg-transparent px-3 py-3 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
                      />
                      <button
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-foreground text-background shadow-sm transition-all hover:scale-[1.02] hover:bg-accent disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-foreground"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </motion.div>
    </div>
  );
}

function MarkdownRenderer({ content, isUser = false }: { content: string; isUser?: boolean }) {
  const textColorClass = isUser ? "text-background" : "text-foreground";
  const headingClass = isUser ? "text-background" : "text-foreground";
  const codeClass = isUser ? "text-background bg-background/20" : "text-accent bg-secondary";
  
  const memoryStore = useMemoryStore();
  const executionStore = useExecutionStore();
  const calendarStore = useCalendarStore();
  
  const [createdMemory, setCreatedMemory] = useState<Record<string, boolean>>({});

  const handleCreateMemory = async (type: any, memoryContent: string, codeStr: string) => {
    await memoryStore.addMemory(type, memoryContent);
    setCreatedMemory(prev => ({ ...prev, [codeStr]: true }));
  };

  const handleCreateProject = async (name: string, description: string, codeStr: string) => {
    await executionStore.addProject(name, description, null);
    setCreatedMemory(prev => ({ ...prev, [codeStr]: true }));
  };

  const handleCreateTimeBlock = async (title: string, type: any, codeStr: string) => {
    const now = new Date();
    await calendarStore.addBlock({
      title,
      type,
      startTime: now.getTime(),
      endTime: now.getTime() + 3600000,
      date: now.toISOString().split('T')[0],
      linkedTaskId: null,
      linkedProjectId: null
    });
    setCreatedMemory(prev => ({ ...prev, [codeStr]: true }));
  };

  return (
    <div className={`prose prose-sm md:prose-base max-w-none prose-p:${textColorClass} prose-p:my-2 prose-headings:${headingClass} prose-headings:mt-6 prose-headings:mb-3 prose-strong:${headingClass} prose-li:${textColorClass} prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeStr = String(children).replace(/\n$/, "");
            
            if (!inline && match && match[1] === "json:memory" && !isUser) {
              try {
                const parsed = JSON.parse(codeStr);
                return (
                  <div className="my-4 rounded-xl border border-accent/30 bg-accent/5 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-accent font-bold">
                      <Brain className="h-4 w-4" /> 
                      AI Memory Suggestion
                    </div>
                    <div className="text-sm text-foreground">
                      <span className="font-semibold text-muted-foreground uppercase text-[10px] mr-2 px-2 py-0.5 rounded-full border border-border bg-background">{parsed.type}</span>
                      {parsed.content}
                    </div>
                    <button 
                      onClick={() => handleCreateMemory(parsed.type, parsed.content, codeStr)}
                      disabled={createdMemory[codeStr]}
                      className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                    >
                      {createdMemory[codeStr] ? <><CheckCircle2 className="h-4 w-4"/> Saved to Memory</> : "Commit to Memory"}
                    </button>
                  </div>
                );
              } catch (e) {
                // fallback if JSON parse fails
              }
            } else if (!inline && match && match[1] === "json:task" && !isUser) {
              try {
                const parsed = JSON.parse(codeStr);
                return (
                  <div className="my-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                      <Target className="h-4 w-4" /> 
                      AI Task Suggestion
                    </div>
                    <div className="text-sm text-foreground font-semibold">
                      {parsed.title}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="uppercase text-[10px] font-bold border border-border px-2 py-0.5 rounded-md">{parsed.priority || 'medium'} priority</span>
                    </div>
                    <button 
                      disabled={true}
                      className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition-colors opacity-50 cursor-not-allowed"
                    >
                      Use Tasks Tab (Coming Soon)
                    </button>
                  </div>
                );
              } catch (e) {
                // fallback if JSON parse fails
              }
            } else if (!inline && match && match[1] === "json:workflow" && !isUser) {
              try {
                const parsed = JSON.parse(codeStr);
                return (
                  <div className="my-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Target className="h-4 w-4" /> 
                      AI Agent Workflow: {parsed.name}
                    </div>
                    <p className="text-xs text-muted-foreground">{parsed.description}</p>
                    
                    {parsed.projects && parsed.projects.length > 0 && (
                      <div className="text-sm bg-black/20 p-2 rounded-lg border border-white/5">
                        <span className="font-bold text-xs text-cyan-400 block mb-1">Projects to Create:</span>
                        <ul className="list-disc pl-4 text-zinc-300">
                          {parsed.projects.map((p: any, i: number) => <li key={i}>{p.name}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => {
                         if (parsed.projects) {
                            parsed.projects.forEach((p: any) => handleCreateProject(p.name, p.description, codeStr));
                         } else {
                            handleCreateProject(parsed.name, parsed.description, codeStr);
                         }
                      }}
                      disabled={createdMemory[codeStr]}
                      className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-cyan-400 disabled:opacity-50"
                    >
                      {createdMemory[codeStr] ? <><CheckCircle2 className="h-4 w-4"/> Workflow Executed</> : "Execute Workflow"}
                    </button>
                  </div>
                );
              } catch (e) {
                // fallback if JSON parse fails
              }
            } else if (!inline && match && match[1] === "json:timeblock" && !isUser) {
              try {
                const parsed = JSON.parse(codeStr);
                return (
                  <div className="my-4 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <Clock3 className="h-4 w-4" /> 
                      AI Schedule Suggestion
                    </div>
                    <div className="text-sm text-foreground font-semibold flex items-center justify-between">
                      {parsed.title}
                      <span className="text-xs bg-blue-500/20 px-2 py-1 rounded text-blue-400 uppercase tracking-wider">{parsed.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{parsed.durationHours} hours block</p>
                    <button 
                      onClick={() => handleCreateTimeBlock(parsed.title, parsed.type, codeStr)}
                      disabled={createdMemory[codeStr]}
                      className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-400 disabled:opacity-50"
                    >
                      {createdMemory[codeStr] ? <><CheckCircle2 className="h-4 w-4"/> Added to Planner</> : "Add to Planner"}
                    </button>
                  </div>
                );
              } catch (e) {
                // fallback if JSON parse fails
              }
            }

            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark as any}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  borderRadius: "16px",
                  padding: "16px",
                  background: "#1e1e1e",
                  border: "1px solid rgba(0,0,0,0.1)",
                  fontSize: "0.875rem",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                }}
                {...props}
              >
                {codeStr}
              </SyntaxHighlighter>
            ) : (
              <code className={`rounded-md px-1.5 py-0.5 font-mono text-sm ${codeClass}`} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default AssistantPage;