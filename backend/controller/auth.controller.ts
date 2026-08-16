import { Request, Response } from "express"
import jwt from "jsonwebtoken"

import User from "../models/users.model";


export const googleCallback = ( req: Request, res: Response) => {
    const user = req.user as any

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: '7d',
        }
    );

    res.redirect(
        `${process.env.FRONTEND_URL}/login-success?token=${token}`
    )
};

export const getMe = async (req: Request, res: Response) => {

    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const user = await User.findById((req.user as any).id);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    res.json(user);
};


export const getOnboardingStatus = async (req: Request, res: Response) => {
  const user = await User.findById((req.user as any).id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.json({
    onboarding: user.onboarded,
  });
};
