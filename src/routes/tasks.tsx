import { createFileRoute } from "@tanstack/react-router";

import {
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  Trash2,
  CalendarDays,
  Flag,
  BrainCircuit,
  Flame,
  Zap,
  Clock3,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";

import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";

import {
  useProductivityStore,
} from "@/store/productivity-store";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  createdAt: number;
};

export const Route =
  createFileRoute("/tasks")({
    component: TasksPage,
  });

function TasksPage() {
  const [
    tasks,
    setTasks,
  ] = useState<Task[]>([]);

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    priority,
    setPriority,
  ] = useState<
    "Low" | "Medium" | "High"
  >("Medium");

  const [
    dueDate,
    setDueDate,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState<
    "All" | "Active" | "Completed"
  >("All");

  const {
    incrementTasks,
  } =
    useProductivityStore();

  useEffect(() => {
    const stored =
      localStorage.getItem(
        "tasks-storage"
      );

    if (stored) {
      setTasks(
        JSON.parse(stored)
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "tasks-storage",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  const createTask = () => {
    if (!title.trim())
      return;

    const newTask: Task =
      {
        id: crypto.randomUUID(),

        title,

        completed:
          false,

        priority,

        dueDate,

        createdAt:
          Date.now(),
      };

    setTasks([
      newTask,
      ...tasks,
    ]);

    setTitle("");

    setPriority(
      "Medium"
    );

    setDueDate("");
  };

  const toggleTask = (
    id: string
  ) => {
    const target =
      tasks.find(
        (t) => t.id === id
      );

    if (
      target &&
      !target.completed
    ) {
      incrementTasks();
    }

    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed:
                !task.completed,
            }
          : task
      )
    );
  };

  const deleteTask = (
    id: string
  ) => {
    setTasks(
      tasks.filter(
        (task) =>
          task.id !== id
      )
    );
  };

  const filteredTasks =
    useMemo(() => {
      if (
        filter ===
        "Completed"
      ) {
        return tasks.filter(
          (t) =>
            t.completed
        );
      }

      if (
        filter ===
        "Active"
      ) {
        return tasks.filter(
          (t) =>
            !t.completed
        );
      }

      return tasks;
    }, [tasks, filter]);

  const completed =
    tasks.filter(
      (t) => t.completed
    ).length;

  const progress =
    tasks.length > 0
      ? Math.round(
          (completed /
            tasks.length) *
            100
        )
      : 0;

  const highPriority =
    tasks.filter(
      (t) =>
        t.priority ===
          "High" &&
        !t.completed
    ).length;

  const activeTasks =
    tasks.filter(
      (t) => !t.completed
    ).length;

  const aiSuggestion =
    highPriority > 0
      ? "Prioritize your high impact tasks first while your energy is high."
      : activeTasks > 4
      ? "You have multiple active tasks. Consider deep work batching."
      : "Your task load is balanced and manageable.";

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-white">

      <WorkspaceSidebar />

      <main
  className="
    relative
    flex-1
    overflow-y-auto
    pl-[88px]
    xl:pl-[280px]
    transition-all
    duration-300
  "
>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_25%)]" />

        <WorkspaceHeader />

        <div className="relative z-10 mx-auto max-w-[1800px] px-8 pb-10 pt-28">

          <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_45%)]" />

            <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />

                  Intelligent Task Workspace

                </div>

                <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight xl:text-6xl">

                  Focused

                  <br />

                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">

                    execution

                  </span>

                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400">

                  Organize priorities, manage execution and
                  build momentum with calm intelligent task management.

                </p>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl">

                  <p className="text-sm text-zinc-500">

                    Completion

                  </p>

                  <h2 className="mt-2 text-4xl font-black text-cyan-400">

                    {progress}%

                  </h2>

                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl">

                  <p className="text-sm text-zinc-500">

                    Active Tasks

                  </p>

                  <h2 className="mt-2 text-4xl font-black text-white">

                    {activeTasks}

                  </h2>

                </div>

              </div>

            </div>

          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr_420px]">

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl">

              <h2 className="text-2xl font-bold text-white">

                Create Task

              </h2>

              <div className="mt-6 space-y-4">

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  placeholder="Task title..."
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white outline-none placeholder:text-zinc-500 focus:border-purple-500/40"
                />

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(
                      e.target
                        .value as any
                    )
                  }
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white outline-none"
                >

                  <option value="Low">

                    Low Priority

                  </option>

                  <option value="Medium">

                    Medium Priority

                  </option>

                  <option value="High">

                    High Priority

                  </option>

                </select>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(
                      e.target.value
                    )
                  }
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white outline-none"
                />

                <button
                  onClick={() =>
                    createTask()
                  }
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 font-semibold text-white shadow-[0_0_40px_rgba(168,85,247,0.35)] transition hover:scale-[1.02]"
                >

                  <Plus className="h-5 w-5" />

                  Create Task

                </button>

              </div>

            </div>

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                {[
                  "All",
                  "Active",
                  "Completed",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setFilter(
                        item as any
                      )
                    }
                    className={`rounded-2xl border px-5 py-2 text-sm transition ${
                      filter === item
                        ? "border-purple-500/40 bg-purple-500/20 text-white"
                        : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                    }`}
                  >

                    {item}

                  </button>
                ))}

              </div>

              {filteredTasks.map(
                (
                  task,
                  index
                ) => (
                  <motion.div
                    key={task.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.05,
                    }}
                    className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl transition hover:border-purple-500/20"
                  >

                    <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_40%)]" />

                    <div className="relative flex items-start justify-between gap-5">

                      <div className="flex items-start gap-4">

                        <button
                          onClick={() =>
                            toggleTask(
                              task.id
                            )
                          }
                          className="mt-1"
                        >

                          {task.completed ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                          ) : (
                            <Circle className="h-6 w-6 text-zinc-500 transition hover:text-white" />
                          )}

                        </button>

                        <div>

                          <h3
                            className={`text-xl font-semibold ${
                              task.completed
                                ? "text-zinc-500 line-through"
                                : "text-white"
                            }`}
                          >

                            {task.title}

                          </h3>

                          <div className="mt-4 flex flex-wrap items-center gap-3">

                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">

                              <Flag className="h-3 w-3" />

                              {
                                task.priority
                              }

                            </div>

                            {task.dueDate && (
                              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">

                                <CalendarDays className="h-3 w-3" />

                                {
                                  task.dueDate
                                }

                              </div>
                            )}

                          </div>

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          deleteTask(
                            task.id
                          )
                        }
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-zinc-500 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                      >

                        <Trash2 className="h-4 w-4" />

                      </button>

                    </div>

                  </motion.div>
                )
              )}

              {filteredTasks.length ===
                0 && (
                <div className="flex min-h-[400px] items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] text-zinc-500">

                  No tasks found

                </div>
              )}

            </div>

            <div className="space-y-6">

              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20">

                    <BrainCircuit className="h-6 w-6 text-purple-300" />

                  </div>

                  <div>

                    <h3 className="text-xl font-bold">

                      AI Insights

                    </h3>

                    <p className="text-sm text-zinc-500">

                      Adaptive task intelligence

                    </p>

                  </div>

                </div>

                <div className="mt-6 grid gap-4">

                  <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5">

                    <div className="flex items-center justify-between">

                      <p className="text-sm text-cyan-200">

                        Productivity

                      </p>

                      <Zap className="h-5 w-5 text-cyan-300" />

                    </div>

                    <h4 className="mt-4 text-3xl font-black text-cyan-300">

                      Stable

                    </h4>

                  </div>

                  <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-5">

                    <div className="flex items-center justify-between">

                      <p className="text-sm text-purple-200">

                        Deep Focus

                      </p>

                      <Flame className="h-5 w-5 text-pink-300" />

                    </div>

                    <h4 className="mt-4 text-3xl font-black text-pink-300">

                      {highPriority}

                    </h4>

                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-5">

                    <div className="flex items-center justify-between">

                      <p className="text-sm text-zinc-400">

                        Momentum

                      </p>

                      <Clock3 className="h-5 w-5 text-zinc-400" />

                    </div>

                    <h4 className="mt-4 text-3xl font-black text-white">

                      {completed}

                    </h4>

                  </div>

                </div>

              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl">

                <h3 className="text-xl font-bold text-white">

                  AI Recommendation

                </h3>

                <p className="mt-5 leading-relaxed text-zinc-400">

                  {aiSuggestion}

                </p>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default TasksPage;