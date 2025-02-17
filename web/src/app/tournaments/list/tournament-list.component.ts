import {Component, input} from '@angular/core';
import {TournamentResponseModel} from '../../shared/api-responses';
import {RouterLink} from '@angular/router';
import {TournamentHeaderComponent} from '../shared/tournament-header.component';
import {FinalStandingsTableComponent} from '../shared/final-standings-table.component';

@Component({
  selector: 'app-tournament-list',
  imports: [
    RouterLink,
    TournamentHeaderComponent,
    FinalStandingsTableComponent
  ],
  template: `
    @if (tournaments().length) {
      <div class="ui items">
        @for (tournament of tournaments(); track tournament.id) {
          <app-tournament-header [tournament]="tournament" class="ui item segment">
            <app-final-standings-table [results]="tournament.top3"></app-final-standings-table>
            <div class="extra">
              <a [routerLink]="['/tournaments', tournament.id]">Full results &rarr;</a>
            </div>
          </app-tournament-header>
        }
      </div>
    } @else {
      <div>
        No tournaments found for selected type and/or date range.
        <a routerLink="./">Show all tournaments</a>.
      </div>
    }
  `
})
export class TournamentListComponent {
  tournaments = input.required<TournamentResponseModel[]>();
}
