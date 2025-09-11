import { Request, Response, NextFunction } from "express";

export function checkAccessKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const clientKey = req.headers["x-api-access-key"];
  if (clientKey !== process.env.API_ACCESS_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid access key" });
  }
  next();
}
