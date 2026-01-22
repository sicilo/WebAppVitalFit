import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'vitalfit-theme';
  private readonly darkMode = signal<boolean>(false);

  readonly isDarkMode = this.darkMode.asReadonly();

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    this.setDarkMode(!this.darkMode());
  }

  setDarkMode(isDark: boolean): void {
    this.darkMode.set(isDark);
    this.applyTheme(isDark);
    this.saveTheme(isDark);
  }

  private loadTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved !== null) {
      this.setDarkMode(saved === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkMode(prefersDark);
    }
  }

  private applyTheme(isDark: boolean): void {
    const html = document.documentElement;

    if (isDark) {
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
    }
  }

  private saveTheme(isDark: boolean): void {
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
  }
}
