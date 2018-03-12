import {Component, Input} from '@angular/core';
import {CupDateResponseModel, CupRankingsResponseModel} from '../../shared/api-responses';
import * as moment from 'moment';

@Component({
  selector: 'app-cup-rankings-table',
  template: `
    <div dragScroll [style.cursor]="'move'">
      <table *ngIf="rankings.length" class="ui small striped fixed result table">
        <thead>
        <tr>
          <th style="width: 50px;"></th>
          <th style="width: 200px;"></th>
          <th *ngFor="let date of dates"
              class="center aligned hill"
              style="width: 60px; cursor: help; white-space: nowrap; text-overflow: ellipsis"
              [title]="moment(date.date).format('ddd DD MMM YYYY HH:mm')">
            {{date.date | date: 'DD MMM'}}
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
    </div>
    <p *ngIf="!rankings.length">There is no data available.</p>
  `
})
export class CupRankingsTableComponent {
  moment = moment;

  @Input() rankings: CupRankingsResponseModel[];
  @Input() dates: CupDateResponseModel[];
}
