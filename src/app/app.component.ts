import {Component, ElementRef, ViewChild} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './navigation/header/header.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, MatSidenavModule, SidenavListComponent, HeaderComponent]
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: ElementRef;

  toggleSidenav(){
    this.sidenav.nativeElement.toggle();
  }
}
