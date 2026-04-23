import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

type BookingStatus = 'Pending' | 'Approved' | 'Cancelled';

interface BookingItem {
  id: number;
  serviceName: string;
  providerName: string;
  category: string;
  preferredDate: string;
  timeRange: string;
  notes: string;
  status: BookingStatus;
}

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent {
  selectedFilter: 'All' | BookingStatus = 'All';

  bookings: BookingItem[] = [
    {
      id: 1,
      serviceName: 'Occupational Therapy Session',
      providerName: 'Dr. Sarah Jenkins',
      category: 'Therapy Support',
      preferredDate: '2026-10-28',
      timeRange: '09:00 AM - 12:00 PM',
      notes: 'Initial assessment',
      status: 'Pending'
    },
    {
      id: 2,
      serviceName: 'Weekly Community Access',
      providerName: 'Support Worker: Mark Thompson',
      category: 'Community Access',
      preferredDate: '2026-10-24',
      timeRange: '09:00 AM - 12:00 PM',
      notes: 'Transport to activity center',
      status: 'Approved'
    },
    {
      id: 3,
      serviceName: 'Physiotherapy Follow-up',
      providerName: 'Peak Performance Clinic',
      category: 'Therapy Support',
      preferredDate: '2026-10-19',
      timeRange: '11:00 AM - 12:00 PM',
      notes: 'Cancelled due to schedule conflict',
      status: 'Cancelled'
    },
    {
      id: 4,
      serviceName: 'Personal Care Assistance',
      providerName: 'CarePlus Agency',
      category: 'Daily Personal Activities',
      preferredDate: '2026-10-25',
      timeRange: '07:00 AM - 08:30 AM',
      notes: 'Morning routine support',
      status: 'Approved'
    }
  ];

  confirmDialogOpen = false;
  selectedBookingId: number | null = null;

  constructor(
    private router: Router,
    private location: Location
  ) {}

  get filteredBookings(): BookingItem[] {
    if (this.selectedFilter === 'All') {
      return this.bookings;
    }
    return this.bookings.filter(b => b.status === this.selectedFilter);
  }

  get totalServices(): number {
    return 12;
  }

  get activeHours(): number {
    return 48.5;
  }

  get upcomingCount(): number {
    return this.bookings.filter(
      b => b.status === 'Pending' || b.status === 'Approved'
    ).length;
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

    this.bookings = this.bookings.map(booking =>
      booking.id === this.selectedBookingId
        ? { ...booking, status: 'Cancelled' }
        : booking
    );

    this.closeCancelDialog();
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