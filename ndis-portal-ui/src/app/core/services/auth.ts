import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Role: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
  };
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5131/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password });
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
