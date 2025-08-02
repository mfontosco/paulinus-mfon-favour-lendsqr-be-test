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
const connection_1 = __importDefault(require("../src/db/connection"));
const user_services_1 = require("../src/services/user.services");
const karma_1 = require("../src/utils/karma");
jest.mock('../src/utils/karma');
describe('UserService.createUser', () => {
    const testEmail = 'test@example.com';
    const userPayload = {
        first_name: 'Test',
        last_name: 'User',
        email: testEmail,
        karma_id: 'valid-karma-id',
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, connection_1.default)('wallets').del();
        yield (0, connection_1.default)('users').del();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection_1.default.destroy();
    }));
    it('should create a user and wallet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield user_services_1.UserService.createUser(userPayload);
        expect(result.user).toBeDefined();
        expect(result.wallet).toBeDefined();
        expect(result.user.email).toBe(testEmail);
        expect(result.wallet.balance.toString()).toBe('0');
    }));
    it('should throw if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield user_services_1.UserService.createUser(userPayload);
        yield expect(user_services_1.UserService.createUser(userPayload)).rejects.toThrow('User already exists');
    }));
    it('should throw if user is blacklisted', () => __awaiter(void 0, void 0, void 0, function* () {
        karma_1.isUserBlacklisted.mockResolvedValue(true);
        const blacklistedPayload = Object.assign(Object.assign({}, userPayload), { email: 'blacklisted@example.com', karma_id: 'blacklisted-user' });
        yield expect(user_services_1.UserService.createUser(blacklistedPayload)).rejects.toThrow('User is blacklisted');
    }));
});
