import {Component, Input, OnChanges} from '@angular/core';
import {FinalResultResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-final-results-table',
  template: `
    <table *ngIf="results.length" class="ui striped result table">
      <thead>
      <tr>
        <th class="one wide" title="Team rank">Rank</th>
        <th *ngIf="!isTeamResults" class="one wide" title="Bib">Bib</th>
        <th class="five wide" title="Name">Name</th>
        <th class="two wide" title="Nation">Nation</th>
        <th class="one wide right aligned" title="Rating">Rating</th>
        <th class="two wide right aligned" title="Length 1st jump">1st jump</th>
        <th class="two wide right aligned" title="Length 2nd jump">2nd jump</th>
        <th class="two wide right aligned" title="Points">Points</th>
        <th *ngIf="isTeamResults" class="one wide" title="Jumper rank"></th>
      </tr>
      </thead>
      <tbody>
      <ng-container *ngFor="let fr of results, let i = index">
        <tr>
          <td>
            <span *ngIf="fr.rank > results[i - 1]?.rank">{{fr.rank}}.</span>
          </td>
          <td *ngIf="!isTeamResults">
            {{fr.bib || 'N/A'}}<span *ngIf="fr.luckyLoser">*</span>
          </td>
          <td>
            <a *ngIf="fr.jumperName" [routerLink]="['/jumpers', fr.jumperId]">
              {{fr.jumperName}}
            </a>
            <span *ngIf="fr.teamNation">
                {{fr.teamNation}} {{fr.teamRank}}
              </span>
          </td>
          <td>
            <i *ngIf="fr.jumperNation" [appFlag]="fr.jumperNation"></i>{{fr.jumperNation}}
            <i *ngIf="fr.teamNation" [appFlag]="fr.teamNation"></i>{{fr.teamNation}}
          </td>
          <td class="right aligned">{{fr.rating}}</td>
          <td class="right aligned" [class.longest-jump]="fr.length1 === longestJump1">
              <span *ngIf="fr.length1">
                <span *ngIf="fr.crashed1">*</span>{{fr.length1.toFixed(2)}}m
              </span>
          </td>
          <td class="right aligned" [class.longest-jump]="fr.length2 === longestJump2">
              <span *ngIf="fr.length2">
                <span *ngIf="fr.crashed2">*</span>{{fr.length2.toFixed(2)}}m
              </span>
          </td>
          <td class="right aligned">{{fr.points?.toFixed(1)}}</td>
          <td *ngIf="isTeamResults"></td>
        </tr>
        <tr *ngFor="let jfr of fr.teamJumpers">
          <td></td>
          <td>
            <a [routerLink]="['/jumpers', jfr.jumperId]">
              {{jfr.jumperName}}
            </a>
          </td>
          <td>
            <i [appFlag]="jfr.jumperNation"></i>{{jfr.jumperNation}}
          </td>
          <td class="right aligned">{{jfr.rating}}</td>
          <td class="right aligned" [class.longest-jump]="jfr.length1 === longestJump1">
              <span *ngIf="jfr.length1">
                <span *ngIf="jfr.crashed1">*</span>{{jfr.length1.toFixed(2)}}m
              </span>
          </td>
          <td class="right aligned" [class.longest-jump]="jfr.length2 === longestJump2">
              <span *ngIf="jfr.length2">
                <span *ngIf="jfr.crashed2">*</span>{{jfr.length2.toFixed(2)}}m
              </span>
          </td>
          <td class="right aligned">{{jfr.points?.toFixed(1)}}</td>
          <td>({{jfr.rank}}.)</td>
        </tr>
      </ng-container>
      </tbody>
    </table>

    <p *ngIf="!results.length">There is no data available.</p>
  `
})
export class FinalResultsTableComponent implements OnChanges {
  @Input() results!: FinalResultResponseModel[];
  longestJump1?: number;
  longestJump2?: number;
  isTeamResults?: boolean;

  ngOnChanges() {
    this.isTeamResults = this.results.length > 0 && this.results[0].teamId !== undefined;
    this.longestJump1 = this.getLongestJump(this.results, r => r.length1);
    this.longestJump2 = this.getLongestJump(this.results, r => r.length2);
  }

  private getLongestJump(results: FinalResultResponseModel[], propSelector: (r: FinalResultResponseModel) => number | undefined): number {
    return results.reduce((max, r) =>
      Math.max(max, r.teamJumpers ? this.getLongestJump(r.teamJumpers, propSelector) : propSelector(r) || 0), 0);
  }
}
