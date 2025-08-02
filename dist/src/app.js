"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const wallet_route_1 = __importDefault(require("./routes/wallet.route"));
const errorHnadler_1 = require("./middlewares/errorHnadler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
console.log('✅ Welcome route is loaded');
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Welcome to the Lendsqr Wallet API',
        status: 'success',
    });
});
app.use("/api/v1/users", user_route_1.default);
app.use('/api/v1/wallets', wallet_route_1.default);
app.use(/(.*)/, (_req, res) => {
    res.status(404).json({
        message: 'Route not found',
        status: 'error',
    });
});
app.use(errorHnadler_1.errorHandler);
exports.default = app;
