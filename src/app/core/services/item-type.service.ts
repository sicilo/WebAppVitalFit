import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  ItemType,
  CreateItemTypeRequest,
  UpdateItemTypeRequest,
} from '../models/item-type.model';

@Injectable({
  providedIn: 'root',
})
export class ItemTypeService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<ItemType[]>> {
    return this.http.get<ApplicationResult<ItemType[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.itemType.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<ItemType>> {
    return this.http.get<ApplicationResult<ItemType>>(
      `${environment.apiUrl}${API_ENDPOINTS.itemType.getById}/${id}`
    );
  }

  create(request: CreateItemTypeRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.itemType.create}`,
      request
    );
  }

  update(request: UpdateItemTypeRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.itemType.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.itemType.delete}`,
      { params: { Id: id } }
    );
  }
}
