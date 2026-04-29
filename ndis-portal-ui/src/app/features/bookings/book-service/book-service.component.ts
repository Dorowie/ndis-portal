import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BookingsService, BookingCreateDto } from '../../../core/services/bookings';
import { ServicesService, ServiceItem } from '../../../core/services/services';

@Component({
  selector: 'app-book-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './book-service.component.html',
  styleUrls: ['./book-service.component.scss']
})
export class BookServiceComponent implements OnInit {
  bookForm: FormGroup;
  isLoading = false;
  apiError: string | null = null;
  services: ServiceItem[] = [];
  selectedService: ServiceItem | null = null;
  preselectedServiceId: number | null = null;
  isPreselected = false;
  preselectedServiceNameValue = '';
  preselectedServiceCategoryValue = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private bookingsService: BookingsService,
    private servicesService: ServicesService
  ) {
    this.bookForm = this.fb.group({
      serviceId: ['', Validators.required],
      bookingDate: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadServices();
    this.route.queryParams.subscribe(params => {
      const serviceId = params['serviceId'];
      if (serviceId) {
        this.preselectedServiceId = Number(serviceId);
        this.isPreselected = true;
        this.bookForm.patchValue({ serviceId: Number(serviceId) });
        // Load the specific service for display
        this.loadPreselectedService(Number(serviceId));
      }
    });
  }

  loadServices(): void {
    this.servicesService.getServices().subscribe({
      next: (data) => {
        this.services = data;
        // If we have a preselected service, update display from loaded services
        if (this.isPreselected && this.preselectedServiceId) {
          this.updatePreselectedServiceDisplay();
        }
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  loadPreselectedService(id: number): void {
    this.servicesService.getService(id).subscribe({
      next: (service) => {
        this.preselectedServiceNameValue = service.name;
        this.preselectedServiceCategoryValue = service.category_name || 'Support Service';
      },
      error: (error) => {
        console.error('Error loading preselected service:', error);
      }
    });
  }

  updatePreselectedServiceDisplay(): void {
    const service = this.services.find(s => s.id === this.preselectedServiceId || (s as any).service_id === this.preselectedServiceId);
    if (service) {
      this.preselectedServiceNameValue = service.name;
      this.preselectedServiceCategoryValue = service.category_name || 'Support Service';
    }
  }

  get minDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get selectedServiceName(): string {
    const selectedId = Number(this.bookForm.get('serviceId')?.value);
    const service = this.services.find(s => s.id === selectedId || (s as any).service_id === selectedId);
    this.selectedService = service || null;
    return service ? service.name : '';
  }

  get preselectedServiceName(): string {
    return this.preselectedServiceNameValue;
  }

  get preselectedServiceCategory(): string {
    return this.preselectedServiceCategoryValue;
  }

  isPastDate(value: string): boolean {
    if (!value) return false;

    const selected = new Date(value);
    const today = new Date();

    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selected < today;
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const bookingDate = this.bookForm.get('bookingDate')?.value;
    if (this.isPastDate(bookingDate)) {
      this.apiError = 'Booking date must not be in the past.';
      return;
    }

    this.isLoading = true;
    this.apiError = null;

    const booking: BookingCreateDto = {
      serviceId: Number(this.bookForm.get('serviceId')?.value),
      preferredDate: bookingDate,
      notes: this.bookForm.get('notes')?.value || undefined
    };

    this.bookingsService.createBooking(booking).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Booking submitted successfully!');
        this.router.navigate(['/bookings']);
      },
      error: (error) => {
        console.error('Error creating booking:', error);
        this.apiError = 'Failed to create booking. Please try again.';
        this.isLoading = false;
      }
    });
  }
}