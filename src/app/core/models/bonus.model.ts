export interface Bonus {
  id: string;
  name: string;
  description: string;
  sessions: number;
  price: number;
}

export interface CreateBonusRequest {
  name: string;
  description: string;
  sessions: number;
  price: number;
}

export interface UpdateBonusRequest {
  id: string;
  name: string;
  description: string;
  sessions: number;
  price: number;
}
