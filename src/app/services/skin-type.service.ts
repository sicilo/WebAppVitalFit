import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SkinType } from '../interfaces/skin-type.interface';
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
export class SkinTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}skin-types`;

  getAll(): Observable<ApiResponse<SkinType[]>> {
    return this.http.get<ApiResponse<SkinType[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: number): Observable<ApiResponse<SkinType>> {
    return this.http.get<ApiResponse<SkinType>>(`${this.apiUrl}/${id}`);
  }

  create(skinType: SkinType): Observable<ApiResponse<SkinType>> {
    return this.http.post<ApiResponse<SkinType>>(`${this.apiUrl}/create`, skinType);
  }

  update(id: number, skinType: SkinType): Observable<ApiResponse<SkinType>> {
    return this.http.put<ApiResponse<SkinType>>(`${this.apiUrl}/update?Id=${id}`, skinType);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
