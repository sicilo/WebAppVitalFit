import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider } from '../interfaces/provider.interface';
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
export class ProviderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}providers`;

  getAll(): Observable<ApiResponse<Provider[]>> {
    return this.http.get<ApiResponse<Provider[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: number): Observable<ApiResponse<Provider>> {
    return this.http.get<ApiResponse<Provider>>(`${this.apiUrl}/${id}`);
  }

  create(provider: Provider): Observable<ApiResponse<Provider>> {
    return this.http.post<ApiResponse<Provider>>(`${this.apiUrl}/create`, provider);
  }

  update(id: number, provider: Provider): Observable<ApiResponse<Provider>> {
    return this.http.put<ApiResponse<Provider>>(`${this.apiUrl}/update?Id=${id}`, provider);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
