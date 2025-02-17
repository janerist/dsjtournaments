import {Component, input, Input} from '@angular/core';
import {CupDateResponseModel, CupRankingsResponseModel} from '../../shared/api-responses';
import {FormatPipeModule} from 'ngx-date-fns';
import {DragScrollComponent} from 'ngx-drag-scroll';
import {FlagDirective} from '../../shared/directives/flag.directive';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cup-rankings-table',
  imports: [
    FormatPipeModule,
    DragScrollComponent,
    FlagDirective,
    RouterLink
  ],
  template: `
    <drag-scroll [style.cursor]="'move'">
      @if (rankings().length) {
        <table class="ui small striped fixed result table">
          <thead>
          <tr>
            <th style="width: 50px;"></th>
            <th style="width: 200px;"></th>
            @for (date of dates(); track date.id) {
              <th class="center aligned hill"
                  style="width: 60px; cursor: help; white-space: nowrap; text-overflow: ellipsis"
                  [title]="date.date | dfnsFormat: 'EEE dd MMM y HH:mm'">
                {{ date.date | dfnsFormat: 'dd MMM' }}
              </th>
            }
          </tr>
          </thead>
          <tbody>
            @for (ranking of rankings(); track ranking.jumperId) {
              <tr>
                <td>
                  @if ($first || ranking.rank > rankings()[$index - 1].rank) {
                    {{ ranking.rank }}.
                  }
                </td>
                <td>
                  <i [appFlag]="ranking.nation"></i>
                  @if (ranking.name) {
                    <a [routerLink]="['/jumpers', ranking.jumperId]">{{ ranking.name }}</a>
                  }
                </td>
                @for (date of dates(); track date.id) {
                  <td class="center aligned">
                    {{ ranking.tournamentRanks[date.tournamentId?.toString()] && ranking.tournamentRanks[date.tournamentId.toString()] + '.' || '-' }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      }
    </drag-scroll>

    @if (!rankings().length) {
      <p>There is no data available.</p>
    }
  `
})
export class CupRankingsTableComponent {
  rankings = input.required<CupRankingsResponseModel[]>();
  dates = input.required<CupDateResponseModel[]>();
}
