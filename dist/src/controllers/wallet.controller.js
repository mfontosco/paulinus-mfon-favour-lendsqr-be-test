"use strict";
// src/controllers/wallet.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_service_1 = __importDefault(require("../services/wallet.service"));
const logger_1 = __importDefault(require("../utils/logger"));
const wallet_schema_1 = require("../validations/wallet.schema");
class WalletController {
    static async fundWallet(req, res, next) {
        try {
            const data = req.body;
            logger_1.default.info("Initiating wallet funding", { data });
            const result = await wallet_service_1.default.fundWallet(data);
            return res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            logger_1.default.error("Fund wallet failed", { error });
            next(error);
        }
    }
    static async withdrawWallet(req, res) {
        var _a;
        const { error } = wallet_schema_1.withdrawWalletSchema.validate(req.body);
        if (error) {
            logger_1.default.warn(`Invalid withdraw request: ${error.message}`);
            return res.status(400).json({ error: error.message });
        }
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized: user not found in request' });
            }
            const { amount, description } = req.body;
            const result = await wallet_service_1.default.withdrawFromWallet({
                userId,
                amount,
                description,
            });
            return res.status(200).json({
                status: true,
                message: 'Withdrawal successful',
                data: result,
            });
        }
        catch (err) {
            logger_1.default.error(`Withdraw controller failed: ${err.message}`, { error: err });
            return res.status(500).json({
                status: false,
                error: err.message || 'Something went wrong',
            });
        }
    }
    static async transferFunds(req, res, next) {
        try {
            const result = await wallet_service_1.default.transferFunds(req.body);
            return res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            logger_1.default.error("Transfer failed", { error });
            next(error);
        }
    }
}
exports.default = WalletController;
