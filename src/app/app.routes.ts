import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './Components/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./Components/admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'company/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./Components/company/company-login/company-login.component').then(m => m.CompanyLoginComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      {
        path: 'feed',
        loadChildren: () => import('./modules/feed/feed.routes').then(m => m.FEED_ROUTES)
      },
      {
        path: 'network',
        loadChildren: () => import('./modules/network/network.routes').then(m => m.NETWORK_ROUTES)
      },
      {
        path: 'jobs',
        loadComponent: () => import('./Components/jobs/jobs-page/jobs-page.component').then(m => m.JobsPageComponent)
      },
      {
        path: 'jobs/:id',
        loadComponent: () => import('./Components/jobs/job-detail/job-detail.component').then(m => m.JobDetailComponent)
      },
      {
        path: 'messaging',
        loadComponent: () => import('./Components/messaging/messaging-page/messaging-page.component').then(m => m.MessagingPageComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./Components/notifications/notifications-page/notifications-page.component').then(m => m.NotificationsPageComponent)
      },
      {
        path: 'profile/:userId',
        loadComponent: () => import('./Components/profile/profile-page/profile-page.component').then(m => m.ProfilePageComponent)
      },
      {
        path: 'search',
        loadComponent: () => import('./Components/search/search-page/search-page.component').then(m => m.SearchPageComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./Components/settings/settings-page/settings-page.component').then(m => m.SettingsPageComponent)
      },
      {
        path: 'premium',
        loadComponent: () => import('./Components/premium/premium-page/premium-page.component').then(m => m.PremiumPageComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./Components/analytics/analytics-page/analytics-page.component').then(m => m.AnalyticsPageComponent)
      },
      {
        path: 'admin/dashboard',
        loadComponent: () => import('./Components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'company/dashboard',
        loadComponent: () => import('./Components/company/company-dashboard/company-dashboard.component').then(m => m.CompanyDashboardComponent)
      },
      {
        path: 'games',
        loadComponent: () => import('./Components/games/games-page/games-page.component').then(m => m.GamesPageComponent)
      },
      {
        path: 'groups',
        loadComponent: () => import('./Components/groups/groups-page/groups-page.component').then(m => m.GroupsPageComponent)
      },
      {
        path: 'companies',
        loadComponent: () => import('./Components/companies/companies-page/companies-page.component').then(m => m.CompaniesPageComponent)
      },
      {
        path: 'companies/:id',
        loadComponent: () => import('./Components/companies/companies-page/companies-page.component').then(m => m.CompaniesPageComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'feed' }
];
