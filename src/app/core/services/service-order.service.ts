import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  ServiceOrderDetail,
  ServiceOrderPagedResult,
  CreateServiceOrderRequest,
  UpdateServiceOrderRequest,
} from '../models/service-order.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderService {
  private readonly http = inject(HttpClient);

  getPaged(): Observable<ApplicationResult<ServiceOrderPagedResult>> {
    return this.http.get<ApplicationResult<ServiceOrderPagedResult>>(
      `${environment.apiUrl}${API_ENDPOINTS.serviceOrder.getPaged}`
    );
  }

  getById(params: { id?: string; consecutive?: number }): Observable<ApplicationResult<ServiceOrderDetail>> {
    const queryParams: Record<string, string | number> = {};
    if (params.id) queryParams['Id'] = params.id;
    if (params.consecutive) queryParams['Consecutive'] = params.consecutive;
    return this.http.get<ApplicationResult<ServiceOrderDetail>>(
      `${environment.apiUrl}${API_ENDPOINTS.serviceOrder.getById}`,
      { params: queryParams }
    );
  }

  create(request: CreateServiceOrderRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.serviceOrder.create}`,
      request
    );
  }

  update(request: UpdateServiceOrderRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.serviceOrder.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.serviceOrder.delete}`,
      { params: { Id: id } }
    );
  }
}
