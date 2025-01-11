import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const authGuard = (type: 'normal' | 'reverse' = 'normal') => {
  const guard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService)
    const router = inject(Router);

    const authUser = authService.authUser()

    if ((type === 'normal' && !authUser) || (type === 'reverse' && authUser)) {
      router.navigate([type === 'reverse' ? '/' : '/signin']);
      return false;
    } else {
      return true;
    }
  }

  return guard
};
