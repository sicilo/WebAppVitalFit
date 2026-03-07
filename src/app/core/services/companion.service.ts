import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import { Companion } from '../models/companion.model';

@Injectable({
  providedIn: 'root',
})
export class CompanionService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<Companion[]>> {
    return this.http.get<ApplicationResult<Companion[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.companion.getAll}`
    );
  }
}
