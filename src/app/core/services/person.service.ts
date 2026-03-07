import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult, PagedRequest } from '../models/api.model';
import {
  Person,
  CreatePersonRequest,
  UpdatePersonRequest,
  PersonPagedResult,
} from '../models/person.model';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private readonly http = inject(HttpClient);

  getPaged(request: PagedRequest & { isClient?: boolean; isEmployee?: boolean }): Observable<ApplicationResult<PersonPagedResult>> {
    return this.http.get<ApplicationResult<PersonPagedResult>>(
      `${environment.apiUrl}${API_ENDPOINTS.person.getPaged}`,
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

  getById(id: string): Observable<ApplicationResult<Person>> {
    return this.http.get<ApplicationResult<Person>>(
      `${environment.apiUrl}${API_ENDPOINTS.person.getById}/${id}`
    );
  }

  create(request: CreatePersonRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.person.create}`,
      request
    );
  }

  update(request: UpdatePersonRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.person.update}`,
      request
    );
  }
}
