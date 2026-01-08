import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gender } from '../interfaces/gender.interface';
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
export class GenderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}master/gender`;

  getAll(): Observable<ApiResponse<Gender[]>> {
    return this.http.get<ApiResponse<Gender[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<Gender>> {
    return this.http.get<ApiResponse<Gender>>(`${this.apiUrl}/${id}`);
  }

  create(gender: Gender): Observable<ApiResponse<Gender>> {
    return this.http.post<ApiResponse<Gender>>(`${this.apiUrl}/create`, gender);
  }

  update(id: string, gender: Gender): Observable<ApiResponse<Gender>> {
    return this.http.put<ApiResponse<Gender>>(`${this.apiUrl}/update?Id=${id}`, gender);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
