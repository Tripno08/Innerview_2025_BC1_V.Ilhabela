import { injectable } from 'tsyringe';
import { ISISAdapter } from '@domain/interfaces/ISISAdapter';
import { SISStudent } from '@domain/types/SISStudent';
import { SISEnrollment } from '@domain/types/SISEnrollment';
import { config } from '@config/external';

@injectable()
export class SISAdapter implements ISISAdapter {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = config.sis.apiUrl;
    this.apiKey = config.sis.apiKey;
  }

  public async getStudentInfo(_studentId: string): Promise<SISStudent> {
    // Implementar integração com API do SIS
    throw new Error('Método não implementado');
  }

  public async getStudentEnrollments(_studentId: string): Promise<SISEnrollment[]> {
    // Implementar integração com API do SIS
    throw new Error('Método não implementado');
  }

  public async updateStudentInfo(_studentId: string, _data: Partial<SISStudent>): Promise<void> {
    // Implementar integração com API do SIS
    throw new Error('Método não implementado');
  }

  public async syncAcademicData(_studentId: string): Promise<void> {
    // Implementar sincronização de dados acadêmicos
    throw new Error('Método não implementado');
  }

  /**
   * Retorna os dados de presença de um aluno
   */
  public async getStudentAttendance(_studentId: string): Promise<Record<string, unknown>[]> {
    // Implementar integração com API do SIS
    throw new Error('Método não implementado');
  }

  /**
   * Atualiza o registro de um aluno no SIS
   */
  public async updateStudentRecord(
    _studentId: string,
    _data: Record<string, unknown>,
  ): Promise<void> {
    // Implementar integração com API do SIS
    throw new Error('Método não implementado');
  }

  public async syncStudentData(_studentId: string): Promise<void> {
    // Implementar sincronização de dados do estudante
    throw new Error('Método não implementado');
  }
}
