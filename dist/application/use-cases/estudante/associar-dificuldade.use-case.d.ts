import { IEstudanteRepository } from '@domain/repositories/estudante-repository.interface';
import { IDificuldadeRepository } from '@domain/repositories/dificuldade-repository.interface';
import { Estudante } from '@domain/entities/estudante.entity';
interface AssociarDificuldadeDTO {
    estudanteId: string;
    dificuldadeId: string;
}
interface AssociarDificuldadeResultado {
    estudante: Estudante;
}
export declare class AssociarDificuldadeUseCase {
    private readonly estudanteRepository;
    private readonly dificuldadeRepository;
    constructor(estudanteRepository: IEstudanteRepository, dificuldadeRepository: IDificuldadeRepository);
    execute(data: AssociarDificuldadeDTO): Promise<AssociarDificuldadeResultado>;
}
export {};
