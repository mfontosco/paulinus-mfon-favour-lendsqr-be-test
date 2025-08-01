// src/validations/wallet.schema.ts
import Joi from "joi";

export const fundWalletSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  narration: Joi.any().optional(),
});


;

export const withdrawWalletSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().optional(),
});



export const transferSchema = Joi.object({
  senderId: Joi.string().uuid().required(),
  recipientId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  narration: Joi.string().optional(),
});
