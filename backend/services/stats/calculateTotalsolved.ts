import { Submission } from "./types";

export function getTotalSolved(submissions: Submission[]): number {
    const solved = new Set<string>();

    for (const sub of submissions) {
        if (sub.verdict !== "OK") continue;

        solved.add(`${sub.platform}:${sub.problemID}`);
    }

    return solved.size;
}

export function getLCSolved(submissions: Submission[]): number {
    const solved = new Set<string>();

    for (const sub of submissions) {
        if (sub.verdict !== "OK" || sub.platform !== "leetcode") continue;

        solved.add(sub.problemID);
    }

    return solved.size;
}

export function getCFSolved(submissions: Submission[]): number {
    const solved = new Set<string>();

    for (const sub of submissions) {
        if (sub.verdict !== "OK" || sub.platform !== "codeforces") continue;

        solved.add(sub.problemID);
    }

    return solved.size;
}