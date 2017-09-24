import {Component} from '@angular/core';
import {AuthService} from '../common/services/auth.service';
import {Router} from '@angular/router';

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
        {{authService.username}}
      </button>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="javascript:void(0);" (click)="logOut()">
          <i class="fa fa-sign-out"></i>
          Log out
        </a>
      </div>
    </div>
  `
})
export class LoginWidgetComponent {
  constructor(public authService: AuthService, private router: Router) {
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
