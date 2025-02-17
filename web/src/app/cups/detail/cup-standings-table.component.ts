import {Component, input, Input} from '@angular/core';
import {CupStandingResponseModel} from '../../shared/api-responses';
import {RouterLink} from '@angular/router';
import {FlagDirective} from '../../shared/directives/flag.directive';

@Component({
  selector: 'app-cup-standings-table',
  imports: [
    RouterLink,
    FlagDirective
  ],
  template: `
    <table class="ui small striped result table">
      <thead>
      <tr>
        <th title="Rank">Rank</th>
        <th class="four wide" title="Name">Name</th>
        <th title="Nation">Nation</th>
        <th class="right aligned" title="Number of tournaments participated">Num</th>
        <th class="right aligned" title="Top rank in single tournament">TR</th>
        <th class="right aligned" title="Top points in single tournament">TP</th>
        <th class="one wide right aligned" title="Number of podiums (1st place)">I</th>
        <th class="one wide right aligned" title="Number of podiums (2nd place)">II</th>
        <th class="one wide right aligned" title="Number of podiums (3rd place)">III</th>
        <th class="right aligned" title="Number of hills jumped">Hills</th>
        <th class="right aligned" title="Total jump points">Total JP</th>
        <th class="right aligned" title="Total cup points">Total CP</th>
      </tr>
      </thead>
      <tbody>
        @for (standing of standings(); track standing.jumperId) {
          <tr>
            <td>
              @if ($first || standing.rank > standings()[$index - 1].rank) {
                {{ standing.rank }}.
              }
            <td>
              <a [routerLink]="['/jumpers', standing.jumperId]">{{ standing.name }}</a>
            </td>
            <td>
              <i [appFlag]="standing.nation"></i>{{ standing.nation }}
            </td>
            <td class="right aligned">
              {{ standing.participations }}/{{ standing.totalTournaments }}
            </td>
            <td class="right aligned">
              {{ standing.topRank }}
            </td>
            <td class="right aligned">
              {{ standing.topPoints }}
            </td>
            <td class="right aligned">
              {{ standing.i || '-' }}
            </td>
            <td class="right aligned">
              {{ standing.ii || '-' }}
            </td>
            <td class="right aligned">
              {{ standing.iii || '-' }}
            </td>
            <td class="right aligned">
              {{ standing.completedHills }}/{{ standing.totalHills }}
            </td>
            <td class="right aligned" [style.font-weight]="rankMethod() === 'jump_points' ? 'bold' : ''">
              {{ standing.jumpPoints }}
            </td>
            <td class="right aligned" [style.font-weight]="rankMethod() === 'cup_points' ? 'bold' : ''">
              {{ standing.cupPoints }}
            </td>
          </tr>
        }

      </tbody>
    </table>
  `
})
export class CupStandingsTableComponent {
  standings = input.required<CupStandingResponseModel[]>();
  rankMethod = input.required<string>();
}
