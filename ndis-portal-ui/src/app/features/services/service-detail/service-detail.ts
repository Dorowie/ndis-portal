import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService, ServiceItem } from '../../../core/services/services';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.scss',
})
export class ServiceDetail implements OnInit {
  service: ServiceItem | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadService(Number(id));
      }
    });
  }

  loadService(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.servicesService.getService(id).subscribe({
      next: (data) => {
        this.service = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading service:', err);
        this.error = 'Failed to load service details';
        this.isLoading = false;
      }
    });
  }

  bookService(): void {
    if (this.service) {
      this.router.navigate(['/bookings/new'], { queryParams: { serviceId: this.service.id } });
    }
  }


}
