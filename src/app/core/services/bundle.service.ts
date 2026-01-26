import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  Bundle,
  CreateBundleRequest,
  UpdateBundleRequest,
} from '../models/bundle.model';

@Injectable({
  providedIn: 'root',
})
export class BundleService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<Bundle[]>> {
    return this.http.get<ApplicationResult<Bundle[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.bundle.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<Bundle>> {
    return this.http.get<ApplicationResult<Bundle>>(
      `${environment.apiUrl}${API_ENDPOINTS.bundle.getById}/${id}`
    );
  }

  create(request: CreateBundleRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.bundle.create}`,
      request
    );
  }

  update(request: UpdateBundleRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.bundle.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.bundle.delete}`,
      { params: { Id: id } }
    );
  }
}
