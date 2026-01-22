export interface Gender {
  id: string;
  name: string;
  description: string;
}

export interface CreateGenderRequest {
  name: string;
  description: string;
}

export interface UpdateGenderRequest {
  id: string;
  name: string;
  description: string;
}
