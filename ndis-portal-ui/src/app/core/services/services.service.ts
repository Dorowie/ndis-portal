import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServiceItem {
  id?: string;
  name: string;
  category: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private apiUrl = 'https://localhost:7113/api/services';

  constructor(private http: HttpClient) {}

  // Get all services
  getServices(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(this.apiUrl);
  }

  // Get single service by ID
  getService(id: number): Observable<ServiceItem> {
    return this.http.get<ServiceItem>(`${this.apiUrl}/${id}`);
  }

  // Create new service (for "Add New Service" modal)
  createService(service: ServiceItem): Observable<ServiceItem> {
    return this.http.post<ServiceItem>(this.apiUrl, service);
  }

  // Update service status
  updateServiceStatus(id: string, status: 'Active' | 'Inactive'): Observable<ServiceItem> {
    return this.http.patch<ServiceItem>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Update entire service
  updateService(id: string, service: ServiceItem): Observable<ServiceItem> {
    return this.http.put<ServiceItem>(`${this.apiUrl}/${id}`, service);
  }

  // Delete service
  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
