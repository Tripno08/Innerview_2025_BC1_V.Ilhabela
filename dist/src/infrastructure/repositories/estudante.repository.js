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
exports.EstudanteRepository = void 0;
const estudante_entity_1 = require("@domain/entities/estudante.entity");
const dificuldade_aprendizagem_entity_1 = require("@domain/entities/dificuldade-aprendizagem.entity");
const base_repository_1 = require("./base.repository");
const enums_1 = require("@shared/enums");
const app_error_1 = require("@shared/errors/app-error");
const tsyringe_1 = require("tsyringe");
const unit_of_work_1 = require("../database/unit-of-work");
const enum_mappers_1 = require("@shared/utils/enum-mappers");
let EstudanteRepository = class EstudanteRepository extends base_repository_1.BaseRepository {
    constructor(unitOfWork) {
        super(unitOfWork);
    }
    async findAll() {
        try {
            const estudantes = await this.unitOfWork.withoutTransaction((prisma) => prisma.estudante.findMany({
                include: this.getEstudanteIncludes(),
                orderBy: {
                    nome: 'asc',
                },
            }));
            return estudantes.map((e) => this.mapToEstudante(e));
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante');
        }
    }
    async findByUsuarioId(usuarioId) {
        try {
            const estudantes = await this.unitOfWork.withoutTransaction((prisma) => prisma.estudante.findMany({
                where: { usuarioId },
                include: this.getEstudanteIncludes(),
                orderBy: {
                    nome: 'asc',
                },
            }));
            return estudantes.map((e) => this.mapToEstudante(e));
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante');
        }
    }
    async findById(id) {
        try {
            const estudante = await this.unitOfWork.withoutTransaction((prisma) => prisma.estudante.findUnique({
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
    adaptToPrismaCreate(data) {
        const { status, ...restData } = data;
        const dadosSemPropriedadesComplexas = this.removerPropriedadesEntidade(restData);
        const resultado = {
            ...dadosSemPropriedadesComplexas,
        };
        if (status) {
            resultado.status = (0, enum_mappers_1.mapStatusToPrisma)(status);
        }
        return resultado;
    }
    adaptToPrismaUpdate(data) {
        const { status, ...restData } = data;
        const dadosSemPropriedadesComplexas = this.removerPropriedadesEntidade(restData);
        const resultado = {
            ...dadosSemPropriedadesComplexas,
        };
        if (status) {
            resultado.status = (0, enum_mappers_1.mapStatusToPrisma)(status);
        }
        return resultado;
    }
    removerPropriedadesEntidade(data) {
        const propsParaRemover = [
            'calcularIdade',
            'calcularMediaAvaliacoes',
            'estaAtivo',
            'inativar',
            'possuiDificuldadeGrave',
            'adicionarAvaliacao',
            'adicionarDificuldade',
            'atualizar',
            'removerDificuldade',
            'dificuldades',
            'avaliacoes',
        ];
        const resultado = { ...data };
        for (const prop of propsParaRemover) {
            if (prop in resultado) {
                delete resultado[prop];
            }
        }
        return resultado;
    }
    async create(data) {
        try {
            const prismaData = this.adaptToPrismaCreate(data);
            const estudante = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.estudante.create({
                    data: prismaData,
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
            const prismaData = this.adaptToPrismaUpdate(data);
            const estudante = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.estudante.update({
                    where: { id },
                    data: prismaData,
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
    async adicionarDificuldade(estudanteId, dificuldadeId, dadosAdicionais) {
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
                const associacaoExistente = await prisma.estudanteDificuldade.findFirst({
                    where: {
                        estudanteId,
                        dificuldadeId,
                    },
                });
                if (associacaoExistente) {
                    throw new app_error_1.AppError('Dificuldade já associada a este estudante', 409, 'DIFFICULTY_ALREADY_ASSOCIATED');
                }
                const createData = {
                    estudante: { connect: { id: estudanteId } },
                    dificuldade: { connect: { id: dificuldadeId } },
                    nivel: enums_1.Nivel.BAIXO,
                };
                if (dadosAdicionais?.tipo) {
                    createData.tipo = dadosAdicionais.tipo;
                }
                if (dadosAdicionais?.observacoes) {
                    createData.observacoes = dadosAdicionais.observacoes;
                }
                await prisma.estudanteDificuldade.create({
                    data: createData,
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
                const associacao = await prisma.estudanteDificuldade.findFirst({
                    where: {
                        estudanteId,
                        dificuldadeId,
                    },
                });
                if (!associacao) {
                    throw new app_error_1.AppError('Dificuldade não está associada a este estudante', 404, 'DIFFICULTY_NOT_ASSOCIATED');
                }
                await prisma.estudanteDificuldade.deleteMany({
                    where: {
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
    async adicionarAvaliacao(estudanteId, avaliacaoData) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const estudante = await prisma.estudante.findUnique({
                    where: { id: estudanteId },
                });
                if (!estudante) {
                    throw new app_error_1.AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND');
                }
                if (!avaliacaoData.avaliadorId) {
                    throw new app_error_1.AppError('ID do avaliador é obrigatório', 400, 'ASSESSOR_REQUIRED');
                }
                const prismaAvaliacaoData = {
                    estudante: { connect: { id: estudanteId } },
                    data: avaliacaoData.data || new Date(),
                    tipo: avaliacaoData.tipo,
                    pontuacao: avaliacaoData.pontuacao || 0,
                    observacoes: avaliacaoData.observacoes,
                };
                await prisma.avaliacao.create({
                    data: prismaAvaliacaoData,
                });
            });
            return await this.findById(estudanteId);
        }
        catch (error) {
            if (error instanceof app_error_1.AppError) {
                throw error;
            }
            this.handlePrismaError(error, 'Estudante-Avaliação');
        }
    }
    async buscarEstudantesComNecessidadesSimilares(dificuldadeIds) {
        try {
            const estudantes = await this.unitOfWork.withoutTransaction((prisma) => prisma.estudante.findMany({
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
            return estudantes.map((e) => this.mapToEstudante(e));
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante');
        }
    }
    getEstudanteIncludes() {
        return {
            dificuldades: {
                include: {
                    dificuldade: true,
                },
            },
            avaliacoes: true,
            usuario: {
                select: {
                    id: true,
                    nome: true,
                    email: true,
                },
            },
        };
    }
    mapToEstudante(estudantePrisma) {
        const data = estudantePrisma;
        const dificuldades = Array.isArray(data.dificuldades)
            ? data.dificuldades.map((rel) => {
                const relData = rel;
                const difData = relData.dificuldade;
                let sintomasProcessados;
                if (typeof difData.sintomas === 'string') {
                    sintomasProcessados = difData.sintomas;
                }
                else if (Array.isArray(difData.sintomas)) {
                    sintomasProcessados = difData.sintomas.join(', ');
                }
                else {
                    sintomasProcessados = '';
                }
                let tipo = dificuldade_aprendizagem_entity_1.TipoDificuldade.OUTRO;
                const categoria = difData.categoria;
                if (categoria === 'LEITURA') {
                    tipo = dificuldade_aprendizagem_entity_1.TipoDificuldade.LEITURA;
                }
                else if (categoria === 'ESCRITA') {
                    tipo = dificuldade_aprendizagem_entity_1.TipoDificuldade.ESCRITA;
                }
                else if (categoria === 'MATEMATICA') {
                    tipo = dificuldade_aprendizagem_entity_1.TipoDificuldade.MATEMATICA;
                }
                let categoriaMapeada = 'LEVE';
                try {
                    if (['LEVE', 'MODERADA', 'GRAVE'].includes(categoria)) {
                        categoriaMapeada = categoria;
                    }
                }
                catch (error) {
                }
                return dificuldade_aprendizagem_entity_1.DificuldadeAprendizagem.restaurar({
                    id: difData.id,
                    nome: difData.nome,
                    descricao: difData.descricao,
                    sintomas: sintomasProcessados,
                    categoria: categoriaMapeada,
                    tipo: tipo,
                });
            })
            : [];
        const avaliacoes = Array.isArray(data.avaliacoes)
            ? data.avaliacoes.map((aval) => {
                const avalData = aval;
                return {
                    id: avalData.id,
                    data: avalData.data,
                    tipo: avalData.tipo,
                    pontuacao: Number(avalData.pontuacao || 0),
                    observacoes: avalData.observacoes,
                    criadoEm: avalData.criadoEm,
                    atualizadoEm: avalData.atualizadoEm,
                };
            })
            : [];
        return estudante_entity_1.Estudante.restaurar({
            id: data.id,
            nome: data.nome,
            serie: data.serie,
            dataNascimento: data.dataNascimento,
            status: data.status,
            usuarioId: data.usuarioId,
            dificuldades,
            avaliacoes,
            criadoEm: data.criadoEm,
            atualizadoEm: data.atualizadoEm,
        });
    }
};
exports.EstudanteRepository = EstudanteRepository;
exports.EstudanteRepository = EstudanteRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [unit_of_work_1.UnitOfWork])
], EstudanteRepository);
//# sourceMappingURL=estudante.repository.js.map