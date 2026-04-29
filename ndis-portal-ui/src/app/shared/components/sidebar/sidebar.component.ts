import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.services';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);

  userRole: string | null = null;

  ngOnInit(): void {
    this.updateUserRole();
    // Listen for storage changes to update role dynamically
    window.addEventListener('storage', () => this.updateUserRole());
  }

  updateUserRole(): void {
    // Check localStorage first for explicit role setting
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.userRole = storedRole;
      return;
    }

    // Otherwise get from auth service
    const role = this.authService.getUserRole();
    this.userRole = role || 'Coordinator'; // Default to Coordinator if no role found
  }

  // Method to manually set role for testing
  setRole(role: string): void {
    localStorage.setItem('userRole', role);
    this.userRole = role;
  }
}