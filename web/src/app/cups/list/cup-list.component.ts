import {Component, input} from '@angular/core';
import {CupResponseModel} from '../../shared/api-responses';
import {RouterLink} from '@angular/router';
import {RankMethodPipe} from '../../shared/pipes/rank-method.pipe';
import {FormatPipeModule} from 'ngx-date-fns';

@Component({
  selector: 'app-cup-list',
  imports: [
    RouterLink,
    RankMethodPipe,
    FormatPipeModule
  ],
  template: `
    <table class="ui condensed table">
      <thead>
      <tr>
        <th>Name</th>
        <th>Rank method</th>
        <th>Starts</th>
        <th>Ends</th>
        <th class="right aligned">Completed</th>
      </tr>
      </thead>
      <tbody>
        @for (cup of cups(); track cup.id) {
          <tr>
            <td>
              <span class="ui label dsj{{cup.gameVersion}}">DSJ{{ cup.gameVersion }}</span>
              <a [routerLink]="['/cups', cup.id]">{{ cup.name }}</a>
            </td>
            <td>
              {{ cup.rankMethod | rankMethod }}
            </td>
            <td>
              {{ cup.startDate | dfnsFormat: 'dd MMM y' }}
            </td>
            <td>
              {{ cup.endDate | dfnsFormat: 'dd MMM y' }}
            </td>
            <td class="right aligned">
              {{ cup.completedCount }} / {{ cup.tournamentCount }}
            </td>
          </tr>
        }

      </tbody>
    </table>
  `
})
export class CupListComponent {
  cups = input.required<CupResponseModel[]>();
}
