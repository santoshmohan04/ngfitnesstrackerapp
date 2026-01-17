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

  ngOnInit(): void {
    this.authSubscription = this.store
      .select((state: any) => state.auth?.loggedInUser)
      .subscribe((user: User | null) => {
        this.userdetails = user;
      });
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
