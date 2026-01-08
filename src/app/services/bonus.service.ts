import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bonus } from '../interfaces/bonus.interface';
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
export class BonusService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}master/bonus`;

  getAll(): Observable<ApiResponse<Bonus[]>> {
    return this.http.get<ApiResponse<Bonus[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<Bonus>> {
    return this.http.get<ApiResponse<Bonus>>(`${this.apiUrl}/get-by-id/${id}`);
  }

  create(bonus: Bonus): Observable<ApiResponse<Bonus>> {
    return this.http.post<ApiResponse<Bonus>>(`${this.apiUrl}/create`, bonus);
  }

  update(id: string, bonus: Bonus): Observable<ApiResponse<Bonus>> {
    return this.http.put<ApiResponse<Bonus>>(`${this.apiUrl}/update?Id=${id}`, bonus);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
