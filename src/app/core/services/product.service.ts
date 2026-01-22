import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ApplicationResult<Product[]>> {
    return this.http.get<ApplicationResult<Product[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.product.getAll}`
    );
  }

  getById(id: string): Observable<ApplicationResult<Product>> {
    return this.http.get<ApplicationResult<Product>>(
      `${environment.apiUrl}${API_ENDPOINTS.product.getById}/${id}`
    );
  }

  create(request: CreateProductRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.product.create}`,
      request
    );
  }

  update(request: UpdateProductRequest): Observable<ApplicationResult<string>> {
    return this.http.put<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.product.update}`,
      request
    );
  }

  delete(id: string): Observable<ApplicationResult<string>> {
    return this.http.delete<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.product.delete}`,
      { params: { Id: id } }
    );
  }
}
