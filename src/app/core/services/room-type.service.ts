import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  RoomType,
  CreateRoomTypeRequest,
  UpdateRoomTypeRequest,
} from '../models/room-type.model';

@Injectable({
  providedIn: 'root',
})
export class RoomTypeService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<RoomType[]>> {
    return this.http.get<ApplicationResult<RoomType[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.roomType.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<RoomType>> {
    return this.http.get<ApplicationResult<RoomType>>(
      `${environment.apiUrl}${API_ENDPOINTS.roomType.getById}/${id}`
    );
  }

  create(request: CreateRoomTypeRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.roomType.create}`,
      request
    );
  }

  update(request: UpdateRoomTypeRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.roomType.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.roomType.delete}`,
      { params: { Id: id } }
    );
  }
}
