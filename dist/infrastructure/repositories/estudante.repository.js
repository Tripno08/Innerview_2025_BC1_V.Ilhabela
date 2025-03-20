"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstudanteRepository = void 0;
const estudante_entity_1 = require("@domain/entities/estudante.entity");
const dificuldade_aprendizagem_entity_1 = require("@domain/entities/dificuldade-aprendizagem.entity");
const base_repository_1 = require("./base.repository");
const client_1 = require("@prisma/client");
const app_error_1 = require("@shared/errors/app-error");
class EstudanteRepository extends base_repository_1.BaseRepository {
    async findAll() {
        try {
            const estudantes = await this.unitOfWork.withoutTransaction(prisma => prisma.estudante.findMany({
                include: this.getEstudanteIncludes(),
                orderBy: {
                    nome: 'asc',
                },
            }));
            return estudantes.map(e => this.mapToEstudante(e));
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante');
        }
    }
    async findByUsuarioId(usuarioId) {
        try {
            const estudantes = await this.unitOfWork.withoutTransaction(prisma => prisma.estudante.findMany({
                where: { usuarioId },
                include: this.getEstudanteIncludes(),
                orderBy: {
                    nome: 'asc',
                },
            }));
            return estudantes.map(e => this.mapToEstudante(e));
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante');
        }
    }
    async findById(id) {
        try {
            const estudante = await this.unitOfWork.withoutTransaction(prisma => prisma.estudante.findUnique({
                where: { id },
                include: this.getEstudanteIncludes(),
            }));
            if (!estudante) {
                return null;
            }
            return this.mapToEstudante(estudante);
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante');
        }
    }
    async create(data) {
        try {
            const estudante = await this.unitOfWork.withTransaction(async (prisma) => {
                const dadosComStatus = {
                    ...data,
                    status: data.status || client_1.Status.ATIVO,
                };
                return await prisma.estudante.create({
                    data: dadosComStatus,
                    include: this.getEstudanteIncludes(),
                });
            });
            return this.mapToEstudante(estudante);
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante');
        }
    }
    async update(id, data) {
        try {
            const estudante = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.estudante.update({
                    where: { id },
                    data,
                    include: this.getEstudanteIncludes(),
                });
            });
            return this.mapToEstudante(estudante);
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante');
        }
    }
    async delete(id) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                await prisma.estudanteDificuldade.deleteMany({
                    where: { estudanteId: id },
                });
                await prisma.avaliacao.deleteMany({
                    where: { estudanteId: id },
                });
                await prisma.intervencao.deleteMany({
                    where: { estudanteId: id },
                });
                await prisma.estudante.delete({
                    where: { id },
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante');
        }
    }
    async adicionarDificuldade(estudanteId, dificuldadeId) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const estudante = await prisma.estudante.findUnique({
                    where: { id: estudanteId },
                });
                if (!estudante) {
                    throw new app_error_1.AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
                }
                const dificuldade = await prisma.dificuldadeAprendizagem.findUnique({
                    where: { id: dificuldadeId },
                });
                if (!dificuldade) {
                    throw new app_error_1.AppError('Dificuldade não encontrada', 404, 'DIFFICULTY_NOT_FOUND');
                }
                const associacaoExistente = await prisma.estudanteDificuldade.findUnique({
                    where: {
                        estudanteId_dificuldadeId: {
                            estudanteId,
                            dificuldadeId,
                        },
                    },
                });
                if (associacaoExistente) {
                    throw new app_error_1.AppError('Dificuldade já associada a este estudante', 409, 'DIFFICULTY_ALREADY_ASSOCIATED');
                }
                await prisma.estudanteDificuldade.create({
                    data: {
                        estudanteId,
                        dificuldadeId,
                    },
                });
            });
            return await this.findById(estudanteId);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Estudante-Dificuldade');
        }
    }
    async removerDificuldade(estudanteId, dificuldadeId) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const associacao = await prisma.estudanteDificuldade.findUnique({
                    where: {
                        estudanteId_dificuldadeId: {
                            estudanteId,
                            dificuldadeId,
                        },
                    },
                });
                if (!associacao) {
                    throw new app_error_1.AppError('Dificuldade não está associada a este estudante', 404, 'DIFFICULTY_NOT_ASSOCIATED');
                }
                await prisma.estudanteDificuldade.delete({
                    where: {
                        estudanteId_dificuldadeId: {
                            estudanteId,
                            dificuldadeId,
                        },
                    },
                });
            });
            return await this.findById(estudanteId);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Estudante-Dificuldade');
        }
    }
    async adicionarAvaliacao(estudanteId, avaliacaoData) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const estudante = await prisma.estudante.findUnique({
                    where: { id: estudanteId },
                });
                if (!estudante) {
                    throw new app_error_1.AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
                }
                await prisma.avaliacao.create({
                    data: {
                        ...avaliacaoData,
                        estudanteId,
                    },
                });
            });
            return await this.findById(estudanteId);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Avaliação');
        }
    }
    async buscarEstudantesComNecessidadesSimilares(dificuldadeIds) {
        try {
            const estudantes = await this.unitOfWork.withoutTransaction(prisma => prisma.estudante.findMany({
                where: {
                    dificuldades: {
                        some: {
                            dificuldadeId: {
                                in: dificuldadeIds,
                            },
                        },
                    },
                },
                include: this.getEstudanteIncludes(),
                orderBy: {
                    nome: 'asc',
                },
            }));
            return estudantes.map(e => this.mapToEstudante(e));
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante');
        }
    }
    getEstudanteIncludes() {
        return {
            avaliacoes: true,
            dificuldades: {
                include: {
                    dificuldade: true,
                },
            },
            usuario: {
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    cargo: true,
                },
            },
        };
    }
    mapToEstudante(estudantePrisma) {
        const dificuldades = estudantePrisma.dificuldades?.map(rel => dificuldade_aprendizagem_entity_1.DificuldadeAprendizagem.restaurar({
            ...rel.dificuldade,
        })) || [];
        return estudante_entity_1.Estudante.restaurar({
            id: estudantePrisma.id,
            nome: estudantePrisma.nome,
            serie: estudantePrisma.serie,
            dataNascimento: estudantePrisma.dataNascimento,
            status: estudantePrisma.status,
            usuarioId: estudantePrisma.usuarioId,
            dificuldades,
            avaliacoes: estudantePrisma.avaliacoes || [],
            criadoEm: estudantePrisma.criadoEm,
            atualizadoEm: estudantePrisma.atualizadoEm,
        });
    }
}
exports.EstudanteRepository = EstudanteRepository;
//# sourceMappingURL=estudante.repository.js.map