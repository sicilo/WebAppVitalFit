export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
}

export interface UpdateProductRequest {
  id: string;
  name: string;
  description: string;
  price: number;
}
