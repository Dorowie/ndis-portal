import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../../../core/services/services';
import { SupportWorkersService, SupportWorker } from '../../../core/services/support-workers';

@Component({
  selector: 'app-support-workers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-workers.component.html',
  styleUrl: './support-workers.component.css',
})
export class SupportWorkersComponent implements OnInit {
  // Support workers data
  workers: SupportWorker[] = [];

  // Loading and error states
  isLoading = false;
  error: string | null = null;

  // Modal state
  showModal = false;

  // Available services for dropdown
  services: any[] = [];

  // New worker form
  newWorker: any = {
    fullName: '',
    email: '',
    phone: '',
    assignedService: '',
  };

  // Form validation errors
  formErrors: { [key: string]: string } = {};

  // Modal modes
  isEditMode = false;
  editingWorkerId: string | null = null;

  // View modal
  showViewModal = false;
  selectedWorker: any = null;

  // Delete confirmation
  showDeleteConfirm = false;
  workerToDelete: any = null;

  constructor(
    private servicesService: ServicesService,
    private supportWorkersService: SupportWorkersService
  ) {}

  ngOnInit(): void {
    this.loadWorkers();
    this.loadServices();
  }

  loadWorkers(): void {
    this.isLoading = true;
    this.supportWorkersService.getSupportWorkers().subscribe({
      next: (data) => {
        this.workers = data.map(w => ({
          ...w,
          assignedService: w.serviceName || w.assignedService
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading support workers:', error);
        this.error = 'Failed to load support workers';
        this.isLoading = false;
      }
    });
  }

  loadServices(): void {
    this.servicesService.getServices().subscribe({
      next: (data) => {
        this.services = data;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.services = [];
      }
    });
  }

  openModal(): void {
    this.isEditMode = false;
    this.editingWorkerId = null;
    this.showModal = true;
    this.resetForm();
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.editingWorkerId = null;
    this.resetForm();
  }

  resetForm(): void {
    this.newWorker = {
      fullName: '',
      email: '',
      phone: '',
      assignedService: '',
    };
    this.formErrors = {};
  }

  // View Worker Details
  viewWorker(worker: any): void {
    this.selectedWorker = worker;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedWorker = null;
  }

  // Edit Worker
  editWorker(worker: SupportWorker): void {
    this.isEditMode = true;
    this.editingWorkerId = worker.id.toString();
    this.newWorker = {
      fullName: worker.fullName,
      email: worker.email,
      phone: worker.phone || '',
      assignedService: worker.assignedService,
    };
    this.showModal = true;
  }

  // Delete Worker
  confirmDelete(worker: any): void {
    this.workerToDelete = worker;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.workerToDelete = null;
  }

  deleteWorker(): void {
    if (this.workerToDelete) {
      this.supportWorkersService.deleteSupportWorker(this.workerToDelete.id).subscribe({
        next: () => {
          this.workers = this.workers.filter(w => w.id !== this.workerToDelete.id);
          this.showDeleteConfirm = false;
          this.workerToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting support worker:', error);
          alert('Failed to delete support worker');
        }
      });
    }
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.newWorker.fullName?.trim()) {
      this.formErrors['fullName'] = 'Full Name is required';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(this.newWorker.fullName.trim())) {
      this.formErrors['fullName'] = 'Full Name must contain letters only';
      isValid = false;
    } else if (this.newWorker.fullName.trim().split(/\s+/).length < 2) {
      this.formErrors['fullName'] = 'Please provide both first and last name';
      isValid = false;
    }

    if (!this.newWorker.email?.trim()) {
      this.formErrors['email'] = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.newWorker.email)) {
      this.formErrors['email'] = 'Please enter a valid email address';
      isValid = false;
    } else if (this.hasEmailTypo(this.newWorker.email)) {
      this.formErrors['email'] = 'Did you mean ' + this.suggestEmailFix(this.newWorker.email) + '?';
      isValid = false;
    }

    if (this.newWorker.phone && this.newWorker.phone.trim()) {
      if (!this.isValidPhone(this.newWorker.phone)) {
        this.formErrors['phone'] = 'Phone number must contain only numbers and valid characters (+, -, space)';
        isValid = false;
      }
    }

    if (!this.newWorker.assignedService) {
      this.formErrors['assignedService'] = 'Assigned Service is required';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: string): boolean {
    // Allow numbers, spaces, plus sign, hyphens, and parentheses
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(phone);
  }

  hasEmailTypo(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;

    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    const commonTypos: { [key: string]: string[] } = {
      'gmail.com': ['gmal.com', 'gmaill.com', 'gmial.com', 'gamil.com', 'gmai.com', 'gmail.co', 'gnail.com', 'gmail.cm', 'gmail.con'],
      'yahoo.com': ['yahoo.co', 'yaho.com', 'yahooo.com', 'yahoo.cm', 'yahoo.con'],
      'hotmail.com': ['hotmal.com', 'hotmaill.com', 'hotmial.com', 'hotmail.co', 'hotmail.cm', 'hotmail.con'],
      'outlook.com': ['outlok.com', 'outlook.co', 'outlook.cm', 'outlook.con', 'outook.com'],
      'icloud.com': ['iclod.com', 'icloud.co', 'icloud.cm', 'icloud.con']
    };

    // Check if domain is a known typo of a common domain
    for (const [correctDomain, typos] of Object.entries(commonTypos)) {
      if (typos.includes(domain)) {
        return true;
      }
    }

    // Check if domain is very similar to a common domain (1-2 character difference)
    for (const correctDomain of commonDomains) {
      if (domain !== correctDomain && this.levenshteinDistance(domain, correctDomain) <= 2) {
        return true;
      }
    }

    return false;
  }

  suggestEmailFix(email: string): string {
    const [localPart, domain] = email.split('@');
    if (!domain) return email;

    const domainLower = domain.toLowerCase();

    const commonTypos: { [key: string]: string } = {
      'gmal.com': 'gmail.com',
      'gmaill.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmail.co': 'gmail.com',
      'gnail.com': 'gmail.com',
      'gmail.cm': 'gmail.com',
      'gmail.con': 'gmail.com',
      'yahoo.co': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'yahooo.com': 'yahoo.com',
      'yahoo.cm': 'yahoo.com',
      'yahoo.con': 'yahoo.com',
      'hotmal.com': 'hotmail.com',
      'hotmaill.com': 'hotmail.com',
      'hotmial.com': 'hotmail.com',
      'hotmail.co': 'hotmail.com',
      'hotmail.cm': 'hotmail.com',
      'hotmail.con': 'hotmail.com',
      'outlok.com': 'outlook.com',
      'outlook.co': 'outlook.com',
      'outlook.cm': 'outlook.com',
      'outlook.con': 'outlook.com',
      'outook.com': 'outlook.com',
      'iclod.com': 'icloud.com',
      'icloud.co': 'icloud.com',
      'icloud.cm': 'icloud.com',
      'icloud.con': 'icloud.com'
    };

    if (commonTypos[domainLower]) {
      return localPart + '@' + commonTypos[domainLower];
    }

    // Find closest match
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    let closestDomain = commonDomains[0];
    let minDistance = this.levenshteinDistance(domainLower, commonDomains[0]);

    for (const d of commonDomains) {
      const distance = this.levenshteinDistance(domainLower, d);
      if (distance < minDistance) {
        minDistance = distance;
        closestDomain = d;
      }
    }

    if (minDistance <= 2) {
      return localPart + '@' + closestDomain;
    }

    return email;
  }

  levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  saveWorker(): void {
    if (!this.validateForm()) {
      return;
    }

    // Split full name into first and last name
    const fullName = this.newWorker.fullName?.trim() || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const workerData = {
      FirstName: firstName,
      LastName: lastName,
      Email: this.newWorker.email?.trim() || '',
      Phone: this.newWorker.phone?.trim() || '',
      AssignedServiceId: parseInt(this.newWorker.assignedService, 10),
    };

    if (this.isEditMode && this.editingWorkerId) {
      // Update existing worker
      const workerId = parseInt(this.editingWorkerId, 10);
      this.supportWorkersService.updateSupportWorker(workerId, workerData).subscribe({
        next: (updatedWorker) => {
          const index = this.workers.findIndex(w => w.id === workerId);
          if (index !== -1) {
            this.workers[index] = updatedWorker;
          }
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating support worker:', error);
          alert('Failed to update support worker');
        }
      });
    } else {
      // Create new worker
      this.supportWorkersService.createSupportWorker(workerData).subscribe({
        next: (newWorker) => {
          this.workers.unshift(newWorker);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating support worker:', error);
          alert('Failed to create support worker');
        }
      });
    }
  }

  getServiceName(serviceId: string): string {
    const service = this.services.find((s) => s.id === serviceId);
    return service?.name || serviceId;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}