export interface BloodType {
  id: string;
  name: string;
  description: string;
}

export interface CreateBloodTypeRequest {
  name: string;
  description: string;
}

export interface UpdateBloodTypeRequest {
  id: string;
  name: string;
  description: string;
}
