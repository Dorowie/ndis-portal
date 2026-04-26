import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.services';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule], // Ensure this is here
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {
  @Output() toggle = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);

  // Modal State
  showLogoutModal = false;

  onToggle() {
    this.toggle.emit();
  }

  // Open the confirmation dialog
  openLogoutModal() {
    this.showLogoutModal = true;
  }

  // Close without logging out
  cancelLogout() {
    this.showLogoutModal = false;
  }

  // The actual logout execution
  confirmLogout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
    this.showLogoutModal = false;
  }
}