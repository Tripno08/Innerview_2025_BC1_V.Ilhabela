"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equipe = exports.EstudanteEquipe = exports.MembroEquipe = exports.PapelMembro = void 0;
const client_1 = require("@prisma/client");
var PapelMembro;
(function (PapelMembro) {
    PapelMembro["COORDENADOR"] = "COORDENADOR";
    PapelMembro["PROFESSOR"] = "PROFESSOR";
    PapelMembro["PSICOLOGO"] = "PSICOLOGO";
    PapelMembro["ASSISTENTE_SOCIAL"] = "ASSISTENTE_SOCIAL";
    PapelMembro["FONOAUDIOLOGO"] = "FONOAUDIOLOGO";
    PapelMembro["TERAPEUTA_OCUPACIONAL"] = "TERAPEUTA_OCUPACIONAL";
    PapelMembro["OUTRO"] = "OUTRO";
})(PapelMembro || (exports.PapelMembro = PapelMembro = {}));
class MembroEquipe {
    id;
    papelMembro;
    usuarioId;
    usuario;
    criadoEm;
    atualizadoEm;
    constructor(props) {
        this.id = props.id;
        this.papelMembro = props.papelMembro;
        this.usuarioId = props.usuarioId;
        this.usuario = props.usuario;
        this.criadoEm = props.criadoEm || new Date();
        this.atualizadoEm = props.atualizadoEm || new Date();
        this.validar();
    }
    validar() {
        if (!Object.values(PapelMembro).includes(this.papelMembro)) {
            throw new Error('Papel de membro inválido');
        }
        if (!this.usuarioId) {
            throw new Error('ID do usuário é obrigatório');
        }
    }
    static criar(props) {
        return new MembroEquipe(props);
    }
    eCoordenador() {
        return this.papelMembro === PapelMembro.COORDENADOR;
    }
    temPapel(papel) {
        return this.papelMembro === papel;
    }
}
exports.MembroEquipe = MembroEquipe;
class EstudanteEquipe {
    id;
    estudanteId;
    estudante;
    criadoEm;
    atualizadoEm;
    constructor(props) {
        this.id = props.id;
        this.estudanteId = props.estudanteId;
        this.estudante = props.estudante;
        this.criadoEm = props.criadoEm || new Date();
        this.atualizadoEm = props.atualizadoEm || new Date();
        this.validar();
    }
    validar() {
        if (!this.estudanteId) {
            throw new Error('ID do estudante é obrigatório');
        }
    }
    static criar(props) {
        return new EstudanteEquipe(props);
    }
}
exports.EstudanteEquipe = EstudanteEquipe;
class Equipe {
    id;
    nome;
    descricao;
    status;
    membros;
    estudantes;
    criadoEm;
    atualizadoEm;
    constructor(props) {
        this.id = props.id;
        this.nome = props.nome;
        this.descricao = props.descricao || '';
        this.status = props.status || client_1.Status.ATIVO;
        this.membros = (props.membros || []).map(m => m instanceof MembroEquipe ? m : MembroEquipe.criar(m));
        this.estudantes = (props.estudantes || []).map(e => e instanceof EstudanteEquipe ? e : EstudanteEquipe.criar(e));
        this.criadoEm = props.criadoEm || new Date();
        this.atualizadoEm = props.atualizadoEm || new Date();
        this.validar();
    }
    validar() {
        if (!this.nome || this.nome.trim().length < 3) {
            throw new Error('Nome deve ter pelo menos 3 caracteres');
        }
    }
    static criar(props) {
        return new Equipe(props);
    }
    static restaurar(dados) {
        return new Equipe({
            ...dados,
        });
    }
    adicionarMembro(membro) {
        if (this.membros.some(m => m.usuarioId === membro.usuarioId)) {
            throw new Error('Usuário já é membro desta equipe');
        }
        const novoMembro = new MembroEquipe(membro);
        return new Equipe({
            ...this,
            membros: [...this.membros, novoMembro],
            atualizadoEm: new Date(),
        });
    }
    removerMembro(usuarioId) {
        return new Equipe({
            ...this,
            membros: this.membros.filter(m => m.usuarioId !== usuarioId),
            atualizadoEm: new Date(),
        });
    }
    adicionarEstudante(estudante) {
        if (this.estudantes.some(e => e.estudanteId === estudante.estudanteId)) {
            throw new Error('Estudante já está associado a esta equipe');
        }
        const novoEstudante = new EstudanteEquipe(estudante);
        return new Equipe({
            ...this,
            estudantes: [...this.estudantes, novoEstudante],
            atualizadoEm: new Date(),
        });
    }
    removerEstudante(estudanteId) {
        return new Equipe({
            ...this,
            estudantes: this.estudantes.filter(e => e.estudanteId !== estudanteId),
            atualizadoEm: new Date(),
        });
    }
    atualizar(dados) {
        return new Equipe({
            ...this,
            nome: dados.nome || this.nome,
            descricao: dados.descricao ?? this.descricao,
            status: dados.status || this.status,
            atualizadoEm: new Date(),
        });
    }
    inativar() {
        return new Equipe({
            ...this,
            status: client_1.Status.CANCELADO,
            atualizadoEm: new Date(),
        });
    }
    estaAtiva() {
        return this.status === client_1.Status.ATIVO;
    }
    obterCoordenadores() {
        return this.membros.filter(m => m.eCoordenador());
    }
    temMembro(usuarioId) {
        return this.membros.some(m => m.usuarioId === usuarioId);
    }
    temEstudante(estudanteId) {
        return this.estudantes.some(e => e.estudanteId === estudanteId);
    }
    quantidadeMembros() {
        return this.membros.length;
    }
    quantidadeEstudantes() {
        return this.estudantes.length;
    }
}
exports.Equipe = Equipe;
//# sourceMappingURL=equipe.entity.js.map