import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Booking {
  booking_id: number;
  service_id: number;
  service_name: string;
  preferred_date: string;
  status: string;
  notes?: string;
  created_date: string;
  modified_date?: string;
}

export interface BookingCreateDto {
  serviceId: number;
  preferredDate: string;
  notes?: string;
}

export interface BookingUpdateDto {
  status: string;
  notes?: string;
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
export class BookingsService {
  private readonly apiUrl = 'https://localhost:7113/api/bookings';

  constructor(private http: HttpClient) {
    console.log('BookingsService initialized with API URL:', this.apiUrl);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<ApiResponse<Booking[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<ApiResponse<Booking[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  createBooking(booking: BookingCreateDto): Observable<Booking> {
    return this.http.post<ApiResponse<Booking>>(this.apiUrl, booking)
      .pipe(map(response => response.data));
  }

  updateBookingStatus(id: number, status: string): Observable<Booking> {
    const endpoint = `${this.apiUrl}/${id}/status`;
    console.log(`Making API call to: ${endpoint}`);
    console.log(`Request payload:`, { status });
    
    return this.http.put<ApiResponse<Booking>>(endpoint, { status })
      .pipe(
        map(response => {
          console.log('API Response:', response);
          return response.data;
        })
      );
  }

  // Test API connectivity
  testConnection(): Observable<boolean> {
    console.log('Testing API connection to:', this.apiUrl);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/test`)
      .pipe(
        map(() => true),
        // If test endpoint fails, try main endpoint
        // This helps identify if the API is running
      );
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }
}
