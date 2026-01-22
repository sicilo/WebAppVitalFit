import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  Bonus,
  CreateBonusRequest,
  UpdateBonusRequest,
} from '../models/bonus.model';

@Injectable({
  providedIn: 'root',
})
export class BonusService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<Bonus[]>> {
    return this.http.get<ApplicationResult<Bonus[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.bonus.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<Bonus>> {
    return this.http.get<ApplicationResult<Bonus>>(
      `${environment.apiUrl}${API_ENDPOINTS.bonus.getById}/${id}`
    );
  }

  create(request: CreateBonusRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.bonus.create}`,
      request
    );
  }

  update(request: UpdateBonusRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.bonus.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.bonus.delete}`,
      { params: { Id: id } }
    );
  }
}
