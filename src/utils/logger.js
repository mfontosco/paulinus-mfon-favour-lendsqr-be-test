"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize } = winston_1.format;
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), colorize(), logFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: "logs/app.log", level: "info" }),
        new winston_1.transports.File({ filename: "logs/errors.log", level: "error" }),
    ],
});
exports.default = logger;
