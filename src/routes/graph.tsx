import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Brain, Network, Sparkles, Plus, ZoomIn, ZoomOut, Target } from "lucide-react";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import { useNotesStore } from "@/store/notes-store";
import { useWorkspaceStore } from "@/store/workspace-store";
import { motion } from "framer-motion";

export const Route = createFileRoute("/graph")({
  component: GraphPage,
});

function GraphPage() {
  const { notes } = useNotesStore();
  const [ForceGraph2D, setForceGraph2D] = useState<any>(null);
  const graphRef = useRef<any>();
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic import to prevent SSR crashes
  useEffect(() => {
    import("react-force-graph-2d").then((mod) => {
      setForceGraph2D(() => mod.default || mod.ForceGraph2D);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setWindowSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    
    window.addEventListener("resize", updateSize);
    updateSize();
    
    // Give time for layout to settle
    const timeout = setTimeout(updateSize, 100);
    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(timeout);
    };
  }, []);

  const graphData = useMemo(() => {
    const nodes = notes.map((note) => ({
      id: note.id,
      name: note.title,
      val: Math.max((note.wordCount || 100) / 100, 1) * 3,
      color: note.category === 'Research' ? '#a855f7' : (note.category === 'Personal' ? '#22d3ee' : '#ec4899'),
      tags: note.tags || []
    }));

    const links: any[] = [];
    notes.forEach((note) => {
      note.outgoingLinks?.forEach((link) => {
        // Ensure target exists
        if (notes.find(n => n.id === link.targetNoteId)) {
          links.push({
            source: note.id,
            target: link.targetNoteId,
            color: 'rgba(168,85,247,0.4)',
            width: 1.5
          });
        }
      });
    });

    return { nodes, links };
  }, [notes]);

  const handleNodeClick = useCallback((node: any) => {
    // Zoom to node
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(4, 2000);
    }
  }, []);

  const handleRecenter = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(800, 50);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-white">
      <WorkspaceSidebar />
      <motion.main
        animate={{ marginLeft: useWorkspaceStore().sidebarCollapsed ? 96 : 280 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-1 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.08),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_25%)]" />
        <WorkspaceHeader />
        
        <div className="relative z-10 h-screen overflow-hidden pt-16 flex flex-col">
          <section className="pointer-events-none absolute left-6 right-6 top-20 z-20 flex items-center justify-between rounded-[24px] border border-white/10 bg-black/40 px-6 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  Knowledge <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">Graph V2</span>
                </h1>
                <p className="text-xs text-zinc-400 mt-1">Interactive Second Brain</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Nodes</p>
                <h3 className="text-sm font-black text-white">{notes.length}</h3>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Connections</p>
                <h3 className="text-sm font-black text-white">{graphData.links.length}</h3>
              </div>
            </div>
          </section>

          <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-2">
            <button 
              onClick={handleRecenter}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/10"
            >
              <Target className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex-1 w-full h-full" ref={containerRef}>
            {notes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-purple-500/10">
                    <Network className="h-10 w-10 text-purple-300" />
                  </div>
                  <h2 className="mt-6 text-3xl font-black text-white">No knowledge yet</h2>
                  <p className="mt-2 text-zinc-500">Create notes and link them to build your graph.</p>
                </div>
              </div>
            ) : !ForceGraph2D ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
              </div>
            ) : (
              <div className="absolute inset-0 cursor-move">
                <ForceGraph2D
                  ref={graphRef}
                  width={windowSize.width}
                  height={windowSize.height}
                  graphData={graphData}
                  nodeLabel="name"
                  nodeColor="color"
                  nodeRelSize={6}
                  linkColor="color"
                  linkWidth="width"
                  onNodeClick={handleNodeClick}
                  d3VelocityDecay={0.3}
                  backgroundColor="transparent"
                  nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
                    const nodeSize = node.val || 4;

                    // Draw glow
                    ctx.shadowColor = node.color;
                    ctx.shadowBlur = 20;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
                    ctx.fillStyle = node.color || '#a855f7';
                    ctx.fill();
                    
                    // Reset shadow for text
                    ctx.shadowBlur = 0;

                    const label = node.name || 'Untitled';
                    const fontSize = Math.max(14 / globalScale, 3);
                    ctx.font = `600 ${fontSize}px Inter, sans-serif`;
                    const textWidth = ctx.measureText(label).width;
                    
                    // Pill background
                    const paddingX = fontSize * 0.8;
                    const paddingY = fontSize * 0.5;
                    const bckgW = textWidth + paddingX * 2;
                    const bckgH = fontSize + paddingY * 2;
                    const bgY = node.y + nodeSize + fontSize;
                    
                    // Border for pill
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.lineWidth = 1 / globalScale;
                    
                    ctx.fillStyle = 'rgba(9, 9, 11, 0.9)'; // Dark zinc background
                    ctx.beginPath();
                    if (ctx.roundRect) {
                      ctx.roundRect(node.x - bckgW / 2, bgY - bckgH / 2, bckgW, bckgH, bckgH / 2);
                    } else {
                      ctx.rect(node.x - bckgW / 2, bgY - bckgH / 2, bckgW, bckgH);
                    }
                    ctx.fill();
                    ctx.stroke();

                    // Text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                    ctx.fillText(label, node.x, bgY);
                  }}
                  nodePointerAreaPaint={(node: any, color: string, ctx: any) => {
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, (node.val || 4) + 10, 0, 2 * Math.PI, false);
                    ctx.fill();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}

export default GraphPage;