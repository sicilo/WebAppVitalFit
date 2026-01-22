import { Routes } from '@angular/router';

export const CLINIC_ROUTES: Routes = [
  {
    path: '',
    title: 'Productios y Servicios',
    loadComponent: () =>
      import('./pages/products-services/products-services.page')
        .then(m => m.ProductsServicesPage),
  },
  {
    path: 'products-services',
    title: 'Productios y Servicios',
    loadComponent: () =>
      import('./pages/products-services/products-services.page').then(m => m.ProductsServicesPage),
  },
  {
    path: 'general-masters',
    title: 'Maestros Generales',
    loadComponent: () =>
      import('./pages/general-masters/general-masters.page').then(m => m.GeneralMastersPage),
  },
  {
    path: 'people',
    title: 'Personal',
    loadComponent: () => import('./pages/people/people.page').then(m => m.PeoplePage),
  },
];
