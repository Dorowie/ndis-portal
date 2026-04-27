import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Booking {
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
  // Bookings data - will be populated from API
  bookings: Booking[] = [];

  filteredBookings: Booking[] = [];
  loading = false;
  errorMessage = '';
  currentPage = 1;
  pageSize = 4;

  ngOnInit(): void {
    // TODO: Load bookings from API
    // this.loadBookingsFromAPI();
    this.filteredBookings = [...this.bookings];
  }

  // TODO: Implement API integration
  // loadBookingsFromAPI(): void {
  //   this.loading = true;
  //   this.bookingService.getAllBookings().subscribe({
  //     next: (data) => {
  //       this.bookings = data;
  //       this.filteredBookings = [...this.bookings];
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.errorMessage = 'Failed to load bookings';
  //       this.loading = false;
  //     }
  //   });
  // }

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

  get paginatedBookings(): Booking[] {
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

  getParticipantName(booking: Booking): string {
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

  getServiceName(booking: Booking): string {
    return booking.serviceName ||
           booking.service ||
           'Service';
  }

  getCategoryName(booking: Booking): string {
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
    const booking = this.bookings.find(
      b => b.id === id
    );

    if (booking) {
      booking.status = status;
    }

    this.filteredBookings = [...this.bookings];
  }
}
