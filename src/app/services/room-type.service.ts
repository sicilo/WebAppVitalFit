import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomType } from '../interfaces/room-type.interface';
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
export class RoomTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}master/room-type`;

  getAll(): Observable<ApiResponse<RoomType[]>> {
    return this.http.get<ApiResponse<RoomType[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<RoomType>> {
    return this.http.get<ApiResponse<RoomType>>(`${this.apiUrl}/get-by-id/${id}`);
  }

  create(roomType: RoomType): Observable<ApiResponse<RoomType>> {
    return this.http.post<ApiResponse<RoomType>>(`${this.apiUrl}/create`, roomType);
  }

  update(id: string, roomType: RoomType): Observable<ApiResponse<RoomType>> {
    return this.http.put<ApiResponse<RoomType>>(`${this.apiUrl}/update?Id=${id}`, roomType);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
