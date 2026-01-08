import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdentificationType } from '../interfaces/identification-type.interface';
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
export class IdentificationTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}master/identification-type`;

  getAll(): Observable<ApiResponse<IdentificationType[]>> {
    return this.http.get<ApiResponse<IdentificationType[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<IdentificationType>> {
    return this.http.get<ApiResponse<IdentificationType>>(`${this.apiUrl}/get-by-id/${id}`);
  }

  create(identificationType: IdentificationType): Observable<ApiResponse<IdentificationType>> {
    return this.http.post<ApiResponse<IdentificationType>>(`${this.apiUrl}/create`, identificationType);
  }

  update(id: string, identificationType: IdentificationType): Observable<ApiResponse<IdentificationType>> {
    return this.http.put<ApiResponse<IdentificationType>>(`${this.apiUrl}/update?Id=${id}`, identificationType);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
