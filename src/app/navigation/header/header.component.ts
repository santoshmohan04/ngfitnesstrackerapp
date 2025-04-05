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
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
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
