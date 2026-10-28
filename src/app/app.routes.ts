import type { Routes } from '@angular/router';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { StellingBeherenComponent } from './admin-page/components/stelling-beheren/stelling-beheren.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminPageComponent
  },
  {
    path: 'admin/stelling-beheren',
    component: StellingBeherenComponent
  },
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
    path: 'stemwijzer',
    loadComponent: async () => import('./stemwijzer-page/stemwijzer-page.component').then(module => module.StemwijzerPageComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
    redirectTo: 'admin',
    pathMatch: 'full'
  }
];
