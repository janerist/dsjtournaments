import {Component} from '@angular/core';
import {TournamentService} from '../tournament.service';

@Component({
  selector: 'app-tournament-standings',
  template: `
    <div class="ui secondary pointing menu">
      <a class="item" routerLink="finalstandings" routerLinkActive="active">
        Final standings
      </a>
      <a *ngIf="tournament.competitions.length" class="item" routerLink="rankings" routerLinkActive="active">
        Per-hill rankings
      </a>
    </div>
    <router-outlet></router-outlet>
  `
})
export class TournamentStandingsComponent {
  constructor(private tournamentService: TournamentService) {

  }

  get tournament() {
    return this.tournamentService.tournament;
  }
}
