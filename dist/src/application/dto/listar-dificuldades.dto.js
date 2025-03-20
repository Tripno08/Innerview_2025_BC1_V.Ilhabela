"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DificuldadeAprendizagem = void 0;
class DificuldadeAprendizagem {
    id;
    nome;
    descricao;
    sintomas;
    tipo;
    categoria;
    status;
    criadoEm;
    atualizadoEm;
    static fromEntity(entity) {
        const dto = new DificuldadeAprendizagem();
        dto.id = entity.id;
        dto.nome = entity.nome;
        dto.descricao = entity.descricao;
        dto.sintomas = entity.sintomas;
        dto.tipo = entity.tipo;
        dto.categoria = entity.categoria;
        dto.status = entity.status;
        dto.criadoEm = entity.criadoEm;
        dto.atualizadoEm = entity.atualizadoEm;
        return dto;
    }
}
exports.DificuldadeAprendizagem = DificuldadeAprendizagem;
//# sourceMappingURL=listar-dificuldades.dto.js.map