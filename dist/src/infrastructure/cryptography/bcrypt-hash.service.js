"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHashService = void 0;
const bcryptjs_1 = require("bcryptjs");
class BcryptHashService {
    saltRounds;
    constructor(saltRounds = 10) {
        this.saltRounds = saltRounds;
    }
    async hash(data) {
        return (0, bcryptjs_1.hash)(data, this.saltRounds);
    }
    async compare(plaintext, hash) {
        return (0, bcryptjs_1.compare)(plaintext, hash);
    }
}
exports.BcryptHashService = BcryptHashService;
//# sourceMappingURL=bcrypt-hash.service.js.map