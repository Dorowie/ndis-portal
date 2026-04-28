import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-support-workers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-workers.component.html',
  styleUrl: './support-workers.component.css',
})
export class SupportWorkersComponent implements OnInit {
  // Support workers data
  workers: any[] = [];

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

  constructor() {}

  ngOnInit(): void {
    this.loadWorkers();
    this.loadServices();
  }

  loadWorkers(): void {
    // TODO: Connect to API when ready
    this.workers = [];
  }

  loadServices(): void {
    // TODO: Connect to API when ready
    this.services = [];
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
  editWorker(worker: any): void {
    this.isEditMode = true;
    this.editingWorkerId = worker.id || null;
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
      // TODO: Call API to delete worker
      this.workers = this.workers.filter(w => w.id !== this.workerToDelete.id);
      this.showDeleteConfirm = false;
      this.workerToDelete = null;
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

  saveWorker(): void {
    if (!this.validateForm()) {
      return;
    }

    const workerData: any = {
      fullName: this.newWorker.fullName?.trim(),
      email: this.newWorker.email?.trim(),
      phone: this.newWorker.phone?.trim() || undefined,
      assignedService: this.newWorker.assignedService,
    };

    if (this.isEditMode && this.editingWorkerId) {
      // TODO: Call API to update worker
      const index = this.workers.findIndex(w => w.id === this.editingWorkerId);
      if (index !== -1) {
        this.workers[index] = {
          ...this.workers[index],
          fullName: workerData.fullName!,
          email: workerData.email!,
          phone: workerData.phone,
          assignedService: workerData.assignedService!,
        };
      }
      this.closeModal();
    } else {
      // TODO: Call API to create worker
      this.workers.unshift({
        id: Date.now().toString(),
        fullName: workerData.fullName!,
        email: workerData.email!,
        phone: workerData.phone,
        assignedService: workerData.assignedService!,
      });
      this.closeModal();
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
