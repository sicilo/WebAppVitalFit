import { PagedResult } from "./api.model";

export interface ServiceOrder {
    id: string;
    orderConsecutive: number;
    orderPrice: number;
    orderCreationDate: string;
    customerId: string;
    customerIdentification: string;
    customerFullName: string;
    customerPhone: string;
    customerEmail: string;
    orderServiceId: string;
    orderServiceName: string;
    orderServiceSessions: number;
    orderServiceDuration: string;
    orderServiceValidity: string;
    appointmentsHeaderId: string;
    totalServiceSessions: number;
    totalTakenSessions: number;
}

export type ServiceOrderDetail = ServiceOrder;

export interface CreateServiceOrderRequest {
    customerId: string;
    price: number;
    consecutive?: number;
    items: Array<{
        itemId: string;
        number: number;
        price: number;
        isService: boolean;
    }>;
}

export interface UpdateServiceOrderRequest {
    id: string;
    price: number;
    consecutive?: number;
    items: Array<{
        itemId: string;
        number: number;
        price: number;
        isService: boolean;
    }>;
}

export interface ServiceOrderPagedResult extends PagedResult<ServiceOrder> {
}
