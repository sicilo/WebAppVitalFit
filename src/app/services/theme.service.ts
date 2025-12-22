import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Cargar tema guardado o usar preferencia del sistema
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }

    // Aplicar tema al cargar
    this.applyTheme(this.isDarkMode());

    // Sincronizar cambios de tema
    effect(() => {
      this.applyTheme(this.isDarkMode());
      localStorage.setItem(this.THEME_KEY, this.isDarkMode() ? 'dark' : 'light');
    });
  }

  toggleTheme(): void {
    this.isDarkMode.set(!this.isDarkMode());
  }

  private applyTheme(isDark: boolean): void {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
}
