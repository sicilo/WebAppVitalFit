export interface Person {
  id: string;
  identificationTypeId: string;
  identificationTypeName?: string;
  identification: string;
  names: string;
  surnames: string;
  phone: string;
  email: string;
  birthDate: string;
  isClient: boolean;
  isEmployee: boolean;
  genderId?: string;
  genderName?: string;
  bloodTypeId?: string;
  bloodTypeName?: string;
  jobTitleId?: string;
  jobTitleName?: string;
  address?: string;
  active: boolean;
}

export interface CreatePersonRequest {
  identificationTypeId: string;
  identification: string;
  names: string;
  surnames: string;
  phone: string;
  email: string;
  birthDate: string;
  isClient: boolean;
  isEmployee: boolean;
  genderId?: string;
  bloodTypeId?: string;
  jobTitleId?: string;
  address?: string;
  active: boolean;
}

export interface UpdatePersonRequest {
  id: string;
  identificationTypeId: string;
  identification: string;
  names: string;
  surnames: string;
  phone: string;
  email: string;
  birthDate: string;
  isClient: boolean;
  isEmployee: boolean;
  genderId?: string;
  bloodTypeId?: string;
  jobTitleId?: string;
  address?: string;
  active: boolean;
}

export interface PersonPagedRequest {
  search?: string;
  page: number;
  itemsPerPage: number;
}

export interface PersonPagedResult {
  items: Person[];
  totalCount: number;
}
