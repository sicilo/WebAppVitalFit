import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professional } from '../interfaces/professional.interface';
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
export class ProfessionalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}clinic/professional`;

  getAll(): Observable<ApiResponse<Professional[]>> {
    return this.http.get<ApiResponse<Professional[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<Professional>> {
    return this.http.get<ApiResponse<Professional>>(`${this.apiUrl}/get-by-id/${id}`);
  }

  create(professional: Professional): Observable<ApiResponse<Professional>> {
    return this.http.post<ApiResponse<Professional>>(`${this.apiUrl}/create`, professional);
  }

  update(id: string, professional: Professional): Observable<ApiResponse<Professional>> {
    return this.http.put<ApiResponse<Professional>>(`${this.apiUrl}/update?Id=${id}`, professional);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
