import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'dsjt-shell',
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  template: `
    <dsjt-navbar></dsjt-navbar>
    <div class="container" id="main">
      <router-outlet></router-outlet>
    </div>
  `
})
export class ShellComponent {
}
