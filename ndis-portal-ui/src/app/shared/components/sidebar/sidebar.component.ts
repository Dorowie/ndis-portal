import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Make sure this path correctly points to your core folder
import { AuthService } from '../../../core/services/auth.services';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'] // Assuming you are using SCSS here too!
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);

  // This is the variable your HTML *ngIf statements are looking for
  userRole: string | null = null;

  ngOnInit(): void {
    // The moment the sidebar loads on the screen, decode the token and grab the role
    this.userRole = this.authService.getUserRole();
  }
}