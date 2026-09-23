import { Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminPageComponent
  },
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  }
];