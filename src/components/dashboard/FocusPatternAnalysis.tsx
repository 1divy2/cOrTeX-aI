import {
  Brain,
  Flame,
  Clock3,
  Zap,
} from "lucide-react";

const insights = [
  {
    icon: Flame,
    title: "Peak Focus Hour",
    value: "10 AM - 12 PM",
    description:
      "Your concentration is strongest during late morning sessions.",
    color:
      "from-orange-500 to-pink-500",
  },

  {
    icon: Clock3,
    title: "Longest Deep Work",
    value: "2h 45m",
    description:
      "Your best uninterrupted session this week.",
    color:
      "from-cyan-500 to-blue-500",
  },

  {
    icon: Zap,
    title: "Distraction Recovery",
    value: "Excellent",
    description:
      "You regain focus quickly after interruptions.",
    color:
      "from-emerald-500 to-green-500",
  },

  {
    icon: Brain,
    title: "AI Recommendation",
    value: "Schedule harder tasks earlier",
    description:
      "Your productivity drops slightly after 3 PM.",
    color:
      "from-purple-500 to-pink-500",
  },
];

export default function FocusPatternAnalysis() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-3xl">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-xl font-semibold text-white">

            Focus Pattern Analysis

          </h3>

          <p className="mt-1 text-sm text-zinc-500">

            AI-generated productivity intelligence

          </p>

        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-400">

          Neural Insights

        </div>

      </div>

      <div className="mt-8 grid gap-4">

        {insights.map(
          (
            item,
            index
          ) => {
            const Icon =
              item.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-black/20 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30"
              >

                <div className="flex items-start gap-4">

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}
                  >

                    <Icon className="h-5 w-5 text-white" />

                  </div>

                  <div className="flex-1">

                    <div className="flex items-center justify-between gap-4">

                      <h4 className="text-sm font-semibold text-zinc-300">

                        {item.title}

                      </h4>

                      <span className="text-sm font-semibold text-white">

                        {item.value}

                      </span>

                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">

                      {
                        item.description
                      }

                    </p>

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}