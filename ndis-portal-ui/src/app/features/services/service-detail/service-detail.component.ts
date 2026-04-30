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

  getDetailedDescription(): string {
    if (!this.service) return '';
    
    const serviceName = this.service.name.toLowerCase();
    const category = this.service.category_name?.toLowerCase() || '';
    
    // Therapy Support Services
    if (category.includes('therapy') || serviceName.includes('therapy')) {
      return `Our professional therapy support services provide comprehensive assistance for individuals requiring therapeutic interventions. This service includes support during therapy sessions, assistance with therapy-related activities, and help implementing therapy recommendations in daily life. Our trained support workers work closely with healthcare professionals to ensure continuity of care and help you achieve your therapy goals. Whether you need support for physical therapy, occupational therapy, speech therapy, or psychological services, our team is equipped to provide the appropriate level of assistance while maintaining your dignity and independence.`;
    }
    
    // Community Access Services
    if (category.includes('community') || serviceName.includes('community')) {
      return `Enhance your social participation and community engagement with our dedicated community access support services. We assist you in accessing community activities, social events, recreational programs, and local facilities that align with your interests and goals. Our support workers provide transportation assistance, help you navigate community spaces, and ensure you can participate fully in community life while maintaining your independence. Whether you want to join local clubs, attend community events, visit parks, or engage in social activities, we're here to support your journey toward greater community inclusion and social connection.`;
    }
    
    // Daily Personal Activities
    if (category.includes('daily') || serviceName.includes('personal') || serviceName.includes('daily')) {
      return `Our daily personal activities support service provides respectful and dignified assistance with everyday living tasks to help you maintain your independence at home. This includes support with personal hygiene, dressing, grooming, meal preparation, household tasks, and mobility assistance. Our trained support workers work collaboratively with you to ensure your preferences and routines are respected while providing the right level of support you need. We focus on building your skills and confidence where possible, while ensuring your safety and comfort in all daily activities. This service is designed to help you live as independently as possible in your own home.`;
    }
    
    // Transport Services
    if (serviceName.includes('transport') || serviceName.includes('travel')) {
      return `Our transport support service provides safe, reliable, and accessible transportation to help you attend appointments, activities, and community engagements. We offer door-to-door service with vehicles equipped to accommodate various mobility needs. Our drivers are trained in disability awareness and provide assistance with boarding, securing mobility equipment, and ensuring your comfort throughout the journey. Whether you need to get to medical appointments, therapy sessions, social activities, or shopping, our transport service ensures you can travel safely and independently while maintaining your schedule and commitments.`;
    }
    
    // Domestic Assistance
    if (serviceName.includes('domestic') || serviceName.includes('household') || serviceName.includes('cleaning')) {
      return `Maintain a clean, safe, and comfortable living environment with our domestic assistance services. Our support workers help with essential household tasks including cleaning, laundry, meal preparation, shopping, and home organization. We work with you to create a customized support plan that addresses your specific household needs while respecting your preferences and routines. Our goal is to reduce the burden of domestic tasks so you can focus on what matters most to you, whether that's pursuing hobbies, social activities, or simply enjoying your home environment. All services are delivered with attention to detail and respect for your personal space and belongings.`;
    }
    
    // Default description
    return `${this.service.name} is a comprehensive support service designed to meet your specific needs and enhance your quality of life. Our professional team provides personalized assistance tailored to your individual requirements, ensuring you receive the highest standard of care and support. We work collaboratively with you to develop a support plan that aligns with your goals, preferences, and lifestyle. Our commitment is to empower you to live independently while providing the necessary support to help you overcome challenges and achieve your personal objectives. All our services are delivered with dignity, respect, and a focus on promoting your independence and wellbeing.`;
  }

  bookService(): void {
    if (this.service) {
      const serviceId = this.service.id || (this.service as any).service_id;
      console.log('BookService clicked - Navigating with serviceId:', serviceId);
      console.log('Service object:', this.service);
      this.router.navigate(['/bookings/new'], {
        queryParams: { serviceId: serviceId }
      });
    }
  }
}
