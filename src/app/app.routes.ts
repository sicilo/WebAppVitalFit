import { Routes } from '@angular/router';
import { SystemLayoutComponent } from './common/layouts/system-layout/system-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: SystemLayoutComponent,
    children: [
      {
        path: 'clinic',
        title: 'Clínica',
        loadChildren: () => import('./modules/clinic/clinic.routes').then(m => m.CLINIC_ROUTES),
      },
      {
        path: 'agenda',
        title: 'Agenda',
        loadChildren: () => import('./modules/agenda/agenda.routes').then(m => m.AGENDA_ROUTES),
      },
      {
        path: 'surety',
        title: 'Seguridad',
        loadChildren: () => import('./modules/surety/surety.routes').then(m => m.SURETY_ROUTES),
      },
      {
        path: '',
        redirectTo: 'agenda',
        pathMatch: 'full',
      },
    ],
  },
];
