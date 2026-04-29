import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5130/api/auth';

  login(email: string, password: string): Observable<AuthResponse> {
    const payload: LoginRequest = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload);
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Decode JWT token to get user info
  getUserFromToken(token?: string): any {
    const jwtToken = token || this.getToken();
    if (!jwtToken) return null;

    try {
      const payload = jwtToken.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return {
        id: decoded.userId || decoded.nameid,
        email: decoded.email,
        role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  getUser(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return this.getUserFromToken();
  }

  getUserRole(token?: string): string | null {
    const user = token ? this.getUserFromToken(token) : this.getUser();
    return user ? user.role : null;
  }
}