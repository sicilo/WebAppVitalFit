import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  CreateRoleRequest,
  ManageRolePermissionsRequest,
  Role,
  RolePermissionView,
  UpdateRoleRequest,
} from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<Role[]>> {
    return this.http.get<ApplicationResult<Role[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.roles.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<Role>> {
    return this.http.get<ApplicationResult<Role>>(
      `${environment.apiUrl}${API_ENDPOINTS.roles.getById}/${id}`
    );
  }

  getPermissions(roleId: string): Observable<ApplicationResult<RolePermissionView[]>> {
    return this.http.get<ApplicationResult<RolePermissionView[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.roles.getPermissions}/${roleId}/permissions`
    );
  }

  create(request: CreateRoleRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.roles.create}`,
      request
    );
  }

  update(request: UpdateRoleRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.roles.update}`,
      request
    );
  }

  updatePermissions(
    request: ManageRolePermissionsRequest
  ): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.roles.updatePermissions}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.roles.delete}`,
      { params: { id } }
    );
  }
}
