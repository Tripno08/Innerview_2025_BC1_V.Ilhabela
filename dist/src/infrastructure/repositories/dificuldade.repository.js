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
exports.DificuldadeRepository = void 0;
const dificuldade_aprendizagem_entity_1 = require("@domain/entities/dificuldade-aprendizagem.entity");
const base_repository_1 = require("./base.repository");
const enums_1 = require("@shared/enums");
const enum_mappers_1 = require("@shared/utils/enum-mappers");
const tsyringe_1 = require("tsyringe");
const unit_of_work_1 = require("../database/unit-of-work");
let DificuldadeRepository = class DificuldadeRepository extends base_repository_1.BaseRepository {
    constructor(unitOfWork) {
        super(unitOfWork);
    }
    async findAll() {
        try {
            const dificuldades = await this.unitOfWork.withoutTransaction((prisma) => prisma.dificuldadeAprendizagem.findMany({
                orderBy: {
                    nome: 'asc',
                },
            }));
            return dificuldades.map((d) => this.mapToDificuldade(d));
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async findById(id) {
        try {
            const dificuldade = await this.unitOfWork.withoutTransaction((prisma) => prisma.dificuldadeAprendizagem.findUnique({
                where: { id },
            }));
            if (!dificuldade) {
                return null;
            }
            return this.mapToDificuldade(dificuldade);
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async findByTipo(tipo) {
        try {
            const dificuldades = await this.unitOfWork.withoutTransaction((prisma) => prisma.dificuldadeAprendizagem.findMany({
                where: {
                    categoria: {
                        equals: this.mapTipoToCategoria(tipo),
                    },
                },
                orderBy: {
                    nome: 'asc',
                },
            }));
            return dificuldades.map((d) => this.mapToDificuldade(d));
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async findByCategoria(categoria) {
        try {
            const dificuldades = await this.unitOfWork.withoutTransaction((prisma) => prisma.dificuldadeAprendizagem.findMany({
                where: {
                    categoria: this.mapCategoriaParaPrisma(categoria),
                },
                orderBy: {
                    nome: 'asc',
                },
            }));
            return dificuldades.map((d) => this.mapToDificuldade(d));
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async findByEstudanteId(estudanteId) {
        try {
            const associacoes = await this.unitOfWork.withoutTransaction((prisma) => prisma.estudanteDificuldade.findMany({
                where: { estudanteId },
                include: {
                    dificuldade: true,
                },
            }));
            return associacoes.map((assoc) => this.mapToDificuldade(assoc.dificuldade));
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async create(data) {
        try {
            const { nome, descricao, sintomas, tipo, categoria, statusInput, ...restData } = data;
            if (!nome || !categoria) {
                throw new Error('Nome e categoria são obrigatórios para criar dificuldade de aprendizagem');
            }
            const createData = {
                nome: String(nome),
                descricao: descricao ? String(descricao) : '',
                sintomas: sintomas ? String(sintomas) : '',
                categoria: this.mapCategoriaParaPrisma(categoria),
                status: (0, enum_mappers_1.mapStatusToPrisma)(statusInput || enums_1.Status.ATIVO),
            };
            if (tipo) {
                createData.metadados = {
                    tipo: String(tipo),
                };
            }
            const novaDificuldade = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.dificuldadeAprendizagem.create({
                    data: createData,
                });
            });
            return this.mapToDificuldade(novaDificuldade);
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async update(id, data) {
        try {
            const { statusInput, ...outrosDados } = data;
            const updateData = { ...outrosDados };
            if (statusInput) {
                updateData.status = (0, enum_mappers_1.mapStatusToPrisma)(statusInput);
            }
            if ('tipo' in updateData) {
                updateData.metadados = {
                    tipo: String(updateData.tipo),
                };
                delete updateData.tipo;
            }
            const dificuldadeAtualizada = await this.unitOfWork.withTransaction(async (prisma) => {
                return await prisma.dificuldadeAprendizagem.update({
                    where: { id },
                    data: updateData,
                });
            });
            return this.mapToDificuldade(dificuldadeAtualizada);
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async delete(id) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const associacoes = await prisma.estudanteDificuldade.findMany({
                    where: { dificuldadeId: id },
                });
                if (associacoes.length > 0) {
                    throw new Error('Não é possível excluir esta dificuldade porque está associada a estudantes');
                }
                await prisma.dificuldadeAprendizagem.delete({
                    where: { id },
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    mapToDificuldade(dificuldadePrisma) {
        let tipo = dificuldadePrisma.tipo;
        if (!tipo && dificuldadePrisma.metadados) {
            const metadados = dificuldadePrisma.metadados;
            tipo = metadados.tipo;
        }
        return dificuldade_aprendizagem_entity_1.DificuldadeAprendizagem.restaurar({
            id: dificuldadePrisma.id,
            nome: dificuldadePrisma.nome,
            descricao: dificuldadePrisma.descricao,
            sintomas: dificuldadePrisma.sintomas || '',
            tipo: tipo ||
                this.obterTipoDaCategoria(dificuldadePrisma.categoria),
            categoria: dificuldadePrisma.categoria,
            status: (0, enum_mappers_1.mapStatusFromPrisma)(dificuldadePrisma.status),
            criadoEm: this.parseDate(dificuldadePrisma.criadoEm),
            atualizadoEm: this.parseDate(dificuldadePrisma.atualizadoEm),
        });
    }
    parseDate(value) {
        if (value instanceof Date)
            return value;
        if (typeof value === 'string' || typeof value === 'number')
            return new Date(value);
        return new Date();
    }
    mapCategoriaParaPrisma(categoria) {
        return categoria;
    }
    mapTipoToCategoria(tipo) {
        switch (tipo) {
            case dificuldade_aprendizagem_entity_1.TipoDificuldade.LEITURA:
                return 'LEITURA';
            case dificuldade_aprendizagem_entity_1.TipoDificuldade.ESCRITA:
                return 'ESCRITA';
            case dificuldade_aprendizagem_entity_1.TipoDificuldade.MATEMATICA:
                return 'MATEMATICA';
            case dificuldade_aprendizagem_entity_1.TipoDificuldade.COMPORTAMENTAL:
                return 'COMPORTAMENTO';
            case dificuldade_aprendizagem_entity_1.TipoDificuldade.ATENCAO:
                return 'ATENCAO';
            case dificuldade_aprendizagem_entity_1.TipoDificuldade.SOCIAL:
                return 'COMUNICACAO';
            case dificuldade_aprendizagem_entity_1.TipoDificuldade.NEUROMOTORA:
                return 'COORDENACAO_MOTORA';
            default:
                return 'OUTRO';
        }
    }
    obterTipoDaCategoria(categoria) {
        switch (categoria) {
            case 'LEITURA':
                return dificuldade_aprendizagem_entity_1.TipoDificuldade.LEITURA;
            case 'ESCRITA':
                return dificuldade_aprendizagem_entity_1.TipoDificuldade.ESCRITA;
            case 'MATEMATICA':
                return dificuldade_aprendizagem_entity_1.TipoDificuldade.MATEMATICA;
            case 'COMPORTAMENTO':
                return dificuldade_aprendizagem_entity_1.TipoDificuldade.COMPORTAMENTAL;
            case 'ATENCAO':
                return dificuldade_aprendizagem_entity_1.TipoDificuldade.ATENCAO;
            case 'COMUNICACAO':
                return dificuldade_aprendizagem_entity_1.TipoDificuldade.SOCIAL;
            case 'COORDENACAO_MOTORA':
                return dificuldade_aprendizagem_entity_1.TipoDificuldade.NEUROMOTORA;
            default:
                return dificuldade_aprendizagem_entity_1.TipoDificuldade.OUTRO;
        }
    }
};
exports.DificuldadeRepository = DificuldadeRepository;
exports.DificuldadeRepository = DificuldadeRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [unit_of_work_1.UnitOfWork])
], DificuldadeRepository);
//# sourceMappingURL=dificuldade.repository.js.map