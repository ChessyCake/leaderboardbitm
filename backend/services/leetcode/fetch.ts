import { Submission } from "../stats/types"

interface UserInfo {
    username: string;
    lastSolvedID: string | null;
}


const QUERY = `
query recentAcSubmissions($username: String!) {
  recentAcSubmissionList(username: $username) {
    id
    title
    titleSlug
    timestamp
  }
}
`;

export const getSub = async ({
    username,
    lastSolvedID,
}: UserInfo): Promise<Submission[]> => {

    const submissions: Submission[] = [];

    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://leetcode.com/",
            },
            body: JSON.stringify({
                query: QUERY,
                variables: {
                    username
                },
            }),
        });

        if (!response.ok) {
            console.error(`[LeetCode API] HTTP ${response.status} for ${username}`);
            return [];
        }

        const data = await response.json();

     
        if (!data || !data.data || !data.data.recentAcSubmissionList) {
            console.error(`[LeetCode API] Missing data for ${username}`);
            return [];
        }

        const page = data.data.recentAcSubmissionList;

        for (const sub of page) {
            if (lastSolvedID && sub.id === lastSolvedID) {
                break; 
            }

            submissions.push({
                platform: "leetcode",
                submissionID: Number(sub.id),
                problemID: sub.titleSlug,
                verdict: "OK", 
                timestamp: Number(sub.timestamp),
                tags: [],
            });
        }
        
    } catch (error) {
        console.error(`[LeetCode API] Fetch error for ${username}:`, error);
    }
    
    return submissions;
};