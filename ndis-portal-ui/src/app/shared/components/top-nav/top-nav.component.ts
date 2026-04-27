import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.services';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {
  @Output() toggle = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);

  showLogoutModal = false;
  userRole: string | null = 'Coordinator';

  onToggle(): void {
    this.toggle.emit();
  }

  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    this.authService.logout();
    this.showLogoutModal = false;
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}