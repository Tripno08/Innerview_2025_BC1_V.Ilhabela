"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConfig = void 0;
exports.testConfig = {
    database: {
        url: 'mysql://test_user:test_password@localhost:3307/innerview_test',
    },
    redis: {
        host: 'localhost',
        port: 6380,
        keyPrefix: 'test:',
    },
    storage: {
        tmpFolder: './tmp/test',
        uploadsFolder: './uploads/test',
    },
    auth: {
        secret: 'test_secret',
        expiresIn: '15m',
    },
};
//# sourceMappingURL=test.js.map