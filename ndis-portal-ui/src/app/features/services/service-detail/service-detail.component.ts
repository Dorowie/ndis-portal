import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServicesService, ServiceItem } from '../../../core/services/services';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.css'
})
export class ServiceDetailComponent implements OnInit {
  service: ServiceItem | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ServiceDetail - ID from route:', id);
    if (id) {
      this.loadService(+id);
    } else {
      this.error = 'Invalid service ID';
      this.isLoading = false;
    }
  }

  loadService(id: number): void {
    console.log('ServiceDetail - Loading service with ID:', id);
    this.isLoading = true;
    this.servicesService.getService(id).subscribe({
      next: (data: ServiceItem) => {
        console.log('ServiceDetail - Loaded service:', data);
        this.service = data;
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error('ServiceDetail - Error loading service:', err);
        this.error = 'Failed to load service details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/services']);
  }

  bookService(): void {
    if (this.service) {
      this.router.navigate(['/bookings/new'], {
        queryParams: { serviceId: this.service.id }
      });
    }
  }
}
