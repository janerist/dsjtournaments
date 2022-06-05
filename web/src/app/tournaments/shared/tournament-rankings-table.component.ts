import {AfterViewInit, Component, Input} from '@angular/core';
import {CompetitionResponseModel, TournamentRankingsResponseModel} from '../../shared/api-responses';
import {iso3toiso2} from '../../shared/country-codes';

@Component({
  selector: 'app-tournament-rankings-table',
  template: `
    <drag-scroll [style.cursor]="'move'">
      <table *ngIf="rankings.length" class="ui small striped fixed result table">
        <thead>
        <tr>
          <th style="width: 50px;"></th>
          <th style="width: 200px;"></th>
          <th *ngFor="let comp of competitions"
              class="center aligned hill"
              style="width: 50px; cursor: help; white-space: nowrap; text-overflow: ellipsis"
              [attr.data-html]="getPopupContent(comp)">
            <i [appFlag]="comp.hillNation"></i><br/>
            <a [routerLink]="['../competitions', comp.id]">{{comp.hillName}}</a>
            <span *ngIf="comp.fileNumber > 1">[{{comp.fileNumber}}]</span>
            <span *ngIf="comp.ko">(KO)</span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let fr of rankings, let i = index">
          <td>
            <span *ngIf="fr.rank > rankings[i - 1]?.rank">{{fr.rank}}.</span>
          </td>
          <td>
            <i [appFlag]="fr.jumperNation || fr.teamNation"></i>
            <a *ngIf="fr.jumperName" [routerLink]="['/jumpers', fr.jumperId]">{{fr.jumperName}}</a>
            <span *ngIf="fr.teamNation">{{fr.teamNation + ' ' + fr.teamRank}}</span>
          </td>
          <td *ngFor="let comp of competitions" class="center aligned">
            {{fr.competitionRanks && fr.competitionRanks[comp.id.toString()] ? fr.competitionRanks[comp.id.toString()] + '.' : '-'}}
          </td>
        </tr>
        </tbody>

      </table>
    </drag-scroll>
    <p *ngIf="!rankings.length">There is no data available.</p>
  `
})
export class TournamentRankingsTableComponent implements AfterViewInit {
  @Input() competitions!: CompetitionResponseModel[];
  @Input() rankings!: TournamentRankingsResponseModel[];

  getPopupContent(comp: CompetitionResponseModel) {
    return `
      <i class="flag ${iso3toiso2[comp.hillNation]}"></i>
      ${comp.hillName} ${comp.fileNumber > 1 ? '[' + comp.fileNumber + ']' : ''}
      ${comp.ko ? '(KO)' : ''}
    `;
  }

  ngAfterViewInit() {
   $('th.hill').popup({
      position: 'bottom center',
      delay: {
        show: 0,
        hide: 0
      }
    });
  }
}
