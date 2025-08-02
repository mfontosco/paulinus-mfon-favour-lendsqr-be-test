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
const wallet_service_1 = __importDefault(require("../src/services/wallet.service"));
const connection_1 = __importDefault(require("../src/db/connection"));
jest.mock('../src/db/connection', () => {
    const actual = jest.requireActual('../src/db/connection');
    return Object.assign(Object.assign({}, actual), { transaction: jest.fn() });
});
describe('WalletService', () => {
    let trx;
    let trxFn;
    beforeEach(() => {
        trx = {
            where: jest.fn().mockReturnThis(),
            first: jest.fn(),
            update: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            rollback: jest.fn(),
            commit: jest.fn(),
        };
        trxFn = jest.fn(() => trx);
        connection_1.default.transaction.mockImplementation((cb) => __awaiter(void 0, void 0, void 0, function* () {
            if (cb && typeof cb === 'function') {
                return cb(trxFn);
            }
            return trxFn;
        }));
        jest.clearAllMocks();
    });
    describe('fundWallet', () => {
        it('should fund wallet and insert credit transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            trxFn.mockReturnValueOnce(trx); // trx('wallets')
            trx.first.mockResolvedValueOnce({
                id: 'wallet123',
                user_id: 'user123',
                balance: 100,
            });
            yield wallet_service_1.default.fundWallet({
                userId: 'user123',
                amount: 50,
                narration: 'Top up test',
            });
            expect(trx.update).toHaveBeenCalledWith({ balance: 150 });
            expect(trx.insert).toHaveBeenCalledWith(expect.objectContaining({
                type: 'credit',
                amount: 50,
                user_id: 'user123',
                wallet_id: 'wallet123',
            }));
        }));
    });
    describe('withdrawFromWallet', () => {
        it('should withdraw and insert debit transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            trxFn.mockReturnValueOnce(trx); // trx('wallets')
            trx.first.mockResolvedValueOnce({
                id: 'wallet456',
                user_id: 'user456',
                balance: 200,
            });
            yield wallet_service_1.default.withdrawFromWallet({
                userId: 'user456',
                amount: 50,
                description: 'Test withdrawal',
            });
            expect(trx.update).toHaveBeenCalledWith({ balance: 150 });
            expect(trx.insert).toHaveBeenCalledWith(expect.objectContaining({
                type: 'debit',
                amount: 50,
                user_id: 'user456',
                wallet_id: 'wallet456',
            }));
        }));
        it('should fail withdrawal with insufficient balance', () => __awaiter(void 0, void 0, void 0, function* () {
            trxFn.mockReturnValueOnce(trx); // trx('wallets')
            trx.first.mockResolvedValueOnce({
                id: 'wallet789',
                user_id: 'user789',
                balance: 30,
            });
            yield expect(wallet_service_1.default.withdrawFromWallet({
                userId: 'user789',
                amount: 100,
                description: 'Attempt overdraft',
            })).rejects.toThrow('Insufficient balance');
            expect(trx.rollback).toHaveBeenCalled();
        }));
    });
    describe('transferFunds', () => {
        it('should transfer funds and record transactions', () => __awaiter(void 0, void 0, void 0, function* () {
            trxFn.mockReturnValueOnce(trx).mockReturnValueOnce(trx);
            trx.first
                .mockResolvedValueOnce({
                id: 'wallet_sender',
                user_id: 'sender_id',
                balance: 100,
            })
                .mockResolvedValueOnce({
                id: 'wallet_recipient',
                user_id: 'recipient_id',
                balance: 50,
            });
            yield wallet_service_1.default.transferFunds({
                senderId: 'sender_id',
                recipientId: 'recipient_id',
                amount: 40,
                narration: 'Transfer test',
            });
            expect(trx.update).toHaveBeenCalledWith({ balance: 60 });
            expect(trx.update).toHaveBeenCalledWith({ balance: 90 });
            expect(trx.insert).toHaveBeenCalledTimes(2);
            expect(trx.insert).toHaveBeenCalledWith(expect.objectContaining({ type: 'debit', user_id: 'sender_id' }));
            expect(trx.insert).toHaveBeenCalledWith(expect.objectContaining({ type: 'credit', user_id: 'recipient_id' }));
        }));
        it('should fail if sender and recipient are the same', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(wallet_service_1.default.transferFunds({
                senderId: 'same_user',
                recipientId: 'same_user',
                amount: 50,
                narration: 'Self-transfer test',
            })).rejects.toThrow('Cannot transfer to self');
        }));
        it('should fail if sender wallet not found', () => __awaiter(void 0, void 0, void 0, function* () {
            trxFn.mockReturnValueOnce(trx).mockReturnValueOnce(trx);
            trx.first.mockResolvedValueOnce(null);
            yield expect(wallet_service_1.default.transferFunds({
                senderId: 'missing',
                recipientId: 'recipient_id',
                amount: 100,
                narration: 'Test transfer',
            })).rejects.toThrow('Sender or recipient wallet not found');
            expect(trx.rollback).toHaveBeenCalled();
        }));
    });
});
