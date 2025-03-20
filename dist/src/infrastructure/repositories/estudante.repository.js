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
        return {
            ...restData,
            ...(status && { status: (0, enum_mappers_1.mapLocalStatusToPrisma)(status) }),
        };
    }
    adaptToPrismaUpdate(data) {
        const { status, ...restData } = data;
        return {
            ...restData,
            ...(status && { status: (0, enum_mappers_1.mapLocalStatusToPrisma)(status) }),
        };
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
                    estudanteId,
                    dificuldadeId,
                    nivel: 'LEVE',
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
                    ...avaliacaoData,
                    estudanteId,
                    data: avaliacaoData.data || new Date(),
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
        const dificuldades = Array.isArray(estudantePrisma.dificuldades)
            ? estudantePrisma.dificuldades.map((rel) => dificuldade_aprendizagem_entity_1.DificuldadeAprendizagem.restaurar({
                ...rel.dificuldade,
                tipo: rel.dificuldade.categoria === 'LEITURA'
                    ? dificuldade_aprendizagem_entity_1.TipoDificuldade.LEITURA
                    : rel.dificuldade.categoria === 'ESCRITA'
                        ? dificuldade_aprendizagem_entity_1.TipoDificuldade.ESCRITA
                        : rel.dificuldade.categoria === 'MATEMATICA'
                            ? dificuldade_aprendizagem_entity_1.TipoDificuldade.MATEMATICA
                            : dificuldade_aprendizagem_entity_1.TipoDificuldade.OUTRO,
            }))
            : [];
        return estudante_entity_1.Estudante.restaurar({
            id: estudantePrisma.id,
            nome: estudantePrisma.nome,
            serie: estudantePrisma.serie,
            dataNascimento: estudantePrisma.dataNascimento,
            status: estudantePrisma.status,
            usuarioId: estudantePrisma.usuarioId,
            dificuldades,
            avaliacoes: (Array.isArray(estudantePrisma.avaliacoes)
                ? estudantePrisma.avaliacoes
                : []),
            criadoEm: estudantePrisma.criadoEm,
            atualizadoEm: estudantePrisma.atualizadoEm,
        });
    }
};
exports.EstudanteRepository = EstudanteRepository;
exports.EstudanteRepository = EstudanteRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [unit_of_work_1.UnitOfWork])
], EstudanteRepository);
//# sourceMappingURL=estudante.repository.js.map