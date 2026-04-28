import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  ngOnInit(): void {
    // TODO: Load services from API
    // this.loadServicesFromAPI();
    this.filteredServices = [...this.services];
  }

  filterByStatus(): void {
    if (this.statusFilter === 'All') {
      this.filteredServices = [...this.services];
    } else {
      this.filteredServices = this.services.filter(s => s.status === this.statusFilter);
    }
  }

  toggleStatus(service: Service): void {
    // TODO: Update service status via API
    service.status = service.status === 'Active' ? 'Inactive' : 'Active';
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
      // TODO: Send new service to API
      // const newId = 'SRV-' + Math.floor(1000 + Math.random() * 9000);
      // this.services.unshift({ ...this.newService, id: newId });
      this.filterByStatus();
      this.closeModal();
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
