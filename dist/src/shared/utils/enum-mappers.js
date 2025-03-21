"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargoUsuarioMap = exports.StatusMap = void 0;
exports.mapStatusToPrisma = mapStatusToPrisma;
exports.mapStatusFromPrisma = mapStatusFromPrisma;
exports.mapCargoToPrisma = mapCargoToPrisma;
exports.mapCargoFromPrisma = mapCargoFromPrisma;
exports.mapPrioridadeToPrisma = mapPrioridadeToPrisma;
exports.mapPrioridadeFromPrisma = mapPrioridadeFromPrisma;
const enums_1 = require("../enums");
exports.StatusMap = {
    [enums_1.Status.PENDENTE]: 'PENDENTE',
    [enums_1.Status.AGENDADO]: 'AGENDADO',
    [enums_1.Status.ATIVO]: 'ATIVO',
    [enums_1.Status.EM_ANDAMENTO]: 'EM_ANDAMENTO',
    [enums_1.Status.CONCLUIDO]: 'CONCLUIDO',
    [enums_1.Status.CANCELADO]: 'CANCELADO',
};
exports.CargoUsuarioMap = {
    [enums_1.CargoUsuario.ADMIN]: 'ADMIN',
    [enums_1.CargoUsuario.PROFESSOR]: 'PROFESSOR',
    [enums_1.CargoUsuario.ESPECIALISTA]: 'ESPECIALISTA',
    [enums_1.CargoUsuario.COORDENADOR]: 'COORDENADOR',
    [enums_1.CargoUsuario.DIRETOR]: 'DIRETOR',
    [enums_1.CargoUsuario.ADMINISTRADOR]: 'ADMINISTRADOR',
};
function mapStatusToPrisma(status) {
    if (typeof status === 'string') {
        const isValidEnum = Object.values(enums_1.Status).includes(status);
        if (isValidEnum) {
            return status;
        }
        return 'PENDENTE';
    }
    return exports.StatusMap[status] || 'PENDENTE';
}
function mapStatusFromPrisma(status) {
    const statusStr = String(status);
    if (Object.values(enums_1.Status).includes(statusStr)) {
        return statusStr;
    }
    const entries = Object.entries(exports.StatusMap);
    const found = entries.find(([_, value]) => value === statusStr);
    return found ? found[0] : enums_1.Status.PENDENTE;
}
function mapCargoToPrisma(cargo) {
    if (typeof cargo === 'string') {
        const isValidEnum = Object.values(enums_1.CargoUsuario).includes(cargo);
        if (isValidEnum) {
            return cargo;
        }
        return 'ADMIN';
    }
    return exports.CargoUsuarioMap[cargo] || 'ADMIN';
}
function mapCargoFromPrisma(cargo) {
    const cargoStr = String(cargo);
    if (Object.values(enums_1.CargoUsuario).includes(cargoStr)) {
        return cargoStr;
    }
    const entries = Object.entries(exports.CargoUsuarioMap);
    const found = entries.find(([_, value]) => value === cargoStr);
    return found ? found[0] : enums_1.CargoUsuario.ADMIN;
}
function mapPrioridadeToPrisma(prioridade) {
    if (typeof prioridade === 'string') {
        const isValidEnum = Object.values(enums_1.Prioridade).includes(prioridade);
        if (isValidEnum) {
            return prioridade;
        }
    }
    switch (prioridade) {
        case enums_1.Prioridade.BAIXA:
            return 'BAIXA';
        case enums_1.Prioridade.MEDIA:
            return 'MEDIA';
        case enums_1.Prioridade.ALTA:
            return 'ALTA';
        case enums_1.Prioridade.URGENTE:
            return 'URGENTE';
        default:
            return 'MEDIA';
    }
}
function mapPrioridadeFromPrisma(prioridade) {
    if (Object.values(enums_1.Prioridade).includes(prioridade)) {
        return prioridade;
    }
    switch (prioridade) {
        case 'BAIXA':
            return enums_1.Prioridade.BAIXA;
        case 'MEDIA':
            return enums_1.Prioridade.MEDIA;
        case 'ALTA':
            return enums_1.Prioridade.ALTA;
        case 'URGENTE':
            return enums_1.Prioridade.URGENTE;
        default:
            return enums_1.Prioridade.MEDIA;
    }
}
//# sourceMappingURL=enum-mappers.js.map