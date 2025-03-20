"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DificuldadeRepository = void 0;
const dificuldade_aprendizagem_entity_1 = require("@domain/entities/dificuldade-aprendizagem.entity");
const base_repository_1 = require("./base.repository");
const client_1 = require("@prisma/client");
class DificuldadeRepository extends base_repository_1.BaseRepository {
    async findAll() {
        try {
            const dificuldades = await this.unitOfWork.withoutTransaction(prisma => prisma.dificuldadeAprendizagem.findMany({
                orderBy: {
                    nome: 'asc',
                },
            }));
            return dificuldades.map(d => this.mapToDificuldade(d));
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async findById(id) {
        try {
            const dificuldade = await this.unitOfWork.withoutTransaction(prisma => prisma.dificuldadeAprendizagem.findUnique({
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
            const dificuldades = await this.unitOfWork.withoutTransaction(prisma => prisma.dificuldadeAprendizagem.findMany({
                where: { tipo: tipo },
                orderBy: {
                    nome: 'asc',
                },
            }));
            return dificuldades.map(d => this.mapToDificuldade(d));
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async findByEstudanteId(estudanteId) {
        try {
            const dificuldades = await this.unitOfWork.withoutTransaction(prisma => prisma.estudanteDificuldade.findMany({
                where: { estudanteId },
                include: {
                    dificuldade: true,
                },
            }));
            return dificuldades.map(rel => this.mapToDificuldade(rel.dificuldade));
        }
        catch (error) {
            this.handlePrismaError(error, 'Dificuldade');
        }
    }
    async create(data) {
        try {
            const dificuldade = await this.unitOfWork.withTransaction(async (prisma) => {
                const dadosComStatus = {
                    ...data,
                    status: data.status || client_1.Status.ATIVO,
                };
                return await prisma.dificuldadeAprendizagem.create({
                    data: dadosComStatus,
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
                return await prisma.dificuldadeAprendizagem.update({
                    where: { id },
                    data,
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
            tipo: dificuldadePrisma.tipo,
            categoria: dificuldadePrisma.categoria,
            status: dificuldadePrisma.status,
            criadoEm: dificuldadePrisma.criadoEm,
            atualizadoEm: dificuldadePrisma.atualizadoEm,
        });
    }
}
exports.DificuldadeRepository = DificuldadeRepository;
//# sourceMappingURL=dificuldade.repository.js.map