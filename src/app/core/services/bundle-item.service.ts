import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApplicationResult } from '../models/api.model';
import { BundleItem, SaveBundleItemsRequest } from '../models/bundle-item.model';

@Injectable({
  providedIn: 'root',
})
export class BundleItemService {
  private readonly http = inject(HttpClient);

  getAll(bundleId: string): Observable<ApplicationResult<BundleItem[]>> {
    return this.http.get<ApplicationResult<BundleItem[]>>(
      `${environment.apiUrl}${API_ENDPOINTS.bundleItems.getAll}`,
      { params: { BundleId: bundleId } }
    );
  }

  save(request: SaveBundleItemsRequest): Observable<ApplicationResult<string>> {
    return this.http.post<ApplicationResult<string>>(
      `${environment.apiUrl}${API_ENDPOINTS.bundleItems.create}`,
      request
    );
  }
}
