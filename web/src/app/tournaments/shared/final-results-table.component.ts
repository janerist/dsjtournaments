import {Component, input, OnChanges} from '@angular/core';
import {FinalResultResponseModel} from '../../shared/api-responses';
import {RouterLink} from '@angular/router';
import {FlagDirective} from '../../shared/directives/flag.directive';

@Component({
  selector: 'app-final-results-table',
  imports: [
    RouterLink,
    FlagDirective
  ],
  template: `
    @if (results().length) {
      <table class="ui striped result table">
        <thead>
        <tr>
          <th class="one wide" title="Team rank">Rank</th>
          @if (!isTeamResults) {
            <th class="one wide" title="Bib">Bib</th>
          }
          <th class="five wide" title="Name">Name</th>
          <th class="two wide" title="Nation">Nation</th>
          <th class="one wide right aligned" title="Rating">Rating</th>
          <th class="two wide right aligned" title="Length 1st jump">1st jump</th>
          <th class="two wide right aligned" title="Length 2nd jump">2nd jump</th>
          <th class="two wide right aligned" title="Points">Points</th>
          @if (isTeamResults) {
            <th class="one wide" title="Jumper rank"></th>
          }
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
              @if (!isTeamResults) {
                <td>
                  {{ fr.bib || 'N/A' }}@if (fr.luckyLoser) {
                  *
                }
                </td>
              }
              <td>
                @if (fr.jumperName) {
                  <a [routerLink]="['/jumpers', fr.jumperId]">
                    {{ fr.jumperName }}
                  </a>
                }
                @if (fr.teamNation) {
                  {{ fr.teamNation }} {{ fr.teamRank }}
                }
              </td>
              <td>
                @if (fr.jumperNation) {
                  <i [appFlag]="fr.jumperNation"></i>{{ fr.jumperNation }}
                }
                @if (fr.teamNation) {
                  <i [appFlag]="fr.teamNation"></i>{{ fr.teamNation }}
                }
              </td>
              <td class="right aligned">{{ fr.rating }}</td>
              <td class="right aligned" [class.longest-jump]="fr.length1 === longestJump1">
                @if (fr.length1) {
                  @if (fr.crashed1){*}{{ fr.length1.toFixed(2) }}m
                }
              </td>
              <td class="right aligned" [class.longest-jump]="fr.length2 === longestJump2">
                @if (fr.length2) {
                  @if (fr.crashed2){*}{{ fr.length2.toFixed(2) }}m
                }
              </td>
              <td class="right aligned">{{ fr.points?.toFixed(1) }}</td>
              @if (isTeamResults) {
                <td></td>
              }
            </tr>
            @for (jfr of fr.teamJumpers; track jfr.jumperId) {
              <tr>
                <td></td>
                <td>
                  <a [routerLink]="['/jumpers', jfr.jumperId]">
                    {{ jfr.jumperName }}
                  </a>
                </td>
                <td>
                  <i [appFlag]="jfr.jumperNation"></i>{{ jfr.jumperNation }}
                </td>
                <td class="right aligned">{{ jfr.rating }}</td>
                <td class="right aligned" [class.longest-jump]="jfr.length1 === longestJump1">
                  @if (jfr.length1) {
                    @if (jfr.crashed1){*}{{ jfr.length1.toFixed(2) }}m
                  }
                </td>
                <td class="right aligned" [class.longest-jump]="jfr.length2 === longestJump2">
                  @if (jfr.length2) {
                    @if (jfr.crashed2){*}{{ jfr.length2.toFixed(2) }}m
                  }
                </td>
                <td class="right aligned">{{ jfr.points?.toFixed(1) }}</td>
                <td>({{ jfr.rank }}.)</td>
              </tr>
            }
          }
        </tbody>
      </table>
    } @else {
      <p>There is no data available.</p>
    }
  `
})
export class FinalResultsTableComponent implements OnChanges {
  results = input.required<FinalResultResponseModel[]>();
  longestJump1?: number;
  longestJump2?: number;
  isTeamResults?: boolean;

  ngOnChanges() {
    this.isTeamResults = this.results().length > 0 && this.results()[0].teamId !== undefined;
    this.longestJump1 = this.getLongestJump(this.results(), r => r.length1);
    this.longestJump2 = this.getLongestJump(this.results(), r => r.length2);
  }

  private getLongestJump(results: FinalResultResponseModel[], propSelector: (r: FinalResultResponseModel) => number | undefined): number {
    return results.reduce((max, r) =>
      Math.max(max, r.teamJumpers ? this.getLongestJump(r.teamJumpers, propSelector) : propSelector(r) || 0), 0);
  }
}
