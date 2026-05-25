import {
  Brain,
  Sparkles,
  Activity,
  Zap,
  Orbit,
  Waves,
  Cpu,
  Flame,
} from "lucide-react";

const metrics = [
  {
    label: "Neural Stability",
    value: "94%",
    icon: Activity,
    color:
      "from-cyan-500 to-blue-500",
  },

  {
    label: "Focus Intensity",
    value: "HIGH",
    icon: Flame,
    color:
      "from-orange-500 to-pink-500",
  },

  {
    label: "Cognitive Sync",
    value: "ACTIVE",
    icon: Sparkles,
    color:
      "from-purple-500 to-pink-500",
  },

  {
    label: "Distraction Rate",
    value: "LOW",
    icon: Zap,
    color:
      "from-emerald-500 to-green-500",
  },
];

const logs = [
  "> Neural synchronization stable",
  "> Deep focus momentum increasing",
  "> Cognitive flow state detected",
  "> AI optimization running",
  "> Session energy stabilized",
];

export default function DeepFocusChamber() {
  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#080812]/90 p-8 backdrop-blur-3xl">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_25%)]" />

      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10">

        <div className="flex items-center justify-between">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300">

              <Cpu className="h-3.5 w-3.5 text-cyan-400" />

              Deep Focus Chamber

            </div>

            <h2 className="mt-5 text-4xl font-black tracking-tight text-white">

              Neural Core

            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">

              Real-time cognitive visualization and adaptive
              focus intelligence powered by corTeX.ai.

            </p>

          </div>

          <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">

            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

            Neural Systems Stable

          </div>

        </div>

        <div className="mt-14 flex flex-col items-center">

          <div className="relative flex h-[420px] w-[420px] items-center justify-center">

            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 blur-3xl animate-pulse" />

            <div className="absolute h-[400px] w-[400px] rounded-full border border-cyan-500/10 animate-spin [animation-duration:24s]" />

            <div className="absolute h-[330px] w-[330px] rounded-full border border-purple-500/10 animate-spin [animation-duration:18s] [animation-direction:reverse]" />

            <div className="absolute h-[260px] w-[260px] rounded-full border border-pink-500/10 animate-spin [animation-duration:12s]" />

            <div className="absolute h-[180px] w-[180px] rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_120px_rgba(168,85,247,0.55)]" />

            <div className="absolute flex flex-col items-center">

              <Brain className="h-14 w-14 text-white" />

              <p className="mt-4 text-xs uppercase tracking-[0.35em] text-zinc-300">

                Neural Reactor

              </p>

            </div>

            <FloatingNode
              icon={Orbit}
              label="Orbit"
              position="left-10 top-20"
              color="text-cyan-400"
            />

            <FloatingNode
              icon={Sparkles}
              label="AI Sync"
              position="right-10 top-24"
              color="text-pink-400"
            />

            <FloatingNode
              icon={Waves}
              label="Pulse"
              position="bottom-12 left-1/2 -translate-x-1/2"
              color="text-purple-400"
            />

            <FloatingNode
              icon={Zap}
              label="Energy"
              position="top-8 left-1/2 -translate-x-1/2"
              color="text-emerald-400"
            />

          </div>

        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">

          {metrics.map(
            (
              item,
              index
            ) => {
              const Icon =
                item.icon;

              return (
                <div
                  key={index}
                  className="group rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/20"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-sm text-zinc-500">

                        {item.label}

                      </p>

                      <h3 className="mt-2 text-3xl font-black text-white">

                        {item.value}

                      </h3>

                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}
                    >

                      <Icon className="h-5 w-5 text-white" />

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

        <div className="mt-8 rounded-[32px] border border-white/10 bg-black/20 p-6 backdrop-blur-xl">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-lg font-semibold text-white">

                Live Neural Feed

              </h3>

              <p className="mt-1 text-sm text-zinc-500">

                Adaptive cognitive system logs

              </p>

            </div>

            <div className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[10px] uppercase tracking-wide text-purple-300">

              LIVE

            </div>

          </div>

          <div className="mt-6 space-y-3">

            {logs.map(
              (
                log,
                index
              ) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 font-mono text-sm text-emerald-300"
                >

                  {log}

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

function FloatingNode({
  icon: Icon,
  label,
  position,
  color,
}: any) {
  return (
    <div
      className={`absolute ${position} flex flex-col items-center`}
    >

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl">

        <Icon className={`h-5 w-5 ${color}`} />

      </div>

      <span className="mt-2 text-[10px] uppercase tracking-wide text-zinc-500">

        {label}

      </span>

    </div>
  );
}