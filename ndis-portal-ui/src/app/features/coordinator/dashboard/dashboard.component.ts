import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BookingsService, Booking as ApiBooking } from '../../../core/services/bookings';

interface DashboardBooking {
  id: number;
  participantName?: string;
  userName?: string;
  serviceName?: string;
  service?: string;
  categoryName?: string;
  bookingDate?: string;
  date?: string;
  status?: string | number;
}

@Component({
  selector: 'app-coordinator-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class CoordinatorDashboardComponent implements OnInit {
  private bookingsService = inject(BookingsService);

  // Bookings data - populated from API
  bookings: DashboardBooking[] = [];

  filteredBookings: DashboardBooking[] = [];
  loading = false;
  errorMessage = '';
  currentPage = 1;
  pageSize = 4;

  ngOnInit(): void {
    this.loadBookingsFromAPI();
  }

  loadBookingsFromAPI(): void {
    this.loading = true;
    this.errorMessage = '';

    this.bookingsService.getAllBookings().subscribe({
      next: (data) => {
        // Map API booking data to dashboard format
        this.bookings = data.map(apiBooking => this.mapApiBookingToDashboard(apiBooking));
        this.filteredBookings = [...this.bookings];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings:', err);
        this.errorMessage = 'Failed to load bookings. Please try again.';
        this.loading = false;
      }
    });
  }

  private mapApiBookingToDashboard(apiBooking: ApiBooking): DashboardBooking {
    return {
      id: apiBooking.booking_id,
      serviceName: apiBooking.service_name,
      service: apiBooking.service_name,
      bookingDate: apiBooking.preferred_date,
      date: apiBooking.preferred_date,
      status: apiBooking.status,
      // These fields may need additional API calls or data enrichment
      participantName: 'Participant', // TODO: Get from user service
      userName: 'Participant',
      categoryName: 'Support Service'
    };
  }

  get totalBookings(): number {
    return this.bookings.length;
  }

  get pendingCount(): number {
    return this.bookings.filter(
      b => this.getStatusText(b.status) === 'Pending'
    ).length;
  }

  get approvedCount(): number {
    return this.bookings.filter(
      b => this.getStatusText(b.status) === 'Approved'
    ).length;
  }

  get cancelledCount(): number {
    return this.bookings.filter(
      b => this.getStatusText(b.status) === 'Cancelled'
    ).length;
  }

  get paginatedBookings(): DashboardBooking[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBookings.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBookings.length / this.pageSize) || 1;
  }

  get pages(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  filterPending(): void {
    this.filteredBookings = this.bookings.filter(
      booking => this.getStatusText(booking.status) === 'Pending'
    );
    this.currentPage = 1;
  }

  showAll(): void {
    this.filteredBookings = [...this.bookings];
    this.currentPage = 1;
  }

  getParticipantName(booking: DashboardBooking): string {
    return booking.participantName ||
           booking.userName ||
           'Participant';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getServiceName(booking: DashboardBooking): string {
    return booking.serviceName ||
           booking.service ||
           'Service';
  }

  getCategoryName(booking: DashboardBooking): string {
    return booking.categoryName ||
           'Support Service';
  }

  getStatusText(status: string | number | undefined): string {
    if (status === 0 || status === '0') return 'Pending';
    if (status === 1 || status === '1') return 'Approved';
    if (status === 2 || status === '2') return 'Cancelled';

    const value = String(status || '').toLowerCase();

    if (value.includes('pending')) return 'Pending';
    if (value.includes('approved')) return 'Approved';
    if (value.includes('cancelled')) return 'Cancelled';

    return 'Pending';
  }

  formatDate(dateValue: string | undefined): string {
    if (!dateValue) return 'No date';

    const date = new Date(dateValue);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(dateValue: string | undefined): string {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  approveBooking(id: number): void {
    this.updateBookingStatus(id, 'Approved');
  }

  cancelBooking(id: number): void {
    this.updateBookingStatus(id, 'Cancelled');
  }

  updateBookingStatus(id: number, status: string): void {
    this.bookingsService.updateBookingStatus(id, status).subscribe({
      next: (updatedBooking) => {
        // Update local state after successful API call
        const booking = this.bookings.find(b => b.id === id);
        if (booking) {
          booking.status = status;
        }
        this.filteredBookings = [...this.bookings];
        console.log(`Booking ${id} status updated to ${status}`);
      },
      error: (err) => {
        console.error(`Failed to update booking ${id} status:`, err);
        alert(`Failed to ${status.toLowerCase()} booking. Please try again.`);
      }
    });
  }
}
