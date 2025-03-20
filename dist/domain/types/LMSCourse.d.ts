export interface LMSCourse {
    id: string;
    externalId: string;
    name: string;
    code: string;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'inactive' | 'archived';
    enrollmentCount: number;
    metadata?: Record<string, unknown>;
}
