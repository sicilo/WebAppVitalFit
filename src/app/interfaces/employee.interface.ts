export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  documentType?: string;
  documentNumber?: string;
  role: 'esteticista' | 'medico' | 'auxiliar' | 'otro';
  phone?: string;
  email?: string;
  specialization?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
