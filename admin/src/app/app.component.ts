import { Component } from '@angular/core';
import {AuthService} from './common/services/auth.service';

@Component({
  selector: 'dsjt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService) {
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }
}
