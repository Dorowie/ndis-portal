import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ServicesService, ServiceItem } from '../../../core/services/services';
import { ServiceRecommendationModalComponent } from '../../../shared/components/service-recommendation-modal/service-recommendation-modal.component';

// Map category names to accent colors and icons for display
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
  imports: [CommonModule, RouterLink, ServiceRecommendationModalComponent],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  @ViewChild(ServiceRecommendationModalComponent) recommendationModal!: ServiceRecommendationModalComponent;

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
    private location: Location,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.servicesService.getServices().subscribe({
      next: (data) => {
        this.services = data.map(service => {
          const categoryName = service.category_name || 'Support Coordination';
          const style = CATEGORY_STYLES[categoryName] || { accent: '#7d7d7d', icon: 'assignment' };
          return {
            ...service,
            accent: style.accent,
            icon: style.icon
          };
        });
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
    this.router.navigate(['/services', service.id]);
  }

  openRecommendationModal(): void {
    this.recommendationModal.openModal();
  }

}