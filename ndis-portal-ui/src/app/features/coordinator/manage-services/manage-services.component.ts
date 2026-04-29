import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServicesService, ServiceItem as ApiService } from '../../../core/services/services';

interface ManageService {
  id: number;
  name: string;
  category: string;
  description: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-manage-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-services.component.html',
  styleUrl: './manage-services.component.css',
})
export class ManageServicesComponent implements OnInit {
  private servicesService = inject(ServicesService);

  services: ManageService[] = [];
  loading = false;
  errorMessage = '';

  showModal = false;
  newService: Partial<ManageService> = {
    name: '',
    category: '',
    description: '',
    status: 'Active'
  };

  categories = [
    'Health & Wellbeing',
    'Social Participation',
    'Clinical Support',
    'Daily Living',
    'Therapeutic Support',
    'Allied Health'
  ];

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.errorMessage = '';

    this.servicesService.getServices().subscribe({
      next: (data) => {
        this.services = data
          .filter(s => s.is_active !== false)
          .map(apiService => this.mapApiServiceToManage(apiService));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load services:', err);
        this.errorMessage = 'Failed to load services. Please try again.';
        this.loading = false;
      }
    });
  }

  private mapApiServiceToManage(apiService: ApiService): ManageService {
    return {
      id: apiService.id || (apiService as any).service_id || 0,
      name: apiService.name,
      category: apiService.category_name || 'Support Service',
      description: apiService.description,
      status: apiService.is_active ? 'Active' : 'Inactive'
    };
  }

  toggleStatus(service: ManageService): void {
    const newStatus = service.status === 'Active' ? 'Inactive' : 'Active';
    const updatedService: ApiService = {
      id: service.id,
      name: service.name,
      category_name: service.category,
      description: service.description,
      is_active: newStatus === 'Active',
      category_id: 1,
      price: 0
    };

    this.servicesService.updateService(service.id, updatedService).subscribe({
      next: () => {
        service.status = newStatus;
        console.log(`Service ${service.id} status updated to ${newStatus}`);
      },
      error: (err) => {
        console.error(`Failed to update service ${service.id} status:`, err);
        alert('Failed to update service status. Please try again.');
      }
    });
  }

  openModal(): void {
    this.showModal = true;
    this.newService = {
      name: '',
      category: '',
      description: '',
      status: 'Active'
    };
  }

  closeModal(): void {
    this.showModal = false;
  }

  prevPage(): void {
    // Simple pagination - can be enhanced later
    console.log('Previous page clicked');
  }

  nextPage(): void {
    // Simple pagination - can be enhanced later
    console.log('Next page clicked');
  }

  saveService(): void {
    if (this.newService.name && this.newService.category) {
      const serviceToCreate: ApiService = {
        id: 0,
        name: this.newService.name!,
        category_name: this.newService.category!,
        description: this.newService.description || '',
        is_active: this.newService.status === 'Active',
        category_id: 1,
        price: 0
      };

      this.servicesService.createService(serviceToCreate).subscribe({
        next: (createdService) => {
          this.services.unshift(this.mapApiServiceToManage(createdService));
          this.closeModal();
          console.log('Service created successfully');
        },
        error: (err) => {
          console.error('Failed to create service:', err);
          alert('Failed to create service. Please try again.');
        }
      });
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
