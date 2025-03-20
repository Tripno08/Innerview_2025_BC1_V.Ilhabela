"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
let LocalStorageService = (() => {
    let _classDecorators = [(0, tsyringe_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LocalStorageService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LocalStorageService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
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
    return LocalStorageService = _classThis;
})();
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=LocalStorageService.js.map