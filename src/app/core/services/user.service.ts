import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ToggleUserStatusRequest,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<User[]>> {
    return this.http.get<ApplicationResult<User[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.users.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<User>> {
    return this.http.get<ApplicationResult<User>>(
      `${environment.apiUrl}${API_ENDPOINTS.users.getById}/${id}`
    );
  }

  create(request: CreateUserRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.users.create}`,
      request
    );
  }

  update(request: UpdateUserRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.users.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.users.delete}`,
      { params: { Id: id } }
    );
  }
}
