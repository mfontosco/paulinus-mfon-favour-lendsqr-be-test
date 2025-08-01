// src/controllers/wallet.controller.ts

import { Request, Response, NextFunction } from "express";
import WalletService from "../services/wallet.service";
import logger from "../utils/logger";

class WalletController {
  static async fundWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      logger.info("Initiating wallet funding", { data });
      const result = await WalletService.fundWallet(data);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      logger.error("Fund wallet failed", { error });
      next(error);
    }
  }
}

export default WalletController;
