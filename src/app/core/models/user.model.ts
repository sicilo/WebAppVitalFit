export interface User {
  id: string;
  userName: string;
  email: string;
  roleId: string;
  roleName: string;
  status: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  userName: string;
  email: string;
  password: string;
  roleId: string;
}

export interface UpdateUserRequest {
  id: string;
  userName: string;
  email: string;
  password?: string;
  roleId: string;
  status: boolean;
}

export interface ToggleUserStatusRequest {
  id: string;
  status: boolean;
}
