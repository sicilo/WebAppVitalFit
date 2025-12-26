import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InsuranceProvider } from '../interfaces/insurance-provider.interface';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  value: T;
  error: any;
  advisories: any;
  isSuccess: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InsuranceProviderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}insurance-providers`;

  getAll(): Observable<ApiResponse<InsuranceProvider[]>> {
    return this.http.get<ApiResponse<InsuranceProvider[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: number): Observable<ApiResponse<InsuranceProvider>> {
    return this.http.get<ApiResponse<InsuranceProvider>>(`${this.apiUrl}/${id}`);
  }

  create(provider: InsuranceProvider): Observable<ApiResponse<InsuranceProvider>> {
    return this.http.post<ApiResponse<InsuranceProvider>>(`${this.apiUrl}/create`, provider);
  }

  update(id: number, provider: InsuranceProvider): Observable<ApiResponse<InsuranceProvider>> {
    return this.http.put<ApiResponse<InsuranceProvider>>(`${this.apiUrl}/update?Id=${id}`, provider);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
