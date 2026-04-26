import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user has a valid token
  if (authService.isAuthenticated()) {
    return true;
  }

  // If not logged in, redirect to login page
  // We pass 'state.url' so we can redirect them back after they log in
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};