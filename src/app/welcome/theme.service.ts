import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDark = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  toggleTheme(): void {
    this.isDark = !this.isDark;
    if (this.isDark) {
      this.document.body.classList.add('dark-theme');
    } else {
      this.document.body.classList.remove('dark-theme');
    }
  }

  get isDarkMode(): boolean {
    return this.isDark;
  }
}