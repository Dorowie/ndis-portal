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
    }

    if (!this.newWorker.email?.trim()) {
      this.formErrors['email'] = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.newWorker.email)) {
      this.formErrors['email'] = 'Please enter a valid email address';
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