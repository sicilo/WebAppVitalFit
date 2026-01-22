import { Routes } from '@angular/router';

export const AGENDA_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'appointments',
    pathMatch: 'full',
  },
  {
    path: 'appointments',
    title: 'Citas',
    loadComponent: () => import('./pages/appointments/appointments.page').then(m => m.AppointmentsPage),
  },
  {
    path: 'calendar',
    title: 'Calendario',
    loadComponent: () => import('./pages/calendar/calendar.page').then(m => m.CalendarPage),
  },
];
