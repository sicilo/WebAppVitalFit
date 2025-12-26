export interface Provider {
  id?: number;
  name: string;
  nit?: string;
  phone?: string;
  email?: string;
  address?: string;
  contactPerson?: string;
  description?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
