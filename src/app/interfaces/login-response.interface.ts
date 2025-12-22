export interface LoginResponse {
  value: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    tokenType: string;
  };
  error: any;
  advisories: any;
  isSuccess: boolean;
}
