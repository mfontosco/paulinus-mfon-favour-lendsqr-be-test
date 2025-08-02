"use strict";
// src/routes/wallet.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = __importDefault(require("../controllers/wallet.controller"));
const wallet_validate_1 = require("../middlewares/wallet.validate");
const wallet_schema_1 = require("../validations/wallet.schema");
const mockAuth_1 = __importDefault(require("../middlewares/mockAuth"));
const router = (0, express_1.Router)();
router.post("/fund", (0, wallet_validate_1.validate)(wallet_schema_1.fundWalletSchema), wallet_controller_1.default.fundWallet);
// src/routes/wallet.routes.ts
router.post("/transfer", (0, wallet_validate_1.validate)(wallet_schema_1.transferSchema), wallet_controller_1.default.transferFunds);
router.post('/withdraw', mockAuth_1.default, wallet_controller_1.default.withdrawWallet);
exports.default = router;
