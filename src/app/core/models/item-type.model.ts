export interface ItemType {
  id: string;
  name: string;
  description: string;
}

export interface CreateItemTypeRequest {
  name: string;
  description: string;
}

export interface UpdateItemTypeRequest {
  id: string;
  name: string;
  description: string;
}
