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
  services: Service[] = [
    {
      id: 'SRV-0342',
      name: 'Physiotherapy - In Home',
      category: 'Health & Wellbeing',
      description: 'In-home physiotherapy sessions',
      status: 'Active'
    },
    {
      id: 'SRV-0098',
      name: 'Community Access Support',
      category: 'Social Participation',
      description: 'Community engagement activities',
      status: 'Active'
    },
    {
      id: 'SRV-0015',
      name: 'Occupational Therapy',
      category: 'Clinical Support',
      description: 'Therapeutic occupational support',
      status: 'Inactive'
    },
    {
      id: 'SRV-0221',
      name: 'Meal Preparation & Delivery',
      category: 'Daily Living',
      description: 'Daily meal preparation service',
      status: 'Active'
    }
  ];

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

  ngOnInit(): void {}

  toggleStatus(service: Service): void {
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
      const newId = 'SRV-' + Math.floor(1000 + Math.random() * 9000);
      this.services.unshift({
        ...this.newService,
        id: newId
      });
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
