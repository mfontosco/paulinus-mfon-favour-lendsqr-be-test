// src/validations/wallet.schema.ts
import Joi from "joi";

export const fundWalletSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  narration: Joi.any().optional(),
});
