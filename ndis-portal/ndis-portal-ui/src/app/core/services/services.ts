import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServiceItem {
  id: number;
  name: string;
  category: string;
  description: string;
  accent: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private readonly apiUrl = 'http://localhost:5000/api/services';

  constructor(private http: HttpClient) {}

  getServices(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(this.apiUrl);
  }

  getService(id: number): Observable<ServiceItem> {
    return this.http.get<ServiceItem>(`${this.apiUrl}/${id}`);
  }

  createService(service: ServiceItem): Observable<ServiceItem> {
    return this.http.post<ServiceItem>(this.apiUrl, service);
  }

  updateService(id: number, service: ServiceItem): Observable<ServiceItem> {
    return this.http.put<ServiceItem>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
