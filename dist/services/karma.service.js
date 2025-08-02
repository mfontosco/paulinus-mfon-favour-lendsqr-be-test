"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KarmaService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
class KarmaService {
    static async isBlacklisted(email) {
        try {
            const { data } = await axios_1.default.get(`${process.env.KARMA_API_URL}/blacklist`, {
                params: { email },
                headers: {
                    Authorization: `Bearer ${process.env.KARMA_API_KEY}`,
                },
            });
            console.log("data--------", data);
            return (data === null || data === void 0 ? void 0 : data.blacklisted) === true;
        }
        catch (error) {
            logger_1.default.error("Karma API error", { error });
            throw new Error("Could not verify blacklist status");
        }
    }
}
exports.KarmaService = KarmaService;
