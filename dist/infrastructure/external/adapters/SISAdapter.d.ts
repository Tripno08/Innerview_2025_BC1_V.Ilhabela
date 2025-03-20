import { ISISAdapter } from '@domain/interfaces/ISISAdapter';
import { SISStudent } from '@domain/types/SISStudent';
import { SISEnrollment } from '@domain/types/SISEnrollment';
export declare class SISAdapter implements ISISAdapter {
    private apiUrl;
    private apiKey;
    constructor();
    getStudentInfo(studentId: string): Promise<SISStudent>;
    getStudentEnrollments(studentId: string): Promise<SISEnrollment[]>;
    updateStudentInfo(studentId: string, data: Partial<SISStudent>): Promise<void>;
    syncAcademicData(studentId: string): Promise<void>;
}
