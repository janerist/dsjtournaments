import {Component, inject, input} from '@angular/core';
import { httpResource} from '@angular/common/http';
import {TournamentRankingsResponseModel} from '../../../shared/api-responses';
import {TournamentService} from '../tournament.service';
import {TournamentRankingsTableComponent} from '../../shared/tournament-rankings-table.component';

@Component({
  selector: 'app-tournament-rankings',
  imports: [
    TournamentRankingsTableComponent
  ],
  template: `
    @if (rankings.value(); as rankings) {
      <app-tournament-rankings-table
        [competitions]="tournamentService.tournament()?.competitions"
        [rankings]="rankings">
      </app-tournament-rankings-table>
    }
  `
})
export class TournamentRankingsComponent {
  id = input.required();

  tournamentService = inject(TournamentService);
  rankings = httpResource<TournamentRankingsResponseModel[]>(() => `/tournaments/${this.id()}/rankings`);

  constructor() {
    this.tournamentService.hideCompetitions.set(true);
  }
}
