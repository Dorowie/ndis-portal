import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ServiceRecommendationRequest {
  userSituation: string;
  supportNeeds: string;
  conversationHistory?: string[];
}

export interface RecommendedService {
  id: number;
  name: string;
  description: string;
  categoryName: string;
  reason: string;
}

export interface ServiceRecommendationResponse {
  recommendations: RecommendedService[];
  summary: string;
}

interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceRecommendationService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7113/api/servicerecommendation';

  getRecommendations(request: ServiceRecommendationRequest): Observable<ServiceRecommendationResponse> {
    return this.http.post<ApiResponse<ServiceRecommendationResponse>>(this.apiUrl, request)
      .pipe(
        map(response => response.data)
      );
  }
}
