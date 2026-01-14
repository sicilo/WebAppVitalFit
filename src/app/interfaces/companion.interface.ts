export interface Companion {
  id?: string;
  identificationTypeId: string;
  identificationTypeName?: string;
  identification: string;
  names: string;
  surnames: string;
  phone?: string;
  email?: string;
  relationship?: string;
  createdAt?: Date | string;
}
