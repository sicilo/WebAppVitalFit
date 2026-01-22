export interface IdentificationType {
  id: string;
  name: string;
  description: string;
}

export interface CreateIdentificationTypeRequest {
  name: string;
  description: string;
}

export interface UpdateIdentificationTypeRequest {
  id: string;
  name: string;
  description: string;
}
