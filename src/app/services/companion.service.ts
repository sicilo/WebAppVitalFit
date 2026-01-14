import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Companion } from '../interfaces/companion.interface';
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
export class CompanionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}clinic/companion`;

  getAll(): Observable<ApiResponse<Companion[]>> {
    return this.http.get<ApiResponse<Companion[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<Companion>> {
    return this.http.get<ApiResponse<Companion>>(`${this.apiUrl}/get-by-id/${id}`);
  }

  create(companion: Companion): Observable<ApiResponse<Companion>> {
    return this.http.post<ApiResponse<Companion>>(`${this.apiUrl}/create`, companion);
  }

  update(id: string, companion: Companion): Observable<ApiResponse<Companion>> {
    return this.http.put<ApiResponse<Companion>>(`${this.apiUrl}/update?Id=${id}`, companion);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
