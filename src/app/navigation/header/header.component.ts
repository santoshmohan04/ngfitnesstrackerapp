import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    FlexLayoutModule,
    RouterModule,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  store = inject(Store);
  @Output() sidenavToggle = new EventEmitter();
  userdetails: User | null = null;
  authSubscription: Subscription | null = null;
  uiservice = inject(UiService);
  isDarkMode: boolean = false;

  get userInitials(): string {
    if (this.userdetails?.firstName && this.userdetails?.lastName) {
      return (this.userdetails.firstName[0] + this.userdetails.lastName[0]).toUpperCase();
    }
    if (this.userdetails?.email) {
      return this.userdetails.email[0].toUpperCase();
    }
    return '';
  }

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
    this.authSubscription = this.store
      .select((state: any) => state.auth?.loggedInUser)
      .subscribe((user: User | null) => {
        this.userdetails = user;
      });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  onToggleSideNav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.uiservice.logout();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
