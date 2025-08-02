"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const logger_1 = __importDefault(require("../utils/logger"));
const karma_1 = require("../utils/karma");
const uuid_1 = require("uuid");
class UserService {
    static async createUser(payload) {
        const trx = await connection_1.default.transaction();
        try {
            const { email, karma_id } = payload;
            const existingUser = await trx('users').where({ email }).first();
            if (existingUser) {
                logger_1.default.warn(`User already exists with email: ${email}`);
                throw new Error('User already exists');
            }
            // Check blacklist
            const blacklisted = await (0, karma_1.isUserBlacklisted)(karma_id);
            if (blacklisted) {
                logger_1.default.warn(`Blacklisted user attempted signup: ${karma_id}`);
                throw new Error('User is blacklisted');
            }
            //  Create user
            const userId = (0, uuid_1.v4)();
            const userPayload = Object.assign({ id: userId }, payload);
            await trx('users').insert(userPayload);
            // Create wallet with default balance
            const walletId = (0, uuid_1.v4)();
            const walletPayload = {
                id: walletId,
                user_id: userId,
                currency: 'NGN',
                balance: 0.00,
                credit: 0.00,
                debit: 0.00,
                metadata: null,
            };
            await trx('wallets').insert(walletPayload);
            const user = await trx('users').where({ id: userId }).first();
            const wallet = await trx('wallets').where({ user_id: userId }).first();
            await trx.commit();
            logger_1.default.info(`User and wallet created for ${user.email}`);
            return {
                user,
                wallet,
            };
        }
        catch (err) {
            await trx.rollback();
            logger_1.default.error(`Error creating user: ${err instanceof Error ? err.message : err}`);
            throw err;
        }
    }
}
exports.UserService = UserService;
