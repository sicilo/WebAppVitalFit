import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserCreate, UserUpdate } from '../interfaces/user.interface';
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
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}surety/user`;

  getAll(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/get-by-id/${id}`);
  }

  create(user: UserCreate): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/create`, user);
  }

  update(id: string, user: UserUpdate): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/update?Id=${id}`, user);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
