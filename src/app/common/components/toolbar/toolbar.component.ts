import { Component, inject, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { TitleService } from '../../../core/services/title.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, TooltipModule],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit {
  protected readonly themeService = inject(ThemeService);
  protected readonly authService = inject(AuthService);
  protected readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    this.authService.getUserInfo().subscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}
