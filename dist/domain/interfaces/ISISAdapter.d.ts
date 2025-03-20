import { SISStudent } from '../types/SISStudent';
import { SISEnrollment } from '../types/SISEnrollment';
export interface ISISAdapter {
    getStudentInfo(studentId: string): Promise<SISStudent>;
    getStudentEnrollments(studentId: string): Promise<SISEnrollment[]>;
    updateStudentInfo(studentId: string, data: Partial<SISStudent>): Promise<void>;
    syncAcademicData(studentId: string): Promise<void>;
}
