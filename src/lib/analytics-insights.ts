export type AIInsight = {
  type:
    | "success"
    | "warning"
    | "info";

  title: string;

  description: string;
};

type GenerateInsightsParams =
  {
    sessions: any[];

    analytics: any;

    notesCount: number;
  };

export function generateInsights({
  sessions,
  analytics,
  notesCount,
}: GenerateInsightsParams): AIInsight[] {

  const insights: AIInsight[] =
    [];

  if (
    !sessions ||
    sessions.length === 0
  ) {
    return [
      {
        type: "info",

        title:
          "No Productivity Data Yet",

        description:
          "Complete focus sessions to unlock adaptive AI intelligence.",
      },
    ];
  }

  const sortedSessions =
    [...sessions].sort(
      (a, b) =>
        b.endedAt -
        a.endedAt
    );

  const totalSessions =
    sortedSessions.length;

  const averageRating =
    sortedSessions.reduce(
      (
        acc,
        session
      ) =>
        acc +
        session.rating,
      0
    ) / totalSessions;

  const recentSessions =
    sortedSessions.slice(
      0,
      5
    );

  const recentAverage =
    recentSessions.reduce(
      (
        acc,
        session
      ) =>
        acc +
        session.rating,
      0
    ) /
    Math.max(
      1,
      recentSessions.length
    );

  if (
    recentAverage >
    averageRating
  ) {
    insights.push({
      type: "success",

      title:
        "Focus Momentum Rising",

      description:
        "Your recent sessions are outperforming your historical average. Cognitive consistency is improving.",
    });
  }

  const eveningSessions =
    sortedSessions.filter(
      (
        session
      ) => {
        const hour =
          new Date(
            session.endedAt
          ).getHours();

        return (
          hour >= 18 &&
          hour <= 23
        );
      }
    );

  const morningSessions =
    sortedSessions.filter(
      (
        session
      ) => {
        const hour =
          new Date(
            session.endedAt
          ).getHours();

        return (
          hour >= 6 &&
          hour <= 11
        );
      }
    );

  if (
    eveningSessions.length >
    morningSessions.length
  ) {
    insights.push({
      type: "info",

      title:
        "Peak Performance Window",

      description:
        "Your strongest focus patterns consistently occur during evening hours.",
    });
  }

  const lowRatedSessions =
    sortedSessions.filter(
      (
        session
      ) =>
        session.rating <=
        4
    );

  if (
    lowRatedSessions.length >=
    3
  ) {
    insights.push({
      type: "warning",

      title:
        "Potential Burnout Pattern",

      description:
        "Multiple low-focus sessions detected. Recovery and shorter deep work cycles may help.",
    });
  }

  if (
    analytics.streak >=
    5
  ) {
    insights.push({
      type: "success",

      title:
        "Consistency Locked In",

      description:
        `You maintained productive activity for ${analytics.streak} consecutive days.`,
    });
  }

  const peakDayMap =
    new Map<
      string,
      number
    >();

  sortedSessions.forEach(
    (
      session
    ) => {
      const day =
        new Date(
          session.endedAt
        ).toLocaleDateString(
          "en-US",
          {
            weekday:
              "long",
          }
        );

      peakDayMap.set(
        day,
        (peakDayMap.get(
          day
        ) || 0) + 1
      );
    }
  );

  let peakDay =
    "";

  let peakCount = 0;

  peakDayMap.forEach(
    (
      count,
      day
    ) => {
      if (
        count >
        peakCount
      ) {
        peakCount =
          count;

        peakDay = day;
      }
    }
  );

  if (peakDay) {
    insights.push({
      type: "info",

      title:
        "Peak Deep Work Day",

      description:
        `${peakDay} currently generates your highest focus output.`,
    });
  }

  if (
    analytics.totalFocusHours >=
    10
  ) {
    insights.push({
      type: "success",

      title:
        "Deep Work Capacity Expanding",

      description:
        `You have accumulated ${analytics.totalFocusHours.toFixed(
          1
        )} hours of focused work.`,
    });
  }

  if (
    notesCount > 0
  ) {
    insights.push({
      type: "info",

      title:
        "Knowledge System Growing",

      description:
        `${notesCount} knowledge nodes are actively connected to your productivity flow.`,
    });
  }

  if (
    analytics.momentum <
    35
  ) {
    insights.push({
      type: "warning",

      title:
        "Momentum Needs Recovery",

      description:
        "Recent session intensity is lower than your average behavioral pattern.",
    });
  }

  return insights.slice(
    0,
    4
  );
}