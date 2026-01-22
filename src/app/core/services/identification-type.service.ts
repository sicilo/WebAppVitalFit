import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  CreateIdentificationTypeRequest,
  IdentificationType,
  UpdateIdentificationTypeRequest,
} from '../models/identification-type.model';

@Injectable({
  providedIn: 'root',
})
export class IdentificationTypeService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<IdentificationType[]>> {
    return this.http.get<ApplicationResult<IdentificationType[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.identificationType.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<IdentificationType>> {
    return this.http.get<ApplicationResult<IdentificationType>>(
      `${environment.apiUrl}${API_ENDPOINTS.identificationType.getById}/${id}`
    );
  }

  create(request: CreateIdentificationTypeRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.identificationType.create}`,
      request
    );
  }

  update(request: UpdateIdentificationTypeRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.identificationType.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.identificationType.delete}`,
      { params: { Id: id } }
    );
  }
}
