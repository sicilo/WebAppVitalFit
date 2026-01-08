import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bundle } from '../interfaces/bundle.interface';
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
export class BundleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}master/bundle`;

  getAll(): Observable<ApiResponse<Bundle[]>> {
    return this.http.get<ApiResponse<Bundle[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<Bundle>> {
    return this.http.get<ApiResponse<Bundle>>(`${this.apiUrl}/${id}`);
  }

  create(bundle: Bundle): Observable<ApiResponse<Bundle>> {
    return this.http.post<ApiResponse<Bundle>>(`${this.apiUrl}/create`, bundle);
  }

  update(id: string, bundle: Bundle): Observable<ApiResponse<Bundle>> {
    return this.http.put<ApiResponse<Bundle>>(`${this.apiUrl}/update?Id=${id}`, bundle);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
