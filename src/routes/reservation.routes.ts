import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createReservation,
  listReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} from "../controllers/reservation.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createReservation);
router.get("/", listReservations);
router.get("/:id", getReservationById);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);

export default router;