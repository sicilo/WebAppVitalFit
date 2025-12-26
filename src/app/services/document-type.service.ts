import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentType } from '../interfaces/document-type.interface';
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
export class DocumentTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}document-types`;

  getAll(): Observable<ApiResponse<DocumentType[]>> {
    return this.http.get<ApiResponse<DocumentType[]>>(`${this.apiUrl}/get-all`);
  }

  getById(id: number): Observable<ApiResponse<DocumentType>> {
    return this.http.get<ApiResponse<DocumentType>>(`${this.apiUrl}/${id}`);
  }

  create(documentType: DocumentType): Observable<ApiResponse<DocumentType>> {
    return this.http.post<ApiResponse<DocumentType>>(`${this.apiUrl}/create`, documentType);
  }

  update(id: number, documentType: DocumentType): Observable<ApiResponse<DocumentType>> {
    return this.http.put<ApiResponse<DocumentType>>(`${this.apiUrl}/update?Id=${id}`, documentType);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete?Id=${id}`);
  }
}
