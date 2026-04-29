import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

// 1. IMPORT YOUR MAIN LAYOUT
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

import { BookServiceComponent } from './features/bookings/book-service/book-service.component';
import { MyBookingsComponent } from './features/bookings/my-bookings/my-bookings.component';
import { ServicesListComponent } from './features/services/services-list/services-list.component';
import { ServiceDetail as ServiceDetailComponent } from './features/services/service-detail/service-detail.component';
import { ManageServicesComponent } from './features/coordinator/manage-services/manage-services.component';
import { CoordinatorDashboardComponent } from './features/coordinator/dashboard/dashboard.component';
import { AllBookingsComponent } from './features/coordinator/all-bookings/all-bookings.component';
import { SupportWorkersComponent } from './features/coordinator/support-workers/support-workers.component';

import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  // --- PUBLIC (redirect if already logged in) ---
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

  // --- PROTECTED ---
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // PARTICIPANT ONLY
      {
        path: 'services',
        component: ServicesListComponent,
        canActivate: [authGuard],
        data: { roles: ['Participant'] }
      },
      {
        path: 'services/:id',
        component: ServiceDetailComponent,
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

      // COORDINATOR ONLY
      {
        path: 'dashboard',
        component: CoordinatorDashboardComponent,
        canActivate: [authGuard],
        data: { roles: ['Coordinator'] }
      },
      {
        path: 'dashboard/services',
        component: ManageServicesComponent,
        canActivate: [authGuard],
        data: { roles: ['Coordinator'] }
      },
      {
        path: 'dashboard/bookings',
        component: AllBookingsComponent,
        canActivate: [authGuard],
        data: { roles: ['Coordinator'] }
      },
      {
        path: 'dashboard/workers',
        component: SupportWorkersComponent,
        canActivate: [authGuard],
        data: { roles: ['Coordinator'] }
      },

      // DEFAULT (handled by guard)
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];