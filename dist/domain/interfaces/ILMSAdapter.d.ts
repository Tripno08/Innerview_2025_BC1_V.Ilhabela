import { LMSStudent } from '../types/LMSStudent';
import { LMSCourse } from '../types/LMSCourse';
export interface ILMSAdapter {
    getStudent(studentId: string): Promise<LMSStudent>;
    getStudentCourses(studentId: string): Promise<LMSCourse[]>;
    getStudentProgress(studentId: string, courseId: string): Promise<number>;
    syncStudentData(studentId: string): Promise<void>;
}
