import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServicesService, ServiceItem } from '../../../core/services/services.service';

interface Service {
  id: string;
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
  // Services data - will be populated from API
  services: Service[] = [];

  filteredServices: Service[] = [];
  statusFilter = 'All';

  showModal = false;
  newService: Service = {
    id: '',
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

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.servicesService.getServices().subscribe({
      next: (data) => {
        this.services = data.map(s => ({
          id: s.id || '',
          name: s.name,
          category: s.category,
          description: s.description || '',
          status: s.status
        }));
        this.filterByStatus();
      },
      error: (err) => {
        console.error('Error loading services:', err);
      }
    });
  }

  filterByStatus(): void {
    if (this.statusFilter === 'All') {
      this.filteredServices = [...this.services];
    } else {
      this.filteredServices = this.services.filter(s => s.status === this.statusFilter);
    }
  }

  toggleStatus(service: Service): void {
    const newStatus = service.status === 'Active' ? 'Inactive' : 'Active';
    this.servicesService.updateServiceStatus(service.id, newStatus).subscribe({
      next: () => {
        service.status = newStatus;
      },
      error: (err) => {
        console.error('Error updating service status:', err);
      }
    });
  }

  openModal(): void {
    this.showModal = true;
    this.newService = {
      id: '',
      name: '',
      category: '',
      description: '',
      status: 'Active'
    };
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveService(): void {
    if (this.newService.name && this.newService.category) {
      const serviceToCreate: ServiceItem = {
        name: this.newService.name,
        category: this.newService.category,
        description: this.newService.description,
        status: this.newService.status
      };

      this.servicesService.createService(serviceToCreate).subscribe({
        next: (createdService) => {
          // Add the new service to the list
          this.services.unshift({
            id: createdService.id || '',
            name: createdService.name,
            category: createdService.category,
            description: createdService.description || '',
            status: createdService.status
          });
          this.filterByStatus();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating service:', err);
          // TODO: Show error message to user
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
