export interface InsuranceProvider {
  id?: number;
  name: string;
  code?: string;
  phone?: string;
  email?: string;
  description?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
