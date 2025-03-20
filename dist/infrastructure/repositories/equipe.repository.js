"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeRepository = void 0;
const equipe_entity_1 = require("@domain/entities/equipe.entity");
const base_repository_1 = require("./base.repository");
const app_error_1 = require("@shared/errors/app-error");
class EquipeRepository extends base_repository_1.BaseRepository {
    async findAll() {
        try {
            const equipes = await this.unitOfWork.withoutTransaction(prisma => prisma.equipe.findMany({
                include: this.getEquipeIncludes(),
                orderBy: {
                    nome: 'asc',
                },
            }));
            return equipes.map(e => this.mapToEquipe(e));
        }
        catch (error) {
            this.handlePrismaError(error, 'Equipe');
        }
    }
    async findByUsuarioId(usuarioId) {
        try {
            const equipes = await this.unitOfWork.withoutTransaction(prisma => prisma.equipe.findMany({
                where: {
                    membros: {
                        some: {
                            usuarioId,
                        },
                    },
                },
                include: this.getEquipeIncludes(),
                orderBy: {
                    nome: 'asc',
                },
            }));
            return equipes.map(e => this.mapToEquipe(e));
        }
        catch (error) {
            this.handlePrismaError(error, 'Equipe');
        }
    }
    async findById(id) {
        try {
            const equipe = await this.unitOfWork.withoutTransaction(prisma => prisma.equipe.findUnique({
                where: { id },
                include: this.getEquipeIncludes(),
            }));
            if (!equipe) {
                return null;
            }
            return this.mapToEquipe(equipe);
        }
        catch (error) {
            this.handlePrismaError(error, 'Equipe');
        }
    }
    async create(data) {
        try {
            const equipe = await this.unitOfWork.withTransaction(async (prisma) => {
                const dadosComStatus = {
                    ...data,
                    ativo: data.ativo !== undefined ? data.ativo : true,
                };
                return await prisma.equipe.create({
                    data: dadosComStatus,
                    include: this.getEquipeIncludes(),
                });
            });
            return this.mapToEquipe(equipe);
        }
        catch (error) {
            this.handlePrismaError(error, 'Equipe');
        }
    }
    async update(id, data) {
        try {
            const equipe = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.equipe.update({
                    where: { id },
                    data,
                    include: this.getEquipeIncludes(),
                });
            });
            return this.mapToEquipe(equipe);
        }
        catch (error) {
            this.handlePrismaError(error, 'Equipe');
        }
    }
    async delete(id) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                await prisma.membroEquipe.deleteMany({
                    where: { equipeId: id },
                });
                await prisma.estudanteEquipe.deleteMany({
                    where: { equipeId: id },
                });
                await prisma.encaminhamento.updateMany({
                    where: { equipeId: id },
                    data: { equipeId: null },
                });
                await prisma.reuniao.updateMany({
                    where: { equipeId: id },
                    data: { equipeId: null },
                });
                await prisma.equipe.delete({
                    where: { id },
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Equipe');
        }
    }
    async adicionarMembro(equipeId, usuarioId, funcao) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const equipe = await prisma.equipe.findUnique({
                    where: { id: equipeId },
                });
                if (!equipe) {
                    throw new app_error_1.AppError('Equipe não encontrada', 404, 'TEAM_NOT_FOUND');
                }
                const usuario = await prisma.usuario.findUnique({
                    where: { id: usuarioId },
                });
                if (!usuario) {
                    throw new app_error_1.AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
                }
                const membroExistente = await prisma.membroEquipe.findUnique({
                    where: {
                        equipeId_usuarioId: {
                            equipeId,
                            usuarioId,
                        },
                    },
                });
                if (membroExistente) {
                    throw new app_error_1.AppError('Usuário já é membro desta equipe', 409, 'USER_ALREADY_MEMBER');
                }
                await prisma.membroEquipe.create({
                    data: {
                        equipeId,
                        usuarioId,
                        funcao: funcao || 'Membro',
                    },
                });
            });
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Membro da Equipe');
        }
    }
    async removerMembro(equipeId, usuarioId) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const membro = await prisma.membroEquipe.findUnique({
                    where: {
                        equipeId_usuarioId: {
                            equipeId,
                            usuarioId,
                        },
                    },
                });
                if (!membro) {
                    throw new app_error_1.AppError('Usuário não é membro desta equipe', 404, 'USER_NOT_MEMBER');
                }
                await prisma.membroEquipe.delete({
                    where: {
                        equipeId_usuarioId: {
                            equipeId,
                            usuarioId,
                        },
                    },
                });
            });
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Membro da Equipe');
        }
    }
    async listarMembros(equipeId) {
        try {
            const membros = await this.unitOfWork.withoutTransaction(prisma => prisma.membroEquipe.findMany({
                where: { equipeId },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                            cargo: true,
                        },
                    },
                },
            }));
            return membros.map(m => ({
                ...m.usuario,
                funcao: m.funcao,
                membroDesde: m.criadoEm,
            }));
        }
        catch (error) {
            this.handlePrismaError(error, 'Membro da Equipe');
        }
    }
    async adicionarEstudante(equipeId, estudanteId) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const equipe = await prisma.equipe.findUnique({
                    where: { id: equipeId },
                });
                if (!equipe) {
                    throw new app_error_1.AppError('Equipe não encontrada', 404, 'TEAM_NOT_FOUND');
                }
                const estudante = await prisma.estudante.findUnique({
                    where: { id: estudanteId },
                });
                if (!estudante) {
                    throw new app_error_1.AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
                }
                const estudanteExistente = await prisma.estudanteEquipe.findUnique({
                    where: {
                        equipeId_estudanteId: {
                            equipeId,
                            estudanteId,
                        },
                    },
                });
                if (estudanteExistente) {
                    throw new app_error_1.AppError('Estudante já está nesta equipe', 409, 'STUDENT_ALREADY_IN_TEAM');
                }
                await prisma.estudanteEquipe.create({
                    data: {
                        equipeId,
                        estudanteId,
                    },
                });
            });
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Estudante da Equipe');
        }
    }
    async removerEstudante(equipeId, estudanteId) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const associacao = await prisma.estudanteEquipe.findUnique({
                    where: {
                        equipeId_estudanteId: {
                            equipeId,
                            estudanteId,
                        },
                    },
                });
                if (!associacao) {
                    throw new app_error_1.AppError('Estudante não está nesta equipe', 404, 'STUDENT_NOT_IN_TEAM');
                }
                await prisma.estudanteEquipe.delete({
                    where: {
                        equipeId_estudanteId: {
                            equipeId,
                            estudanteId,
                        },
                    },
                });
            });
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Estudante da Equipe');
        }
    }
    async listarEstudantes(equipeId) {
        try {
            const estudantes = await this.unitOfWork.withoutTransaction(prisma => prisma.estudanteEquipe.findMany({
                where: { equipeId },
                include: {
                    estudante: {
                        select: {
                            id: true,
                            nome: true,
                            serie: true,
                            dataNascimento: true,
                            usuario: {
                                select: {
                                    id: true,
                                    nome: true,
                                },
                            },
                        },
                    },
                },
            }));
            return estudantes.map(e => ({
                ...e.estudante,
                membroDesde: e.criadoEm,
            }));
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante da Equipe');
        }
    }
    getEquipeIncludes() {
        return {
            membros: {
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                            cargo: true,
                        },
                    },
                },
            },
            estudantes: {
                include: {
                    estudante: {
                        select: {
                            id: true,
                            nome: true,
                            serie: true,
                        },
                    },
                },
            },
        };
    }
    mapToEquipe(equipePrisma) {
        const membros = equipePrisma.membros?.map(m => ({
            id: m.usuario.id,
            nome: m.usuario.nome,
            email: m.usuario.email,
            cargo: m.usuario.cargo,
            funcao: m.funcao,
        })) || [];
        const estudantes = equipePrisma.estudantes?.map(e => ({
            id: e.estudante.id,
            nome: e.estudante.nome,
            serie: e.estudante.serie,
        })) || [];
        return equipe_entity_1.Equipe.restaurar({
            id: equipePrisma.id,
            nome: equipePrisma.nome,
            descricao: equipePrisma.descricao,
            ativo: equipePrisma.ativo,
            membros,
            estudantes,
            criadoEm: equipePrisma.criadoEm,
            atualizadoEm: equipePrisma.atualizadoEm,
        });
    }
}
exports.EquipeRepository = EquipeRepository;
//# sourceMappingURL=equipe.repository.js.map