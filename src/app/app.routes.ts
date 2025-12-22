import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./navigation/navigation.component').then(
        (m) => m.NavigationComponent
      ),
    // canActivate: [AuthGuard]
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./components/users/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'users/create',
        loadComponent: () =>
          import('./components/users/user-form/user-form.component').then(
            (m) => m.UserFormComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'users/edit/:id',
        loadComponent: () =>
          import('./components/users/user-form/user-form.component').then(
            (m) => m.UserFormComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./components/roles/role-list/role-list.component').then(
            (m) => m.RoleListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'roles/create',
        loadComponent: () =>
          import('./components/roles/role-form/role-form.component').then(
            (m) => m.RoleFormComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'roles/permissions/:id',
        loadComponent: () =>
          import('./components/roles/role-assign-permission/role-assign-permission.component').then(
            (m) => m.RoleAssignPermissionComponent
          ),
        // canActivate: [AuthGuard]
      },

    ],
  },
];
