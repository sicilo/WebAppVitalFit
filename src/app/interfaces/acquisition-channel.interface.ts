export interface AcquisitionChannel {
  id?: number;
  name: string;
  type: 'instagram' | 'facebook' | 'web' | 'referido' | 'otro';
  description?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
