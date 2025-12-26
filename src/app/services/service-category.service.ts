import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceCategory } from '../interfaces/service-category.interface';
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
export class ServiceCategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}service-categories`;

  getAll(): Observable<ApiResponse<ServiceCategory[]>> {
    return this.http.get<ApiResponse<ServiceCategory[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: number): Observable<ApiResponse<ServiceCategory>> {
    return this.http.get<ApiResponse<ServiceCategory>>(`${this.apiUrl}/${id}`);
  }

  create(category: ServiceCategory): Observable<ApiResponse<ServiceCategory>> {
    return this.http.post<ApiResponse<ServiceCategory>>(`${this.apiUrl}/create`, category);
  }

  update(id: number, category: ServiceCategory): Observable<ApiResponse<ServiceCategory>> {
    return this.http.put<ApiResponse<ServiceCategory>>(`${this.apiUrl}/update?Id=${id}`, category);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
