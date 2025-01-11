import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {ToastService} from '../services/toast.service';
import {catchError, throwError} from 'rxjs';
import {SigninResponse} from '../../types';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const access = localStorage.getItem('InsuredAccess');
  const token = access ? (JSON.parse(access) as SigninResponse).accessToken : "";

  const clonedRequest = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
    : req;

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('InsuredAccess');

        if (req.url.includes('/login')) {
          return throwError(() => error);
        }

        window.location.reload();
      } else if (error.status === 403) {
        toastService.add({title: 'You do not have permission to perform this action.', type: 'error', }, 5);
      }

      // Rethrow the error for further handling
      return throwError(() => error);
    })
  );
};
