export interface RoomType {
  id: string;
  name: string;
  description: string;
}

export interface CreateRoomTypeRequest {
  name: string;
  description: string;
}

export interface UpdateRoomTypeRequest {
  id: string;
  name: string;
  description: string;
}
