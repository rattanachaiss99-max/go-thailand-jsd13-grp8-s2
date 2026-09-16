import { Router } from "express";
import { router as usersRoutes } from "./users.routes.js";

export const router = Router();

router.use("/users", usersRoutes);
