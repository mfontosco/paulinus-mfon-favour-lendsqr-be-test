"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferSchema = exports.withdrawWalletSchema = exports.fundWalletSchema = void 0;
// src/validations/wallet.schema.ts
const joi_1 = __importDefault(require("joi"));
exports.fundWalletSchema = joi_1.default.object({
    userId: joi_1.default.string().uuid().required(),
    amount: joi_1.default.number().positive().required(),
    narration: joi_1.default.any().optional(),
});
;
exports.withdrawWalletSchema = joi_1.default.object({
    amount: joi_1.default.number().positive().required(),
    description: joi_1.default.string().optional(),
});
exports.transferSchema = joi_1.default.object({
    senderId: joi_1.default.string().uuid().required(),
    recipientId: joi_1.default.string().uuid().required(),
    amount: joi_1.default.number().positive().required(),
    narration: joi_1.default.string().optional(),
});
