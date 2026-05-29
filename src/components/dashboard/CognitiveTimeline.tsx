import {
  Brain,
  Coffee,
  Sparkles,
  CheckCircle2,
  Flame,
} from "lucide-react";

const events = [
  {
    time: "09:00",
    title: "Focus Session Started",
    description:
      "Entered deep work mode",
    icon: Brain,
    color:
      "from-purple-500 to-pink-500",
  },

  {
    time: "10:15",
    title: "Short Break",
    description:
      "5 minute recovery reset",
    icon: Coffee,
    color:
      "from-cyan-500 to-blue-500",
  },

  {
    time: "10:30",
    title: "AI Planning",
    description:
      "Generated productivity roadmap",
    icon: Sparkles,
    color:
      "from-pink-500 to-cyan-500",
  },

  {
    time: "12:10",
    title: "Task Completed",
    description:
      "Completed dashboard redesign",
    icon: CheckCircle2,
    color:
      "from-emerald-500 to-green-500",
  },

  {
    time: "13:00",
    title: "Deep Flow State",
    description:
      "Peak concentration detected",
    icon: Flame,
    color:
      "from-orange-500 to-pink-500",
  },
];

export default function CognitiveTimeline() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-3xl">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-xl font-semibold text-white">

            Today’s Cognitive Timeline

          </h3>

          <p className="mt-1 text-sm text-zinc-500">

            Real-time focus activity and momentum

          </p>

        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-400">

          Live Feed

        </div>

      </div>

      <div className="relative mt-10">

        <div className="absolute left-[22px] top-0 h-full w-px bg-gradient-to-b from-purple-500/50 via-cyan-500/30 to-transparent" />

        <div className="space-y-8">

          {events.map(
            (
              event,
              index
            ) => {
              const Icon =
                event.icon;

              return (
                <div
                  key={index}
                  className="relative flex gap-5"
                >

                  <div
                    className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${event.color} shadow-lg`}
                  >

                    <Icon className="h-5 w-5 text-white" />

                  </div>

                  <div className="flex-1">

                    <div className="flex items-center justify-between">

                      <h4 className="text-sm font-semibold text-white">

                        {event.title}

                      </h4>

                      <span className="text-xs text-zinc-500">

                        {event.time}

                      </span>

                    </div>

                    <p className="mt-1 text-sm text-zinc-500">

                      {
                        event.description
                      }

                    </p>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}