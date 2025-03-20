"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificarPermissaoUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
class VerificarPermissaoUseCase {
    usuarioRepository;
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async execute(dados) {
        const usuario = await this.usuarioRepository.findById(dados.usuarioId);
        if (!usuario) {
            throw new app_error_1.AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
        }
        if (usuario.ehAdministrador()) {
            return true;
        }
        if (dados.instituicaoId) {
            const pertenceInstituicao = await this.usuarioRepository.verificarPertencimentoInstituicao(dados.usuarioId, dados.instituicaoId);
            if (!pertenceInstituicao) {
                return false;
            }
            const instituicoes = await this.usuarioRepository.listarInstituicoesDoUsuario(dados.usuarioId);
            const instituicao = instituicoes.find((inst) => inst.id === dados.instituicaoId);
            if (!instituicao) {
                return false;
            }
            return dados.cargosPermitidos.includes(instituicao.cargo);
        }
        return usuario.temPermissao(dados.cargosPermitidos);
    }
}
exports.VerificarPermissaoUseCase = VerificarPermissaoUseCase;
//# sourceMappingURL=verificar-permissao.use-case.js.map