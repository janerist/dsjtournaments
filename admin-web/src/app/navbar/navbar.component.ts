import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../common/services/auth.service';

@Component({
  selector: 'dsjt-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">DSJT Admin</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="tournaments" routerLinkActive="active">
                <i class="fa fa-list"></i>
                Tournaments
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="jumpers" routerLinkActive="active">
                <i class="fa fa-user"></i>
                Jumpers
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="cups" routerLinkActive="active">
                <i class="fa fa-calendar"></i>
                Cups & Tours
              </a>
            </li>
          </ul>
        </div>
        <div class="dropdown">
          <button class="btn btn-light dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
            <i class="fa fa-user"></i>
            {{ authService.user?.username }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="javascript:void(0);" (click)="authService.logout()">
                <i class="fa fa-sign-out"></i>
                Log out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
}
