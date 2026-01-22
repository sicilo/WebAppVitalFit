import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  BloodType,
  CreateBloodTypeRequest,
  UpdateBloodTypeRequest,
} from '../models/blood-type.model';

@Injectable({
  providedIn: 'root',
})
export class BloodTypeService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<BloodType[]>> {
    return this.http.get<ApplicationResult<BloodType[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.bloodType.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<BloodType>> {
    return this.http.get<ApplicationResult<BloodType>>(
      `${environment.apiUrl}${API_ENDPOINTS.bloodType.getById}/${id}`
    );
  }

  create(request: CreateBloodTypeRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.bloodType.create}`,
      request
    );
  }

  update(request: UpdateBloodTypeRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.bloodType.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.bloodType.delete}`,
      { params: { Id: id } }
    );
  }
}
