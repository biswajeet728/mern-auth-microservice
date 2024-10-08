import express from "express";

import { create, login } from "../controllers/auth.controller";
import { validate } from "../middlewares/parse.validator";
import { loginSchema, registerSchema } from "../validator";

const router = express.Router();

router.post("/new", validate(registerSchema), create);
router.post("/login", validate(loginSchema), login);

export default router;
