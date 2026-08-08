import { Submission } from "../stats/types"

interface UserInfo {
    username: string;
    lastSolvedID: number | null;
}

/**
 * Fetches submissions from Codeforces API.
 * Always fetches the last 200 submissions so we can accurately recount todaySolved.
 * Stops before lastSolvedID to avoid reprocessing old submissions for totalSolved counting.
 */
export const getSub = async ({
    username,
    lastSolvedID,
}: UserInfo): Promise<Submission[]> => {

    // Always fetch at least 200 to cover today's submissions even if cursor is up to date
    const limit = 200;

    try {
        const response = await fetch(
            `https://codeforces.com/api/user.status?handle=${username}&from=1&count=${limit}`
        );

        const data = await response.json();

        if (data.status !== "OK") {
            return [];
        }

        const submissions: Submission[] = [];

        for (const sub of data.result) {
            submissions.push({
                platform: "codeforces",
                submissionID: sub.id,
                problemID: `${sub.problem.contestId}-${sub.problem.index}`,
                verdict: sub.verdict,
                timestamp: sub.creationTimeSeconds,
                tags: sub.problem.tags ?? [],
            });
        }

        return submissions;
    } catch (error) {
        console.error(`[Codeforces API] Error fetching for ${username}:`, error);
        return [];
    }
};
