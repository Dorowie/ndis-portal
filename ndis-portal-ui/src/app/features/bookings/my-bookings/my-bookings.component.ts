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
  styleUrls: ['./my-bookings.component.scss']
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
        console.log('Raw API data:', data);
        this.bookings = data.map(booking => {
          const capitalizedStatus = this.capitalizeStatus(booking.status);
          console.log(`Booking ${booking.booking_id}: original status="${booking.status}", capitalized="${capitalizedStatus}"`);
          return {
            ...booking,
            status: capitalizedStatus
          };
        });
        console.log('Final bookings array:', this.bookings);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.error = 'Failed to load bookings';
        this.isLoading = false;
      }
    });
  }

  capitalizeStatus(status: string | number): BookingStatus {
    const statusStr = String(status);
    
    // Handle numeric status values from API
    if (statusStr === '0') return 'Pending';
    if (statusStr === '1') return 'Approved';
    if (statusStr === '2') return 'Cancelled';
    
    // Handle string status values
    const lowerStatus = statusStr.toLowerCase();
    if (lowerStatus.includes('pending')) return 'Pending';
    if (lowerStatus.includes('approved')) return 'Approved';
    if (lowerStatus.includes('cancelled')) return 'Cancelled';
    
    // Default fallback
    return 'Pending';
  }

  get filteredBookings(): BookingItem[] {
    if (this.selectedFilter === 'All') {
      return this.bookings;
    }
    return this.bookings.filter(b => b.status === this.selectedFilter);
  }

  get nextSessionDate(): string | null {
    // Get approved bookings with future dates, sorted by date
    const approvedBookings = this.bookings
      .filter(b => b.status === 'Approved' && new Date(b.preferred_date) >= new Date())
      .sort((a, b) => new Date(a.preferred_date).getTime() - new Date(b.preferred_date).getTime());
    
    if (approvedBookings.length === 0) {
      return null;
    }
    
    return this.formatDate(approvedBookings[0].preferred_date);
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

    // API expects numeric status: 0=Pending, 1=Approved, 2=Cancelled
    this.bookingsService.updateBookingStatus(this.selectedBookingId, '2').subscribe({
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