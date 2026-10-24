import { Submission } from "../stats/types"

interface UserInfo {
    username: string;
    lastSolvedID: number | null;
}

export const getSub = async ({
    username,
    lastSolvedID,
}: UserInfo): Promise<Submission[]> => {

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

export const getPreviousContest = async (): Promise<number> => {
    const res = await fetch(
        "https://codeforces.com/api/contest.list?gym=false"
    );

    const data = await res.json();

    if (data.status !== "OK") {
        throw new Error(data.comment ?? "Failed to fetch contests");
    }

    const finishedContests = data.result
        .filter((contest: any) => contest.phase === "FINISHED")
        .sort(
            (a: any, b: any) =>
                (b.startTimeSeconds ?? 0) - (a.startTimeSeconds ?? 0)
        );

    if (finishedContests.length === 0) {
        throw new Error("No finished contest found");
    }

    return finishedContests[0].id;
};