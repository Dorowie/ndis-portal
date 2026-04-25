import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

export const routes: Routes = [
  // Auth Features (No Layout)
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register) 
  },

  // Portal Features (With Main Layout)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];