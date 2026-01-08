import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeType } from '../interfaces/employee-type.interface';
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
export class EmployeeTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}master/employee-type`;

  getAll(): Observable<ApiResponse<EmployeeType[]>> {
    return this.http.get<ApiResponse<EmployeeType[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<EmployeeType>> {
    return this.http.get<ApiResponse<EmployeeType>>(`${this.apiUrl}/${id}`);
  }

  create(employeeType: EmployeeType): Observable<ApiResponse<EmployeeType>> {
    return this.http.post<ApiResponse<EmployeeType>>(`${this.apiUrl}/create`, employeeType);
  }

  update(id: string, employeeType: EmployeeType): Observable<ApiResponse<EmployeeType>> {
    return this.http.put<ApiResponse<EmployeeType>>(`${this.apiUrl}/update?Id=${id}`, employeeType);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
