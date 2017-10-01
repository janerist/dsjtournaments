import {Component} from '@angular/core';

@Component({
  selector: 'app-competition',
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
