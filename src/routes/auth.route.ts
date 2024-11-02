import express from "express";

import { create, getMe, login } from "../controllers/auth.controller";
import { validate } from "../middlewares/parse.validator";
import { loginSchema, registerSchema } from "../validator";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.post("/new", validate(registerSchema), create);
router.post("/login", validate(loginSchema), login);
router.get("/self", authenticate, getMe);

export default router;
