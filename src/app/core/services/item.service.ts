import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult, PagedRequest, PagedResult } from '../models/api.model';
import {
  Item,
  CreateItemRequest,
  UpdateItemRequest,
} from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly http = inject(HttpClient);

  getPaged(request: PagedRequest): Observable<ApplicationResult<PagedResult<Item>>> {
    return this.http.get<ApplicationResult<PagedResult<Item>>>(
      `${environment.apiUrl}${API_ENDPOINTS.item.getPaged}`,
      {
        params: {
          page: request.page.toString(),
          itemsPerPage: request.itemsPerPage.toString(),
          ...(request.search ? { search: request.search } : {}),
        },
      }
    );
  }

  create(request: CreateItemRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.item.create}`,
      request
    );
  }

  update(request: UpdateItemRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.item.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.item.delete}`,
      { params: { Id: id } }
    );
  }
}
