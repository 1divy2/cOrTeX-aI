type Note = {
  title?: string;

  plainText?: string;

  tags?: string[];

  category?: string;

  archived?: boolean;
};

export function retrieveRelevantNotes(
  notes: Note[],
  query: string
) {
  const search =
    query.toLowerCase();

  const queryTerms =
    search
      .split(/\s+/)
      .filter(Boolean);

  return notes
    .filter(
      (note) =>
        note &&
        !note.archived
    )
    .map(
      (note) => {
        const title =
          (
            note.title ||
            ""
          ).toLowerCase();

        const content =
          (
            note.plainText ||
            ""
          ).toLowerCase();

        const tags =
          (
            note.tags ||
            []
          )
            .join(" ")
            .toLowerCase();

        let score = 0;

        queryTerms.forEach(
          (term) => {
            if (
              title.includes(
                term
              )
            )
              score += 8;

            if (
              tags.includes(
                term
              )
            )
              score += 6;

            if (
              content.includes(
                term
              )
            )
              score += 3;
          }
        );

        return {
          note,
          score,
        };
      }
    )
    .filter(
      (
        item
      ) => item.score > 0
    )
    .sort(
      (
        a,
        b
      ) =>
        b.score -
        a.score
    )
    .slice(0, 5)
    .map(
      (
        item
      ) => item.note
    );
}