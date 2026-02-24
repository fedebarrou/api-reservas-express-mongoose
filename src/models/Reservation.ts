import { Schema, model, Document, Types } from "mongoose";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface IReservation extends Document {
  name: string;
  email: string;
  phone: string;
  itemType?: string;
  itemName?: string;
  itemDescription?: string;
  startAt: Date;
  endAt: Date;
  status: ReservationStatus;
  notes?: string;
  createdBy: Types.ObjectId;
}

const ReservationSchema = new Schema<IReservation>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    itemType: { type: String, trim: true },
    itemName: { type: String, trim: true },
    itemDescription: { type: String, trim: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Reservation = model<IReservation>("Reservation", ReservationSchema);