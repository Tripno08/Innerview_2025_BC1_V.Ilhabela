"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarAvaliacaoUseCase = void 0;
const app_error_1 = require("../../../shared/errors/app-error");
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
            avaliadorId: data.avaliadorId,
            disciplina: data.disciplina,
            conteudo: data.conteudo,
        };
        const estudanteAtualizado = await this.estudanteRepository.adicionarAvaliacao(data.estudanteId, avaliacaoData);
        const avaliacao = estudanteAtualizado.avaliacoes[estudanteAtualizado.avaliacoes.length - 1];
        return {
            estudante: estudanteAtualizado,
            avaliacao,
        };
    }
    validarAvaliacao(data) {
        const tiposValidos = ['PROVA', 'EXERCICIO', 'TRABALHO', 'PARTICIPACAO', 'OUTRO'];
        if (!tiposValidos.includes(data.tipo)) {
            throw new app_error_1.AppError(`Tipo de avaliação inválido. Valores válidos: ${tiposValidos.join(', ')}`, 400, 'INVALID_EVALUATION_TYPE');
        }
        if (data.pontuacao < 0 || data.pontuacao > 10) {
            throw new app_error_1.AppError('A pontuação deve estar entre 0 e 10', 400, 'INVALID_EVALUATION_SCORE');
        }
        const dataAvaliacao = new Date(data.data);
        const hoje = new Date();
        if (dataAvaliacao > hoje) {
            throw new app_error_1.AppError('A data da avaliação não pode ser futura', 400, 'INVALID_EVALUATION_DATE');
        }
    }
}
exports.RegistrarAvaliacaoUseCase = RegistrarAvaliacaoUseCase;
//# sourceMappingURL=registrar-avaliacao.use-case.js.map