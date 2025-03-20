"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DificuldadeAprendizagem = exports.CategoriaDificuldade = exports.TipoDificuldade = void 0;
const client_1 = require("@prisma/client");
var TipoDificuldade;
(function (TipoDificuldade) {
    TipoDificuldade["LEITURA"] = "LEITURA";
    TipoDificuldade["ESCRITA"] = "ESCRITA";
    TipoDificuldade["MATEMATICA"] = "MATEMATICA";
    TipoDificuldade["ATENCAO"] = "ATENCAO";
    TipoDificuldade["COMPORTAMENTAL"] = "COMPORTAMENTAL";
    TipoDificuldade["EMOCIONAL"] = "EMOCIONAL";
    TipoDificuldade["SOCIAL"] = "SOCIAL";
    TipoDificuldade["NEUROMOTORA"] = "NEUROMOTORA";
    TipoDificuldade["OUTRO"] = "OUTRO";
})(TipoDificuldade || (exports.TipoDificuldade = TipoDificuldade = {}));
var CategoriaDificuldade;
(function (CategoriaDificuldade) {
    CategoriaDificuldade["LEVE"] = "LEVE";
    CategoriaDificuldade["MODERADA"] = "MODERADA";
    CategoriaDificuldade["GRAVE"] = "GRAVE";
})(CategoriaDificuldade || (exports.CategoriaDificuldade = CategoriaDificuldade = {}));
class DificuldadeAprendizagem {
    id;
    nome;
    descricao;
    tipo;
    categoria;
    status;
    criadoEm;
    atualizadoEm;
    constructor(props) {
        this.id = props.id;
        this.nome = props.nome;
        this.descricao = props.descricao;
        this.tipo = props.tipo;
        this.categoria = props.categoria;
        this.status = props.status || client_1.Status.ATIVO;
        this.criadoEm = props.criadoEm || new Date();
        this.atualizadoEm = props.atualizadoEm || new Date();
        this.validar();
    }
    validar() {
        if (!this.nome || this.nome.trim().length < 3) {
            throw new Error('Nome deve ter pelo menos 3 caracteres');
        }
        if (!this.descricao || this.descricao.trim().length < 10) {
            throw new Error('Descrição deve ter pelo menos 10 caracteres');
        }
        if (!Object.values(TipoDificuldade).includes(this.tipo)) {
            throw new Error('Tipo de dificuldade inválido');
        }
        if (!Object.values(CategoriaDificuldade).includes(this.categoria)) {
            throw new Error('Categoria de dificuldade inválida');
        }
    }
    static criar(props) {
        return new DificuldadeAprendizagem(props);
    }
    static restaurar(dados) {
        return new DificuldadeAprendizagem({
            ...dados,
        });
    }
    atualizar(dados) {
        return new DificuldadeAprendizagem({
            id: this.id,
            nome: dados.nome || this.nome,
            descricao: dados.descricao || this.descricao,
            tipo: dados.tipo || this.tipo,
            categoria: dados.categoria || this.categoria,
            status: dados.status || this.status,
            criadoEm: this.criadoEm,
            atualizadoEm: new Date(),
        });
    }
    inativar() {
        return new DificuldadeAprendizagem({
            ...this,
            status: client_1.Status.CANCELADO,
            atualizadoEm: new Date(),
        });
    }
    estaAtiva() {
        return this.status === client_1.Status.ATIVO;
    }
    ehGrave() {
        return this.categoria === CategoriaDificuldade.GRAVE;
    }
}
exports.DificuldadeAprendizagem = DificuldadeAprendizagem;
//# sourceMappingURL=dificuldade-aprendizagem.entity.js.map