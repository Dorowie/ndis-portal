import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Booking {
  booking_id: number;
  service_id: number;
  service_name: string;
  category_name?: string;
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

  constructor(private http: HttpClient) {}

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
    const statusValue = status === 'Approved' ? 1 : status === 'Cancelled' ? 2 : 0;
    return this.http.put<ApiResponse<Booking>>(`${this.apiUrl}/${id}/status`, { status: statusValue })
      .pipe(map(response => response.data));
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }
}
