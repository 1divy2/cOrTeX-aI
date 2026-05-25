import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    subject: "Focus",
    A: 92,
  },

  {
    subject: "Deep Work",
    A: 88,
  },

  {
    subject: "Consistency",
    A: 81,
  },

  {
    subject: "Recovery",
    A: 74,
  },

  {
    subject: "AI Usage",
    A: 96,
  },

  {
    subject: "Tasks",
    A: 84,
  },

  {
    subject: "Flow State",
    A: 91,
  },

  {
    subject: "Distraction",
    A: 69,
  },
];

export default function CognitiveRadar() {
  return (
    <div className="overflow-hidden rounded-[40px] border border-white/10 bg-[#080812]/90 p-8 backdrop-blur-3xl">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-black text-white">

            Cognitive Performance Radar

          </h2>

          <p className="mt-2 text-sm text-zinc-500">

            Real-time neural productivity analytics

          </p>

        </div>

        <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-300">

          LIVE ANALYSIS

        </div>

      </div>

      <div className="mt-10 h-[650px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <RadarChart
            data={data}
          >

            <PolarGrid
              stroke="rgba(255,255,255,0.08)"
            />

            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill:
                  "#a1a1aa",
                fontSize: 13,
              }}
            />

            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{
                fill:
                  "#71717a",
              }}
            />

            <Radar
              name="Focus"
              dataKey="A"
              stroke="#22d3ee"
              fill="#a855f7"
              fillOpacity={0.55}
            />

          </RadarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}