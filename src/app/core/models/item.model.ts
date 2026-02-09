import { PagedResult } from "./api.model";

export interface Item {
  id: string;
  itemTypeId: string;
  itemTypeName: string;
  name: string;
  description: string;
  price: number;
  minimumSessions: number | null;
  duration: string | null;
  validity: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemRequest {
  itemTypeId: string;
  name: string;
  description: string;
  price: number;
  isService: boolean;
  minimumSessions?: number | null;
  duration?: string | null;
  validity?: string | null;
}

export interface UpdateItemRequest {
  id: string;
  itemTypeId: string;
  name: string;
  description: string;
  price: number;
  isService: boolean;
  minimumSessions?: number | null;
  duration?: string | null;
  validity?: string | null;
}

export interface PersonPagedResult extends PagedResult<Item> {
}
