import { createFileRoute } from "@tanstack/react-router";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Brain,
  Sparkles,
  Send,
  FileText,
  CheckSquare,
  BarChart3,
  Zap,
  Bot,
  User,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";

import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";

import {
  useNotesStore,
} from "@/store/notes-store";

import {
  useTasksStore,
} from "@/store/tasks-store";

import {
  useProductivityStore,
} from "@/store/productivity-store";

export const Route =
  createFileRoute("/ai")({
    component: AIPage,
  });

type Message = {
  id: string;

  role:
    | "user"
    | "assistant";

  content: string;

  createdAt: number;
};

function AIPage() {
  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([
      {
        id: crypto.randomUUID(),

        role: "assistant",

        createdAt:
          Date.now(),

        content:
          "Welcome to corTeX AI.\n\nI can understand your notes, tasks, focus sessions and productivity patterns to help you think, plan and execute better.",
      },
    ]);

  const {
    notes,
    analytics:
      notesAnalytics,
  } = useNotesStore();

  const {
    tasks,
    completedToday,
    completionRate,
    executionVelocity,
  } =
    useTasksStore();

  const {
    completedSessions,
    totalFocusHours,
    focusScore,
    streak,
  } =
    useProductivityStore();

  const workspaceContext =
    useMemo(() => {
      return {
        notesCount:
          notes.length,

        tasksCount:
          tasks.length,

        completedTasks:
          tasks.filter(
            (
              task
            ) =>
              task.completed
          ).length,

        focusHours:
          totalFocusHours,

        focusScore,

        streak,

        completedSessions,

        completedToday,

        completionRate,

        executionVelocity,

        totalWords:
          notesAnalytics.totalWords,

        recentNotes:
          notes
            .slice(0, 5)
            .map(
              (
                note
              ) => ({
                title:
                  note.title,

                tags:
                  note.tags,
              })
            ),
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

  const generateAIResponse =
    async (
      prompt: string
    ) => {
      const lower =
        prompt.toLowerCase();

      if (
        lower.includes(
          "productivity"
        )
      ) {
        return `Your current productivity score is ${focusScore}/100.\n\nYou've completed ${completedSessions} focus sessions with ${totalFocusHours} total focus hours.\n\nYour current streak is ${streak} days and your execution velocity is ${executionVelocity}/day.`;
      }

      if (
        lower.includes(
          "notes"
        )
      ) {
        return `You currently have ${notes.length} notes with ${notesAnalytics.totalWords} total words stored in your second-brain system.\n\nRecent topics include:\n${notes
          .slice(0, 5)
          .map(
            (
              note
            ) =>
              `• ${note.title}`
          )
          .join("\n")}`;
      }

      if (
        lower.includes(
          "tasks"
        )
      ) {
        return `You currently have ${tasks.length} tracked tasks.\n\nCompletion rate: ${completionRate}%\nCompleted today: ${completedToday}\nExecution velocity: ${executionVelocity}/day`;
      }

      return `I analyzed your workspace context.\n\nYou currently maintain:\n• ${notes.length} knowledge nodes\n• ${tasks.length} tracked tasks\n• ${completedSessions} focus sessions\n• ${totalFocusHours} focus hours\n\nYour system is evolving into a highly connected productivity workspace.`;
    };

  const sendMessage =
    async () => {
      if (
        !input.trim() ||
        loading
      ) {
        return;
      }

      const userMessage: Message =
        {
          id: crypto.randomUUID(),

          role: "user",

          content: input,

          createdAt:
            Date.now(),
        };

      setMessages(
        (
          prev
        ) => [
          ...prev,
          userMessage,
        ]
      );

      const prompt =
        input;

      setInput("");

      setLoading(true);

      setTimeout(
        async () => {
          const response =
            await generateAIResponse(
              prompt
            );

          const aiMessage: Message =
            {
              id: crypto.randomUUID(),

              role:
                "assistant",

              content:
                response,

              createdAt:
                Date.now(),
            };

          setMessages(
            (
              prev
            ) => [
              ...prev,
              aiMessage,
            ]
          );

          setLoading(
            false
          );
        },
        900
      );
    };

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-white">

      <WorkspaceSidebar />

      <main className="relative flex-1 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_25%)]" />

        <WorkspaceHeader />

        <div className="relative z-10 flex h-screen flex-col px-8 pb-8 pt-28">

          <section className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_50%)]" />

            <div className="relative flex items-center justify-between">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />

                  Workspace Intelligence

                </div>

                <h1 className="mt-5 text-5xl font-black tracking-tight">

                  corTeX

                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">

                    .ai

                  </span>

                </h1>

                <p className="mt-4 max-w-2xl text-zinc-400">

                  AI-aware workspace assistant connected to your notes, tasks, focus sessions and productivity intelligence.

                </p>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <AIStat
                  icon={FileText}
                  label="Knowledge"
                  value={`${notes.length}`}
                />

                <AIStat
                  icon={CheckSquare}
                  label="Tasks"
                  value={`${tasks.length}`}
                />

                <AIStat
                  icon={BarChart3}
                  label="Focus"
                  value={`${focusScore}`}
                />

                <AIStat
                  icon={Zap}
                  label="Streak"
                  value={`${streak}d`}
                />

              </div>

            </div>

          </section>

          <section className="mt-6 flex min-h-0 flex-1 gap-6">

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[38px] border border-white/10 bg-black/20 backdrop-blur-3xl">

              <div className="border-b border-white/10 px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_30px_rgba(168,85,247,0.35)]">

                    <Brain className="h-5 w-5 text-white" />

                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-white">

                      AI Workspace Assistant

                    </h2>

                    <p className="text-sm text-zinc-500">

                      Connected to your second brain

                    </p>

                  </div>

                </div>

              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">

                <div className="space-y-5">

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
                          className={`flex ${
                            message.role ===
                            "assistant"
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >

                          <div
                            className={`max-w-3xl rounded-[28px] border px-5 py-4 backdrop-blur-2xl ${
                              message.role ===
                              "assistant"
                                ? "border-white/10 bg-white/[0.04]"
                                : "border-purple-500/20 bg-purple-500/10"
                            }`}
                          >

                            <div className="mb-3 flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05]">

                                {message.role ===
                                "assistant" ? (
                                  <Bot className="h-4 w-4 text-purple-300" />
                                ) : (
                                  <User className="h-4 w-4 text-cyan-300" />
                                )}

                              </div>

                              <p className="text-sm font-semibold text-white">

                                {message.role ===
                                "assistant"
                                  ? "corTeX AI"
                                  : "You"}

                              </p>

                            </div>

                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">

                              {
                                message.content
                              }

                            </p>

                          </div>

                        </motion.div>
                      )
                    )}

                  </AnimatePresence>

                  {loading && (
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      className="flex justify-start"
                    >

                      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="h-2 w-2 animate-bounce rounded-full bg-purple-400" />

                          <div className="h-2 w-2 animate-bounce rounded-full bg-pink-400 [animation-delay:120ms]" />

                          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:240ms]" />

                        </div>

                      </div>

                    </motion.div>
                  )}

                </div>

              </div>

              <div className="border-t border-white/10 p-5">

                <div className="flex items-end gap-4">

                  <div className="relative flex-1">

                    <textarea
                      value={input}
                      onChange={(e) =>
                        setInput(
                          e.target
                            .value
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
                      placeholder="Ask your workspace anything..."
                      className="min-h-[68px] w-full resize-none rounded-[26px] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500/30"
                    />

                  </div>

                  <motion.button
                    whileTap={{
                      scale: 0.95,
                    }}
                    whileHover={{
                      scale: 1.03,
                    }}
                    onClick={
                      sendMessage
                    }
                    className="flex h-[68px] w-[68px] items-center justify-center rounded-[24px] bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_40px_rgba(168,85,247,0.35)]"
                  >

                    <Send className="h-5 w-5 text-white" />

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

              <div className="rounded-[34px] border border-purple-500/20 bg-purple-500/10 p-6 backdrop-blur-3xl">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20">

                    <Sparkles className="h-5 w-5 text-purple-300" />

                  </div>

                  <div>

                    <h3 className="text-lg font-bold text-white">

                      AI Context Layer

                    </h3>

                    <p className="text-sm text-zinc-500">

                      Live workspace injection

                    </p>

                  </div>

                </div>

                <div className="mt-5 space-y-3 text-sm text-zinc-400">

                  <p>

                    • Notes indexed for semantic recall

                  </p>

                  <p>

                    • Task execution patterns tracked

                  </p>

                  <p>

                    • Productivity metrics injected

                  </p>

                  <p>

                    • Ready for OpenAI integration

                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

function AIStat({
  icon: Icon,
  label,
  value,
}: any) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10">

        <Icon className="h-5 w-5 text-purple-300" />

      </div>

      <p className="mt-4 text-xs text-zinc-500">

        {label}

      </p>

      <h3 className="mt-1 text-2xl font-black text-white">

        {value}

      </h3>

    </div>
  );
}

function AIInsightCard({
  title,
  value,
  desc,
}: any) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl">

      <p className="text-sm text-zinc-500">

        {title}

      </p>

      <h3 className="mt-2 text-3xl font-black text-white">

        {value}

      </h3>

      <p className="mt-4 text-sm leading-relaxed text-zinc-400">

        {desc}

      </p>

    </div>
  );
}

export default AIPage;