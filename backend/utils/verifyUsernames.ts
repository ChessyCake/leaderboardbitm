export const verifyLeetcodeUsername = async (username: string): Promise<boolean> => {
    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://leetcode.com/",
            },
            body: JSON.stringify({
                query: `query { matchedUser(username: "${username}") { username } }`
            }),
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        
        // If the user doesn't exist, matchedUser is null
        if (data?.data?.matchedUser === null) {
            return false;
        }

        // If matchedUser has a username, the user exists
        return !!data?.data?.matchedUser?.username;
    } catch (error) {
        console.error(`[Verification API] LeetCode verification error for ${username}:`, error);
        return false; // Safest to fail verification or maybe pass? Fail is better.
    }
};

export const verifyCodeforcesUsername = async (username: string): Promise<boolean> => {
    try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        
        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.status === "OK";
    } catch (error) {
        console.error(`[Verification API] Codeforces verification error for ${username}:`, error);
        return false;
    }
};

export const checkLeetcodeOwnership = async (username: string, token: string): Promise<boolean> => {
    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://leetcode.com/",
            },
            body: JSON.stringify({
                query: `query { matchedUser(username: "${username}") { profile { aboutMe } } }`
            }),
        });

        if (!response.ok) return false;

        const data = await response.json();
        const aboutMe = data?.data?.matchedUser?.profile?.aboutMe || "";
        
        return aboutMe.includes(token);
    } catch (error) {
        console.error(`[Verification API] LeetCode ownership error for ${username}:`, error);
        return false;
    }
};

export const checkCodeforcesOwnership = async (username: string): Promise<boolean> => {
    // Check if user submitted ANY compilation error in the last 15 minutes.
    try {
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=20`);
        
        if (!response.ok) return false;

        const data = await response.json();
        if (data.status !== "OK") return false;

        const submissions = data.result || [];
        const currentTime = Math.floor(Date.now() / 1000);
        
        for (const sub of submissions) {
            // Check if submission is within the last 15 minutes (900 seconds)
            if (currentTime - sub.creationTimeSeconds <= 900) {
                if (sub.verdict === "COMPILATION_ERROR") {
                    return true;
                }
            }
        }
        return false;
    } catch (error) {
        console.error(`[Verification API] Codeforces ownership error for ${username}:`, error);
        return false;
    }
};
