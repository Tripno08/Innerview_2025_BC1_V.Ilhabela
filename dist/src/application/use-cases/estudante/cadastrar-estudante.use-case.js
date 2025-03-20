"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CadastrarEstudanteUseCase = void 0;
const app_error_1 = require("@shared/errors/app-error");
class CadastrarEstudanteUseCase {
    estudanteRepository;
    usuarioRepository;
    constructor(estudanteRepository, usuarioRepository) {
        this.estudanteRepository = estudanteRepository;
        this.usuarioRepository = usuarioRepository;
    }
    async execute(data) {
        const usuario = await this.usuarioRepository.findById(data.usuarioId);
        if (!usuario) {
            throw new app_error_1.AppError('Professor não encontrado', 404, 'TEACHER_NOT_FOUND');
        }
        const dataNascimento = new Date(data.dataNascimento);
        const hoje = new Date();
        if (dataNascimento > hoje) {
            throw new app_error_1.AppError('Data de nascimento não pode ser futura', 400, 'INVALID_BIRTH_DATE');
        }
        if (!data.serie || data.serie.trim() === '') {
            throw new app_error_1.AppError('Série é obrigatória', 400, 'INVALID_GRADE');
        }
        try {
            const estudante = await this.estudanteRepository.create({
                nome: data.nome,
                serie: data.serie,
                dataNascimento,
                usuarioId: data.usuarioId,
            });
            return { estudante };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new app_error_1.AppError(`Erro ao cadastrar estudante: ${error.message}`, 400, 'STUDENT_CREATION_ERROR');
            }
            throw error;
        }
    }
}
exports.CadastrarEstudanteUseCase = CadastrarEstudanteUseCase;
//# sourceMappingURL=cadastrar-estudante.use-case.js.map