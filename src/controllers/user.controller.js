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
exports.createUser = void 0;
const user_schema_1 = require("../validations/user.schema");
const user_services_1 = require("../services/user.services");
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = user_schema_1.createUserSchema.validate(req.body);
    if (error) {
        return responseHandler_1.default.sendError(res, 400, error.details[0].message);
    }
    try {
        const user = yield user_services_1.UserService.createUser(value);
        return responseHandler_1.default.sendSuccess(res, user, "User created successfully.");
    }
    catch (err) {
        return responseHandler_1.default.sendError(res, 500, err.message || "Failed to create user.");
    }
});
exports.createUser = createUser;
