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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificarPermissaoUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
const tsyringe_1 = require("tsyringe");
let VerificarPermissaoUseCase = class VerificarPermissaoUseCase {
    usuarioRepository;
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async execute({ usuarioId, instituicaoId, cargosPermitidos, }) {
        const usuario = await this.usuarioRepository.findById(usuarioId);
        if (!usuario) {
            throw new app_error_1.AppError('Usuário não encontrado', 404);
        }
        if (usuario.ehAdministrador()) {
            return true;
        }
        if (!instituicaoId) {
            return usuario.temPermissao(cargosPermitidos);
        }
        const pertencimento = await this.usuarioRepository.verificarPertencimentoInstituicao(usuarioId, instituicaoId);
        if (!pertencimento.pertence) {
            throw new app_error_1.AppError('Usuário não pertence à instituição', 403);
        }
        const cargoNaInstituicao = pertencimento.cargo;
        if (!cargoNaInstituicao) {
            return usuario.temPermissao(cargosPermitidos);
        }
        return cargosPermitidos.includes(cargoNaInstituicao);
    }
};
exports.VerificarPermissaoUseCase = VerificarPermissaoUseCase;
exports.VerificarPermissaoUseCase = VerificarPermissaoUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('UsuarioRepository')),
    __metadata("design:paramtypes", [Object])
], VerificarPermissaoUseCase);
//# sourceMappingURL=verificar-permissao.use-case.js.map