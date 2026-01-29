import { PagedResult } from "./api.model";

export interface Item {
  id: string;
  itemTypeId: string;
  itemTypeName: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemRequest {
  itemTypeId: string;
  name: string;
  description: string;
  price: number;
}

export interface UpdateItemRequest {
  id: string;
  itemTypeId: string;
  name: string;
  description: string;
  price: number;
}

export interface PersonPagedResult extends PagedResult<Item> {
}
