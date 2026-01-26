export interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface CreateBundleRequest {
  name: string;
  description: string;
  price: number;
}

export interface UpdateBundleRequest {
  id: string;
  name: string;
  description: string;
  price: number;
}
