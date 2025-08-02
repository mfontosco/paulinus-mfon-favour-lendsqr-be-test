"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    sendSuccess: (res, data, message = "Success") => {
        return res.status(200).json({ status: true, message, data });
    },
    sendError: (res, statusCode = 500, message = "Error") => {
        return res.status(statusCode).json({ status: false, message });
    },
    internalServerError: (res) => {
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    },
};
