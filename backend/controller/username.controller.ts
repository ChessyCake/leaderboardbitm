import { Request, Response } from "express";
import User from "../models/users.model";
import { verifyCodeforcesUsername, verifyLeetcodeUsername } from "../utils/verifyUsernames";

export const updateUsernames = async (req: Request, res: Response) => {
    try {
        const { codeforces, leetcode } = req.body;

        const trimmedCF = (codeforces || "").trim();
        const trimmedLC = (leetcode || "").trim();

        if (!trimmedCF && !trimmedLC) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one platform username",
            });
        }

        const user = await User.findById((req.user as any).id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (trimmedCF) {
            const isValid = await verifyCodeforcesUsername(trimmedCF);
            if (!isValid) {
                return res.status(400).json({ success: false, message: "Invalid Codeforces username" });
            }
            user.codeforces_username = trimmedCF;
        }
        
        if (trimmedLC) {
            const isValid = await verifyLeetcodeUsername(trimmedLC);
            if (!isValid) {
                return res.status(400).json({ success: false, message: "Invalid LeetCode username" });
            }
            user.leetcode_username = trimmedLC;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Successfully updated usernames",
            codeforces_username: user.codeforces_username,
            leetcode_username: user.leetcode_username,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};