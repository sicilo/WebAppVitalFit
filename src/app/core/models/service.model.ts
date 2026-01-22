export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
}

export interface UpdateServiceRequest {
  id: string;
  name: string;
  description: string;
  price: number;
}
