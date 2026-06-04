import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import { useExecutionStore } from "@/store/execution-store";
import { motion } from "framer-motion";
import { Target, Plus, Folder, AlertCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects, addProject, fetchExecutionData } = useExecutionStore();
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchExecutionData();
  }, []);

  const handleAdd = () => {
    if (newTitle.trim()) {
      addProject(newTitle.trim(), "New Project Description", null);
      setNewTitle("");
      setShowNew(false);
    }
  };

  return (
    <WorkspaceShell>
      <div className="mx-auto w-full max-w-7xl p-8 flex flex-col flex-1 text-white selection:bg-purple-500/30">
        <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                <Target className="h-10 w-10 text-cyan-400" /> Projects
              </h1>
              <p className="text-zinc-400 mt-2">Manage your goals and active projects.</p>
            </div>
            <button 
              onClick={() => setShowNew(true)}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" /> New Project
            </button>
          </div>

          {showNew && (
            <div className="mb-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6 backdrop-blur-md">
              <h3 className="mb-4 text-lg font-bold text-cyan-400">Create New Project</h3>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Project Name..."
                  className="flex-1 rounded-xl bg-black/50 border border-white/10 px-4 py-2 outline-none focus:border-cyan-500 transition-colors"
                  autoFocus
                />
                <button onClick={handleAdd} className="bg-cyan-500 text-black px-6 font-bold rounded-xl hover:bg-cyan-400">Create</button>
                <button onClick={() => setShowNew(false)} className="bg-white/10 px-6 font-bold rounded-xl hover:bg-white/20">Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-xl flex flex-col hover:border-cyan-500/30 transition-colors group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                    <Folder className="h-6 w-6" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    project.status === 'active' ? 'bg-cyan-500/20 text-cyan-400' :
                    project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{project.name}</h2>
                <p className="text-sm text-zinc-500 flex-1 line-clamp-2">{project.description}</p>
                
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-xs text-zinc-400 mb-2">
                    <span>Project Health</span>
                    <span className="font-mono">{project.healthScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: `${project.healthScore}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && !showNew && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-cyan-500/10 p-6 text-cyan-400 mb-6">
                <Target className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No active projects</h2>
              <p className="text-zinc-500 max-w-md">Decompose your large goals into manageable projects to start tracking your execution.</p>
            </div>
          )}
      </div>
    </WorkspaceShell>
  );
}
