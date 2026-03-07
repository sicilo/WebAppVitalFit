import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import { Professional } from '../models/professional.model';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<Professional[]>> {
    return this.http.get<ApplicationResult<Professional[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.professional.getAll}`
    );
  }
}
