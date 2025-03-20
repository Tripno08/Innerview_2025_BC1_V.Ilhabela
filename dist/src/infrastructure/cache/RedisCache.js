"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCache = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const tsyringe_1 = require("tsyringe");
const cache_1 = require("@config/cache");
let RedisCache = class RedisCache {
    client;
    constructor() {
        this.client = new ioredis_1.default(cache_1.config.redis);
    }
    async set(key, value, ttlInSeconds) {
        const serializedValue = JSON.stringify(value);
        if (ttlInSeconds) {
            await this.client.setex(key, ttlInSeconds, serializedValue);
        }
        else {
            await this.client.set(key, serializedValue);
        }
    }
    async get(key) {
        const data = await this.client.get(key);
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    }
    async delete(key) {
        await this.client.del(key);
    }
    async invalidatePrefix(prefix) {
        const keys = await this.client.keys(`${prefix}:*`);
        if (keys.length > 0) {
            await this.client.del(...keys);
        }
    }
};
exports.RedisCache = RedisCache;
exports.RedisCache = RedisCache = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], RedisCache);
//# sourceMappingURL=RedisCache.js.map