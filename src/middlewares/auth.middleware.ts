import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "../utils/httpError";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new HttpError(401, "Missing token");

    const token = header.slice("Bearer ".length).trim();
    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string; email: string };

    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    next(new HttpError(401, "Invalid token"));
  }
}