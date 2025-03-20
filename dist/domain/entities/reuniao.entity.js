"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reuniao = void 0;
class Reuniao {
    id;
    titulo;
    data;
    local;
    status;
    observacoes;
    resumo;
    criadoEm;
    atualizadoEm;
    equipeId;
    equipe;
    participantes;
    encaminhamentos;
    constructor(props) {
        this.id = props.id;
        this.titulo = props.titulo;
        this.data = props.data;
        this.local = props.local;
        this.status = props.status;
        this.observacoes = props.observacoes;
        this.resumo = props.resumo;
        this.criadoEm = props.criadoEm;
        this.atualizadoEm = props.atualizadoEm;
        this.equipeId = props.equipeId;
        this.equipe = props.equipe;
        this.participantes = props.participantes;
        this.encaminhamentos = props.encaminhamentos;
    }
    static criar(props) {
        const reuniao = {
            ...props,
            id: crypto.randomUUID(),
            criadoEm: new Date(),
            atualizadoEm: new Date(),
        };
        return new Reuniao(reuniao);
    }
    static restaurar(props) {
        return new Reuniao(props);
    }
    atualizar(props) {
        return new Reuniao({
            ...this,
            ...props,
            atualizadoEm: new Date(),
        });
    }
    estaAgendada() {
        return this.status === 'AGENDADO';
    }
    estaEmAndamento() {
        return this.status === 'EM_ANDAMENTO';
    }
    estaConcluida() {
        return this.status === 'CONCLUIDO';
    }
    estaCancelada() {
        return this.status === 'CANCELADO';
    }
}
exports.Reuniao = Reuniao;
//# sourceMappingURL=reuniao.entity.js.map