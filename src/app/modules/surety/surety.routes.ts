import { Routes } from '@angular/router';

export const SURETY_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    title: 'Usuarios',
    loadComponent: () => import('./pages/users/users.page').then(m => m.UsersPage),
  },
  {
    path: 'roles-permissions',
    title: 'Roles y Permisos',
    loadComponent: () =>
      import('./pages/roles-permissions/roles-permissions.page').then(m => m.RolesPermissionsPage),
  },
];
