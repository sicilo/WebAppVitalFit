import { PagedResult } from "./api.model";

export interface ServiceOrder {
    id: string;
    customerId: string;
    customerNames: string;
    customerSurnames: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    consecutive: number;
}

export interface ServiceOrderItem {
    id: string;
    itemId: string;
    itemName: string;
    number: number;
    price: number;
}

export interface ServiceOrderDetail extends ServiceOrder {
    items: ServiceOrderItem[];
}

export interface CreateServiceOrderRequest {
    customerId: string;
    price: number;
    consecutive: number;
    items: Array<{
        itemId: string;
        number: number;
        price: number;
    }>;
}

export interface UpdateServiceOrderRequest {
    id: string;
    price: number;
    consecutive: number;
    items: Array<{
        itemId: string;
        number: number;
        price: number;
    }>;
}

export interface ServiceOrderPagedResult extends PagedResult<ServiceOrder> {
}
