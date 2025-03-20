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
exports.LocalStorageService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const tsyringe_1 = require("tsyringe");
const AppError_1 = require("@shared/errors/AppError");
const storage_1 = require("@config/storage");
let LocalStorageService = class LocalStorageService {
    tmpFolder;
    uploadsFolder;
    constructor() {
        this.tmpFolder = storage_1.config.storage.tmpFolder;
        this.uploadsFolder = storage_1.config.storage.uploadsFolder;
        this.ensureDirectoriesExist();
    }
    ensureDirectoriesExist() {
        if (!fs_1.default.existsSync(this.tmpFolder)) {
            fs_1.default.mkdirSync(this.tmpFolder, { recursive: true });
        }
        if (!fs_1.default.existsSync(this.uploadsFolder)) {
            fs_1.default.mkdirSync(this.uploadsFolder, { recursive: true });
        }
    }
    async saveFile(file) {
        if (!file) {
            throw new AppError_1.AppError('Arquivo não fornecido');
        }
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path_1.default.resolve(this.uploadsFolder, fileName);
        await fs_1.default.promises.rename(file.path, filePath);
        return fileName;
    }
    async deleteFile(fileName) {
        const filePath = path_1.default.resolve(this.uploadsFolder, fileName);
        try {
            await fs_1.default.promises.stat(filePath);
            await fs_1.default.promises.unlink(filePath);
        }
        catch {
        }
    }
    getFileUrl(fileName) {
        return `${storage_1.config.storage.baseUrl}/uploads/${fileName}`;
    }
};
exports.LocalStorageService = LocalStorageService;
exports.LocalStorageService = LocalStorageService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], LocalStorageService);
//# sourceMappingURL=LocalStorageService.js.map