import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Plus, Sparkles, Trash2, CalendarDays, Flag, BrainCircuit, Flame, Zap, Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import { useProductivityStore } from "@/store/productivity-store";
import { useWorkspaceStore } from "@/store/workspace-store";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  createdAt: number;
};

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Completed">("All");

  const { incrementTasks } = useProductivityStore();
  const { sidebarCollapsed } = useWorkspaceStore();

  useEffect(() => {
    const stored = localStorage.getItem("tasks-storage");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks-storage", JSON.stringify(tasks));
  }, [tasks]);

  const createTask = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      priority,
      dueDate,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setTitle("");
    setPriority("Medium");
    setDueDate("");
  };

  const toggleTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (target && !target.completed) {
      incrementTasks();
    }
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = useMemo(() => {
    if (filter === "Completed") return tasks.filter((t) => t.completed);
    if (filter === "Active") return tasks.filter((t) => !t.completed);
    return tasks;
  }, [tasks, filter]);

  const completed = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const highPriority = tasks.filter((t) => t.priority === "High" && !t.completed).length;
  const activeTasks = tasks.filter((t) => !t.completed).length;

  const aiSuggestion =
    highPriority > 0
      ? "Prioritize your high impact tasks first while your energy is high."
      : activeTasks > 4
      ? "You have multiple active tasks. Consider deep work batching."
      : "Your task load is balanced and manageable.";

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      <WorkspaceSidebar />
      <motion.main
        animate={{ paddingLeft: sidebarCollapsed ? 96 : 280 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-1 overflow-y-auto"
      >
        <WorkspaceHeader />
        <div className="relative z-10 mx-auto max-w-[1800px] px-8 pb-10 pt-28">
          <section className="relative overflow-hidden paper-panel rounded-[24px] border border-border p-8 transition-colors duration-500">
            <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Intelligent Task Workspace
                </div>
                <h1 className="mt-6 text-5xl font-display font-bold leading-[1.1] tracking-tight xl:text-6xl text-foreground">
                  Focused <span className="text-accent italic">execution</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  Organize priorities, manage execution and build momentum with calm intelligent task management.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-background p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Completion</p>
                  <h2 className="mt-2 text-4xl font-display font-bold text-accent">{progress}%</h2>
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Tasks</p>
                  <h2 className="mt-2 text-4xl font-display font-bold text-foreground">{activeTasks}</h2>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr_420px]">
            <div className="paper-panel rounded-[24px] border border-border p-6 transition-colors duration-500">
              <h2 className="text-xl font-bold text-foreground">Create Task</h2>
              <div className="mt-6 space-y-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title..."
                  className="h-12 w-full rounded-xl border border-border bg-secondary px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent"
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="h-12 w-full rounded-xl border border-border bg-secondary px-4 text-sm text-foreground outline-none focus:border-accent"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-secondary px-4 text-sm text-foreground outline-none focus:border-accent"
                />
                <button
                  onClick={() => createTask()}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground font-bold text-background shadow-sm transition-all hover:bg-accent hover:scale-[1.02] hover:text-white"
                >
                  <Plus className="h-5 w-5" />
                  Create Task
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {["All", "Active", "Completed"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item as any)}
                    className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors ${
                      filter === item
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-secondary text-muted-foreground hover:bg-background"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative overflow-hidden rounded-[20px] border p-6 transition-all duration-200 ${
                    task.completed
                      ? "border-border bg-background/50 opacity-60"
                      : "border-border bg-background hover:border-accent/50 hover:bg-secondary/30"
                  }`}
                >
                  <div className="relative flex items-start justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <button onClick={() => toggleTask(task.id)} className="mt-1">
                        {task.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-accent" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground transition hover:text-foreground" />
                        )}
                      </button>
                      <div>
                        <h3
                          className={`text-lg font-bold ${
                            task.completed ? "text-muted-foreground line-through" : "text-foreground"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1">
                            <Flag className="h-3 w-3" />
                            {task.priority}
                          </div>
                          {task.dueDate && (
                            <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1">
                              <CalendarDays className="h-3 w-3" />
                              {task.dueDate}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-xl border border-border bg-background p-2.5 text-muted-foreground transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {filteredTasks.length === 0 && (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-secondary/50 text-center p-8 transition-colors">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background border border-border shadow-sm mb-4">
                    <Flag className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">No tasks in your inbox</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">Capture your thoughts and clear your mind. Add a task on the left to start building your execution momentum.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="paper-panel rounded-[24px] border border-border p-6 transition-colors duration-500">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border">
                    <BrainCircuit className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">AI Insights</h3>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Adaptive intelligence</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-[20px] border border-border bg-secondary p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Productivity</p>
                      <Zap className="h-4 w-4 text-accent" />
                    </div>
                    <h4 className="mt-3 text-2xl font-display font-bold text-foreground">Stable</h4>
                  </div>
                  <div className="rounded-[20px] border border-border bg-secondary p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Deep Focus</p>
                      <Flame className="h-4 w-4 text-accent" />
                    </div>
                    <h4 className="mt-3 text-2xl font-display font-bold text-foreground">{highPriority}</h4>
                  </div>
                  <div className="rounded-[20px] border border-border bg-secondary p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Momentum</p>
                      <Clock3 className="h-4 w-4 text-accent" />
                    </div>
                    <h4 className="mt-3 text-2xl font-display font-bold text-foreground">{completed}</h4>
                  </div>
                </div>
              </div>

              <div className="paper-panel rounded-[24px] border border-border p-6 transition-colors duration-500">
                <h3 className="text-xl font-bold text-foreground">AI Recommendation</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{aiSuggestion}</p>
              </div>
            </div>
          </section>
        </div>
      </motion.main>
    </div>
  );
}

export default TasksPage;