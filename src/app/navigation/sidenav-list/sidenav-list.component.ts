import { Component, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
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
  userdetails: User | null = null;
  authSubscription: Subscription | null = null;
  uiservice = inject(UiService);

  ngOnInit(): void {
    this.authSubscription = this.store
      .select((state: any) => state.auth?.loggedInUser)
      .subscribe((user: User | null) => {
        this.userdetails = user;
      });
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
