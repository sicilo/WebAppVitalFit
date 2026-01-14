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
      {
        path: 'service-categories',
        loadComponent: () =>
          import('./components/service-categories/service-category-list/service-category-list.component').then(
            (m) => m.ServiceCategoryListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'document-types',
        loadComponent: () =>
          import('./components/document-types/document-type-list/document-type-list.component').then(
            (m) => m.DocumentTypeListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'skin-types',
        loadComponent: () =>
          import('./components/skin-types/skin-type-list/skin-type-list.component').then(
            (m) => m.SkinTypeListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'blood-types',
        loadComponent: () =>
          import('./components/blood-types/blood-type-list/blood-type-list.component').then(
            (m) => m.BloodTypeListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'insurance-providers',
        loadComponent: () =>
          import('./components/insurance-providers/insurance-provider-list/insurance-provider-list.component').then(
            (m) => m.InsuranceProviderListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./components/employees/employee-list/employee-list.component').then(
            (m) => m.EmployeeListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'acquisition-channels',
        loadComponent: () =>
          import('./components/acquisition-channels/acquisition-channel-list/acquisition-channel-list.component').then(
            (m) => m.AcquisitionChannelListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'providers',
        loadComponent: () =>
          import('./components/providers/provider-list/provider-list.component').then(
            (m) => m.ProviderListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'bonus',
        loadComponent: () =>
          import('./components/bonus/bonus-list/bonus-list.component').then(
            (m) => m.BonusListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'bundle',
        loadComponent: () =>
          import('./components/bundle/bundle-list/bundle-list.component').then(
            (m) => m.BundleListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'employee-types',
        loadComponent: () =>
          import('./components/employee-types/employee-type-list/employee-type-list.component').then(
            (m) => m.EmployeeTypeListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'genders',
        loadComponent: () =>
          import('./components/genders/gender-list/gender-list.component').then(
            (m) => m.GenderListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'job-titles',
        loadComponent: () =>
          import('./components/job-titles/job-title-list/job-title-list.component').then(
            (m) => m.JobTitleListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'novelty-types',
        loadComponent: () =>
          import('./components/novelty-types/novelty-type-list/novelty-type-list.component').then(
            (m) => m.NoveltyTypeListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./components/products/product-list/product-list.component').then(
            (m) => m.ProductListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'room-types',
        loadComponent: () =>
          import('./components/room-types/room-type-list/room-type-list.component').then(
            (m) => m.RoomTypeListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./components/services/service-list/service-list.component').then(
            (m) => m.ServiceListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./components/clinic/customers/customer-list/customer-list.component').then(
            (m) => m.CustomerListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'customers/create',
        loadComponent: () =>
          import('./components/clinic/customers/customer-form/customer-form.component').then(
            (m) => m.CustomerFormComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'customers/edit/:id',
        loadComponent: () =>
          import('./components/clinic/customers/customer-form/customer-form.component').then(
            (m) => m.CustomerFormComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'professionals',
        loadComponent: () =>
          import('./components/clinic/professionals/professional-list/professional-list.component').then(
            (m) => m.ProfessionalListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'professionals/create',
        loadComponent: () =>
          import('./components/clinic/professionals/professional-form/professional-form.component').then(
            (m) => m.ProfessionalFormComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'professionals/edit/:id',
        loadComponent: () =>
          import('./components/clinic/professionals/professional-form/professional-form.component').then(
            (m) => m.ProfessionalFormComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'companions',
        loadComponent: () =>
          import('./components/clinic/companions/companion-list/companion-list.component').then(
            (m) => m.CompanionListComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'companions/create',
        loadComponent: () =>
          import('./components/clinic/companions/companion-form/companion-form.component').then(
            (m) => m.CompanionFormComponent
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'companions/edit/:id',
        loadComponent: () =>
          import('./components/clinic/companions/companion-form/companion-form.component').then(
            (m) => m.CompanionFormComponent
          ),
        // canActivate: [AuthGuard]
      },

    ],
  },
];
