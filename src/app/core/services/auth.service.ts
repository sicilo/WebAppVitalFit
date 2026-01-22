import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly STORAGE_KEY = 'vitalfit-auth';

  private readonly _isAuthenticated = signal<boolean>(this.hasValidToken());

  readonly isAuthenticated = this._isAuthenticated.asReadonly();

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
    this.router.navigate(['/auth/login']);
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
