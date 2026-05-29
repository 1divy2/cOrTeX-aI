export type SessionRating =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8;

export type FocusSession = {
  id: string;

  startedAt: number;

  endedAt: number;

  duration: number;

  rating: SessionRating;
};

export type AnalyticsData = {
  totalSessions: number;

  totalFocusHours: number;

  averageSessionMinutes: number;

  productivityScore: number;

  momentum: number;

  neuralScore: number;

  streak: number;

  peakDay: string;

  peakHour: number;

  sessionDensity: number;

  consistencyScore: number;

  burnoutRisk: number;

  focusDistribution: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };

  weeklyTrend: {
    day: string;
    hours: number;
  }[];

  velocityTrend: number[];

  heatmap: {
    date: string;
    sessions: number;
    minutes: number;
  }[];

  peakHoursMap: {
    hour: number;
    sessions: number;
  }[];
};

const DAY_NAMES = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export function generateAnalytics(
  sessions: FocusSession[]
): AnalyticsData {
  if (!sessions.length) {
    return {
      totalSessions: 0,
      totalFocusHours: 0,
      averageSessionMinutes: 0,
      productivityScore: 0,
      momentum: 0,
      neuralScore: 0,
      streak: 0,
      peakDay: "None",
      peakHour: 0,
      sessionDensity: 0,
      consistencyScore: 0,
      burnoutRisk: 0,
      focusDistribution: {
        morning: 0,
        afternoon: 0,
        evening: 0,
        night: 0,
      },
      weeklyTrend: [],
      velocityTrend: [],
      heatmap: [],
      peakHoursMap: [],
    };
  }

  const sortedSessions =
    [...sessions].sort(
      (a, b) =>
        a.startedAt -
        b.startedAt
    );

  const totalMinutes =
    sessions.reduce(
      (acc, session) =>
        acc +
        session.duration /
          60,
      0
    );

  const totalHours =
    totalMinutes / 60;

  const averageSessionMinutes =
    totalMinutes /
    sessions.length;

  const productivityScore =
    Math.min(
      100,
      Math.round(
        sessions.reduce(
          (
            acc,
            session
          ) =>
            acc +
            session.rating *
              12,
          0
        ) /
          sessions.length
      )
    );

  const uniqueDays =
    new Set(
      sessions.map(
        (session) =>
          new Date(
            session.endedAt
          )
            .toISOString()
            .split(
              "T"
            )[0]
      )
    );

  let streak = 0;

  for (
    let i = 0;
    i < 365;
    i++
  ) {
    const date =
      new Date();

    date.setDate(
      date.getDate() -
        i
    );

    const key =
      date
        .toISOString()
        .split(
          "T"
        )[0];

    if (
      uniqueDays.has(
        key
      )
    ) {
      streak++;
    } else {
      break;
    }
  }

  const sessionsByDay =
    new Map<
      string,
      number
    >();

  sessions.forEach(
    (session) => {
      const day =
        DAY_NAMES[
          new Date(
            session.startedAt
          ).getDay()
        ];

      const current =
        sessionsByDay.get(
          day
        ) || 0;

      sessionsByDay.set(
        day,
        current +
          session.duration /
            3600
      );
    }
  );

  let peakDay =
    "None";

  let peakHours =
    0;

  sessionsByDay.forEach(
    (
      hours,
      day
    ) => {
      if (
        hours >
        peakHours
      ) {
        peakHours =
          hours;

        peakDay = day;
      }
    }
  );

  const focusDistribution =
    {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };

  sessions.forEach(
    (session) => {
      const hour =
        new Date(
          session.startedAt
        ).getHours();

      if (
        hour >= 5 &&
        hour < 12
      ) {
        focusDistribution.morning +=
          session.duration /
          60;
      } else if (
        hour >= 12 &&
        hour < 17
      ) {
        focusDistribution.afternoon +=
          session.duration /
          60;
      } else if (
        hour >= 17 &&
        hour < 22
      ) {
        focusDistribution.evening +=
          session.duration /
          60;
      } else {
        focusDistribution.night +=
          session.duration /
          60;
      }
    }
  );

  const distributionTotal =
    Object.values(
      focusDistribution
    ).reduce(
      (
        a,
        b
      ) => a + b,
      0
    );

  Object.keys(
    focusDistribution
  ).forEach(
    (key) => {
      focusDistribution[
        key as keyof typeof focusDistribution
      ] =
        Math.round(
          (focusDistribution[
            key as keyof typeof focusDistribution
          ] /
            distributionTotal) *
            100
        );
    }
  );

  const weeklyTrend =
    DAY_NAMES.map(
      (day) => ({
        day,
        hours:
          Number(
            (
              sessionsByDay.get(
                day
              ) || 0
            ).toFixed(
              1
            )
          ),
      })
    );

  const velocityTrend =
    sessions
      .slice(-7)
      .map(
        (
          session
        ) =>
          Math.round(
            session.rating *
              12
          )
      );

  const hourlyMap =
    Array.from(
      {
        length: 24,
      },
      (
        _,
        hour
      ) => ({
        hour,
        sessions: 0,
      })
    );

  sessions.forEach(
    (session) => {
      const hour =
        new Date(
          session.startedAt
        ).getHours();

      hourlyMap[
        hour
      ].sessions += 1;
    }
  );

  let peakHour =
    0;

  let peakHourSessions =
    0;

  hourlyMap.forEach(
    (
      entry
    ) => {
      if (
        entry.sessions >
        peakHourSessions
      ) {
        peakHourSessions =
          entry.sessions;

        peakHour =
          entry.hour;
      }
    }
  );

  const heatmapMap =
    new Map<
      string,
      {
        sessions: number;
        minutes: number;
      }
    >();

  sessions.forEach(
    (session) => {
      const date =
        new Date(
          session.endedAt
        )
          .toISOString()
          .split(
            "T"
          )[0];

      const current =
        heatmapMap.get(
          date
        ) || {
          sessions: 0,
          minutes: 0,
        };

      heatmapMap.set(
        date,
        {
          sessions:
            current.sessions +
            1,
          minutes:
            current.minutes +
            Math.round(
              session.duration /
                60
            ),
        }
      );
    }
  );

  const heatmap =
    Array.from(
      heatmapMap.entries()
    ).map(
      ([
        date,
        value,
      ]) => ({
        date,
        sessions:
          value.sessions,
        minutes:
          value.minutes,
      })
    );

  const momentum =
    Math.min(
      100,
      Math.round(
        productivityScore *
          0.7 +
          streak * 5
      )
    );

  const consistencyScore =
    Math.min(
      100,
      Math.round(
        (uniqueDays.size /
          7) *
          100
      )
    );

  const burnoutRisk =
    totalHours >
    40
      ? 80
      : totalHours >
          25
        ? 45
        : 15;

  const neuralScore =
    Math.min(
      100,
      Math.round(
        productivityScore *
          0.5 +
          momentum *
            0.3 +
          consistencyScore *
            0.2
      )
    );

  return {
    totalSessions:
      sessions.length,

    totalFocusHours:
      Number(
        totalHours.toFixed(
          1
        )
      ),

    averageSessionMinutes:
      Math.round(
        averageSessionMinutes
      ),

    productivityScore,

    momentum,

    neuralScore,

    streak,

    peakDay,

    peakHour,

    sessionDensity:
      sessions.length,

    consistencyScore,

    burnoutRisk,

    focusDistribution,

    weeklyTrend,

    velocityTrend,

    heatmap,

    peakHoursMap:
      hourlyMap,
  };
}