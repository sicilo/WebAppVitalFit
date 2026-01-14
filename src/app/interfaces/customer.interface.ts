export interface Customer {
  id?: string;
  identificationTypeId: string;
  identificationTypeName?: string;
  identification: string;
  names: string;
  surnames: string;
  phone?: string;
  email?: string;
  bloodTypeId?: string;
  bloodTypeName?: string;
  birthDate?: Date | string;
  address?: string;
  createdAt?: Date | string;
}
