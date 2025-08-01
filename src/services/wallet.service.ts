// src/services/wallet.service.ts

import knex from '../db/connection';
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";
import { FundWalletDTO } from '../interfaces/wallet.interface';

class WalletService {
  static async fundWallet({ userId, amount, narration }: FundWalletDTO) {
    const trx = await knex.transaction();
    try {
   
      const wallet = await trx("wallets").where({ user_id: userId }).first();
      if (!wallet) throw new Error("Wallet not found");

      const prevBalance = parseFloat(wallet.balance);
      const newBalance = prevBalance + amount;

     
      await trx("wallets")
        .where({ user_id: userId })
        .update({ balance: newBalance });

   
      await trx("wallet_transactions").insert({
        id: uuidv4(),
        wallet_id: wallet.id,
        user_id: userId,
        trx_ref: uuidv4(),
        transaction_type: "credit",
        currency: "NGN", 
        previous_balance: prevBalance,
        balance: newBalance,
        transaction_status: "success",
        description: narration || "Wallet funded",
        metadata: JSON.stringify({ source: "manual", method: "internal" }),
        created_at: new Date(),
        updated_at: new Date(),
      });

      await trx.commit();
      logger.info("Wallet funded successfully", { userId, amount });

      return {
        message: "Wallet funded",
        balance: newBalance,
      };
    } catch (error) {
      await trx.rollback();
      logger.error("Error funding wallet", { error });
      throw error;
    }
  }
 static async withdrawFromWallet({
    userId,
    amount,
    description,
  }: {
    userId: string;
    amount: number;
    description?: string;
  }) {
    const trx = await knex.transaction();

    try {
      logger.info('Initiating withdrawal', { userId, amount });

      // 1. Get wallet
      const wallet = await trx('wallets').where({ user_id: userId }).first();
      if (!wallet) {
        logger.warn(`Wallet not found for user ${userId}`);
        throw new Error('Wallet not found');
      }

      const prevBalance = parseFloat(wallet.balance);

      // 2. Validate balance
      if (prevBalance < amount) {
        logger.warn(`Insufficient balance for user ${userId}`);
        throw new Error('Insufficient balance');
      }

      const newBalance = prevBalance - amount;

      // 3. Update wallet balance
      await trx('wallets')
        .where({ user_id: userId })
        .update({ balance: newBalance, debit: wallet.debit + amount });

      // 4. Log transaction
      await trx('wallet_transactions').insert({
        id: uuidv4(),
        wallet_id: wallet.id,
        user_id:userId,
        trx_ref: uuidv4(),
        transaction_type: 'debit',
        currency: wallet.currency || 'NGN',
        previous_balance: prevBalance,
        balance: newBalance,
        transaction_status: 'success',
        description: description || 'Wallet withdrawal',
        metadata: JSON.stringify({ method: 'internal', source: 'api' }),
        created_at: new Date(),
        updated_at: new Date(),
      });

      // 5. Commit
      await trx.commit();

      logger.info(`Withdrawal of ${amount} for user ${userId} successful`);

      return {
        message: 'Withdrawal successful',
        balance: newBalance,
      };
    } catch (err) {
      await trx.rollback();
     if (err instanceof Error) {
  logger.error(`Withdrawal failed: ${err.message}`, { error: err });
} else {
  logger.error(`Withdrawal failed: Unknown error`, { error: err });
}
      throw err;
    }
  }
}

export default WalletService;
