import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Booking {
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
  // Bookings data - will be populated from API
  bookings: Booking[] = [];

  filteredBookings: Booking[] = [];
  statusFilter: string = 'Pending';
  showFilter: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;

  ngOnInit(): void {
    // TODO: Load bookings from API
    // this.loadBookingsFromAPI();
    this.filterByStatus();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  setFilter(status: string): void {
    this.statusFilter = status;
    this.filterByStatus();
  }

  filterByStatus(): void {
    this.filteredBookings = this.bookings.filter(
      b => b.status === this.statusFilter
    );
    this.currentPage = 1;
    this.showFilter = false;
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
    // TODO: Update booking status via API
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'Approved';
    }
    this.filterByStatus();
  }

  cancelBooking(id: number): void {
    // TODO: Update booking status via API
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'Cancelled';
    }
    this.filterByStatus();
  }

  get paginatedBookings(): Booking[] {
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
