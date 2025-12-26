import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcquisitionChannel } from '../interfaces/acquisition-channel.interface';
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
export class AcquisitionChannelService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}acquisition-channels`;

  getAll(): Observable<ApiResponse<AcquisitionChannel[]>> {
    return this.http.get<ApiResponse<AcquisitionChannel[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: number): Observable<ApiResponse<AcquisitionChannel>> {
    return this.http.get<ApiResponse<AcquisitionChannel>>(`${this.apiUrl}/${id}`);
  }

  create(channel: AcquisitionChannel): Observable<ApiResponse<AcquisitionChannel>> {
    return this.http.post<ApiResponse<AcquisitionChannel>>(`${this.apiUrl}/create`, channel);
  }

  update(id: number, channel: AcquisitionChannel): Observable<ApiResponse<AcquisitionChannel>> {
    return this.http.put<ApiResponse<AcquisitionChannel>>(`${this.apiUrl}/update?Id=${id}`, channel);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
