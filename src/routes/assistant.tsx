import { createFileRoute } from "@tanstack/react-router";

import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Brain,
  Wand2,
  Zap,
  Clock3,
  Flame,
  ChevronRight,
  Plus,
  Copy,
  RefreshCw,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  retrieveRelevantNotes,
} from "@/lib/retrieveRelevantNotes";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  useNotesStore,
} from "@/store/notes-store";

import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";

import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";

import {
  streamGemini,
} from "@/lib/gemini";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import {
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  useProductivityStore,
} from "@/store/productivity-store";

type Message = {
  id: string;

  role:
    | "user"
    | "assistant";

  content: string;

  createdAt: number;
};

type Conversation = {
  id: string;

  title: string;

  messages: Message[];

  createdAt: number;
};

export const Route =
  createFileRoute("/assistant")({
    component:
      AssistantPage,
  });

const createInitialConversation =
  (): Conversation => ({
    id: crypto.randomUUID(),

    title:
      "New Conversation",

    createdAt:
      Date.now(),

    messages: [
      {
        id: crypto.randomUUID(),

        role:
          "assistant",

        content:
          "# Welcome back to corTeX.ai\n\nYour AI workspace is synced and ready.\n\nI can help you:\n\n- Think clearly\n- Organize ideas\n- Plan intelligently\n- Summarize notes\n- Optimize deep work sessions\n- Build systems and workflows",

        createdAt:
          Date.now(),
      },
    ],
  });

function AssistantPage() {
  const productivity =
    useProductivityStore() as any;
const notesStore =
  useNotesStore();

const notes =
  Array.isArray(
    notesStore?.notes
  )
    ? notesStore.notes
    : [];

const notesContext =
  notes
    .filter(
      (note) =>
        note &&
        !note.archived
    )
    .slice(0, 8)
    .map(
      (note) => {
        const title =
          note.title ||
          "Untitled";

        const category =
          note.category ||
          "General";

        const tags =
          Array.isArray(
            note.tags
          )
            ? note.tags.join(
                ", "
              )
            : "";

        const content =
          typeof note.plainText ===
          "string"
            ? note.plainText.slice(
                0,
                1200
              )
            : "";

        return `
Title:
${title}

Category:
${category}

Tags:
${tags}

Content:
${content}
`;
      }
    )
    .join(
      "\n\n------------------\n\n"
    );
  const [
    conversations,
    setConversations,
  ] = useState<
    Conversation[]
  >([
    createInitialConversation(),
  ]);

  const [
    activeConversationId,
    setActiveConversationId,
  ] = useState("");

  const [
    input,
    setInput,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    streamingText,
    setStreamingText,
  ] = useState("");

  const [
    copiedId,
    setCopiedId,
  ] = useState("");

  const textareaRef =
    useRef<HTMLTextAreaElement>(
      null
    );

  const bottomRef =
    useRef<HTMLDivElement>(
      null
    );

  useEffect(() => {
    const stored =
      localStorage.getItem(
        "assistant-conversations"
      );

    if (stored) {
      const parsed =
        JSON.parse(stored);

      setConversations(
        parsed
      );

      if (
        parsed.length
      ) {
        setActiveConversationId(
          parsed[0].id
        );
      }
    } else {
      const initial =
        createInitialConversation();

      setConversations([
        initial,
      ]);

      setActiveConversationId(
        initial.id
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "assistant-conversations",
      JSON.stringify(
        conversations
      )
    );
  }, [conversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior:
          "smooth",
      }
    );
  }, [
    conversations,
    streamingText,
  ]);

  useEffect(() => {
    const textarea =
      textareaRef.current;

    if (!textarea)
      return;

    textarea.style.height =
      "auto";

    textarea.style.height =
      Math.min(
        textarea.scrollHeight,
        220
      ) + "px";
  }, [input]);

  const activeConversation =
    useMemo(
      () =>
        conversations.find(
          (c) =>
            c.id ===
            activeConversationId
        ) ||
        conversations[0],
      [
        conversations,
        activeConversationId,
      ]
    );

  const messages =
    activeConversation
      ?.messages || [];

  const suggestions =
    useMemo(
      () => [
        "Plan my ideal deep work day",

        "Summarize my productivity patterns",

        "Generate startup ideas",

        "Build a learning roadmap for AI engineering",

        "How can I improve focus?",

        "Create a 7 day discipline system",
      ],
      []
    );

  const createConversation =
    useCallback(() => {
      const newConversation =
        createInitialConversation();

      setConversations(
        (prev) => [
          newConversation,
          ...prev,
        ]
      );

      setActiveConversationId(
        newConversation.id
      );
    }, []);

  const clearChat =
    useCallback(() => {
      const fresh =
        createInitialConversation();

      setConversations([
        fresh,
      ]);

      setActiveConversationId(
        fresh.id
      );

      localStorage.removeItem(
        "assistant-conversations"
      );
    }, []);

  const copyMessage =
    async (
      id: string,
      content: string
    ) => {
      await navigator.clipboard.writeText(
        content
      );

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId("");
      }, 2000);
    };

  const sendMessage =
    useCallback(
      async (
        preset?: string
      ) => {
        const content =
          preset || input;

        if (
          !content.trim() ||
          loading
        )
          return;

        const userMessage: Message =
          {
            id: crypto.randomUUID(),

            role:
              "user",

            content,

            createdAt:
              Date.now(),
          };

        setConversations(
          (
            prev
          ) =>
            prev.map(
              (
                conversation
              ) =>
                conversation.id ===
                activeConversationId
                  ? {
                      ...conversation,

                      messages: [
                        ...conversation.messages,
                        userMessage,
                      ],
                    }
                  : conversation
            )
        );

        setInput("");

        setLoading(true);

        try {
          setStreamingText(
            ""
          );

          const conversationContext =
            messages
              .slice(-12)
              .map(
                (
                  m
                ) =>
                  `${
                    m.role ===
                    "user"
                      ? "User"
                      : "Assistant"
                  }: ${
                    m.content
                  }`
              )
              .join(
                "\n\n"
              );

          const fullResponse =
            await streamGemini(
              `
You are corTeX.ai,
an elite futuristic AI productivity operating system.

You help users:
- think clearly
- focus deeply
- organize ideas
- build systems
- learn efficiently
- optimize productivity
- reduce distractions
- create strategies

Current workspace context:

Completed Sessions:
${productivity?.completedSessions || 0}

Total Focus Hours:
${productivity?.totalFocusHours || 0}

Neural Score:
${productivity?.neuralScore || 32}

Conversation History:
${conversationContext}

Workspace Notes:
${notesContext}

Latest User Prompt:
${content}

Rules:
- Be intelligent
- Be concise when possible
- Use markdown beautifully
- Use structured responses
- Sound futuristic but human
- Avoid generic chatbot phrasing
`,
              (
                partial
              ) => {
                setStreamingText(
                  partial
                );
              }
            );

          const assistantMessage: Message =
            {
              id: crypto.randomUUID(),

              role:
                "assistant",

              content:
                fullResponse,

              createdAt:
                Date.now(),
            };

          setConversations(
            (
              prev
            ) =>
              prev.map(
                (
                  conversation
                ) =>
                  conversation.id ===
                  activeConversationId
                    ? {
                        ...conversation,

                        title:
                          conversation
                            .messages
                            .length <=
                          2
                            ? content.slice(
                                0,
                                40
                              )
                            : conversation.title,

                        messages: [
                          ...conversation.messages,
                          assistantMessage,
                        ],
                      }
                    : conversation
              )
          );

          setStreamingText(
            ""
          );
        } catch (
          error
        ) {
          console.error(
            error
          );

          const errorMessage: Message =
            {
              id: crypto.randomUUID(),

              role:
                "assistant",

              content:
                "## Error\n\ncorTeX.ai encountered an issue while generating a response.\n\nPlease try again.",

              createdAt:
                Date.now(),
            };

          setConversations(
            (
              prev
            ) =>
              prev.map(
                (
                  conversation
                ) =>
                  conversation.id ===
                  activeConversationId
                    ? {
                        ...conversation,

                        messages: [
                          ...conversation.messages,
                          errorMessage,
                        ],
                      }
                    : conversation
              )
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        input,
        loading,
        messages,
        productivity,
        activeConversationId,
      ]
    );

  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-white">

      <WorkspaceSidebar />

      <div className="ml-[84px] lg:ml-[280px]">

        <WorkspaceHeader />

        <main className="relative h-screen overflow-hidden pt-20">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_25%)]" />

          <motion.div
            animate={{
              scale: [
                1,
                1.08,
                1,
              ],
            }}
            transition={{
              duration: 10,
              repeat:
                Infinity,
            }}
            className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[160px]"
          />

          <div className="relative z-10 flex h-[calc(100vh-80px)] overflow-hidden">

            <aside className="hidden w-[360px] shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-3xl xl:flex xl:flex-col">

              <div className="border-b border-white/10 p-6">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />

                  Neural Workspace

                </div>

                <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight">

                  corTeX

                  <br />

                  intelligence

                </h1>

              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto p-6">

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20">

                      <Brain className="h-7 w-7 text-purple-300" />

                    </div>

                    <div>

                      <h2 className="text-2xl font-black text-white">

                        AI Context

                      </h2>

                      <p className="text-sm text-zinc-500">

                        Live workspace awareness

                      </p>

                    </div>

                  </div>

                  <div className="mt-8 space-y-4">

                    <ContextCard
                      icon={Flame}
                      title="Focus Sessions"
                      value={`${productivity?.completedSessions || 0}`}
                    />

                    <ContextCard
                      icon={Clock3}
                      title="Total Hours"
                      value={`${productivity?.totalFocusHours || 0}h`}
                    />

                    <ContextCard
                      icon={Zap}
                      title="Neural Score"
                      value={`${productivity?.neuralScore || 32}`}
                    />

                  </div>

                </div>

                <div className="mt-8">

                  <div className="mb-4 flex items-center justify-between">

                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">

                      Neural Sessions

                    </p>

                    <button
                      onClick={
                        createConversation
                      }
                      className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-xs text-purple-300 transition hover:bg-purple-500/20"
                    >

                      <Plus className="h-3.5 w-3.5" />

                      New

                    </button>

                  </div>

                  <div className="custom-scrollbar max-h-[320px] space-y-3 overflow-y-auto pr-2">

                    {conversations.map(
                      (
                        conversation
                      ) => (
                        <button
                          key={
                            conversation.id
                          }
                          onClick={() =>
                            setActiveConversationId(
                              conversation.id
                            )
                          }
                          className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
                            activeConversationId ===
                            conversation.id
                              ? "border-purple-500/30 bg-purple-500/10 shadow-[0_0_35px_rgba(168,85,247,0.15)]"
                              : "border-white/10 bg-white/[0.03] hover:border-white/20"
                          }`}
                        >

                          <p className="truncate text-sm font-medium text-white">

                            {
                              conversation.title
                            }

                          </p>

                          <p className="mt-2 text-xs text-zinc-500">

                            {
                              conversation.messages
                                .length
                            }{" "}
                            messages

                          </p>

                        </button>
                      )
                    )}

                  </div>

                </div>

                <div className="mt-8">

                  <p className="mb-4 text-xs uppercase tracking-[0.2em] text-zinc-500">

                    Quick Actions

                  </p>

                  <div className="space-y-3">

                    {suggestions.map(
                      (
                        suggestion
                      ) => (
                        <button
                          key={
                            suggestion
                          }
                          onClick={() =>
                            sendMessage(
                              suggestion
                            )
                          }
                          className="group w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all duration-300 hover:border-purple-500/20 hover:bg-purple-500/10"
                        >

                          <div className="flex items-start gap-4">

                            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">

                              <Wand2 className="h-4 w-4 text-purple-300" />

                            </div>

                            <div className="flex-1">

                              <h3 className="text-sm font-medium text-white">

                                {
                                  suggestion
                                }

                              </h3>

                            </div>

                            <ChevronRight className="h-4 w-4 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-white" />

                          </div>

                        </button>
                      )
                    )}

                  </div>

                </div>

              </div>

              <div className="border-t border-white/10 p-6">

                <button
                  onClick={
                    clearChat
                  }
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                >

                  <Trash2 className="h-4 w-4" />

                  Clear Conversation

                </button>

              </div>

            </aside>

            <section className="relative flex min-w-0 flex-1 flex-col">

              <div className="custom-scrollbar flex-1 overflow-y-auto px-6 pb-44 pt-10">

                <div className="mx-auto flex max-w-5xl flex-col gap-6">

                  <AnimatePresence>

                    {messages.map(
                      (
                        message
                      ) => (
                        <motion.div
                          key={
                            message.id
                          }
                          initial={{
                            opacity: 0,
                            y: 20,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                          }}
                          className={`flex ${
                            message.role ===
                            "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >

                          <div
                            className={`group relative max-w-[85%] rounded-[32px] border p-6 backdrop-blur-2xl ${
                              message.role ===
                              "user"
                                ? "border-purple-500/20 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20"
                                : "border-white/10 bg-white/[0.03]"
                            }`}
                          >

                            <div className="mb-5 flex items-center justify-between">

                              <div className="flex items-center gap-3">

                                <div
                                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                                    message.role ===
                                    "user"
                                      ? "bg-white/10"
                                      : "bg-purple-500/20"
                                  }`}
                                >

                                  {message.role ===
                                  "user" ? (
                                    <User className="h-5 w-5 text-white" />
                                  ) : (
                                    <Bot className="h-5 w-5 text-purple-300" />
                                  )}

                                </div>

                                <div>

                                  <p className="text-sm font-semibold text-white">

                                    {message.role ===
                                    "user"
                                      ? "You"
                                      : "corTeX AI"}

                                  </p>

                                  <p className="text-xs text-zinc-500">

                                    {new Date(
                                      message.createdAt
                                    ).toLocaleTimeString(
                                      [],
                                      {
                                        hour:
                                          "2-digit",

                                        minute:
                                          "2-digit",
                                      }
                                    )}

                                  </p>

                                </div>

                              </div>

                              <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">

                                <button
                                  onClick={() =>
                                    copyMessage(
                                      message.id,
                                      message.content
                                    )
                                  }
                                  className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                                >

                                  <Copy className="h-4 w-4 text-zinc-300" />

                                </button>

                                {message.role ===
                                  "assistant" && (
                                  <button
                                    className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                                  >

                                    <RefreshCw className="h-4 w-4 text-zinc-300" />

                                  </button>
                                )}

                              </div>

                            </div>

                            {copiedId ===
                              message.id && (
                              <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">

                                Copied to clipboard

                              </div>
                            )}

                            <MarkdownRenderer
                              content={
                                message.content
                              }
                            />

                          </div>

                        </motion.div>
                      )
                    )}

                  </AnimatePresence>

                  {loading && (
                    <div className="flex justify-start">

                      <div className="max-w-[85%] rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl">

                        <div className="mb-5 flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/20">

                            <Brain className="h-5 w-5 animate-pulse text-purple-300" />

                          </div>

                          <div>

                            <p className="text-sm font-semibold text-white">

                              corTeX AI

                            </p>

                            <p className="text-xs text-zinc-500">

                              Thinking...

                            </p>

                          </div>

                        </div>

                        <MarkdownRenderer
                          content={`${streamingText}|`}
                        />

                      </div>

                    </div>
                  )}

                  <div ref={bottomRef} />

                </div>

              </div>

              <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#050816]/70 backdrop-blur-3xl">

                <div className="mx-auto max-w-5xl px-6 py-6">

                  <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-3xl">

                    <div className="flex items-end gap-4">

                      <textarea
                        ref={
                          textareaRef
                        }
                        value={input}
                        onChange={(e) =>
                          setInput(
                            e.target.value
                          )
                        }
                        onKeyDown={(
                          e
                        ) => {
                          if (
                            e.key ===
                              "Enter" &&
                            !e.shiftKey
                          ) {
                            e.preventDefault();

                            sendMessage();
                          }
                        }}
                        placeholder="Ask corTeX AI anything..."
                        className="max-h-[220px] min-h-[70px] flex-1 resize-none bg-transparent px-2 text-white outline-none placeholder:text-zinc-500"
                      />

                      <button
                        onClick={() =>
                          sendMessage()
                        }
                        disabled={
                          loading
                        }
                        className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-[0_0_40px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-[1.04] disabled:opacity-50"
                      >

                        <Send className="h-6 w-6" />

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}

function MarkdownRenderer({
  content,
}: {
  content: string;
}) {
  return (
    <div className="prose prose-invert max-w-none prose-p:text-zinc-200 prose-headings:text-white prose-strong:text-white prose-code:text-cyan-300">

      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
        ]}
        components={{
          code({
            inline,
            className,
            children,
            ...props
          }: any) {
            const match =
              /language-(\w+)/.exec(
                className || ""
              );

            return !inline &&
              match ? (
              <SyntaxHighlighter
                style={
                  oneDark as any
                }
                language={
                  match[1]
                }
                PreTag="div"
                customStyle={{
                  borderRadius:
                    "18px",
                  padding:
                    "18px",
                  background:
                    "#09090f",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                }}
                {...props}
              >

                {String(
                  children
                ).replace(
                  /\n$/,
                  ""
                )}

              </SyntaxHighlighter>
            ) : (
              <code
                className="rounded bg-white/10 px-1.5 py-1 text-cyan-300"
                {...props}
              >

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

function ContextCard({
  icon: Icon,
  title,
  value,
}: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20">

          <Icon className="h-5 w-5 text-purple-300" />

        </div>

        <div>

          <p className="text-sm text-zinc-500">

            {title}

          </p>

          <p className="mt-1 text-xl font-bold text-white">

            {value}

          </p>

        </div>

      </div>

    </div>
  );
}

export default AssistantPage;