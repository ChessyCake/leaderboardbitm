import { Request, Response } from "express";
import Users from "../models/users.model"


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
        user.codeforces_username = trimmedCodeforces;
    }
    if (trimmedLeetcode) {
        user.leetcode_username = trimmedLeetcode;
    }

    user.onboarded = true
    await user.save()

    return res.json({
        success: true,
        message: "Username updated successfully"
    })
}


