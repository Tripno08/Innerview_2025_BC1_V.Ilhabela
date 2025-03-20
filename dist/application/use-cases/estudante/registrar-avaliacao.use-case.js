"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarAvaliacaoUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
class RegistrarAvaliacaoUseCase {
    estudanteRepository;
    constructor(estudanteRepository) {
        this.estudanteRepository = estudanteRepository;
    }
    async execute(data) {
        const estudante = await this.estudanteRepository.findById(data.estudanteId);
        if (!estudante) {
            throw new app_error_1.AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
        }
        this.validarAvaliacao(data);
        const avaliacaoData = {
            data: new Date(data.data),
            tipo: data.tipo,
            pontuacao: data.pontuacao,
            observacoes: data.observacoes,
        };
        try {
            const estudanteAtualizado = await this.estudanteRepository.adicionarAvaliacao(data.estudanteId, avaliacaoData);
            const avaliacaoAdicionada = estudanteAtualizado.avaliacoes[estudanteAtualizado.avaliacoes.length - 1];
            return {
                estudante: estudanteAtualizado,
                avaliacao: avaliacaoAdicionada,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new app_error_1.AppError(`Erro ao registrar avaliação: ${error.message}`, 400, 'ASSESSMENT_CREATION_ERROR');
            }
            throw error;
        }
    }
    validarAvaliacao(data) {
        const dataAvaliacao = new Date(data.data);
        const hoje = new Date();
        if (dataAvaliacao > hoje) {
            throw new app_error_1.AppError('Data da avaliação não pode ser futura', 400, 'INVALID_ASSESSMENT_DATE');
        }
        if (!data.tipo || data.tipo.trim() === '') {
            throw new app_error_1.AppError('Tipo de avaliação é obrigatório', 400, 'INVALID_ASSESSMENT_TYPE');
        }
        if (data.pontuacao < 0 || data.pontuacao > 10) {
            throw new app_error_1.AppError('Pontuação deve estar entre 0 e 10', 400, 'INVALID_ASSESSMENT_SCORE');
        }
    }
}
exports.RegistrarAvaliacaoUseCase = RegistrarAvaliacaoUseCase;
//# sourceMappingURL=registrar-avaliacao.use-case.js.map