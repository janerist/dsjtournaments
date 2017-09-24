import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'dsjt-navbar',
  template: `
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" routerLink="/">DSJT Admin</a>
        <button class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item" routerLinkActive="active">
              <a class="nav-link" routerLink="/tournaments">
                <i class="fa fa-list"></i>
                Tournaments
              </a>
            </li>
            <li class="nav-item" routerLinkActive="active">
              <a class="nav-link" routerLink="/jumpers">
                <i class="fa fa-user"></i>
                Jumpers
              </a>
            </li>
            <li class="nav-item" routerLinkActive="active">
              <a class="nav-link" routerLink="/cups">
                <i class="fa fa-calendar"></i>
                Cups & Tours
              </a>
            </li>
          </ul>
        </div>
        <dsjt-login-widget></dsjt-login-widget>
      </nav>
    </div>
  `,
})
export class NavbarComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
