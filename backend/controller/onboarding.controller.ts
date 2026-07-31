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

    user.codeforces_username = codeforces
    user.leetcode_username = leetcode

    user.onboarded = true
    await user.save()

    return res.json({
        success: true,
        message: "Username updated successfully"
    })
}


