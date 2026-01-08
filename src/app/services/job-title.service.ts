import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobTitle } from '../interfaces/job-title.interface';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  value: T;
  error: any;
  advisories: any;
  isSuccess: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class JobTitleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}master/job-title`;

  getAll(): Observable<ApiResponse<JobTitle[]>> {
    return this.http.get<ApiResponse<JobTitle[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<JobTitle>> {
    return this.http.get<ApiResponse<JobTitle>>(`${this.apiUrl}/${id}`);
  }

  create(jobTitle: JobTitle): Observable<ApiResponse<JobTitle>> {
    return this.http.post<ApiResponse<JobTitle>>(`${this.apiUrl}/create`, jobTitle);
  }

  update(id: string, jobTitle: JobTitle): Observable<ApiResponse<JobTitle>> {
    return this.http.put<ApiResponse<JobTitle>>(`${this.apiUrl}/update?Id=${id}`, jobTitle);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
