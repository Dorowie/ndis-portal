import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingsService, Booking } from '../../../core/services/bookings';

type BookingStatus = 'Pending' | 'Approved' | 'Cancelled';

interface BookingItem extends Booking {
  status: BookingStatus;
}

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  selectedFilter: 'All' | BookingStatus = 'All';
  bookings: BookingItem[] = [];
  isLoading = true;
  error: string | null = null;

  confirmDialogOpen = false;
  selectedBookingId: number | null = null;

  constructor(
    private router: Router,
    private location: Location,
    private bookingsService: BookingsService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingsService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data.map(booking => ({
          ...booking,
          status: this.capitalizeStatus(booking.status)
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.error = 'Failed to load bookings';
        this.isLoading = false;
      }
    });
  }

  capitalizeStatus(status: string): BookingStatus {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() as BookingStatus;
  }

  get filteredBookings(): BookingItem[] {
    if (this.selectedFilter === 'All') {
      return this.bookings;
    }
    return this.bookings.filter(b => b.status === this.selectedFilter);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getStatusClass(status: BookingStatus): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Approved':
        return 'status-approved';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'Therapy Support':
        return 'cat-therapy';
      case 'Community Access':
        return 'cat-community';
      case 'Daily Personal Activities':
        return 'cat-daily';
      default:
        return 'cat-default';
    }
  }

  setFilter(value: string): void {
    this.selectedFilter = value as 'All' | BookingStatus;
  }

  openCancelDialog(bookingId: number): void {
    this.selectedBookingId = bookingId;
    this.confirmDialogOpen = true;
  }

  closeCancelDialog(): void {
    this.confirmDialogOpen = false;
    this.selectedBookingId = null;
  }

  confirmCancel(): void {
    if (this.selectedBookingId === null) return;

    this.bookingsService.updateBookingStatus(this.selectedBookingId, 'Cancelled').subscribe({
      next: () => {
        this.bookings = this.bookings.map(booking =>
          booking.booking_id === this.selectedBookingId
            ? { ...booking, status: 'Cancelled' }
            : booking
        );
        this.closeCancelDialog();
      },
      error: (error) => {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}