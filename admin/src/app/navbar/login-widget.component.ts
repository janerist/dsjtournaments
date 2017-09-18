import {Component} from '@angular/core';
import {AuthService} from '../common/services/auth.service';

@Component({
  selector: 'dsjt-user-widget',
  templateUrl: './login-widget.component.html'
})
export class LoginWidgetComponent {

  constructor(
    private authService: AuthService) {
  }

  get username() {
    return this.authService.username;
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }
}
