// src/controllers/wallet.controller.ts

import { Request, Response, NextFunction } from "express";
import WalletService from "../services/wallet.service";
import logger from "../utils/logger";
import { withdrawWalletSchema } from "../validations/wallet.schema";

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

  static async withdrawWallet(req: Request, res: Response) {
    
    const { error } = withdrawWalletSchema.validate(req.body);
    if (error) {
      logger.warn(`Invalid withdraw request: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }

    try {
      const userId = (req as any).user?.id; 
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: user not found in request' });
      }

      const { amount, description } = req.body;

      const result = await WalletService.withdrawFromWallet({
        userId,
        amount,
        description,
      });

      return res.status(200).json({
        status: true,
        message: 'Withdrawal successful',
        data: result,
      });

    } catch (err: any) {
      logger.error(`Withdraw controller failed: ${err.message}`, { error: err });
      return res.status(500).json({
        status: false,
        error: err.message || 'Something went wrong',
      });
    }
  }
}

export default WalletController;
