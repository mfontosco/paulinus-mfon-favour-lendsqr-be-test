// src/routes/wallet.routes.ts

import { Router } from "express";
import WalletController from "../controllers/wallet.controller";
import {validate} from "../middlewares/wallet.validate";
import { fundWalletSchema, } from "../validations/wallet.schema";
import mockAuth from "../middlewares/mockAuth";
const router = Router();

router.post("/fund", validate(fundWalletSchema), WalletController.fundWallet);

router.post('/withdraw', mockAuth, WalletController.withdrawWallet);
export default router;
