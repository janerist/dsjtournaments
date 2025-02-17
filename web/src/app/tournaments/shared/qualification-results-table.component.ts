import {Component, input, OnChanges} from '@angular/core';
import {QualificationResultResponseModel} from '../../shared/api-responses';
import {RouterLink} from '@angular/router';
import {FlagDirective} from '../../shared/directives/flag.directive';

@Component({
  selector: 'app-qualification-results-table',
  imports: [
    RouterLink,
    FlagDirective
  ],
  template: `
    @if (results().length) {
      <table class="ui striped result table">
        <thead>
        <tr>
          <th class="one wide" title="Rank">Rank</th>
          <th class="one wide" title="Bib">Bib</th>
          <th class="five wide" title="Name">Name</th>
          <th class="two wide" title="Nation">Nation</th>
          <th class="one wide right aligned" title="Rating">Rating</th>
          <th class="two wide right aligned" title="Length">Length</th>
          <th class="two wide right aligned" title="Points">Points</th>
          @if (isTeamQual) {
            <th class="two wide" title="Team">Team</th>
          } @else {
            <th class="one wide right aligned" title="Qualified?">Q</th>
          }
        </tr>
        </thead>
        <tbody>
          @for (qr of results(); track qr.id) {
            <tr>
              <td>
                @if ($first || qr.rank > results()[$index - 1].rank) {
                  {{ qr.rank }}.
                }
              </td>
              <td>{{ qr.bib || 'N/A' }}</td>
              <td>
                @if (qr.jumperName) {
                  <a [routerLink]="['/jumpers', qr.jumperId]">
                    {{ qr.jumperName }}
                  </a>
                }
              </td>
              <td>
                @if (qr.jumperNation) {
                  <i [appFlag]="qr.jumperNation"></i>{{ qr.jumperNation }}
                }
              </td>
              <td class="right aligned">{{ qr.rating }}</td>
              <td class="right aligned" [class.longest-jump]="qr.length === longestJump">
                @if (qr.length) {
                  @if (qr.crashed){*}{{ qr.length.toFixed(2) }}m
                }
              </td>
              <td class="right aligned">{{ qr.points?.toFixed(1) }}</td>
              @if (isTeamQual) {
                <td>
                  {{ qr.teamNation }} {{ qr.teamRank }}
                </td>
              } @else {
                <td class="right aligned">
                  @if (qr.qualified && !qr.prequalified) {
                    @if (qr.crashed){*}q
                  }
                  @if (qr.prequalified){Q}
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    } @else {
      <p>There is no data available.</p>
    }
  `
})
export class QualificationResultsTableComponent implements OnChanges {
  results = input.required<QualificationResultResponseModel[]>();
  isTeamQual?: boolean;
  longestJump?: number;

  ngOnChanges() {
    this.isTeamQual = this.results().length > 0 && !!this.results()[0].teamId;
    this.longestJump = this.results().reduce((max, r) => Math.max(max, r.length || 0), 0);
  }
}
