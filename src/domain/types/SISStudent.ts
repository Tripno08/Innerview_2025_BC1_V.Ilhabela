export interface SISStudent {
  id: string;
  registrationNumber: string;
  name: string;
  birthDate: Date;
  email: string;
  phoneNumber?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  academicStatus: 'regular' | 'irregular' | 'transferred' | 'graduated';
  enrollmentYear: number;
  currentPeriod: number;
  metadata?: Record<string, unknown>;
}
