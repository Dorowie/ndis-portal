import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface ServiceOption {
  id: number;
  name: string;
  category: string;
}

@Component({
  selector: 'app-book-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './book-service.component.html',
  styleUrl: './book-service.component.css'
})
export class BookServiceComponent {
  bookForm: FormGroup;
  isLoading = false;
  apiError: string | null = null;

  services: ServiceOption[] = [
    { id: 1, name: 'Personal Hygiene Assistance', category: 'Daily Personal Activities' },
    { id: 2, name: 'Meal Preparation Support', category: 'Daily Personal Activities' },
    { id: 3, name: 'Community Participation Program', category: 'Community Access' },
    { id: 4, name: 'Social Skills Group', category: 'Community Access' },
    { id: 5, name: 'Occupational Therapy', category: 'Therapy Supports' },
    { id: 6, name: 'Speech Therapy', category: 'Therapy Supports' },
    { id: 7, name: 'Short Term Respite Accommodation', category: 'Respite Care' },
    { id: 8, name: 'Plan Management & Coordination', category: 'Support Coordination' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      serviceId: ['', Validators.required],
      preferredDate: ['', Validators.required],
      notes: ['']
    });
  }

  get minDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get selectedServiceCategory(): string {
    const selectedId = Number(this.bookForm.get('serviceId')?.value);
    const service = this.services.find(s => s.id === selectedId);
    return service ? service.category : '';
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

    const preferredDate = this.bookForm.get('preferredDate')?.value;
    if (this.isPastDate(preferredDate)) {
      this.apiError = 'Preferred date must not be in the past.';
      return;
    }

    this.isLoading = true;
    this.apiError = null;

    setTimeout(() => {
      this.isLoading = false;
      alert('Booking submitted successfully!');
      this.router.navigate(['/bookings']);
    }, 1000);
  }
}