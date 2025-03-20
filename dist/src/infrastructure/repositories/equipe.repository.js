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
exports.EquipeRepository = void 0;
const equipe_entity_1 = require("@domain/entities/equipe.entity");
const base_repository_1 = require("./base.repository");
const enums_1 = require("@shared/enums");
const enum_mappers_1 = require("@shared/utils/enum-mappers");
const app_error_1 = require("@shared/errors/app-error");
const tsyringe_1 = require("tsyringe");
const unit_of_work_1 = require("../database/unit-of-work");
let EquipeRepository = class EquipeRepository extends base_repository_1.BaseRepository {
    constructor(unitOfWork) {
        super(unitOfWork);
    }
    async findAll() {
        try {
            const equipes = await this.unitOfWork.withoutTransaction((prisma) => prisma.equipe.findMany({
                include: this.getEquipeIncludes(),
                orderBy: {
                    nome: 'asc',
                },
            }));
            return equipes.map((e) => this.mapToEquipe(e));
        }
        catch (error) {
            this.handlePrismaError(error, 'Equipe');
        }
    }
    async findByUsuarioId(usuarioId) {
        try {
            const equipes = await this.unitOfWork.withoutTransaction((prisma) => prisma.equipe.findMany({
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
            return equipes.map((e) => this.mapToEquipe(e));
        }
        catch (error) {
            this.handlePrismaError(error, 'Equipe');
        }
    }
    async findById(id) {
        try {
            const equipe = await this.unitOfWork.withoutTransaction((prisma) => prisma.equipe.findUnique({
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
                const { nome, descricao, status: statusInput, ativo, ...outrosDados } = data;
                const createData = {
                    nome,
                    descricao,
                    status: (0, enum_mappers_1.mapLocalStatusToPrisma)(statusInput || enums_1.Status.ATIVO),
                    ativo: ativo !== undefined ? ativo : true,
                    ...outrosDados,
                };
                return await prisma.equipe.create({
                    data: createData,
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
                const { status: statusInput, ...outrosDados } = data;
                const updateData = { ...outrosDados };
                if (statusInput) {
                    updateData.status = (0, enum_mappers_1.mapLocalStatusToPrisma)(statusInput);
                }
                return await prisma.equipe.update({
                    where: { id },
                    data: updateData,
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
    async verificarMembroEquipe(equipeId, usuarioId) {
        try {
            return await this.unitOfWork.withoutTransaction((prisma) => prisma.membroEquipe.findFirst({
                where: {
                    equipeId,
                    usuarioId,
                },
            }));
        }
        catch (error) {
            this.handlePrismaError(error, 'Membro da Equipe');
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
                const membroExistente = await prisma.membroEquipe.findFirst({
                    where: {
                        AND: [{ equipeId }, { usuarioId }],
                    },
                });
                if (membroExistente) {
                    throw new app_error_1.AppError('Usuário já está nesta equipe', 409, 'USER_ALREADY_IN_TEAM');
                }
                await prisma.membroEquipe.create({
                    data: {
                        equipe: {
                            connect: { id: equipeId },
                        },
                        usuario: {
                            connect: { id: usuarioId },
                        },
                        ...(funcao && { funcao }),
                        cargo: this.mapCargoUsuarioToCargoEquipe(usuario.cargo),
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
                const membro = await prisma.membroEquipe.findFirst({
                    where: {
                        AND: [{ equipeId }, { usuarioId }],
                    },
                });
                if (!membro) {
                    throw new app_error_1.AppError('Usuário não está nesta equipe', 404, 'USER_NOT_IN_TEAM');
                }
                await prisma.membroEquipe.delete({
                    where: { id: membro.id },
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
            const membros = await this.unitOfWork.withoutTransaction((prisma) => prisma.membroEquipe.findMany({
                where: { equipeId },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            email: true,
                            nome: true,
                            cargo: true,
                        },
                    },
                },
            }));
            return membros.map((m) => this.mapToMembro(m));
        }
        catch (error) {
            this.handlePrismaError(error, 'Membros da Equipe');
        }
    }
    async verificarEstudanteEquipe(equipeId, estudanteId) {
        try {
            return await this.unitOfWork.withoutTransaction((prisma) => prisma.estudanteEquipe.findFirst({
                where: {
                    equipeId,
                    estudanteId,
                },
            }));
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudante da Equipe');
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
                const estudanteExistente = await prisma.estudanteEquipe.findFirst({
                    where: {
                        AND: [{ equipeId }, { estudanteId }],
                    },
                });
                if (estudanteExistente) {
                    throw new app_error_1.AppError('Estudante já está nesta equipe', 409, 'STUDENT_ALREADY_IN_TEAM');
                }
                await prisma.estudanteEquipe.create({
                    data: {
                        equipe: {
                            connect: { id: equipeId },
                        },
                        estudante: {
                            connect: { id: estudanteId },
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
    async removerEstudante(equipeId, estudanteId) {
        try {
            await this.unitOfWork.withTransaction(async (prisma) => {
                const estudanteEquipe = await prisma.estudanteEquipe.findFirst({
                    where: {
                        AND: [{ equipeId }, { estudanteId }],
                    },
                });
                if (!estudanteEquipe) {
                    throw new app_error_1.AppError('Estudante não está nesta equipe', 404, 'STUDENT_NOT_IN_TEAM');
                }
                await prisma.estudanteEquipe.delete({
                    where: { id: estudanteEquipe.id },
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
            const estudantes = await this.unitOfWork.withoutTransaction((prisma) => prisma.estudanteEquipe.findMany({
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
            return estudantes.map((e) => ({
                id: e.id,
                equipeId: e.equipeId,
                estudanteId: e.estudanteId,
                dataEntrada: e.criadoEm,
                dataSaida: e.atualizadoEm,
                estudante: e.estudante
                    ? {
                        id: e.estudante.id,
                        nome: e.estudante.nome,
                        serie: e.estudante.serie || '',
                        idade: e.estudante.dataNascimento
                            ? this.calcularIdade(e.estudante.dataNascimento)
                            : undefined,
                    }
                    : undefined,
            }));
        }
        catch (error) {
            this.handlePrismaError(error, 'Estudantes da Equipe');
        }
    }
    calcularIdade(dataNascimento) {
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const m = hoje.getMonth() - dataNascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
            idade--;
        }
        return idade;
    }
    getEquipeIncludes() {
        return {
            membros: {
                include: {
                    usuario: {
                        select: {
                            id: true,
                            email: true,
                            nome: true,
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
    mapCargoUsuarioToCargoEquipe(cargoUsuario) {
        switch (cargoUsuario) {
            case 'PROFESSOR':
                return enums_1.CargoEquipe.PROFESSOR;
            case 'COORDENADOR':
                return enums_1.CargoEquipe.COORDENADOR;
            case 'ESPECIALISTA':
                return enums_1.CargoEquipe.ESPECIALISTA;
            case 'DIRETOR':
            case 'ADMINISTRADOR':
            case 'ADMIN':
                return enums_1.CargoEquipe.OUTRO;
            default:
                return enums_1.CargoEquipe.OUTRO;
        }
    }
    mapToEquipe(equipePrisma) {
        const data = equipePrisma;
        const membrosProps = data.membros.map((m) => ({
            id: m.id,
            papelMembro: this.mapCargoPapel(m.cargo),
            usuarioId: m.usuarioId,
            usuario: m.usuario
                ? {
                    id: m.usuario.id,
                    nome: m.usuario.nome,
                    email: m.usuario.email,
                    cargo: m.usuario.cargo,
                }
                : undefined,
            criadoEm: m.dataEntrada,
            atualizadoEm: m.dataSaida || m.dataEntrada,
        }));
        const estudantesProps = data.estudantes.map((e) => ({
            id: e.id,
            estudanteId: e.estudanteId,
            estudante: e.estudante
                ? {
                    id: e.estudante.id,
                    nome: e.estudante.nome,
                    serie: e.estudante.serie || '',
                }
                : undefined,
            criadoEm: e.dataEntrada,
            atualizadoEm: e.dataEntrada,
        }));
        return equipe_entity_1.Equipe.restaurar({
            id: data.id,
            nome: data.nome,
            descricao: data.descricao || '',
            status: (0, enum_mappers_1.mapPrismaStatusToLocal)(data.status),
            membros: membrosProps,
            estudantes: estudantesProps,
            criadoEm: data.criadoEm,
            atualizadoEm: data.atualizadoEm,
        });
    }
    mapCargoPapel(cargo) {
        switch (cargo) {
            case 'COORDENADOR':
                return equipe_entity_1.PapelMembro.COORDENADOR;
            case 'PROFESSOR':
                return equipe_entity_1.PapelMembro.PROFESSOR;
            case 'PSICOLOGO':
                return equipe_entity_1.PapelMembro.PSICOLOGO;
            case 'ASSISTENTE_SOCIAL':
                return equipe_entity_1.PapelMembro.ASSISTENTE_SOCIAL;
            case 'FONOAUDIOLOGO':
                return equipe_entity_1.PapelMembro.FONOAUDIOLOGO;
            case 'TERAPEUTA_OCUPACIONAL':
                return equipe_entity_1.PapelMembro.TERAPEUTA_OCUPACIONAL;
            default:
                return equipe_entity_1.PapelMembro.OUTRO;
        }
    }
    parseDate(value) {
        if (value instanceof Date)
            return value;
        if (typeof value === 'string' || typeof value === 'number')
            return new Date(value);
        return new Date();
    }
    mapToMembro(m) {
        const usuario = m.usuario;
        return {
            id: m.id,
            usuarioId: m.usuarioId,
            equipeId: m.equipeId,
            cargo: m.cargo,
            funcao: m.funcao !== undefined && m.funcao !== null ? m.funcao : undefined,
            dataEntrada: this.parseDate(m.dataEntrada),
            dataSaida: m.dataSaida ? this.parseDate(m.dataSaida) : undefined,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo,
            },
        };
    }
};
exports.EquipeRepository = EquipeRepository;
exports.EquipeRepository = EquipeRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [unit_of_work_1.UnitOfWork])
], EquipeRepository);
//# sourceMappingURL=equipe.repository.js.map