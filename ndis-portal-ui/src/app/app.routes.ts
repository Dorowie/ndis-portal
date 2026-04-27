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
  // --- PUBLIC ---
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // --- PROTECTED ---
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // 🔵 PARTICIPANT ONLY
      {
        path: 'services',
        component: ServicesListComponent,
        canActivate: [authGuard],
        data: { roles: ['Participant'] }
      },
      {
        path: 'services/:id',
        component: ServiceDetail,
        canActivate: [authGuard],
        data: { roles: ['Participant'] }
      },
      {
        path: 'bookings/new',
        component: BookServiceComponent,
        canActivate: [authGuard],
        data: { roles: ['Participant'] }
      },
      {
        path: 'bookings',
        component: MyBookingsComponent,
        canActivate: [authGuard],
        data: { roles: ['Participant'] }
      },

      // 🔴 COORDINATOR ONLY
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { roles: ['Coordinator'] }
      },

      // ❗ DEFAULT (handled by guard)
      { path: '', redirectTo: 'services', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];