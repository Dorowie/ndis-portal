import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ❌ Not logged in
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const userRole = authService.getUserRole();
  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  // ✅ If route has NO role restriction → allow
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // ✅ If role is allowed → allow
  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  // ❌ BLOCKED → redirect based on role (NO LOOP)
  if (userRole === 'Coordinator') {
    return router.createUrlTree(['/dashboard']);
  }

  if (userRole === 'Participant') {
    return router.createUrlTree(['/services']);
  }

  return router.createUrlTree(['/login']);
};