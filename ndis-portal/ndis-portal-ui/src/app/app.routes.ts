import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ServicesListComponent } from './features/services/services-list/services-list.component';
// import { ServiceDetailComponent } from './features/services/service-detail/service-detail.component';
// import { MyBookingsComponent } from './features/bookings/my-bookings/my-bookings.component';
// import { BookServiceComponent } from './features/bookings/book-service/book-service.component';
// import { DashboardComponent } from './features/coordinator/dashboard/dashboard.component';
// import { authGuard } from './core/guards/auth.guard';
// import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'services', component: ServicesListComponent },
  // { path: 'services/:id', component: ServiceDetailComponent },

  // add these when your components/guards are ready
  // { path: 'bookings', component: MyBookingsComponent, canActivate: [authGuard, roleGuard], data: { role: 'Participant' } },
  // { path: 'bookings/new', component: BookServiceComponent, canActivate: [authGuard, roleGuard], data: { role: 'Participant' } },
  // { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, roleGuard], data: { role: 'Coordinator' } },

  { path: '', redirectTo: 'services', pathMatch: 'full' },
  { path: '**', redirectTo: 'services' }
];