import { injectable } from 'tsyringe';
import { ILMSAdapter } from '@domain/interfaces/ILMSAdapter';
import { LMSStudent } from '@domain/types/LMSStudent';
import { LMSCourse } from '@domain/types/LMSCourse';
import { config } from '@config/external';

@injectable()
export class LMSAdapter implements ILMSAdapter {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = config.lms.apiUrl;
    this.apiKey = config.lms.apiKey;
  }

  public async getStudent(_studentId: string): Promise<LMSStudent> {
    // Implementar integração com API do LMS
    throw new Error('Método não implementado');
  }

  public async getStudentCourses(_studentId: string): Promise<LMSCourse[]> {
    // Implementar integração com API do LMS
    throw new Error('Método não implementado');
  }

  public async getStudentProgress(_studentId: string, _courseId: string): Promise<number> {
    // Implementar integração com API do LMS
    throw new Error('Método não implementado');
  }

  public async syncStudentData(_studentId: string): Promise<void> {
    // Implementar sincronização de dados do estudante
    throw new Error('Método não implementado');
  }
}
