import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface SupportWorker {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  assignedService: string;
  serviceName?: string;
}

export interface SupportWorkerCreateDto {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  AssignedServiceId: number;
}

export interface SupportWorkerUpdateDto {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  AssignedServiceId: number;
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
export class SupportWorkersService {
  private readonly apiUrl = 'https://localhost:7113/api/support-workers';

  constructor(private http: HttpClient) {}

  getSupportWorkers(): Observable<SupportWorker[]> {
    return this.http.get<ApiResponse<SupportWorker[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  createSupportWorker(worker: SupportWorkerCreateDto): Observable<SupportWorker> {
    return this.http.post<ApiResponse<SupportWorker>>(this.apiUrl, worker)
      .pipe(map(response => response.data));
  }

  updateSupportWorker(id: number, worker: SupportWorkerUpdateDto): Observable<SupportWorker> {
    return this.http.put<ApiResponse<SupportWorker>>(`${this.apiUrl}/${id}`, worker)
      .pipe(map(response => response.data));
  }

  deleteSupportWorker(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }
}
