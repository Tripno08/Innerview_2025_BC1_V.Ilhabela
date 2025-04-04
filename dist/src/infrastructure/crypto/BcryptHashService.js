"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHashService = void 0;
const bcryptjs_1 = require("bcryptjs");
const tsyringe_1 = require("tsyringe");
let BcryptHashService = class BcryptHashService {
    SALT_ROUNDS = 10;
    async hashPassword(password) {
        return (0, bcryptjs_1.hash)(password, this.SALT_ROUNDS);
    }
    async comparePassword(password, hashedPassword) {
        return (0, bcryptjs_1.compare)(password, hashedPassword);
    }
};
exports.BcryptHashService = BcryptHashService;
exports.BcryptHashService = BcryptHashService = __decorate([
    (0, tsyringe_1.injectable)()
], BcryptHashService);
//# sourceMappingURL=BcryptHashService.js.map