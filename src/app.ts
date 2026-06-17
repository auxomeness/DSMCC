import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "node:path";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { appointmentRoutes } from "./modules/appointments/appointment.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { concernRoutes } from "./modules/concerns/concern.routes";
import { officeRoutes } from "./modules/offices/office.routes";
import { staffRoutes } from "./modules/staff/staff.routes";
import { successResponse } from "./utils/response";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.status(200).json(successResponse("DECA backend is running", { status: "ok" }));
});

app.use("/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/offices", officeRoutes);
app.use("/api/v1/offices", officeRoutes);
app.use("/staff", staffRoutes);
app.use("/api/v1/staff", staffRoutes);
app.use("/concerns", concernRoutes);
app.use("/api/v1/concerns", concernRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/api/v1/appointments", appointmentRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
