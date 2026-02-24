import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";
import { ZodError } from "zod";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      error: {
        message: "Validation error",
        details: err.issues,
      },
    });
  }

  // HttpError
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      ok: false,
      error: { message: err.message },
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    ok: false,
    error: { message: "Internal server error" },
  });
}