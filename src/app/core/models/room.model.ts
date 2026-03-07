import { PagedResult } from "./api.model";

export interface Room {
    id: string;
    roomTypeId: string;
    roomTypeName: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRoomRequest {
    roomTypeId: string;
    name: string;
    description: string;
}

export interface UpdateRoomRequest {
    id: string;
    roomTypeId: string;
    name: string;
    description: string;
}

export interface RoomPagedResult extends PagedResult<Room> {
}

