import { Submission } from "../stats/types"

interface UserInfo {
    username: string;
    lastSolvedID: number | null;
}

export const getSub = async ({
    username,
    lastSolvedID,
}: UserInfo): Promise<Submission[]> => {

    const limit = lastSolvedID ? 100 : 5000;

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
            // STOP fetching if we hit the submission we already recorded last time!
            if (lastSolvedID && sub.id === lastSolvedID) {
                break;
            }

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
