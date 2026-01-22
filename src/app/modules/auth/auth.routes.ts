import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../../common/layouts/auth-layout/auth-layout.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
      },
      {
        path: 'recover',
        loadComponent: () => import('./pages/recover/recover.page').then(m => m.RecoverPage),
      },
    ],
  },
];
