import {Component, input, Input} from '@angular/core';
import {FinalStandingResponseModel} from '../../shared/api-responses';
import {FlagDirective} from '../../shared/directives/flag.directive';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-final-standings-table',
  template: `
    @if (results().length) {
      <table class="ui striped result table">
        <thead>
        <tr>
          <th title="Rank">Rank</th>
          <th class="five wide" title="Name">Name</th>
          <th class="two wide" title="Nation">Nation</th>
          <th class="one wide right aligned" title="Rating">Rating</th>
          <th class="one wide right aligned" title="Number of podiums (1st place)">I</th>
          <th class="one wide right aligned" title="Number of podiums (2nd place)">II</th>
          <th class="one wide right aligned" title="Number of podiums (3rd place)">III</th>
          <th class="one wide right aligned" title="Number of hills jumped">N</th>
          <th class="one wide right aligned" title="Points">Points</th>
          <th class="two wide right aligned" title="Average points per hill (Points/N)">Avg</th>
        </tr>
        </thead>
        <tbody>
          @for (fr of results(); track fr.id) {
            <tr>
              <td>
                @if ($first || fr.rank > results()[$index - 1].rank) {
                  {{ fr.rank }}.
                }
              </td>
              <td>
                @if (fr.jumperId) {
                  <a [routerLink]="['/jumpers', fr.jumperId]">
                    {{ fr.jumperName }}
                  </a>
                } @else {
                  {{ fr.teamNation + ' ' + fr.teamRank }}
                }
              </td>
              <td>
                <i [appFlag]="(fr.jumperNation ?? fr.teamNation)!"></i>{{ fr.jumperNation ?? fr.teamNation }}
              </td>
              <td class="right aligned">{{ fr.rating ?? 'N/A' }}</td>
              <td class="right aligned">{{ fr.i || '-' }}</td>
              <td class="right aligned">{{ fr.ii || '-' }}</td>
              <td class="right aligned">{{ fr.iii || '-' }}</td>
              <td class="right aligned">{{ fr.n ?? 'N/A' }}</td>
              <td class="right aligned">{{ fr.points }}</td>
              <td class="right aligned">{{ fr.avg?.toFixed(2) ?? 'N/A' }}</td>
            </tr>
          }
        </tbody>
      </table>
    } @else {
      <p>There is no data available.</p>
    }
  `,
  imports: [
    FlagDirective,
    RouterLink
  ]
})
export class FinalStandingsTableComponent {
  results = input.required<FinalStandingResponseModel[]>();
}
