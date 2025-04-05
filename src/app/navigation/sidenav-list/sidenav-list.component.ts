import { Component, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  standalone: true,
  imports: [
    MatListModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterLink,
  ],
})
export class SidenavListComponent implements OnInit, OnDestroy {
  store = inject(Store);
  @Output() sidenavToggle = new EventEmitter();
  userdetails: User;
  authSubscription: Subscription | null = null;
  auth = getAuth();
  uiservice = inject(UiService);

  ngOnInit(): void {
    this.authSubscription = new Subscription();
    const authUnsubscribe = onAuthStateChanged(
      this.auth,
      (user: User | null) => {
        if (user) {
          this.userdetails = user;
        } else {
          this.userdetails = null;
        }
      }
    );
    this.authSubscription.add(authUnsubscribe);
  }

  onToggleSidenav() {
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
