"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntervencaoRepository = void 0;
const tsyringe_1 = require("tsyringe");
const app_error_1 = require("@shared/errors/app-error");
const intervencao_entity_1 = require("@domain/entities/intervencao.entity");
const base_repository_1 = require("./base.repository");
const enums_1 = require("@shared/enums");
const enum_mappers_1 = require("@shared/utils/enum-mappers");
const unit_of_work_1 = require("../database/unit-of-work");
let IntervencaoRepository = class IntervencaoRepository extends base_repository_1.BaseRepository {
    constructor(unitOfWork) {
        super(unitOfWork);
    }
    async findAll() {
        try {
            const intervencoes = await this.unitOfWork.withoutTransaction((prisma) => prisma.intervencao.findMany({
                include: this.getIntervencaoIncludes(),
                orderBy: {
                    dataInicio: 'desc',
                },
            }));
            return intervencoes.map((i) => this.mapToIntervencao(i));
        }
        catch (error) {
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async findAllCatalogo() {
        try {
            const modelos = await this.unitOfWork.withoutTransaction((prisma) => prisma.catalogoIntervencao.findMany({
                include: this.getCatalogoIncludes(),
                orderBy: {
                    titulo: 'asc',
                },
            }));
            return modelos.map((m) => this.mapToCatalogo(m));
        }
        catch (error) {
            this.handlePrismaError(error, 'Catálogo de Intervenção');
        }
    }
    async findCatalogoById(id) {
        try {
            const modelo = await this.unitOfWork.withoutTransaction((prisma) => prisma.catalogoIntervencao.findUnique({
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
            const modelos = await this.unitOfWork.withoutTransaction((prisma) => prisma.catalogoIntervencao.findMany({
                where: {
                    tipo: tipo.toString(),
                },
                include: this.getCatalogoIncludes(),
            }));
            return modelos.map((m) => this.mapToCatalogo(m));
        }
        catch (error) {
            this.handlePrismaError(error, 'Catálogo de Intervenção');
        }
    }
    async findCatalogoByDificuldade(dificuldadeId) {
        try {
            const modelos = await this.unitOfWork.withoutTransaction((prisma) => prisma.catalogoIntervencao.findMany({
                where: {
                    titulo: { contains: dificuldadeId },
                },
                include: this.getCatalogoIncludes(),
            }));
            return modelos.map((m) => this.mapToCatalogo(m));
        }
        catch (error) {
            this.handlePrismaError(error, 'Catálogo de Intervenção');
        }
    }
    async createCatalogo(data) {
        try {
            const tipoData = data.tipo;
            const tituloData = data.titulo;
            const descricaoData = data.descricao;
            const duracaoData = data.duracao;
            const dificuldadesAlvoData = data.dificuldadesAlvo;
            const publicoData = data.publico;
            const recursosData = data.recursos;
            const modelo = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.catalogoIntervencao.create({
                    data: {
                        titulo: tituloData,
                        descricao: descricaoData,
                        tipo: tipoData.toString(),
                        status: (0, enum_mappers_1.mapLocalStatusToPrisma)(enums_1.Status.ATIVO),
                        duracao: duracaoData,
                        dificuldadesAlvo: dificuldadesAlvoData,
                        publico: publicoData,
                        recursos: recursosData,
                    },
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
            const tipoData = data.tipo;
            const tituloData = data.titulo;
            const descricaoData = data.descricao;
            const duracaoData = data.duracao;
            const dificuldadesAlvoData = data.dificuldadesAlvo;
            const publicoData = data.publico;
            const recursosData = data.recursos;
            const modelo = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.catalogoIntervencao.update({
                    where: { id },
                    data: {
                        ...(tituloData && { titulo: tituloData }),
                        ...(descricaoData && { descricao: descricaoData }),
                        ...(tipoData && { tipo: tipoData.toString() }),
                        ...(duracaoData !== undefined && { duracao: duracaoData }),
                        ...(dificuldadesAlvoData && { dificuldadesAlvo: dificuldadesAlvoData }),
                        ...(publicoData && { publico: publicoData }),
                        ...(recursosData && { recursos: recursosData }),
                    },
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
        return this.findByEstudante(estudanteId);
    }
    async findByEstudante(estudanteId) {
        try {
            const intervencoes = await this.unitOfWork.withoutTransaction((prisma) => prisma.intervencao.findMany({
                where: {
                    estudanteId,
                },
                include: this.getIntervencaoIncludes(),
                orderBy: {
                    dataInicio: 'desc',
                },
            }));
            return intervencoes.map((i) => this.mapToIntervencao(i));
        }
        catch (error) {
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async findById(id) {
        try {
            const intervencao = await this.unitOfWork.withoutTransaction((prisma) => prisma.intervencao.findUnique({
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
            let catalogoIntervencao = null;
            if (data.intervencaoBaseId) {
                catalogoIntervencao = await this.findCatalogoById(data.intervencaoBaseId);
            }
            const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
                const createData = {
                    tipo: data.tipo?.toString() || catalogoIntervencao?.tipo || 'PEDAGOGICA',
                    descricao: data.descricao || catalogoIntervencao?.descricao || '',
                    estudanteId: data.estudanteId,
                    dataInicio: data.dataInicio || new Date(),
                    dataFim: data.dataFim || null,
                    status: (0, enum_mappers_1.mapLocalStatusToPrisma)(data.status || enums_1.Status.EM_ANDAMENTO),
                    intervencaoBaseId: data.intervencaoBaseId || null,
                    observacoes: data.observacoes || null,
                    progresso: data.progresso || 0,
                    progressos: {
                        create: [
                            {
                                valor: data.progresso || 0,
                                data: new Date(),
                                observacao: 'Progresso inicial',
                            },
                        ],
                    },
                };
                return await prisma.intervencao.create({
                    data: createData,
                    include: this.getIntervencaoIncludes(),
                });
            });
            return this.mapToIntervencao(intervencao);
        }
        catch (error) {
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async update(id, data) {
        try {
            const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.intervencao.update({
                    where: { id },
                    data: {
                        ...(data.tipo && { tipo: data.tipo.toString() }),
                        ...(data.descricao && { descricao: data.descricao }),
                        ...(data.dataInicio && { dataInicio: data.dataInicio }),
                        ...(data.dataFim !== undefined && { dataFim: data.dataFim }),
                        ...(data.status && { status: (0, enum_mappers_1.mapLocalStatusToPrisma)(data.status) }),
                        ...(data.intervencaoBaseId !== undefined && {
                            intervencaoBaseId: data.intervencaoBaseId,
                        }),
                        ...(data.observacoes !== undefined && { observacoes: data.observacoes }),
                        ...(data.progresso !== undefined && { progresso: data.progresso }),
                    },
                    include: this.getIntervencaoIncludes(),
                });
            });
            return this.mapToIntervencao(intervencao);
        }
        catch (error) {
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async delete(id) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                await prisma.intervencao.delete({
                    where: { id },
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async atualizarProgresso(id, progresso) {
        return this.registrarProgresso(id, progresso);
    }
    async registrarProgresso(id, valor, observacao) {
        try {
            if (valor < 0 || valor > 100) {
                throw new app_error_1.AppError('Valor de progresso deve estar entre 0 e 100', 400);
            }
            const intervencaoAtual = await this.findById(id);
            if (!intervencaoAtual) {
                throw new app_error_1.AppError('Intervenção não encontrada', 404);
            }
            let status = intervencaoAtual.status;
            if (valor === 100) {
                status = enums_1.Status.CONCLUIDO;
            }
            else if (valor > 0) {
                status = enums_1.Status.EM_ANDAMENTO;
            }
            const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
                await prisma.progressoIntervencao.create({
                    data: {
                        intervencaoId: id,
                        valor: valor,
                        data: new Date(),
                        observacao: observacao || null,
                    },
                });
                return await prisma.intervencao.update({
                    where: { id },
                    data: {
                        status: (0, enum_mappers_1.mapLocalStatusToPrisma)(status),
                        ...(valor === 100 && { dataFim: new Date() }),
                    },
                    include: this.getIntervencaoIncludes(),
                });
            });
            const result = this.mapToIntervencao(intervencao);
            return Object.assign({}, result, { progresso: valor });
        }
        catch (error) {
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async concluir(id) {
        try {
            const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
                await prisma.progressoIntervencao.create({
                    data: {
                        intervencaoId: id,
                        valor: 100,
                        data: new Date(),
                        observacao: 'Intervenção concluída',
                    },
                });
                return await prisma.intervencao.update({
                    where: { id },
                    data: {
                        status: (0, enum_mappers_1.mapLocalStatusToPrisma)(enums_1.Status.CONCLUIDO),
                        dataFim: new Date(),
                    },
                    include: this.getIntervencaoIncludes(),
                });
            });
            const result = this.mapToIntervencao(intervencao);
            return Object.assign({}, result, { progresso: 100 });
        }
        catch (error) {
            this.handlePrismaError(error, 'Intervenção');
        }
    }
    async cancelar(id) {
        try {
            const intervencao = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.intervencao.update({
                    where: { id },
                    data: {
                        status: (0, enum_mappers_1.mapLocalStatusToPrisma)(enums_1.Status.CANCELADO),
                        dataFim: new Date(),
                    },
                    include: this.getIntervencaoIncludes(),
                });
            });
            return this.mapToIntervencao(intervencao);
        }
        catch (error) {
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
        return {
            id: modeloPrisma.id,
            titulo: modeloPrisma.titulo,
            descricao: modeloPrisma.descricao,
            tipo: modeloPrisma.tipo,
            status: (0, enum_mappers_1.mapPrismaStatusToLocal)(modeloPrisma.status),
            duracao: modeloPrisma.duracao,
            dificuldadesAlvo: modeloPrisma.dificuldadesAlvo || [],
            publico: modeloPrisma.publico || [],
            recursos: modeloPrisma.recursos || [],
            criadoEm: modeloPrisma.criadoEm,
            atualizadoEm: modeloPrisma.atualizadoEm,
        };
    }
    mapToIntervencao(intervencaoPrisma) {
        const { id, tipo, descricao, status: statusString, dataInicio, dataFim, estudanteId, intervencaoBaseId, observacoes, progresso, criadoEm, atualizadoEm, } = intervencaoPrisma;
        const props = {
            id,
            titulo: descricao.substring(0, 50),
            tipo: tipo,
            descricao,
            status: (0, enum_mappers_1.mapPrismaStatusToLocal)(statusString),
            dataInicio,
            dataFim,
            estudanteId,
            intervencaoBaseId,
            observacoes,
            progresso: progresso || 0,
            criadoEm,
            atualizadoEm,
        };
        return intervencao_entity_1.Intervencao.restaurar(props);
    }
};
exports.IntervencaoRepository = IntervencaoRepository;
exports.IntervencaoRepository = IntervencaoRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [unit_of_work_1.UnitOfWork])
], IntervencaoRepository);
//# sourceMappingURL=intervencao.repository.js.map