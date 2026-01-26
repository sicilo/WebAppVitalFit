export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
}

export interface UserInfo {
  id: string;
  userName: string;
  email: string;
  roleId: string;
  roleName: string;
}
