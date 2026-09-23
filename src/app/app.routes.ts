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
    redirectTo: 'admin',
    pathMatch: 'full'
  }
];