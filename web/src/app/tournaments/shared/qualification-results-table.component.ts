import {Component, Input, OnChanges} from '@angular/core';
import {QualificationResultResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-qualification-results-table',
  template: `
    <table *ngIf="results.length" class="ui striped result table">
      <thead>
      <tr>
        <th class="one wide" title="Rank">Rank</th>
        <th class="one wide" title="Bib">Bib</th>
        <th class="five wide" title="Name">Name</th>
        <th class="two wide" title="Nation">Nation</th>
        <th class="one wide right aligned" title="Rating">Rating</th>
        <th class="two wide right aligned" title="Length">Length</th>
        <th class="two wide right aligned" title="Points">Points</th>
        <th *ngIf="!isTeamQual" class="one wide right aligned" title="Qualified?">Q</th>
        <th *ngIf="isTeamQual" class="two wide" title="Team">Team</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let qr of results, let i = index">
        <td>
          <span *ngIf="qr.rank > results[i - 1]?.rank">{{qr.rank}}.</span>
        </td>
        <td>{{qr.bib || 'N/A'}}</td>
        <td>
          <a *ngIf="qr.jumperName" [routerLink]="['/jumpers', qr.jumperId]">
            {{qr.jumperName}}
          </a>
        </td>
        <td>
          <i *ngIf="qr.jumperNation" [appFlag]="qr.jumperNation"></i>{{qr.jumperNation}}
        </td>
        <td class="right aligned">{{qr.rating}}</td>
        <td class="right aligned" [class.longest-jump]="qr.length === longestJump">
          <span *ngIf="qr.length">
            <span *ngIf="qr.crashed">*</span>{{qr.length.toFixed(2)}}m
          </span>
        </td>
        <td class="right aligned">{{qr.points?.toFixed(1)}}</td>
        <td *ngIf="!isTeamQual" class="right aligned">
          <span *ngIf="qr.qualified && !qr.prequalified">
            <span *ngIf="qr.crashed">*</span>q
          </span>
          <span *ngIf="qr.prequalified">Q</span>
        </td>
        <td *ngIf="isTeamQual">
          {{qr.teamNation}} {{qr.teamRank}}
        </td>
      </tr>
      </tbody>
    </table>

    <p *ngIf="!results.length">There is no data available.</p>
  `
})
export class QualificationResultsTableComponent implements OnChanges {
  @Input() results: QualificationResultResponseModel[];
  isTeamQual: boolean;
  longestJump: number;

  ngOnChanges() {
    this.isTeamQual = this.results.length && !!this.results[0].teamId;
    this.longestJump = this.results.reduce((max, r) => Math.max(max, r.length || 0), 0);
  }
}
