export type AIInsight = {
  type:
    | "success"
    | "warning"
    | "info";

  title: string;

  description: string;
};

export function generateInsights(
  sessions: any[],
  dailyAnalytics: any[]
): AIInsight[] {

  const insights: AIInsight[] =
    [];

  if (
    !sessions.length
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

  const totalSessions =
    sessions.length;

  const averageRating =
    sessions.reduce(
      (
        acc,
        session
      ) =>
        acc +
        session.rating,
      0
    ) / totalSessions;

  const recentSessions =
    sessions.slice(-5);

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
    sessions.filter(
      (
        session
      ) => {
        const hour =
          new Date(
            session.completedAt
          ).getHours();

        return (
          hour >= 18 &&
          hour <= 23
        );
      }
    );

  const morningSessions =
    sessions.filter(
      (
        session
      ) => {
        const hour =
          new Date(
            session.completedAt
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
    sessions.filter(
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
    dailyAnalytics.length >=
    5
  ) {
    const lastFive =
      dailyAnalytics.slice(
        -5
      );

    const consistency =
      lastFive.every(
        (
          day
        ) =>
          day.sessions >
          0
      );

    if (
      consistency
    ) {
      insights.push({
        type: "success",

        title:
          "Consistency Locked In",

        description:
          "You maintained productive activity for 5 consecutive tracked days.",
      });
    }
  }

  const peakDayMap =
    new Map<
      string,
      number
    >();

  sessions.forEach(
    (
      session
    ) => {
      const day =
        new Date(
          session.completedAt
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

  return insights.slice(
    0,
    4
  );
}