import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { Estudante } from '@domain/entities/estudante.entity';
interface CadastrarEstudanteDTO {
    nome: string;
    serie: string;
    dataNascimento: Date;
    usuarioId: string;
}
interface CadastrarEstudanteResultado {
    estudante: Estudante;
}
export declare class CadastrarEstudanteUseCase {
    private readonly estudanteRepository;
    private readonly usuarioRepository;
    constructor(estudanteRepository: IEstudanteRepository, usuarioRepository: IUsuarioRepository);
    execute(data: CadastrarEstudanteDTO): Promise<CadastrarEstudanteResultado>;
}
export {};
