import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ServicesListComponent } from './features/services/services-list/services-list.component';
import { BookServiceComponent } from './features/bookings/book-service/book-service.component';
import { MyBookingsComponent } from './features/bookings/my-bookings/my-bookings.component';
import { ServiceDetail } from './features/services/service-detail/service-detail';
import { DashboardComponent } from './features/coordinator/dashboard/dashboard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'services', component: ServicesListComponent },
  { path: 'services/:id', component: ServiceDetail },

  { path: 'bookings/new', component: BookServiceComponent },
  { path: 'bookings', component: MyBookingsComponent },

  { path: 'dashboard', component: DashboardComponent },

  { path: '', redirectTo: 'services', pathMatch: 'full' },
  { path: '**', redirectTo: 'services' }
];