"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntervencaoRepository = void 0;
const intervencao_entity_1 = require("@domain/entities/intervencao.entity");
const base_repository_1 = require("./base.repository");
const client_1 = require("@prisma/client");
const app_error_1 = require("@shared/errors/app-error");
class IntervencaoRepository extends base_repository_1.BaseRepository {
    async findAllCatalogo() {
        try {
            const modelos = await this.unitOfWork.withoutTransaction(prisma => prisma.catalogoIntervencao.findMany({
                where: { status: client_1.Status.ATIVO },
                include: this.getCatalogoIncludes(),
                orderBy: {
                    titulo: 'asc',
                },
            }));
            return modelos.map(m => this.mapToCatalogo(m));
        }
        catch (error) {
            this.handlePrismaError(error, 'Catálogo de Intervenção');
        }
    }
    async findCatalogoById(id) {
        try {
            const modelo = await this.unitOfWork.withoutTransaction(prisma => prisma.catalogoIntervencao.findUnique({
                where: { id },
                include: this.getCatalogoIncludes(),
            }));
            if (!modelo) {
                return null;
            }
            return this.mapToCatalogo(modelo);
        }
        catch (error) {
            this.handlePrismaError(error, 'Catálogo de Intervenção');
        }
    }
    async findCatalogoByTipo(tipo) {
        try {
            const modelos = await this.unitOfWork.withoutTransaction(prisma => prisma.catalogoIntervencao.findMany({
                where: {
                    tipo: tipo,
                    status: client_1.Status.ATIVO
                },
                include: this.getCatalogoIncludes(),
                orderBy: {
                    titulo: 'asc',
                },
            }));
            return modelos.map(m => this.mapToCatalogo(m));
        }
        catch (error) {
            this.handlePrismaError(error, 'Catálogo de Intervenção');
        }
    }
    async findCatalogoByDificuldade(dificuldadeId) {
        try {
            const modelos = await this.unitOfWork.withoutTransaction(prisma => prisma.catalogoIntervencao.findMany({
                where: {
                    status: client_1.Status.ATIVO,
                    dificuldadesAlvo: {
                        has: dificuldadeId,
                    },
                },
                include: this.getCatalogoIncludes(),
                orderBy: {
                    titulo: 'asc',
                },
            }));
            return modelos.map(m => this.mapToCatalogo(m));
        }
        catch (error) {
            this.handlePrismaError(error, 'Catálogo de Intervenção');
        }
    }
    async createCatalogo(data) {
        try {
            const modelo = await this.unitOfWork.withTransaction(async (prisma) => {
                const dadosComStatus = {
                    ...data,
                    status: data.status || client_1.Status.ATIVO,
                };
                return await prisma.catalogoIntervencao.create({
                    data: dadosComStatus,
                    include: this.getCatalogoIncludes(),
                });
            });
            return this.mapToCatalogo(modelo);
        }
        catch (error) {
            this.handlePrismaError(error, 'Catálogo de Intervenção');
        }
    }
    async updateCatalogo(id, data) {
        try {
            const modelo = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.catalogoIntervencao.update({
                    where: { id },
                    data,
                    include: this.getCatalogoIncludes(),
                });
            });
            return this.mapToCatalogo(modelo);
        }
        catch (error) {
            this.handlePrismaError(error, 'Catálogo de Intervenção');
        }
    }
    async deleteCatalogo(id) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                await prisma.catalogoIntervencao.delete({
                    where: { id },
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Catálogo de Intervenção');
        }
    }
    async findByEstudanteId(estudanteId) {
        try {
            const intervencoes = await this.unitOfWork.withoutTransaction(prisma => prisma.intervencao.findMany({
                where: { estudanteId },
                include: this.getIntervencaoIncludes(),
                orderBy: [
                    { status: 'asc' },
                    { dataInicio: 'desc' },
                ],
            }));
            return intervencoes.map(i => this.mapToIntervencao(i));
        }
        catch (error) {
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async findById(id) {
        try {
            const intervencao = await this.unitOfWork.withoutTransaction(prisma => prisma.intervencao.findUnique({
                where: { id },
                include: this.getIntervencaoIncludes(),
            }));
            if (!intervencao) {
                return null;
            }
            return this.mapToIntervencao(intervencao);
        }
        catch (error) {
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async create(data) {
        try {
            const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
                const dadosComStatus = {
                    ...data,
                    status: data.status || client_1.Status.ATIVO,
                    progresso: data.progresso || 0,
                };
                const estudante = await prisma.estudante.findUnique({
                    where: { id: dadosComStatus.estudanteId },
                });
                if (!estudante) {
                    throw new app_error_1.AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
                }
                if (dadosComStatus.intervencaoBaseId) {
                    const modelo = await prisma.catalogoIntervencao.findUnique({
                        where: { id: dadosComStatus.intervencaoBaseId },
                    });
                    if (!modelo) {
                        throw new app_error_1.AppError('Modelo de intervenção não encontrado', 404, 'INTERVENTION_MODEL_NOT_FOUND');
                    }
                }
                return await prisma.intervencao.create({
                    data: dadosComStatus,
                    include: this.getIntervencaoIncludes(),
                });
            });
            return this.mapToIntervencao(intervencao);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async update(id, data) {
        try {
            const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.intervencao.update({
                    where: { id },
                    data,
                    include: this.getIntervencaoIncludes(),
                });
            });
            return this.mapToIntervencao(intervencao);
        }
        catch (error) {
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async atualizarProgresso(id, progresso) {
        try {
            if (progresso < 0 || progresso > 100) {
                throw new app_error_1.AppError('Progresso deve estar entre 0 e 100', 400, 'INVALID_PROGRESS');
            }
            const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
                const existente = await prisma.intervencao.findUnique({
                    where: { id },
                });
                if (!existente) {
                    throw new app_error_1.AppError('Intervenção não encontrada', 404, 'INTERVENTION_NOT_FOUND');
                }
                if (existente.status !== client_1.Status.ATIVO) {
                    throw new app_error_1.AppError('Não é possível atualizar o progresso de uma intervenção inativa', 400, 'INTERVENTION_NOT_ACTIVE');
                }
                const dataFim = progresso === 100 ? new Date() : undefined;
                return await prisma.intervencao.update({
                    where: { id },
                    data: {
                        progresso,
                        dataFim,
                    },
                    include: this.getIntervencaoIncludes(),
                });
            });
            return this.mapToIntervencao(intervencao);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async concluir(id) {
        try {
            const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
                const existente = await prisma.intervencao.findUnique({
                    where: { id },
                });
                if (!existente) {
                    throw new app_error_1.AppError('Intervenção não encontrada', 404, 'INTERVENTION_NOT_FOUND');
                }
                if (existente.status !== client_1.Status.ATIVO) {
                    throw new app_error_1.AppError('Não é possível concluir uma intervenção inativa', 400, 'INTERVENTION_NOT_ACTIVE');
                }
                return await prisma.intervencao.update({
                    where: { id },
                    data: {
                        dataFim: new Date(),
                        progresso: 100,
                    },
                    include: this.getIntervencaoIncludes(),
                });
            });
            return this.mapToIntervencao(intervencao);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async cancelar(id) {
        try {
            const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
                const existente = await prisma.intervencao.findUnique({
                    where: { id },
                });
                if (!existente) {
                    throw new app_error_1.AppError('Intervenção não encontrada', 404, 'INTERVENTION_NOT_FOUND');
                }
                return await prisma.intervencao.update({
                    where: { id },
                    data: {
                        status: client_1.Status.CANCELADO,
                    },
                    include: this.getIntervencaoIncludes(),
                });
            });
            return this.mapToIntervencao(intervencao);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    getCatalogoIncludes() {
        return {};
    }
    getIntervencaoIncludes() {
        return {
            estudante: {
                select: {
                    id: true,
                    nome: true,
                    serie: true,
                },
            },
            intervencaoBase: true,
        };
    }
    mapToCatalogo(modeloPrisma) {
        return intervencao_entity_1.CatalogoIntervencao.restaurar({
            id: modeloPrisma.id,
            titulo: modeloPrisma.titulo,
            descricao: modeloPrisma.descricao,
            tipo: modeloPrisma.tipo,
            status: modeloPrisma.status,
            duracao: modeloPrisma.duracao,
            dificuldadesAlvo: modeloPrisma.dificuldadesAlvo || [],
            publico: modeloPrisma.publico || [],
            recursos: modeloPrisma.recursos || [],
            criadoEm: modeloPrisma.criadoEm,
            atualizadoEm: modeloPrisma.atualizadoEm,
        });
    }
    mapToIntervencao(intervencaoPrisma) {
        return intervencao_entity_1.Intervencao.restaurar({
            id: intervencaoPrisma.id,
            titulo: intervencaoPrisma.titulo,
            descricao: intervencaoPrisma.descricao,
            tipo: intervencaoPrisma.tipo,
            status: intervencaoPrisma.status,
            dataInicio: intervencaoPrisma.dataInicio,
            dataFim: intervencaoPrisma.dataFim,
            estudanteId: intervencaoPrisma.estudanteId,
            intervencaoBaseId: intervencaoPrisma.intervencaoBaseId,
            observacoes: intervencaoPrisma.observacoes,
            progresso: intervencaoPrisma.progresso || 0,
            criadoEm: intervencaoPrisma.criadoEm,
            atualizadoEm: intervencaoPrisma.atualizadoEm,
        });
    }
}
exports.IntervencaoRepository = IntervencaoRepository;
//# sourceMappingURL=intervencao.repository.js.map