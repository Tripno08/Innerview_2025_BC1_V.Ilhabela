export interface LMSStudent {
  id: string;
  externalId: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  enrolledCourses: string[];
  lastAccess?: Date;
  metadata?: Record<string, unknown>;
}
