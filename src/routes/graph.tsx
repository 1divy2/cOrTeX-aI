import { createFileRoute } from "@tanstack/react-router";

import {
  motion,
} from "framer-motion";

import {
  Brain,
  Network,
  Sparkles,
} from "lucide-react";

import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";

import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";

import {
  useNotesStore,
} from "@/store/notes-store";

export const Route =
  createFileRoute("/graph")({
    component: GraphPage,
  });

type GraphNode = {
  id: string;

  title: string;

  x: number;

  y: number;

  tags: string[];
};

type GraphEdge = {
  source: string;

  target: string;
};

function GraphPage() {
  const {
    notes,
  } =
    useNotesStore();

  const graphNodes: GraphNode[] =
    notes.map(
      (
        note,
        index
      ) => ({
        id: note.id,

        title: note.title,

        tags:
          note.tags || [],

        x:
          Math.cos(
            (index /
              Math.max(
                notes.length,
                1
              )) *
              Math.PI *
              2
          ) * 350,

        y:
          Math.sin(
            (index /
              Math.max(
                notes.length,
                1
              )) *
              Math.PI *
              2
          ) * 260,
      })
    );

  const graphEdges: GraphEdge[] =
    [];

  notes.forEach(
    (note) => {
      note.outgoingLinks?.forEach(
        (link) => {
          graphEdges.push({
            source:
              note.id,

            target:
              link.targetNoteId,
          });
        }
      );
    }
  );

  const getNodeById = (
    id: string
  ) =>
    graphNodes.find(
      (node) =>
        node.id === id
    );

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-white">

      <WorkspaceSidebar />

      <main className="relative flex-1 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_25%)]" />

        <WorkspaceHeader />

        <div className="relative z-10 h-screen overflow-hidden pt-24">

          <section className="pointer-events-none absolute left-8 top-8 z-20 max-w-md rounded-[36px] border border-white/10 bg-black/30 p-7 backdrop-blur-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

              <Sparkles className="h-3.5 w-3.5 text-purple-400" />

              Knowledge Intelligence

            </div>

            <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-tight">

              Knowledge

              <br />

              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">

                graph

              </span>

            </h1>

            <p className="mt-5 text-sm leading-relaxed text-zinc-400">

              Visualize connected thinking,
              note relationships and your
              evolving second-brain network.

            </p>

            <div className="mt-8 flex items-center gap-4">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">

                <p className="text-xs text-zinc-500">

                  Notes

                </p>

                <h3 className="mt-1 text-2xl font-black text-white">

                  {notes.length}

                </h3>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">

                <p className="text-xs text-zinc-500">

                  Connections

                </p>

                <h3 className="mt-1 text-2xl font-black text-white">

                  {
                    graphEdges.length
                  }

                </h3>

              </div>

            </div>

          </section>

          <div className="relative h-full w-full overflow-hidden">

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat:
                  Infinity,

                duration: 240,

                ease: "linear",
              }}
              className="absolute left-1/2 top-1/2 h-[1400px] w-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/5"
            />

            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                repeat:
                  Infinity,

                duration: 180,

                ease: "linear",
              }}
              className="absolute left-1/2 top-1/2 h-[1100px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/5"
            />

            <svg className="absolute inset-0 h-full w-full">

              {graphEdges.map(
                (
                  edge,
                  index
                ) => {
                  const source =
                    getNodeById(
                      edge.source
                    );

                  const target =
                    getNodeById(
                      edge.target
                    );

                  if (
                    !source ||
                    !target
                  ) {
                    return null;
                  }

                  return (
                    <motion.line
                      key={index}
                      initial={{
                        pathLength: 0,
                        opacity: 0,
                      }}
                      animate={{
                        pathLength: 1,
                        opacity: 1,
                      }}
                      transition={{
                        duration: 1.2,
                        delay:
                          index *
                          0.04,
                      }}
                      x1={
                        source.x +
                        window.innerWidth /
                          2
                      }
                      y1={
                        source.y +
                        window.innerHeight /
                          2
                      }
                      x2={
                        target.x +
                        window.innerWidth /
                          2
                      }
                      y2={
                        target.y +
                        window.innerHeight /
                          2
                      }
                      stroke="rgba(168,85,247,0.35)"
                      strokeWidth="1.5"
                    />
                  );
                }
              )}

            </svg>

            <div className="absolute inset-0">

              {graphNodes.map(
                (
                  node,
                  index
                ) => (
                  <motion.div
                    key={node.id}
                    initial={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay:
                        index *
                        0.05,
                    }}
                    whileHover={{
                      scale: 1.08,
                    }}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${node.x}px)`,

                      top: `calc(50% + ${node.y}px)`,
                    }}
                  >

                    <div className="group relative">

                      <motion.div
                        animate={{
                          scale: [
                            1,
                            1.08,
                            1,
                          ],
                        }}
                        transition={{
                          repeat:
                            Infinity,

                          duration:
                            4 +
                            index,

                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl"
                      />

                      <div className="relative flex min-w-[220px] items-start gap-4 rounded-[28px] border border-white/10 bg-black/40 p-5 shadow-[0_0_40px_rgba(168,85,247,0.16)] backdrop-blur-3xl transition duration-300 group-hover:border-purple-500/30">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_20px_rgba(168,85,247,0.35)]">

                          <Brain className="h-5 w-5 text-white" />

                        </div>

                        <div className="min-w-0 flex-1">

                          <h3 className="truncate text-sm font-bold text-white">

                            {node.title}

                          </h3>

                          <div className="mt-3 flex flex-wrap gap-2">

                            {node.tags
                              .slice(
                                0,
                                3
                              )
                              .map(
                                (
                                  tag
                                ) => (
                                  <span
                                    key={
                                      tag
                                    }
                                    className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-zinc-400"
                                  >

                                    #{tag}

                                  </span>
                                )
                              )}

                          </div>

                        </div>

                      </div>

                    </div>

                  </motion.div>
                )
              )}

            </div>

            {notes.length ===
              0 && (
              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-purple-500/10">

                    <Network className="h-12 w-12 text-purple-300" />

                  </div>

                  <h2 className="mt-8 text-4xl font-black text-white">

                    No graph data

                  </h2>

                  <p className="mt-3 text-zinc-500">

                    Create notes and connect them
                    to build your knowledge graph.

                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default GraphPage;