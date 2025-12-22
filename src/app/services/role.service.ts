import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, RoleCreate, RoleUpdate, Permission, RolePermissionUpdate } from '../interfaces/role.interface';
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
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}surety/role`;

  getAll(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`);
  }

  create(role: RoleCreate): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(`${this.apiUrl}/create`, role);
  }

  update(id: string, role: RoleUpdate): Observable<ApiResponse<Role>> {
    return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/update?Id=${id}`, role);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }

  getPermissions(roleId: string): Observable<ApiResponse<Permission[]>> {
    return this.http.get<ApiResponse<Permission[]>>(`${this.apiUrl}/${roleId}/permissions`);
  }

  updatePermissions(permissions: RolePermissionUpdate): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/permissions`, permissions);
  }
}
