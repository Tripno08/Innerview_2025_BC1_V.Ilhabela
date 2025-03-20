export interface SISEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  period: string;
  status: 'enrolled' | 'completed' | 'cancelled' | 'failed';
  enrollmentDate: Date;
  completionDate?: Date;
  grade?: number;
  attendance?: number;
  metadata?: Record<string, unknown>;
}
