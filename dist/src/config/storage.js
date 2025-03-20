"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const path_1 = __importDefault(require("path"));
exports.config = {
    storage: {
        driver: process.env.STORAGE_DRIVER || 'local',
        tmpFolder: path_1.default.resolve(__dirname, '..', '..', 'tmp'),
        uploadsFolder: path_1.default.resolve(__dirname, '..', '..', 'uploads'),
        baseUrl: process.env.APP_API_URL || 'http://localhost:3333',
        s3: {
            bucket: process.env.AWS_BUCKET,
            region: process.env.AWS_REGION,
        },
    },
};
//# sourceMappingURL=storage.js.map