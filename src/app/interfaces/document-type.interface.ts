export interface DocumentType {
  id?: number;
  code: string;
  name: string;
  description?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
