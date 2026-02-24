import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import reservationRoutes from "./routes/reservation.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true, status: "up" }));

app.use("/auth", authRoutes);
app.use("/reservations", reservationRoutes);

// Error middleware al final
app.use(errorMiddleware);