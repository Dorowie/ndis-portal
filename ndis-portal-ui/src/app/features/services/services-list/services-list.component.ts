import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ServicesService, ServiceItem } from '../../../core/services/services';

const CATEGORY_STYLES: Record<string, { accent: string; icon: string }> = {
  'Daily Personal Activities': { accent: '#d9534f', icon: 'self_improvement' },
  'Community Access': { accent: '#b59b00', icon: 'groups' },
  'Therapy Supports': { accent: '#2f5bd3', icon: 'healing' },
  'Respite Care': { accent: '#7a3db8', icon: 'hotel' },
  'Support Coordination': { accent: '#7d7d7d', icon: 'assignment' }
};

interface DisplayService extends ServiceItem {
  accent: string;
  icon: string;
}

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.css'
})
export class ServicesListComponent implements OnInit {
  isLoading = true;

  categories: string[] = [
    'Category',
    'Daily Personal Activities',
    'Community Access',
    'Therapy Supports',
    'Respite Care',
    'Support Coordination'
  ];

  selectedCategory = 'Category';

  services: DisplayService[] = [];

  constructor(
    private router: Router,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.servicesService.getServices().subscribe({
      next: (data) => {
        console.log('Raw API data:', data);
        this.services = data.map(service => {
          const categoryName = service.category_name || 'Support Coordination';
          const style = CATEGORY_STYLES[categoryName] || { accent: '#7d7d7d', icon: 'assignment' };
          return {
            ...service,
            id: (service as any).service_id || service.id,
            accent: style.accent,
            icon: style.icon
          };
        });
        console.log('Mapped services:', this.services);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isLoading = false;
      }
    });
  }

  get filteredServices(): DisplayService[] {
    if (this.selectedCategory === 'Category') {
      return this.services;
    }
    return this.services.filter(
      service => (service.category_name || '') === this.selectedCategory
    );
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
  }

  openService(service: DisplayService): void {
    console.log('Opening service:', service);
    console.log('Service ID:', service.id);
    if (service.id) {
      this.router.navigate(['/services', service.id]).then(
        () => console.log('Navigation successful'),
        (err) => console.error('Navigation failed:', err)
      );
    } else {
      console.error('Service ID is missing:', service);
      alert('Cannot open service: ID is missing');
    }
  }
}
