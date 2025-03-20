import { ILMSAdapter } from '@domain/interfaces/ILMSAdapter';
import { LMSStudent } from '@domain/types/LMSStudent';
import { LMSCourse } from '@domain/types/LMSCourse';
export declare class LMSAdapter implements ILMSAdapter {
    private apiUrl;
    private apiKey;
    constructor();
    getStudent(_studentId: string): Promise<LMSStudent>;
    getStudentCourses(_studentId: string): Promise<LMSCourse[]>;
    getStudentProgress(_studentId: string, _courseId: string): Promise<number>;
    syncStudentData(_studentId: string): Promise<void>;
}
