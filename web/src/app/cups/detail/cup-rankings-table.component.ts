import {Component, Input} from '@angular/core';
import {CupDateResponseModel, CupRankingsResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-cup-rankings-table',
  template: `
    <drag-scroll [style.cursor]="'move'">
      <table *ngIf="rankings.length" class="ui small striped fixed result table">
        <thead>
        <tr>
          <th style="width: 50px;"></th>
          <th style="width: 200px;"></th>
          <th *ngFor="let date of dates"
              class="center aligned hill"
              style="width: 60px; cursor: help; white-space: nowrap; text-overflow: ellipsis"
              [title]="date.date | dsjtDate: 'EEE dd MMM y HH:mm'">
            {{date.date | dsjtDate: 'dd MMM'}}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let ranking of rankings, let i = index">
          <td>
            <span *ngIf="ranking.rank > rankings[i - 1]?.rank">{{ranking.rank}}.</span>
          </td>
          <td>
            <i [appFlag]="ranking.nation"></i>
            <a *ngIf="ranking.name" [routerLink]="['/jumpers', ranking.jumperId]">{{ranking.name}}</a>
          </td>
          <td *ngFor="let date of dates" class="center aligned">
            {{ranking.tournamentRanks[date.tournamentId?.toString()] && ranking.tournamentRanks[date.tournamentId.toString()] + '.' || '-'}}
          </td>
        </tr>
        </tbody>

      </table>
    </drag-scroll>
    <p *ngIf="!rankings.length">There is no data available.</p>
  `
})
export class CupRankingsTableComponent {
  @Input() rankings!: CupRankingsResponseModel[];
  @Input() dates!: CupDateResponseModel[];
}
