import { z } from "zod";

const isoDate = z.string().datetime();

const reservationBaseSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  itemType: z.string().min(3),
  itemName: z.string().min(5),
  itemDescription: z.string().min(1).optional(),
  startAt: isoDate,
  endAt: isoDate,
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  notes: z.string().max(500).optional(),
});


export const createReservationSchema = reservationBaseSchema.refine(
  (v) => new Date(v.endAt).getTime() > new Date(v.startAt).getTime(),
  { message: "endAt must be after startAt", path: ["endAt"] }
);


export const updateReservationSchema = reservationBaseSchema.partial().superRefine((v, ctx) => {
  if (v.startAt && v.endAt) {
    const ok = new Date(v.endAt).getTime() > new Date(v.startAt).getTime();
    if (!ok) {
      ctx.addIssue({
        code: "custom",
        message: "endAt must be after startAt",
        path: ["endAt"],
      });
    }
  }
});


export const listReservationQuerySchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  email: z.string().email().optional(),
  q: z.string().min(1).optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.string().optional(),
  endFrom: isoDate.optional(),
  endTo: isoDate.optional(),
});