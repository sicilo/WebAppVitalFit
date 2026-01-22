import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  Gender,
  CreateGenderRequest,
  UpdateGenderRequest,
} from '../models/gender.model';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<Gender[]>> {
    return this.http.get<ApplicationResult<Gender[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.gender.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<Gender>> {
    return this.http.get<ApplicationResult<Gender>>(
      `${environment.apiUrl}${API_ENDPOINTS.gender.getById}/${id}`
    );
  }

  create(request: CreateGenderRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.gender.create}`,
      request
    );
  }

  update(request: UpdateGenderRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.gender.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.gender.delete}`,
      { params: { Id: id } }
    );
  }
}
