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
exports.KarmaService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
class KarmaService {
    static isBlacklisted(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(`${process.env.KARMA_API_URL}/blacklist`, {
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
        });
    }
}
exports.KarmaService = KarmaService;
