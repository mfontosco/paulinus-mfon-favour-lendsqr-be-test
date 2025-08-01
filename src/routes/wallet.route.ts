// src/routes/wallet.routes.ts

import { Router } from "express";
import WalletController from "../controllers/wallet.controller";
import {validate} from "../middlewares/wallet.validate";
import { fundWalletSchema } from "../validations/wallet.schema";

const router = Router();

router.post("/fund", validate(fundWalletSchema), WalletController.fundWallet);

export default router;
