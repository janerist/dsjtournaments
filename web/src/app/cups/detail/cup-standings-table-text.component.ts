import {Component, Input} from '@angular/core';
import {CupStandingResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-cup-standings-table-text',
  template: `
    <div *ngIf="standings.length" class="result table" style="font-size: 85%">
      <span [innerHtml]="cell(6,  'left',  'Rank')"></span>
      <span [innerHtml]="cell(25, 'left',  'Name')"></span>
      <span [innerHtml]="cell(6,  'left',  'Nation')"></span>
      <span [innerHtml]="cell(7,  'right', 'Num')"></span>
      <span [innerHtml]="cell(8,  'right', 'TR')"></span>
      <span [innerHtml]="cell(8,  'right', 'TP')"></span>
      <span [innerHtml]="cell(6,  'right', 'I')"></span>
      <span [innerHtml]="cell(6,  'right', 'II')"></span>
      <span [innerHtml]="cell(6,  'right', 'III')"></span>
      <span [innerHtml]="cell(11, 'right', 'Hills')"></span>
      <span [innerHtml]="cell(11, 'right', 'Total JP')"></span>
      <span [innerHtml]="cell(11, 'right', 'Total CP')"></span>
      <br/>
      <ng-container *ngFor="let standing of standings, let i = index">
        <span [innerHtml]="cell(6, 'left', standing.rank > standings[i - 1]?.rank ? standing.rank + '.' : '')"></span>
        <span [innerHtml]="cell(25, 'left', standing.name)"></span>
        <span [innerHtml]="cell(6, 'left', standing.nation)"></span>
        <span [innerHtml]="cell(7, 'right', standing.participations + '/' + standing.totalTournaments)"></span>
        <span [innerHtml]="cell(8, 'right', standing.topRank.toString())"></span>
        <span [innerHtml]="cell(8, 'right', standing.topPoints.toString())"></span>
        <span [innerHtml]="cell(6, 'right', standing.i && standing.i.toString() || '-')"></span>
        <span [innerHtml]="cell(6, 'right', standing.ii && standing.ii?.toString() || '-')"></span>
        <span [innerHtml]="cell(6, 'right', standing.iii && standing.iii?.toString() || '-')"></span>
        <span [innerHtml]="cell(11, 'right', standing.completedHills + '/' + standing.totalHills)"></span>
        <span [innerHtml]="cell(11, 'right', standing.jumpPoints.toString())"></span>
        <span [innerHtml]="cell(11, 'right', standing.cupPoints.toString())"></span>
        <br/>
      </ng-container>
    </div>

    <p *ngIf="!standings.length">
      There is no data available.
    </p>
  `
})
export class CupStandingsTableTextComponent {
  @Input() standings: CupStandingResponseModel[];

  cell(width: number, align: 'left'|'center'|'right', content: string) {
    const numSpacesNeeded = width - content.length < 0 ? 0 : width - content.length;
    const truncatedContent = content.substr(0, width);

    switch (align) {
      case 'left':
        return truncatedContent + '&nbsp;'.repeat(numSpacesNeeded);
      case 'center':
        return '&nbsp;'.repeat(numSpacesNeeded / 2) + truncatedContent + '&nbsp;'.repeat(numSpacesNeeded / 2);
      case 'right':
        return '&nbsp;'.repeat(numSpacesNeeded) + truncatedContent;
    }
  }
}
