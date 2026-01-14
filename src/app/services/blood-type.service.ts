import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BloodType } from '../interfaces/blood-type.interface';
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
export class BloodTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}master/blood-type`;

  getAll(): Observable<ApiResponse<BloodType[]>> {
    return this.http.get<ApiResponse<BloodType[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<BloodType>> {
    return this.http.get<ApiResponse<BloodType>>(`${this.apiUrl}/get-by-id/${id}`);
  }

  create(bloodType: BloodType): Observable<ApiResponse<BloodType>> {
    return this.http.post<ApiResponse<BloodType>>(`${this.apiUrl}/create`, bloodType);
  }

  update(id: string, bloodType: BloodType): Observable<ApiResponse<BloodType>> {
    return this.http.put<ApiResponse<BloodType>>(`${this.apiUrl}/update?Id=${id}`, bloodType);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
