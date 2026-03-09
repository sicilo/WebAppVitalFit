import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult, PagedRequest } from '../models/api.model';

import {
  AppointmentBody,
  AppointmentBodyPagedResult,
  CreateAppointmentBodyRequest,
  GetFilteredAppointmentsRequest,
  UpdateAppointmentBodyRequest,
} from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly http = inject(HttpClient);

  getPaged(request: PagedRequest): Observable<ApplicationResult<AppointmentBodyPagedResult>> {
    return this.http.get<ApplicationResult<AppointmentBodyPagedResult>>(
      `${environment.apiUrl}${API_ENDPOINTS.appointment.getPaged}`,
      {
        params: {
          page: request.page.toString(),
          itemsPerPage: request.itemsPerPage.toString(),
          ...(request.search ? { search: request.search } : {}),
        },
      }
    );
  }

  getFilteredBy(request: GetFilteredAppointmentsRequest): Observable<ApplicationResult<AppointmentBody[]>> {
    const params: Record<string, string> = {};
    if (request.professionalName) params['ProfessionalName'] = request.professionalName;
    if (request.patientName) params['PatientName'] = request.patientName;
    if (request.professionalIdentification) params['ProfessionalIdentification'] = request.professionalIdentification;
    if (request.patientIdentification) params['PatientIdentification'] = request.patientIdentification;
    if (request.roomName) params['RoomName'] = request.roomName;
    return this.http.get<ApplicationResult<AppointmentBody[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.appointment.getFilteredBy}`,
      { params }
    );
  }

  getById(id: string): Observable<ApplicationResult<AppointmentBody>> {
    return this.http.get<ApplicationResult<AppointmentBody>>(
      `${environment.apiUrl}${API_ENDPOINTS.appointment.getById}/${id}`
    );
  }

  create(request: CreateAppointmentBodyRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.appointment.create}`,
      request
    );
  }

  update(request: UpdateAppointmentBodyRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.appointment.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.appointment.delete}`,
      { params: { Id: id } }
    );
  }
}
