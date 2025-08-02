"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../db/connection"));
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("../utils/logger"));
class WalletService {
    static fundWallet(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, amount, narration }) {
            const trx = yield connection_1.default.transaction();
            try {
                const wallet = yield trx("wallets").where({ user_id: userId }).first();
                if (!wallet)
                    throw new Error("Wallet not found");
                const prevBalance = parseFloat(wallet.balance);
                const newBalance = prevBalance + amount;
                yield trx("wallets")
                    .where({ user_id: userId })
                    .update({ balance: newBalance });
                yield trx("wallet_transactions").insert({
                    id: (0, uuid_1.v4)(),
                    wallet_id: wallet.id,
                    user_id: userId,
                    trx_ref: (0, uuid_1.v4)(),
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
                yield trx.commit();
                logger_1.default.info("Wallet funded successfully", { userId, amount });
                return {
                    message: "Wallet funded",
                    balance: newBalance,
                };
            }
            catch (error) {
                yield trx.rollback();
                logger_1.default.error("Error funding wallet", { error });
                throw error;
            }
        });
    }
    static withdrawFromWallet(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, amount, description, }) {
            const trx = yield connection_1.default.transaction();
            try {
                logger_1.default.info('Initiating withdrawal', { userId, amount });
                // 1. Get wallet
                const wallet = yield trx('wallets').where({ user_id: userId }).first();
                if (!wallet) {
                    logger_1.default.warn(`Wallet not found for user ${userId}`);
                    throw new Error('Wallet not found');
                }
                const prevBalance = parseFloat(wallet.balance);
                // 2. Validate balance
                if (prevBalance < amount) {
                    logger_1.default.warn(`Insufficient balance for user ${userId}`);
                    throw new Error('Insufficient balance');
                }
                const newBalance = prevBalance - amount;
                // 3. Update wallet balance
                yield trx('wallets')
                    .where({ user_id: userId })
                    .update({ balance: newBalance, debit: wallet.debit + amount });
                // 4. Log transaction
                yield trx('wallet_transactions').insert({
                    id: (0, uuid_1.v4)(),
                    wallet_id: wallet.id,
                    user_id: userId,
                    trx_ref: (0, uuid_1.v4)(),
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
                yield trx.commit();
                logger_1.default.info(`Withdrawal of ${amount} for user ${userId} successful`);
                return {
                    message: 'Withdrawal successful',
                    balance: newBalance,
                };
            }
            catch (err) {
                yield trx.rollback();
                if (err instanceof Error) {
                    logger_1.default.error(`Withdrawal failed: ${err.message}`, { error: err });
                }
                else {
                    logger_1.default.error(`Withdrawal failed: Unknown error`, { error: err });
                }
                throw err;
            }
        });
    }
    static transferFunds(_a) {
        return __awaiter(this, arguments, void 0, function* ({ senderId, recipientId, amount, narration }) {
            const trx = yield connection_1.default.transaction();
            try {
                if (senderId === recipientId)
                    throw new Error("Cannot transfer to self");
                const senderWallet = yield trx("wallets").where({ user_id: senderId }).first();
                const recipientWallet = yield trx("wallets").where({ user_id: recipientId }).first();
                if (!senderWallet || !recipientWallet) {
                    throw new Error("Sender or recipient wallet not found");
                }
                const senderBalance = parseFloat(senderWallet.balance);
                const recipientBalance = parseFloat(recipientWallet.balance);
                if (senderBalance < amount)
                    throw new Error("Insufficient balance");
                const senderNewBalance = senderBalance - amount;
                const recipientNewBalance = recipientBalance + amount;
                const reference = (0, uuid_1.v4)();
                const currency = senderWallet.currency || 'NGN';
                // Update sender wallet
                yield trx("wallets")
                    .where({ user_id: senderId })
                    .update({
                    balance: senderNewBalance,
                    debit: connection_1.default.raw('?? + ?', ['debit', amount]),
                    updated_at: connection_1.default.fn.now(),
                });
                // Update recipient wallet
                yield trx("wallets")
                    .where({ user_id: recipientId })
                    .update({
                    balance: recipientNewBalance,
                    credit: connection_1.default.raw('?? + ?', ['credit', amount]),
                    updated_at: connection_1.default.fn.now(),
                });
                // Record sender transaction (DEBIT)
                yield trx("wallet_transactions").insert({
                    id: (0, uuid_1.v4)(),
                    wallet_id: senderWallet.id,
                    user_id: senderId,
                    trx_ref: reference,
                    transaction_type: 'debit',
                    currency,
                    previous_balance: senderBalance,
                    balance: senderNewBalance,
                    transaction_status: 'success',
                    description: narration || "Wallet transfer - debit",
                    metadata: JSON.stringify({ transfer_type: "wallet", direction: "outbound" }),
                    created_at: new Date(),
                    updated_at: new Date(),
                });
                // Record recipient transaction (CREDIT)
                yield trx("wallet_transactions").insert({
                    id: (0, uuid_1.v4)(),
                    wallet_id: recipientWallet.id,
                    user_id: recipientId,
                    trx_ref: reference,
                    transaction_type: 'credit',
                    currency,
                    previous_balance: recipientBalance,
                    balance: recipientNewBalance,
                    transaction_status: 'success',
                    description: narration || "Wallet transfer - credit",
                    metadata: JSON.stringify({ transfer_type: "wallet", direction: "inbound" }),
                    created_at: new Date(),
                    updated_at: new Date(),
                });
                yield trx.commit();
                logger_1.default.info("Wallet transfer completed", {
                    from: senderId,
                    to: recipientId,
                    amount,
                    reference,
                });
                return {
                    message: "Transfer successful",
                    reference,
                    sender_balance: senderNewBalance,
                    recipient_balance: recipientNewBalance,
                };
            }
            catch (err) {
                yield trx.rollback();
                logger_1.default.error("Transfer failed", { error: err });
                throw err;
            }
        });
    }
}
exports.default = WalletService;
