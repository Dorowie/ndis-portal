import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SupportWorkerItem {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  assignedService: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupportWorkersService {
  private apiUrl = 'https://localhost:7113/api/supportworkers';

  constructor(private http: HttpClient) {}

  // Get all support workers
  getWorkers(): Observable<SupportWorkerItem[]> {
    return this.http.get<SupportWorkerItem[]>(this.apiUrl);
  }

  // Get single support worker by ID
  getWorker(id: string): Observable<SupportWorkerItem> {
    return this.http.get<SupportWorkerItem>(`${this.apiUrl}/${id}`);
  }

  // Create new support worker
  createWorker(worker: SupportWorkerItem): Observable<SupportWorkerItem> {
    return this.http.post<SupportWorkerItem>(this.apiUrl, worker);
  }

  // Update support worker
  updateWorker(id: string, worker: Partial<SupportWorkerItem>): Observable<SupportWorkerItem> {
    return this.http.put<SupportWorkerItem>(`${this.apiUrl}/${id}`, worker);
  }

  // Delete support worker
  deleteWorker(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
