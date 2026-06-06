import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const NETWORK_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('../../Components/network/network-page/network-page.component').then(m => m.NetworkPageComponent)
  }
];
