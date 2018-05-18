import {Component, Input} from '@angular/core';


import {TournamentResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-tournament-list',
  template: `
    <div *ngIf="tournaments.length" class="ui items">
      <app-tournament-header *ngFor="let tournament of tournaments"
                             [tournament]="tournament"
                             class="ui item segment">
        <app-final-standings-table [results]="tournament.top3"></app-final-standings-table>
        <div class="extra">
          <a [routerLink]="['/tournaments', tournament.id]">Full results &rarr;</a>
        </div>
      </app-tournament-header>
    </div>

    <div *ngIf="!tournaments.length">
      No tournaments found for selected type and/or date range.
      <a routerLink="./">Show all tournaments</a>.
    </div>
  `
})
export class TournamentListComponent {
  @Input() tournaments: TournamentResponseModel[];
}
