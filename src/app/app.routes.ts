import type { Routes } from '@angular/router';
import { adminAuthGuard } from './guards/admin-auth.guard';

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
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: async () => import('./admin-page/admin-page.component').then(module => module.AdminPageComponent),
    loadChildren: async () => import('./admin-page/admin-page.routes').then(module => module.routes),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
