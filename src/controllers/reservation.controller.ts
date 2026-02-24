import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Reservation } from "../models/Reservation";
import { HttpError } from "../utils/httpError";
import {
  createReservationSchema,
  updateReservationSchema,
  listReservationQuerySchema,
} from "../validators/reservation.schemas";

export async function createReservation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Unauthorized");

    const data = createReservationSchema.parse(req.body);

    const created = await Reservation.create({
      ...data,
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
      createdBy: new Types.ObjectId(req.user.userId),
    });

    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function listReservations(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Unauthorized");

    const q = listReservationQuerySchema.parse(req.query);

    const filter: Record<string, any> = {
      createdBy: req.user.userId,
    };

    if (q.status) filter.status = q.status;
    if (q.email) filter.email = q.email;

    if (q.q) {
      const needle = q.q.trim();
      filter.$or = [
        { name: { $regex: needle, $options: "i" } },
        { itemName: { $regex: needle, $options: "i" } },
        { itemType: { $regex: needle, $options: "i" } },
      ];
    }

    const anyQ = q as typeof q & { endFrom?: string; endTo?: string };

    if (q.from || q.to) {
      filter.startAt = {};
      if (q.from) filter.startAt.$gte = new Date(q.from);
      if (q.to) filter.startAt.$lte = new Date(q.to);
    }

    if (anyQ.endFrom || anyQ.endTo) {
      filter.endAt = {};
      if (anyQ.endFrom) filter.endAt.$gte = new Date(anyQ.endFrom);
      if (anyQ.endTo) filter.endAt.$lte = new Date(anyQ.endTo);
    }


    const page = q.page ?? 1;
    const limit = q.limit ?? 10;
    const skip = (page - 1) * limit;

    const allowedSortFields = new Set(["createdAt", "startAt", "endAt", "status", "email", "name", "itemName", "itemType"]);
    const rawSort = (q.sort ?? "-createdAt").trim();

    const sortDir = rawSort.startsWith("-") ? -1 : 1;
    const sortField = rawSort.replace(/^-/, "");
    const sort: Record<string, 1 | -1> = allowedSortFields.has(sortField)
      ? { [sortField]: sortDir }
      : { createdAt: -1 };

    const [items, total] = await Promise.all([
      Reservation.find(filter).sort(sort).skip(skip).limit(limit),
      Reservation.countDocuments(filter),
    ]);

    return res.json({
      ok: true,
      data: {
        items,
        meta: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getReservationById(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Unauthorized");

    const { id } = req.params;

    const item = await Reservation.findOne({ _id: id, createdBy: req.user.userId });
    if (!item) throw new HttpError(404, "Reservation not found");

    return res.json({ ok: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateReservation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Unauthorized");

    const { id } = req.params;
    const data = updateReservationSchema.parse(req.body);

    const patch: Record<string, any> = { ...data };

    if (data.startAt) patch.startAt = new Date(data.startAt);
    if (data.endAt) patch.endAt = new Date(data.endAt);

    // si mandan startAt y endAt en update, validá lógica mínima
    if (patch.startAt && patch.endAt) {
      if (patch.endAt.getTime() <= patch.startAt.getTime()) {
        throw new HttpError(400, "endAt must be after startAt");
      }
    }

    const updated = await Reservation.findOneAndUpdate(
      { _id: id, createdBy: req.user.userId },
      { $set: patch },
      { new: true }
    );

    if (!updated) throw new HttpError(404, "Reservation not found");

    return res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteReservation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Unauthorized");

    const { id } = req.params;

    const deleted = await Reservation.findOneAndDelete({ _id: id, createdBy: req.user.userId });
    if (!deleted) throw new HttpError(404, "Reservation not found");

    return res.json({ ok: true, data: { id } });
  } catch (err) {
    next(err);
  }
}