import {Component, effect, inject, input, numberAttribute} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TournamentService} from '../tournament.service';

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
  cid = input.required({transform: numberAttribute});

  tournamentService = inject(TournamentService);

  constructor() {
    effect(() => this.tournamentService.setCompetition(this.cid()));
  }
}
