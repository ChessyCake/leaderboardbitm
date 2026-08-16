async function testLeetcode() {
    console.log("Testing Leetcode Verification...");
    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://leetcode.com/",
            },
            body: JSON.stringify({
                query: `query { matchedUser(username: "tourist") { username } }`
            }),
        });

        if (!response.ok) {
            console.log("Failed LC fetch", response.status);
            return;
        }

        const data = await response.json();
        console.log("LC Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

async function testCodeforces() {
    console.log("\nTesting Codeforces Verification...");
    try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=tourist`);
        if (!response.ok) {
            console.log("Failed CF fetch", response.status);
            return;
        }
        const data = await response.json();
        console.log("CF Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

async function run() {
    await testLeetcode();
    await testCodeforces();
}

run();
