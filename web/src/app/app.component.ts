import { Component } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>

    <div class="ui main container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .main.container {
      margin-top: 5em;
    }
  `]
})
export class AppComponent {
  constructor(router: Router) {
    // Scroll to top on route changes
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => document.body.scrollTop = 0);
  }
}
