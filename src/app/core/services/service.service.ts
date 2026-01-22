import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
} from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<Service[]>> {
    return this.http.get<ApplicationResult<Service[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.service.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<Service>> {
    return this.http.get<ApplicationResult<Service>>(
      `${environment.apiUrl}${API_ENDPOINTS.service.getById}/${id}`
    );
  }

  create(request: CreateServiceRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.service.create}`,
      request
    );
  }

  update(request: UpdateServiceRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.service.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.service.delete}`,
      { params: { Id: id } }
    );
  }
}
