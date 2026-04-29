import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ServiceItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  is_active: boolean;
  category_name: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private readonly apiUrl = 'http://localhost:5130/api/services';

  constructor(private http: HttpClient) {}

  getServices(): Observable<ServiceItem[]> {
    return this.http.get<ApiResponse<ServiceItem[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getService(id: number): Observable<ServiceItem> {
    return this.http.get<ApiResponse<ServiceItem>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  createService(service: ServiceItem): Observable<ServiceItem> {
    return this.http.post<ApiResponse<ServiceItem>>(this.apiUrl, service)
      .pipe(map(response => response.data));
  }

  updateService(id: number, service: ServiceItem): Observable<ServiceItem> {
    return this.http.put<ApiResponse<ServiceItem>>(`${this.apiUrl}/${id}`, service)
      .pipe(map(response => response.data));
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }
}
