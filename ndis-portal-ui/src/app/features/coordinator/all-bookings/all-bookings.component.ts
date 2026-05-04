import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingsService, Booking as ApiBooking } from '../../../core/services/bookings';

interface AllBooking {
  id: number;
  participantName: string;
  ndisNumber: string;
  serviceName: string;
  categoryName: string;
  bookingDate: string;
  timeRange: string;
  notes?: string;
  status: string;
  avatarColor: string;
}

@Component({
  selector: 'app-all-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-bookings.component.html',
  styleUrl: './all-bookings.component.css',
})
export class AllBookingsComponent implements OnInit {
  private bookingsService = inject(BookingsService);

  bookings: AllBooking[] = [];
  filteredBookings: AllBooking[] = [];
  statusFilter: string = 'All';
  currentPage: number = 1;
  pageSize: number = 10;
  loading = false;
  errorMessage = '';

  private avatarColors = ['#BFDBFE', '#BBF7D0', '#FED7AA', '#FECACA', '#E9D5FF'];

  ngOnInit(): void {
    this.loadBookingsFromAPI();
  }

  loadBookingsFromAPI(): void {
    this.loading = true;
    this.errorMessage = '';

    this.bookingsService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data.map(apiBooking => this.mapApiBookingToAllBooking(apiBooking));
        this.filterByStatus();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings:', err);
        this.errorMessage = 'Failed to load bookings. Please try again.';
        this.loading = false;
      }
    });
  }

  private mapApiBookingToAllBooking(apiBooking: ApiBooking): AllBooking {
    const status = this.getStatusText(apiBooking.status);
    return {
      id: apiBooking.booking_id,
      participantName: apiBooking.participant_name || 'Unknown User',
      ndisNumber: `#${apiBooking.user_id?.toString().padStart(9, '0') || apiBooking.booking_id.toString().padStart(9, '0')}`,
      serviceName: apiBooking.service_name,
      categoryName: apiBooking.category_name || 'Support Service',
      bookingDate: this.formatDate(apiBooking.preferred_date),
      timeRange: this.formatTimeRange(apiBooking.preferred_date),
      notes: apiBooking.notes,
      status: status,
      avatarColor: this.avatarColors[apiBooking.booking_id % this.avatarColors.length]
    };
  }

  private getStatusText(status: string | number): string {
    if (status === 0 || status === '0' || String(status).toLowerCase().includes('pending')) {
      return 'Pending';
    }
    if (status === 1 || status === '1' || String(status).toLowerCase().includes('approved')) {
      return 'Approved';
    }
    if (status === 2 || status === '2' || String(status).toLowerCase().includes('cancelled')) {
      return 'Cancelled';
    }
    return 'Pending';
  }

  private formatDate(dateValue: string): string {
    if (!dateValue) return 'No date';
    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }

  private formatTimeRange(dateValue: string): string {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    const startTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endDate = new Date(date.getTime() + 60 * 60 * 1000);
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${startTime} - ${endTime}`;
  }

  filterByStatus(): void {
    if (this.statusFilter === 'All') {
      this.filteredBookings = [...this.bookings];
    } else {
      this.filteredBookings = this.bookings.filter(
        b => b.status === this.statusFilter
      );
    }
    this.currentPage = 1;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  approveBooking(id: number): void {
    this.updateBookingStatus(id, 'Approved');
  }

  cancelBooking(id: number): void {
    this.updateBookingStatus(id, 'Cancelled');
  }

  private updateBookingStatus(id: number, status: string): void {
    this.bookingsService.updateBookingStatus(id, status).subscribe({
      next: () => {
        const booking = this.bookings.find(b => b.id === id);
        if (booking) {
          booking.status = status;
        }
        this.filterByStatus();
        console.log(`Booking ${id} status updated to ${status}`);
      },
      error: (err) => {
        console.error(`Failed to update booking ${id} status:`, err);
        alert(`Failed to ${status.toLowerCase()} booking. Please try again.`);
      }
    });
  }

  get paginatedBookings(): AllBooking[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBookings.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBookings.length / this.pageSize) || 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
