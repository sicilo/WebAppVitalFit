import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarMenuComponent } from '../../components/sidebar-menu/sidebar-menu.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-system-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonModule,
    TooltipModule,
    SidebarMenuComponent,
    ToolbarComponent,
    CardModule,
    PanelModule
  ],
  templateUrl: './system-layout.component.html',
})
export class SystemLayoutComponent {
 
}
