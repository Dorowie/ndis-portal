import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

// 1. IMPORT YOUR MAIN LAYOUT
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

import { ServicesListComponent } from './features/services/services-list/services-list.component';
import { BookServiceComponent } from './features/bookings/book-service/book-service.component';
import { MyBookingsComponent } from './features/bookings/my-bookings/my-bookings.component';
import { ServiceDetail } from './features/services/service-detail/service-detail';
import { DashboardComponent } from './features/coordinator/dashboard/dashboard';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // --- PUBLIC ROUTES (No layout, full screen) ---
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // --- PROTECTED ROUTES (Wrapped inside Main Layout) ---
  { 
    path: '', 
    component: MainLayoutComponent, 
    canActivate: [authGuard], // Protects the layout and EVERYTHING inside it
    children: [
      { path: 'services', component: ServicesListComponent },
      { path: 'services/:id', component: ServiceDetail },
      { path: 'bookings/new', component: BookServiceComponent },
      { path: 'bookings', component: MyBookingsComponent },
      { path: 'dashboard', component: DashboardComponent },
      
      // Default redirect once inside the layout
      { path: '', redirectTo: 'services', pathMatch: 'full' }
    ]
  },

  // --- FALLBACK ---
  { path: '**', redirectTo: 'login' }
];