import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If already logged in, redirect based on role
  if (authService.isAuthenticated()) {
    const userRole = authService.getUserRole();
    
    if (userRole === 'Coordinator') {
      router.navigate(['/dashboard']);
    } else {
      // Default to /services for Participant or any other role
      router.navigate(['/services']);
    }
    return false;
  }

  // Not logged in, allow access to login/register
  return true;
};
