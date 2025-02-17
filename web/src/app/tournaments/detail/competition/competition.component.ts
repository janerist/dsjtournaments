import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-competition',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  template: `
    <div class="ui secondary pointing menu">
      <a class="item" routerLink="final" routerLinkActive="active">Competition Final Results</a>
      <a class="item" routerLink="qual" routerLinkActive="active">Qualification results</a>
    </div>
    <router-outlet></router-outlet>
  `
})
export class CompetitionComponent {
}
