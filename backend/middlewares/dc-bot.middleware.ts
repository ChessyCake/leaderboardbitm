import { NextFunction, Request, Response } from "express";

export const botMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = header.split(" ")[1];

  if (token !== process.env.BOT_SECRET) {
    return res.status(403).json({
      message: "Invalid bot token",
    });
  }

  next();
};