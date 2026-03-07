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
import { PagedRequest } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderService {
  private readonly http = inject(HttpClient);

  getPaged(request: PagedRequest & { isClient?: boolean; isEmployee?: boolean }): Observable<ApplicationResult<ServiceOrderPagedResult>> {
    return this.http.get<ApplicationResult<ServiceOrderPagedResult>>(
      `${environment.apiUrl}${API_ENDPOINTS.serviceOrder.getPaged}`,
      {
        params: {
          page: request.page.toString(),
          itemsPerPage: request.itemsPerPage.toString(),
          ...(request.search ? { search: request.search } : {}),
          ...(request.isClient !== undefined ? { isClient: request.isClient.toString() } : {}),
          ...(request.isEmployee !== undefined ? { isEmployee: request.isEmployee.toString() } : {}),
        },
      }
    );
  }

  getById(params: { id?: string; consecutive?: number; isClient?: boolean; isEmployee?: boolean }): Observable<ApplicationResult<ServiceOrderDetail>> {
    const queryParams: Record<string, string | number> = {};
    if (params.id) queryParams['Id'] = params.id;
    if (params.consecutive) queryParams['Consecutive'] = params.consecutive;
    if (params.isClient !== undefined) queryParams['IsClient'] = params.isClient.toString();
    if (params.isEmployee !== undefined) queryParams['IsEmployee'] = params.isEmployee.toString();
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
