import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

import { User } from "../models/User";
import { env } from "../config/env";
import { HttpError } from "../utils/httpError";
import { registerSchema, loginSchema } from "../validators/auth.schemas";

function signToken(payload: { userId: string; email: string }) {
  const secret: Secret = env.jwtSecret;
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] };
  return jwt.sign(payload, secret, options);
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);

    const exists = await User.findOne({ email: data.email });
    if (exists) throw new HttpError(409, "Email already in use");

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    const token = signToken({ userId: user._id.toString(), email: user.email });

    return res.status(201).json({
      ok: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });
    if (!user) throw new HttpError(401, "Invalid credentials");

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid credentials");

    const token = signToken({ userId: user._id.toString(), email: user.email });

    return res.json({
      ok: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}