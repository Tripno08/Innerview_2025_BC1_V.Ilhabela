"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociarUsuarioInstituicaoUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
class AssociarUsuarioInstituicaoUseCase {
    usuarioRepository;
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async execute(dados) {
        const usuario = await this.usuarioRepository.findById(dados.usuarioId);
        if (!usuario) {
            throw new app_error_1.AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
        }
        const jaAssociado = await this.usuarioRepository.verificarPertencimentoInstituicao(dados.usuarioId, dados.instituicaoId);
        if (jaAssociado) {
            throw new app_error_1.AppError('Usuário já está associado a esta instituição', 409, 'USER_ALREADY_ASSOCIATED');
        }
        await this.usuarioRepository.associarAInstituicao(dados.usuarioId, dados.instituicaoId, dados.cargo);
    }
}
exports.AssociarUsuarioInstituicaoUseCase = AssociarUsuarioInstituicaoUseCase;
//# sourceMappingURL=associar-usuario-instituicao.use-case.js.map