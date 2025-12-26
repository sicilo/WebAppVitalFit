export interface ServiceCategory {
  id?: number;
  name: string;
  description?: string;
  type: 'facial' | 'corporal' | 'laser' | 'otro';
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
