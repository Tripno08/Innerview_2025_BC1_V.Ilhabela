"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLocalStatusToPrisma = mapLocalStatusToPrisma;
exports.mapPrismaStatusToLocal = mapPrismaStatusToLocal;
exports.mapLocalCargoToPrisma = mapLocalCargoToPrisma;
exports.mapPrismaCargoToLocal = mapPrismaCargoToLocal;
exports.mapLocalPrioridadeToPrisma = mapLocalPrioridadeToPrisma;
exports.mapPrismaPrioridadeToLocal = mapPrismaPrioridadeToLocal;
const enums_1 = require("@shared/enums");
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../types/prisma"));
function mapLocalStatusToPrisma(status) {
    const localStatus = typeof status === 'string' ? status : status;
    return prisma_1.default.StatusMap[localStatus] || client_1.Status.PENDENTE;
}
function mapPrismaStatusToLocal(prismaStatus) {
    const prismaStatusValue = typeof prismaStatus === 'string' ? prismaStatus : prismaStatus;
    for (const [key, value] of Object.entries(prisma_1.default.StatusMap)) {
        if (value === prismaStatusValue) {
            return key;
        }
    }
    return enums_1.Status.PENDENTE;
}
function mapLocalCargoToPrisma(cargo) {
    const localCargo = typeof cargo === 'string' ? cargo : cargo;
    return prisma_1.default.CargoUsuarioMap[localCargo] || client_1.CargoUsuario.PROFESSOR;
}
function mapPrismaCargoToLocal(prismaCargo) {
    const prismaCargoValue = typeof prismaCargo === 'string' ? prismaCargo : prismaCargo;
    for (const [key, value] of Object.entries(prisma_1.default.CargoUsuarioMap)) {
        if (value === prismaCargoValue) {
            return key;
        }
    }
    return enums_1.CargoUsuario.PROFESSOR;
}
function mapLocalPrioridadeToPrisma(prioridade) {
    return prioridade.toString();
}
function mapPrismaPrioridadeToLocal(prioridade) {
    return prioridade;
}
//# sourceMappingURL=enum-mappers.js.map