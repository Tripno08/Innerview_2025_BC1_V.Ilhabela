import { ILMSAdapter } from '@domain/interfaces/ILMSAdapter';
import { LMSStudent } from '@domain/types/LMSStudent';
import { LMSCourse } from '@domain/types/LMSCourse';
export declare class LMSAdapter implements ILMSAdapter {
    private apiUrl;
    private apiKey;
    constructor();
    getStudent(studentId: string): Promise<LMSStudent>;
    getStudentCourses(studentId: string): Promise<LMSCourse[]>;
    getStudentProgress(studentId: string, courseId: string): Promise<number>;
    syncStudentData(studentId: string): Promise<void>;
}
