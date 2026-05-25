import {
  Brain,
  Activity,
  Flame,
  Sparkles,
  Zap,
  Radar,
  Waves,
  Cpu,
} from "lucide-react";

const insights = [
  {
    label: "Neural Stability",
    value: "92%",
    color:
      "from-cyan-500 to-blue-500",
  },

  {
    label: "Focus Momentum",
    value: "High",
    color:
      "from-purple-500 to-pink-500",
  },

  {
    label: "Cognitive Load",
    value: "Optimal",
    color:
      "from-emerald-500 to-green-500",
  },

  {
    label: "AI Synchronization",
    value: "Active",
    color:
      "from-orange-500 to-pink-500",
  },
];

const feed = [
  {
    icon: Sparkles,
    text:
      "AI detected peak productivity window approaching.",
    time: "now",
  },

  {
    icon: Flame,
    text:
      "Deep focus momentum increased by 18%.",
    time: "2m ago",
  },

  {
    icon: Activity,
    text:
      "Low distraction pattern observed.",
    time: "5m ago",
  },

  {
    icon: Zap,
    text:
      "Neural engagement levels stabilizing.",
    time: "8m ago",
  },
];

export default function NeuralCommandCenter() {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_25%)]" />

      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10">

        <div className="flex flex-col gap-8 xl:flex-row">

          <div className="flex-1">

            <div className="flex items-center justify-between">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

                  <Cpu className="h-3.5 w-3.5 text-cyan-400" />

                  Neural Core Active

                </div>

                <h2 className="mt-5 text-4xl font-black tracking-tight text-white">

                  Neural Command Center

                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">

                  Real-time cognitive synchronization and adaptive
                  productivity intelligence powered by corTeX.ai.

                </p>

              </div>

              <div className="hidden xl:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">

                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

                Systems Stable

              </div>

            </div>

            <div className="mt-10 flex flex-col items-center justify-center">

              <div className="relative flex h-[320px] w-[320px] items-center justify-center">

                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 blur-3xl animate-pulse" />

                <div className="absolute h-[290px] w-[290px] rounded-full border border-cyan-500/20 animate-spin [animation-duration:18s]" />

                <div className="absolute h-[240px] w-[240px] rounded-full border border-purple-500/20 animate-spin [animation-duration:14s] [animation-direction:reverse]" />

                <div className="absolute h-[190px] w-[190px] rounded-full border border-pink-500/20 animate-spin [animation-duration:10s]" />

                <div className="absolute h-[130px] w-[130px] rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_80px_rgba(168,85,247,0.45)]" />

                <div className="absolute flex flex-col items-center">

                  <Brain className="h-12 w-12 text-white" />

                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-zinc-300">

                    Neural Core

                  </p>

                </div>

                <div className="absolute left-0 top-1/2 flex -translate-y-1/2 flex-col items-center">

                  <Radar className="h-5 w-5 text-cyan-400" />

                  <span className="mt-2 text-[10px] text-zinc-500">

                    Scan

                  </span>

                </div>

                <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center">

                  <Zap className="h-5 w-5 text-pink-400" />

                  <span className="mt-2 text-[10px] text-zinc-500">

                    Sync

                  </span>

                </div>

                <div className="absolute bottom-0 flex flex-col items-center">

                  <Waves className="h-5 w-5 text-purple-400" />

                  <span className="mt-2 text-[10px] text-zinc-500">

                    Pulse

                  </span>

                </div>

              </div>

            </div>

          </div>

          <div className="w-full xl:w-[420px]">

            <div className="grid grid-cols-2 gap-4">

              {insights.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl"
                  >

                    <div
                      className={`h-2 w-full rounded-full bg-gradient-to-r ${item.color}`}
                    />

                    <p className="mt-5 text-sm text-zinc-500">

                      {item.label}

                    </p>

                    <h3 className="mt-2 text-2xl font-black text-white">

                      {item.value}

                    </h3>

                  </div>
                )
              )}

            </div>

            <div className="mt-6 rounded-[32px] border border-white/10 bg-black/20 p-6 backdrop-blur-xl">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-white">

                    Live Intelligence Feed

                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">

                    Adaptive neural activity

                  </p>

                </div>

                <div className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[10px] uppercase tracking-wide text-purple-300">

                  LIVE

                </div>

              </div>

              <div className="mt-6 space-y-4">

                {feed.map(
                  (
                    item,
                    index
                  ) => {
                    const Icon =
                      item.icon;

                    return (
                      <div
                        key={index}
                        className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-purple-500/20"
                      >

                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20">

                          <Icon className="h-4 w-4 text-white" />

                        </div>

                        <div className="flex-1">

                          <p className="text-sm leading-relaxed text-zinc-300">

                            {item.text}

                          </p>

                          <span className="mt-2 inline-block text-xs text-zinc-500">

                            {item.time}

                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}