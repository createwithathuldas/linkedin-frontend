import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const FEED_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('../../Components/feed/feed-page/feed-page.component').then(m => m.FeedPageComponent)
  }
];
