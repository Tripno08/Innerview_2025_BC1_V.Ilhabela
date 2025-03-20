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
            let categoria;
            switch (tipo) {
                case dificuldade_aprendizagem_entity_1.TipoDificuldade.LEITURA:
                    categoria = 'LEITURA';
                    break;
                case dificuldade_aprendizagem_entity_1.TipoDificuldade.ESCRITA:
                    categoria = 'ESCRITA';
                    break;
                case dificuldade_aprendizagem_entity_1.TipoDificuldade.MATEMATICA:
                    categoria = 'MATEMATICA';
                    break;
                case dificuldade_aprendizagem_entity_1.TipoDificuldade.COMPORTAMENTAL:
                    categoria = 'COMPORTAMENTO';
                    break;
                case dificuldade_aprendizagem_entity_1.TipoDificuldade.ATENCAO:
                    categoria = 'ATENCAO';
                    break;
                case dificuldade_aprendizagem_entity_1.TipoDificuldade.SOCIAL:
                    categoria = 'COMUNICACAO';
                    break;
                case dificuldade_aprendizagem_entity_1.TipoDificuldade.NEUROMOTORA:
                    categoria = 'COORDENACAO_MOTORA';
                    break;
                default:
                    categoria = 'OUTRO';
            }
            const dificuldades = await this.unitOfWork.withoutTransaction((prisma) => prisma.dificuldadeAprendizagem.findMany({
                where: {
                    categoria: categoria,
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
            const dificuldades = await this.unitOfWork.withoutTransaction((prisma) => prisma.estudanteDificuldade.findMany({
                where: { estudanteId },
                include: {
                    dificuldade: true,
                },
            }));
            return dificuldades.map((rel) => this.mapToDificuldade(rel.dificuldade));
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async create(data) {
        try {
            const dificuldade = await this.unitOfWork.withTransaction(async (prisma) => {
                const { nome, descricao, sintomas, tipo, categoria, status: statusInput, ...restData } = data;
                const createData = {
                    nome,
                    descricao,
                    sintomas: sintomas || '',
                    tipo: String(tipo),
                    categoria: String(categoria),
                    status: (0, enum_mappers_1.mapLocalStatusToPrisma)(statusInput || enums_1.Status.ATIVO),
                    ...restData,
                };
                return await prisma.dificuldadeAprendizagem.create({
                    data: createData,
                });
            });
            return this.mapToDificuldade(dificuldade);
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async update(id, data) {
        try {
            const dificuldade = await this.unitOfWork.withTransaction(async (prisma) => {
                const { status: statusInput, ...outrosDados } = data;
                const updateData = { ...outrosDados };
                if (statusInput) {
                    updateData.status = (0, enum_mappers_1.mapLocalStatusToPrisma)(statusInput);
                }
                return await prisma.dificuldadeAprendizagem.update({
                    where: { id },
                    data: updateData,
                });
            });
            return this.mapToDificuldade(dificuldade);
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async delete(id) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                await prisma.estudanteDificuldade.deleteMany({
                    where: { dificuldadeId: id },
                });
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
        return dificuldade_aprendizagem_entity_1.DificuldadeAprendizagem.restaurar({
            id: dificuldadePrisma.id,
            nome: dificuldadePrisma.nome,
            descricao: dificuldadePrisma.descricao,
            sintomas: dificuldadePrisma.sintomas || '',
            tipo: dificuldadePrisma.tipo,
            categoria: dificuldadePrisma.categoria,
            status: (0, enum_mappers_1.mapPrismaStatusToLocal)(dificuldadePrisma.status),
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
};
exports.DificuldadeRepository = DificuldadeRepository;
exports.DificuldadeRepository = DificuldadeRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [unit_of_work_1.UnitOfWork])
], DificuldadeRepository);
//# sourceMappingURL=dificuldade.repository.js.map