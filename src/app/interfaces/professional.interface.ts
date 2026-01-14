export interface Professional {
  id?: string;
  identificationTypeId: string;
  identificationTypeName?: string;
  identification: string;
  names: string;
  surnames: string;
  phone?: string;
  email?: string;
  createdAt?: Date | string;
}
