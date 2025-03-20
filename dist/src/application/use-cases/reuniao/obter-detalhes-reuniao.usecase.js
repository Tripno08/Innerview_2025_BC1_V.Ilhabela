"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterDetalhesReuniaoUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
class ObterDetalhesReuniaoUseCase {
    reuniaoRepository;
    constructor(reuniaoRepository) {
        this.reuniaoRepository = reuniaoRepository;
    }
    async execute(reuniaoId) {
        const reuniao = await this.reuniaoRepository.findById(reuniaoId);
        if (!reuniao) {
            throw new app_error_1.AppError('Reunião não encontrada', 404, 'MEETING_NOT_FOUND');
        }
        const participantes = await this.reuniaoRepository.listarParticipantes(reuniaoId);
        const encaminhamentos = await this.reuniaoRepository.listarEncaminhamentos(reuniaoId);
        return {
            reuniao,
            participantes,
            encaminhamentos,
        };
    }
}
exports.ObterDetalhesReuniaoUseCase = ObterDetalhesReuniaoUseCase;
//# sourceMappingURL=obter-detalhes-reuniao.usecase.js.map