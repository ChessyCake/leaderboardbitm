import { verifyCodeforcesUsername, verifyLeetcodeUsername } from "./utils/verifyUsernames";

async function test() {
    console.log("Testing Codeforces (valid):", await verifyCodeforcesUsername("tourist"));
    console.log("Testing Codeforces (invalid):", await verifyCodeforcesUsername("invaliduser123890123"));
    console.log("Testing LeetCode (valid):", await verifyLeetcodeUsername("tourist"));
    console.log("Testing LeetCode (invalid):", await verifyLeetcodeUsername("invaliduser123890123"));
}

test();
