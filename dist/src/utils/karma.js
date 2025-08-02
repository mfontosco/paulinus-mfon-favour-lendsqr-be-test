"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserBlacklisted = void 0;
const axios_1 = __importDefault(require("axios"));
const isUserBlacklisted = async (karma_id) => {
    if (process.env.NODE_ENV === 'development' || process.env.MOCK_KARMA === 'true') {
        console.log(`[Mock] Checking karma_id: ${karma_id}`);
        if (karma_id === 'blacklisted-id-123')
            return true;
        return false;
    }
    try {
        const { data } = await axios_1.default.get(`${process.env.KARMA_API}/${karma_id}`, {
            headers: {
                Authorization: `Bearer ${process.env.KARMA_API_KEY}`,
            },
        });
        return (data === null || data === void 0 ? void 0 : data.blacklisted) || false;
    }
    catch (err) {
        throw new Error('Unable to verify karma blacklist');
    }
};
exports.isUserBlacklisted = isUserBlacklisted;
