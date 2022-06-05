import {Component, Input} from '@angular/core';
import {FinalStandingResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-final-standings-table',
  template: `
    <table *ngIf="results.length" class="ui striped result table">
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
      <tr *ngFor="let fr of results, let i = index">
        <td>
          <span *ngIf="fr.rank > results[i - 1]?.rank">{{fr.rank}}.</span>
        </td>
        <td>
          <a *ngIf="fr.jumperName" [routerLink]="['/jumpers', fr.jumperId]">
            {{fr.jumperName}}
          </a>
          <span *ngIf="fr.teamNation">
                  {{fr.teamNation + ' ' + fr.teamRank}}
                </span>
        </td>
        <td>
          <i [appFlag]="fr.jumperNation || fr.teamNation"></i>{{fr.jumperNation || fr.teamNation}}
        </td>
        <td class="right aligned">{{fr.rating || 'N/A'}}</td>
        <td class="right aligned">{{fr.i || '-'}}</td>
        <td class="right aligned">{{fr.ii || '-'}}</td>
        <td class="right aligned">{{fr.iii || '-'}}</td>
        <td class="right aligned">{{fr.n || 'N/A'}}</td>
        <td class="right aligned">{{fr.points}}</td>
        <td class="right aligned">{{fr.avg?.toFixed(2) || 'N/A'}}</td>
      </tr>
      </tbody>
    </table>

    <p *ngIf="!results.length">There is no data available.</p>
  `
})
export class FinalStandingsTableComponent {
  @Input() results!: FinalStandingResponseModel[];
}
