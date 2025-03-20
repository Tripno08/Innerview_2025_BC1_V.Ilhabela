import { ISISAdapter } from '@domain/interfaces/ISISAdapter';
import { SISStudent } from '@domain/types/SISStudent';
import { SISEnrollment } from '@domain/types/SISEnrollment';
export declare class SISAdapter implements ISISAdapter {
    private apiUrl;
    private apiKey;
    constructor();
    getStudentInfo(_studentId: string): Promise<SISStudent>;
    getStudentEnrollments(_studentId: string): Promise<SISEnrollment[]>;
    updateStudentInfo(_studentId: string, _data: Partial<SISStudent>): Promise<void>;
    syncAcademicData(_studentId: string): Promise<void>;
    getStudentAttendance(_studentId: string): Promise<Record<string, unknown>[]>;
    updateStudentRecord(_studentId: string, _data: Record<string, unknown>): Promise<void>;
    syncStudentData(_studentId: string): Promise<void>;
}
