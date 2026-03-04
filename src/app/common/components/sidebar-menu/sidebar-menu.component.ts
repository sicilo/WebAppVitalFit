import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

export interface MenuItemWithIcon extends MenuItem {
  matIcon?: string;
  items?: MenuItemWithIcon[];
}

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [PanelMenuModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-menu.component.html',
})
export class SidebarMenuComponent {
  protected readonly menuItems: MenuItemWithIcon[] = [
    {
      label: 'Agenda',
      matIcon: 'calendar_month',
      items: [
        {
          label: 'Citas',
          matIcon: 'event',
          routerLink: '/agenda/appointments',
        },
        {
          label: 'Calendario',
          matIcon: 'calendar_today',
          routerLink: '/agenda/calendar',
        },
        {
          label: 'Ventas',
          matIcon: 'point_of_sale',
          routerLink: '/agenda/sales',
        },
      ],
    },
    {
      label: 'Clínica',
      matIcon: 'local_hospital',
      items: [
        {
          label: 'Productos & Servicios',
          matIcon: 'inventory_2',
          routerLink: '/clinic/products-services',
        },
        {
          label: 'Maestros Generales',
          matIcon: 'settings',
          routerLink: '/clinic/general-masters',
        },
        {
          label: 'Personal',
          matIcon: 'groups',
          routerLink: '/clinic/people',
        },
      ],
    },
    {
      label: 'Seguridad',
      matIcon: 'shield',
      items: [
        {
          label: 'Usuarios',
          matIcon: 'person',
          routerLink: '/surety/users',
        },
        {
          label: 'Roles & Permisos',
          matIcon: 'lock',
          routerLink: '/surety/roles-permissions',
        },
      ],
    },
  ];
}
