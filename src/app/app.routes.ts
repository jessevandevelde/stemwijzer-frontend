import type { Routes } from '@angular/router';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { partyAdminAuthGuard } from './guards/party-admin-auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadChildren: async () => import('./login-page/login-page.routes').then(module => module.routes),
  },
  {
    path: 'admin/stelling-beheren',
    canActivate: [adminAuthGuard],
    loadComponent: async () => import('./admin-page/components/stelling-beheren/stelling-beheren.component').then(module => module.StellingBeherenComponent),
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: async () => import('./admin-page/admin-page.component').then(module => module.AdminPageComponent),
    loadChildren: async () => import('./admin-page/admin-page.routes').then(module => module.routes),
  },
  {
    path: 'partij',
    canActivate: [partyAdminAuthGuard],
    loadComponent: async () => import('./party-admin-page/party-admin-page.component').then(module => module.PartyAdminPageComponent),
  },
  {
    path: 'stemwijzer',
    loadComponent: async () => import('./stemwijzer-page/stemwijzer-page.component').then(module => module.StemwijzerPageComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
