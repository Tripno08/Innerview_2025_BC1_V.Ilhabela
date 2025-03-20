"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociarDificuldadeUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
class AssociarDificuldadeUseCase {
    estudanteRepository;
    dificuldadeRepository;
    constructor(estudanteRepository, dificuldadeRepository) {
        this.estudanteRepository = estudanteRepository;
        this.dificuldadeRepository = dificuldadeRepository;
    }
    async execute(data) {
        const estudante = await this.estudanteRepository.findById(data.estudanteId);
        if (!estudante) {
            throw new app_error_1.AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
        }
        const dificuldade = await this.dificuldadeRepository.findById(data.dificuldadeId);
        if (!dificuldade) {
            throw new app_error_1.AppError('Dificuldade de aprendizagem não encontrada', 404, 'DIFFICULTY_NOT_FOUND');
        }
        if (!dificuldade.estaAtiva()) {
            throw new app_error_1.AppError('Dificuldade de aprendizagem inativa não pode ser associada', 400, 'INACTIVE_DIFFICULTY');
        }
        const dificuldadesAtuais = await this.dificuldadeRepository.findByEstudanteId(data.estudanteId);
        if (dificuldadesAtuais.some(d => d.id === data.dificuldadeId)) {
            throw new app_error_1.AppError('Dificuldade já está associada a este estudante', 409, 'DIFFICULTY_ALREADY_ASSOCIATED');
        }
        const estudanteAtualizado = await this.estudanteRepository.adicionarDificuldade(data.estudanteId, data.dificuldadeId);
        return { estudante: estudanteAtualizado };
    }
}
exports.AssociarDificuldadeUseCase = AssociarDificuldadeUseCase;
//# sourceMappingURL=associar-dificuldade.use-case.js.map