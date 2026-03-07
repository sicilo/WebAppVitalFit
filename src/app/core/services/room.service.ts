import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult, PagedRequest } from '../models/api.model';
import {
  Room,
  RoomPagedResult,
  CreateRoomRequest,
  UpdateRoomRequest,
} from '../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly http = inject(HttpClient);

  getPaged(request: PagedRequest): Observable<ApplicationResult<RoomPagedResult>> {
    return this.http.get<ApplicationResult<RoomPagedResult>>(
      `${environment.apiUrl}${API_ENDPOINTS.room.getPaged}`,
      {
        params: {
          page: request.page.toString(),
          itemsPerPage: request.itemsPerPage.toString(),
          ...(request.search ? { search: request.search } : {}),
        },
      }
    );
  }

  getById(id: string): Observable<ApplicationResult<Room>> {
    return this.http.get<ApplicationResult<Room>>(
      `${environment.apiUrl}${API_ENDPOINTS.room.getById}/${id}`
    );
  }

  create(request: CreateRoomRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.room.create}`,
      request
    );
  }

  update(request: UpdateRoomRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.room.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.room.delete}`,
      { params: { Id: id } }
    );
  }
}
