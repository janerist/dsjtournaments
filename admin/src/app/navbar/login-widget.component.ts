import {Component} from '@angular/core';
import {AuthService} from '../common/services/auth.service';

@Component({
  selector: 'dsjt-login-widget',
  template: `
    <div class="dropdown">
      <button class="btn btn-light dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
        <i class="fa fa-user"></i>
        {{username}}
      </button>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" routerLink="/logout">
          <i class="fa fa-sign-out"></i>
          Log out
        </a>
      </div>
    </div>
  `
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
