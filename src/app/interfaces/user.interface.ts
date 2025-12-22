export interface User {
  id: string;
  userName: string;
  email: string;
  status: boolean;
  roleId: string;
  roleName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserCreate {
  userName: string;
  email: string;
  password: string;
  status: boolean;
  roleId: string;
}

export interface UserUpdate {
  id: string;
  userName: string;
  email: string;
  password?: string;
  status: boolean;
  roleId: string;
}
