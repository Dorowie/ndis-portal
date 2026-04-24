import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5131/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error(response.message || 'Login failed');
        }),
        catchError(this.handleError)
      );
  }

  register(data: RegisterRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/register`, data)
      .pipe(
        map(response => {
          if (response.success) {
            return;
          }
          throw new Error(response.message || 'Registration failed');
        }),
        catchError(this.handleError)
      );
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unexpected error occurred. Please try again later.';
    
    if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check if the backend is running.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.errors?.length > 0) {
      errorMessage = error.error.errors.join(', ');
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.status === 400) {
      errorMessage = 'Invalid request. Please check your input.';
    } else if (error.status === 401) {
      errorMessage = 'Invalid credentials. Please try again.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
