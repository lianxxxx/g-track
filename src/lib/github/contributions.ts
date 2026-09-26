import type { Octokit } from "@octokit/rest";
import { z } from "zod";

/** One day of the user's GitHub contribution calendar. */
export type ContributionDay = { day: string; count: number };

/**
 * The same data as the contribution graph on a GitHub profile: the last year of
 * daily counts. Private contributions are included (as counts only, no repo
 * detail) when the user has "Include private contributions on my profile" on,
 * so it works with the default read:user scope.
 */
const CALENDAR_QUERY = `
  query {
    viewer {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

/** GraphQL responses have no generated types, so the fields we read are validated. */
const calendarResponse = z.object({
  viewer: z.object({
    contributionsCollection: z.object({
      contributionCalendar: z.object({
        weeks: z.array(
          z.object({
            contributionDays: z.array(
              z.object({
                date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
                contributionCount: z.number().int().nonnegative(),
              }),
            ),
          }),
        ),
      }),
    }),
  }),
});

/** Fetch the signed-in user's contribution calendar for the last year. */
export async function fetchContributionCalendar(
  octokit: Octokit,
): Promise<ContributionDay[]> {
  const response = calendarResponse.parse(await octokit.graphql(CALENDAR_QUERY));

  return response.viewer.contributionsCollection.contributionCalendar.weeks.flatMap(
    (week) =>
      week.contributionDays.map((day) => ({
        day: day.date,
        count: day.contributionCount,
      })),
  );
}
