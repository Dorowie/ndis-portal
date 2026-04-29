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
  bookings: Booking[] = [
    {
      id: 1,
      participantName: 'Sarah Mitchell',
      ndisNumber: '#482-192-334',
      serviceName: 'Community Participation',
      categoryName: 'Personal Care',
      bookingDate: 'Oct 24, 2023',
      timeRange: '10:00 AM - 2:00 PM',
      notes: 'Regular weekly session',
      status: 'Pending',
      avatarColor: '#BFDBFE'
    },
    {
      id: 2,
      participantName: 'James Robinson',
      ndisNumber: '#112-908-445',
      serviceName: 'Occupational Therapy',
      categoryName: 'Therapeutic Support',
      bookingDate: 'Oct 25, 2023',
      timeRange: '02:30 PM - 3:30 PM',
      status: 'Approved',
      avatarColor: '#BBF7D0'
    },
    {
      id: 3,
      participantName: 'Emily Lawson',
      ndisNumber: '#223-445-667',
      serviceName: 'Meal Preparation',
      categoryName: 'Domestic Support',
      bookingDate: 'Oct 26, 2023',
      timeRange: '11:00 AM - 1:00 PM',
      status: 'Pending',
      avatarColor: '#FED7AA'
    },
    {
      id: 4,
      participantName: 'Thomas Higgins',
      ndisNumber: '#887-112-990',
      serviceName: 'Speech Therapy',
      categoryName: 'Allied Health',
      bookingDate: 'Oct 26, 2023',
      timeRange: '09:00 AM - 10:00 AM',
      status: 'Cancelled',
      avatarColor: '#BFDBFE'
    }
  ];

  filteredBookings: Booking[] = [];
  statusFilter: string = 'All';
  currentPage: number = 1;
  pageSize: number = 10;

  ngOnInit(): void {
    this.filteredBookings = [...this.bookings];
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
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'Approved';
    }
    this.filterByStatus();
  }

  cancelBooking(id: number): void {
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
