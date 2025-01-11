import { Routes } from '@angular/router';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {path: "", canActivate: [authGuard()],
    loadComponent: () => import("./pages/dashboard/dashboard.component")
      .then(c => c.DashboardComponent)},
  {path: "signin", canActivate: [authGuard("reverse")],
    loadComponent: () => import("./pages/signin/signin.component")
      .then(c => c.SigninComponent)},
  {path: 'signup', canActivate: [authGuard("reverse")],
    loadComponent: () => import("./pages/signup/signup.component")
      .then(c => c.SignupComponent)},
  {path: "**", loadComponent: () => import("./errors/not-found/not-found.component")
      .then(c => c.NotFoundComponent)},
];
