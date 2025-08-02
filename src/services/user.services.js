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
exports.UserService = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const logger_1 = __importDefault(require("../utils/logger"));
const karma_1 = require("../utils/karma");
const uuid_1 = require("uuid");
class UserService {
    static createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const trx = yield connection_1.default.transaction();
            try {
                const { email, karma_id } = payload;
                const existingUser = yield trx('users').where({ email }).first();
                if (existingUser) {
                    logger_1.default.warn(`User already exists with email: ${email}`);
                    throw new Error('User already exists');
                }
                // Check blacklist
                const blacklisted = yield (0, karma_1.isUserBlacklisted)(karma_id);
                if (blacklisted) {
                    logger_1.default.warn(`Blacklisted user attempted signup: ${karma_id}`);
                    throw new Error('User is blacklisted');
                }
                //  Create user
                const userId = (0, uuid_1.v4)();
                const userPayload = Object.assign({ id: userId }, payload);
                yield trx('users').insert(userPayload);
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
                yield trx('wallets').insert(walletPayload);
                const user = yield trx('users').where({ id: userId }).first();
                const wallet = yield trx('wallets').where({ user_id: userId }).first();
                yield trx.commit();
                logger_1.default.info(`User and wallet created for ${user.email}`);
                return {
                    user,
                    wallet,
                };
            }
            catch (err) {
                yield trx.rollback();
                logger_1.default.error(`Error creating user: ${err instanceof Error ? err.message : err}`);
                throw err;
            }
        });
    }
}
exports.UserService = UserService;
