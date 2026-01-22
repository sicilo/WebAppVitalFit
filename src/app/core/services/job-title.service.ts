import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  JobTitle,
  CreateJobTitleRequest,
  UpdateJobTitleRequest,
} from '../models/job-title.model';

@Injectable({
  providedIn: 'root',
})
export class JobTitleService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<JobTitle[]>> {
    return this.http.get<ApplicationResult<JobTitle[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.jobTitle.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<JobTitle>> {
    return this.http.get<ApplicationResult<JobTitle>>(
      `${environment.apiUrl}${API_ENDPOINTS.jobTitle.getById}/${id}`
    );
  }

  create(request: CreateJobTitleRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.jobTitle.create}`,
      request
    );
  }

  update(request: UpdateJobTitleRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.jobTitle.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.jobTitle.delete}`,
      { params: { Id: id } }
    );
  }
}
