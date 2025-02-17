import {Component, inject} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs/operators';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    RouterOutlet
  ],
  styles: [`
    .main.container {
      margin-top: 5em;
    }
  `],
  template: `
    <app-header></app-header>

    <div class="ui main container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  private router = inject(Router);

  constructor() {
    // Scroll to top on route changes
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => window.scrollTo(0, 0));
  }
}
