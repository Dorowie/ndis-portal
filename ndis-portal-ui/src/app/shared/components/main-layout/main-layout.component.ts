import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopNavComponent, ChatbotComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isSidebarOpen = false;
  
  // Inject the Angular Router
  private router = inject(Router);

  ngOnInit() {
    // Listen to the router events stream
    this.router.events.pipe(
      // Filter out everything except the successful end of a navigation event
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Automatically close the sidebar when the route changes
      this.closeSidebar();
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}