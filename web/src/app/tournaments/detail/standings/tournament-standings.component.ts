import {Component, inject} from '@angular/core';
import {TournamentService} from '../tournament.service';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-tournament-standings',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <div class="ui secondary pointing menu">
      <a class="item" routerLink="finalstandings" routerLinkActive="active">
        Final standings
      </a>
      @if (tournamentService.tournament()?.competitions.length) {
        <a class="item" routerLink="rankings" routerLinkActive="active">
          Per-hill rankings
        </a>
      }
    </div>
    <router-outlet></router-outlet>
  `
})
export class TournamentStandingsComponent {
  tournamentService = inject(TournamentService);
}
