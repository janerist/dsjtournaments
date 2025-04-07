import {Component, inject, input} from '@angular/core';
import {FinalStandingResponseModel} from '../../../shared/api-responses';
import {httpResource} from '@angular/common/http';
import {FinalStandingsTableComponent} from '../../shared/final-standings-table.component';
import {TournamentService} from '../tournament.service';

@Component({
  selector: 'app-final-standings',
  imports: [
    FinalStandingsTableComponent,
  ],
  template: `
    @if (finalStandings.value(); as results) {
      <app-final-standings-table [results]="results"></app-final-standings-table>
    }
  `
})
export class FinalStandingsComponent {
  id = input.required();
  tournamentService = inject(TournamentService);
  finalStandings = httpResource<FinalStandingResponseModel[]>(() => `/tournaments/${this.id()}/finalstandings`);

  constructor() {
    this.tournamentService.hideCompetitions.set(false);
  }
}
