import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/auth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('../../Components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('../../Components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'verify-otp',
    canActivate: [guestGuard],
    loadComponent: () => import('../../Components/auth/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
