import { Request, Response } from "express";
import Users from "../models/users.model"


import { verifyCodeforcesUsername, verifyLeetcodeUsername, checkCodeforcesOwnership, checkLeetcodeOwnership } from "../utils/verifyUsernames";
import crypto from "crypto";

export const setUsernames = async ( req: Request, res: Response) => {

    if( !req.user){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    const { leetcode, codeforces } = req.body

    const user = await Users.findById((req.user as any).id)

    if( !user){
        return res.status(400).json({
            success: false,
            message: "Invalid Credentials"
        })
    }

    const trimmedLeetcode = leetcode?.trim();
    const trimmedCodeforces = codeforces?.trim();

    if (!trimmedLeetcode && !trimmedCodeforces) {
        return res.status(400).json({
            success: false,
            message: "Please provide at least one platform username"
        });
    }

    if (trimmedCodeforces) {
        const isValid = await verifyCodeforcesUsername(trimmedCodeforces);
        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid Codeforces username" });
        }
        user.codeforces_username = trimmedCodeforces;
    } else {
        user.codeforces_username = "";
    }
    
    if (trimmedLeetcode) {
        const isValid = await verifyLeetcodeUsername(trimmedLeetcode);
        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid LeetCode username" });
        }
        user.leetcode_username = trimmedLeetcode;
    } else {
        user.leetcode_username = "";
    }

    const token = crypto.randomBytes(16).toString("hex");
    user.verificationToken = token;
    await user.save();

    return res.json({
        success: true,
        message: "Usernames validated. Proceed to verification.",
        verificationToken: token
    })
}

export const verifyOwnership = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await Users.findById((req.user as any).id);

    if (!user) {
        return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const token = user.verificationToken;
    if (!token) {
        return res.status(400).json({ success: false, message: "No verification token found" });
    }

    if (user.codeforces_username) {
        const isCfVerified = await checkCodeforcesOwnership(user.codeforces_username);
        if (!isCfVerified) {
            return res.status(400).json({ success: false, message: "Codeforces verification failed. Could not find recent COMPILATION_ERROR submission." });
        }
    }

    if (user.leetcode_username) {
        const isLcVerified = await checkLeetcodeOwnership(user.leetcode_username, token);
        if (!isLcVerified) {
            return res.status(400).json({ success: false, message: "LeetCode verification failed. Could not find token in About Me section." });
        }
    }

    user.onboarded = true;
    user.verificationToken = ""; // clear the token
    await user.save();

    return res.json({
        success: true,
        message: "Ownership verified successfully!"
    });
};


