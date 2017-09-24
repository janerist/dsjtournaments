import { Component } from '@angular/core';
import {AuthService} from './common/services/auth.service';

@Component({
  selector: 'dsjt-root',
  template: `
    <dsjt-navbar *ngIf="authService.isLoggedIn"></dsjt-navbar>
    <div class="container" id="main">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  constructor(public authService: AuthService) {
  }
}
