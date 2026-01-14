import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NoveltyType } from '../interfaces/novelty-type.interface';
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
export class NoveltyTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}master/novelty-type`;

  getAll(): Observable<ApiResponse<NoveltyType[]>> {
    return this.http.get<ApiResponse<NoveltyType[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<NoveltyType>> {
    return this.http.get<ApiResponse<NoveltyType>>(`${this.apiUrl}/${id}`);
  }

  create(noveltyType: NoveltyType): Observable<ApiResponse<NoveltyType>> {
    return this.http.post<ApiResponse<NoveltyType>>(`${this.apiUrl}/create`, noveltyType);
  }

  update(id: string, noveltyType: NoveltyType): Observable<ApiResponse<NoveltyType>> {
    return this.http.put<ApiResponse<NoveltyType>>(`${this.apiUrl}/update?Id=${id}`, noveltyType);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
