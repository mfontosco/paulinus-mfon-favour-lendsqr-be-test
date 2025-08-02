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
exports.isUserBlacklisted = void 0;
const axios_1 = __importDefault(require("axios"));
const isUserBlacklisted = (karma_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === 'development' || process.env.MOCK_KARMA === 'true') {
        console.log(`[Mock] Checking karma_id: ${karma_id}`);
        if (karma_id === 'blacklisted-id-123')
            return true;
        return false;
    }
    try {
        const { data } = yield axios_1.default.get(`${process.env.KARMA_API}/${karma_id}`, {
            headers: {
                Authorization: `Bearer ${process.env.KARMA_API_KEY}`,
            },
        });
        return (data === null || data === void 0 ? void 0 : data.blacklisted) || false;
    }
    catch (err) {
        throw new Error('Unable to verify karma blacklist');
    }
});
exports.isUserBlacklisted = isUserBlacklisted;
