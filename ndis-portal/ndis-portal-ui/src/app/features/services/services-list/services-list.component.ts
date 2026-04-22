import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface ServiceItem {
  id: number;
  name: string;
  category: string;
  description: string;
  accent: string;
  icon: string;
}

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent {
  isLoading = false;

  categories: string[] = [
    'Category',
    'Daily Personal Activities',
    'Community Access',
    'Therapy Supports',
    'Respite Care',
    'Support Coordination'
  ];

  selectedCategory = 'Category';

  services: ServiceItem[] = [
    {
      id: 1,
      name: 'Personal Hygiene Assistance',
      category: 'Daily Personal Activities',
      description: 'Support with personal hygiene tasks',
      accent: '#d9534f',
      icon: 'self_improvement'
    },
    {
      id: 2,
      name: 'Meal Preparation Support',
      category: 'Daily Personal Activities',
      description: 'Assistance in preparing daily meals',
      accent: '#d9534f',
      icon: 'restaurant'
    },
    {
      id: 3,
      name: 'Community Participation Program',
      category: 'Community Access',
      description: 'Programs for community involvement',
      accent: '#b59b00',
      icon: 'groups'
    },
    {
      id: 4,
      name: 'Social Skills Group',
      category: 'Community Access',
      description: 'Group sessions for social skill development',
      accent: '#b59b00',
      icon: 'diversity_3'
    },
    {
      id: 5,
      name: 'Occupational Therapy',
      category: 'Therapy Supports',
      description: 'Therapy for daily living and work skills',
      accent: '#2f5bd3',
      icon: 'healing'
    },
    {
      id: 6,
      name: 'Speech Therapy',
      category: 'Therapy Supports',
      description: 'Speech and communication therapy',
      accent: '#2f5bd3',
      icon: 'record_voice_over'
    },
    {
      id: 7,
      name: 'Short Term Respite Accommodation',
      category: 'Respite Care',
      description: 'Temporary accommodation support',
      accent: '#7a3db8',
      icon: 'hotel'
    },
    {
      id: 8,
      name: 'Plan Management & Coordination',
      category: 'Support Coordination',
      description: 'Managing and coordinating support plans',
      accent: '#7d7d7d',
      icon: 'assignment'
    }
  ];

  constructor(private router: Router) {}

  get filteredServices(): ServiceItem[] {
    if (this.selectedCategory === 'Category') {
      return this.services;
    }

    return this.services.filter(
      service => service.category === this.selectedCategory
    );
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
  }

  openService(service: ServiceItem): void {
    this.router.navigate(['/services', service.id]);
  }
}