"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const user_schema_1 = require("../validations/user.schema");
const user_services_1 = require("../services/user.services");
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const createUser = async (req, res) => {
    const { error, value } = user_schema_1.createUserSchema.validate(req.body);
    if (error) {
        return responseHandler_1.default.sendError(res, 400, error.details[0].message);
    }
    try {
        const user = await user_services_1.UserService.createUser(value);
        return responseHandler_1.default.sendSuccess(res, user, "User created successfully.");
    }
    catch (err) {
        return responseHandler_1.default.sendError(res, 500, err.message || "Failed to create user.");
    }
};
exports.createUser = createUser;
