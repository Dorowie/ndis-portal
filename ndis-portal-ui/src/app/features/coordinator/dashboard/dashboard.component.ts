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

  bookings: DashboardBooking[] = [];
  filteredBookings: DashboardBooking[] = [];
  loading = false;
  errorMessage = '';
  currentPage = 1;
  pageSize = 4;
  showFilterDropdown = false;
  currentFilter = 'All';

  ngOnInit(): void {
    this.loadBookingsFromAPI();
  }

  loadBookingsFromAPI(): void {
    this.loading = true;
    this.errorMessage = '';

    this.bookingsService.getAllBookings().subscribe({
      next: (data) => {
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
      participantName: 'Participant',
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

  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  closeFilterDropdown(): void {
    this.showFilterDropdown = false;
  }

  filterByStatus(status: string): void {
    this.currentFilter = status;
    if (status === 'All') {
      this.filteredBookings = [...this.bookings];
    } else {
      this.filteredBookings = this.bookings.filter(
        booking => this.getStatusText(booking.status) === status
      );
    }
    this.currentPage = 1;
    this.showFilterDropdown = false;
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
    this.updateBookingStatus(id, 1, 'Approved');
  }

  cancelBooking(id: number): void {
    this.updateBookingStatus(id, 2, 'Cancelled');
  }

  updateBookingStatus(id: number, statusValue: number, statusText: string): void {
    console.log(`Attempting to update booking ${id} to status: ${statusText} (${statusValue})`);
    
    this.bookingsService.updateBookingStatus(id, statusValue.toString()).subscribe({
      next: (response) => {
        console.log('Update successful:', response);
        const booking = this.bookings.find(b => b.id === id || (b as any).booking_id === id);
        if (booking) {
          booking.status = statusValue;
        }
        this.filteredBookings = [...this.bookings];
        console.log(`Booking ${id} status updated to ${statusText}`);
        // Show success message
        alert(`Booking ${statusText.toLowerCase()} successfully!`);
      },
      error: (err) => {
        console.error(`Failed to update booking ${id} status:`, err);
        console.error('Error details:', err.error);
        // Try with string status if numeric fails
        if (statusValue !== statusText) {
          console.log('Retrying with string status...');
          this.bookingsService.updateBookingStatus(id, statusText).subscribe({
            next: (response) => {
              console.log('String status update successful:', response);
              const booking = this.bookings.find(b => b.id === id || (b as any).booking_id === id);
              if (booking) {
                booking.status = statusText;
              }
              this.filteredBookings = [...this.bookings];
              alert(`Booking ${statusText.toLowerCase()} successfully!`);
            },
            error: (stringErr) => {
              console.error('String status also failed:', stringErr);
              alert(`Failed to ${statusText.toLowerCase()} booking. Please try again.\nError: ${stringErr.message || 'API error'}`);
            }
          });
        } else {
          alert(`Failed to ${statusText.toLowerCase()} booking. Please try again.\nError: ${err.message || 'API error'}`);
        }
      }
    });
  }
}
