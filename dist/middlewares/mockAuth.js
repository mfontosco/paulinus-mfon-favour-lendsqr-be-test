"use strict";
// src/middlewares/mockAuth.ts
Object.defineProperty(exports, "__esModule", { value: true });
const mockAuth = (req, res, next) => {
    req.user = {
        id: 'f57f69bd-4672-4e3d-ad2a-e7037fd91302',
        email: 'john234y3@example.com',
    };
    next();
};
exports.default = mockAuth;
