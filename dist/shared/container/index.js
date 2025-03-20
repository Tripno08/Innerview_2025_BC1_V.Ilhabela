"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDependencies = registerDependencies;
const tsyringe_1 = require("tsyringe");
const usuario_repository_1 = require("@infrastructure/repositories/usuario.repository");
const reuniao_repository_1 = require("@infrastructure/repositories/reuniao.repository");
const cryptography_1 = require("@infrastructure/cryptography");
const JwtAuthService_1 = require("@infrastructure/auth/JwtAuthService");
const RedisCache_1 = require("@infrastructure/cache/RedisCache");
const WinstonLogger_1 = require("@infrastructure/logging/WinstonLogger");
const LocalStorageService_1 = require("@infrastructure/storage/LocalStorageService");
const LMSAdapter_1 = require("@infrastructure/external/adapters/LMSAdapter");
const SISAdapter_1 = require("@infrastructure/external/adapters/SISAdapter");
const usuario_1 = require("@application/use-cases/usuario");
const criar_reuniao_usecase_1 = require("@application/use-cases/reuniao/criar-reuniao.usecase");
function registerDependencies() {
    tsyringe_1.container.registerSingleton('UsuarioRepository', usuario_repository_1.UsuarioRepository);
    tsyringe_1.container.registerSingleton('ReuniaoRepository', reuniao_repository_1.ReuniaoRepository);
    tsyringe_1.container.registerSingleton('HashService', cryptography_1.BcryptHashService);
    tsyringe_1.container.registerSingleton('JwtService', cryptography_1.JwtService);
    tsyringe_1.container.registerSingleton('AuthService', JwtAuthService_1.JwtAuthService);
    tsyringe_1.container.registerSingleton('CacheService', RedisCache_1.RedisCache);
    tsyringe_1.container.registerSingleton('Logger', WinstonLogger_1.WinstonLogger);
    tsyringe_1.container.registerSingleton('StorageService', LocalStorageService_1.LocalStorageService);
    tsyringe_1.container.registerSingleton('LMSAdapter', LMSAdapter_1.LMSAdapter);
    tsyringe_1.container.registerSingleton('SISAdapter', SISAdapter_1.SISAdapter);
    tsyringe_1.container.registerSingleton('RegistrarUsuarioUseCase', usuario_1.RegistrarUsuarioUseCase);
    tsyringe_1.container.registerSingleton('AutenticarUsuarioUseCase', usuario_1.AutenticarUsuarioUseCase);
    tsyringe_1.container.registerSingleton('AssociarUsuarioInstituicaoUseCase', usuario_1.AssociarUsuarioInstituicaoUseCase);
    tsyringe_1.container.registerSingleton('VerificarPermissaoUseCase', usuario_1.VerificarPermissaoUseCase);
    tsyringe_1.container.registerSingleton('CriarReuniaoUseCase', criar_reuniao_usecase_1.CriarReuniaoUseCase);
}
//# sourceMappingURL=index.js.map