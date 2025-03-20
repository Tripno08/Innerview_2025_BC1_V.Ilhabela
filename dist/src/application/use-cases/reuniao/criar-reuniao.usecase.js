"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarReuniaoUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
class CriarReuniaoUseCase {
    reuniaoRepository;
    constructor(reuniaoRepository) {
        this.reuniaoRepository = reuniaoRepository;
    }
    async execute(dados) {
        if (!dados.titulo) {
            throw new app_error_1.AppError('Título da reunião é obrigatório', 400, 'INVALID_INPUT');
        }
        if (!dados.data) {
            throw new app_error_1.AppError('Data da reunião é obrigatória', 400, 'INVALID_INPUT');
        }
        if (!dados.equipeId) {
            throw new app_error_1.AppError('ID da equipe é obrigatório', 400, 'INVALID_INPUT');
        }
        const reuniao = await this.reuniaoRepository.create({
            titulo: dados.titulo,
            data: dados.data,
            local: dados.local,
            equipeId: dados.equipeId,
            observacoes: dados.observacoes,
            status: dados.status || 'AGENDADO',
        });
        if (dados.participantes && dados.participantes.length > 0) {
            for (const usuarioId of dados.participantes) {
                try {
                    await this.reuniaoRepository.adicionarParticipante(reuniao.id, usuarioId);
                }
                catch (error) {
                    console.error(`Erro ao adicionar participante ${usuarioId} à reunião ${reuniao.id}:`, error);
                }
            }
        }
        return reuniao;
    }
}
exports.CriarReuniaoUseCase = CriarReuniaoUseCase;
//# sourceMappingURL=criar-reuniao.usecase.js.map