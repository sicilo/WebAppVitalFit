import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import { LoginRequest, LoginResponse, UserInfo } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly STORAGE_KEY = 'vitalfit-auth';

  private readonly _isAuthenticated = signal<boolean>(this.hasValidToken());
  private readonly _userInfo = signal<UserInfo | null>(null);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly userInfo = this._userInfo.asReadonly();

  login(request: LoginRequest): Observable<ApplicationResult<LoginResponse>> {
    return this.http
      .post<ApplicationResult<LoginResponse>>(
        `${environment.apiUrl}${API_ENDPOINTS.auth.login}`,
        request
      )
      .pipe(
        tap((response) => {
          if (response.value) {
            this.saveToken(response.value);
            this._isAuthenticated.set(true);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this._isAuthenticated.set(false);
    this._userInfo.set(null);
    this.router.navigate(['/auth/login']);
  }

  getUserInfo(): Observable<ApplicationResult<UserInfo>> {
    return this.http
      .get<ApplicationResult<UserInfo>>(
        `${environment.apiUrl}${API_ENDPOINTS.auth.userInfo}`
      )
      .pipe(
        tap((response) => {
          if (response.value) {
            this._userInfo.set(response.value);
          }
        })
      );
  }

  getAccessToken(): string | null {
    const auth = this.getStoredAuth();
    return auth?.accessToken ?? null;
  }

  private saveToken(response: LoginResponse): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response));
  }

  private getStoredAuth(): LoginResponse | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  private hasValidToken(): boolean {
    const auth = this.getStoredAuth();
    if (!auth) return false;

    const expiresAt = new Date(auth.expiresAt);
    return expiresAt > new Date();
  }
}
