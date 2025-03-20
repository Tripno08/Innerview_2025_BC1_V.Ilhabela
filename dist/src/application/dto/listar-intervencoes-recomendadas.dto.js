"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogoIntervencao = void 0;
class CatalogoIntervencao {
    id;
    titulo;
    descricao;
    tipo;
    objetivos;
    estrategias;
    recursos;
    duracaoEstimada;
    nivelEficacia;
    totalUsos;
    criadoEm;
    static fromData(data) {
        const dto = new CatalogoIntervencao();
        dto.id = data.id;
        dto.titulo = data.titulo;
        dto.descricao = data.descricao;
        dto.tipo = data.tipo;
        dto.objetivos = data.objetivos;
        dto.estrategias = data.estrategias;
        dto.recursos = data.recursos;
        dto.duracaoEstimada = data.duracaoEstimada;
        dto.nivelEficacia = data.nivelEficacia;
        dto.totalUsos = data.totalUsos || 0;
        dto.criadoEm = data.criadoEm;
        return dto;
    }
}
exports.CatalogoIntervencao = CatalogoIntervencao;
//# sourceMappingURL=listar-intervencoes-recomendadas.dto.js.map