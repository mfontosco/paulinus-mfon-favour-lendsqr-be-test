import express from "express";
import { createUser } from "../controllers/user.controller";
import { validate } from "../middlewares/user.validate";
import { createUserSchema } from "../validations/user.schema";
const router = express.Router();

router.post("/",createUser);

export default router;
