import {AfterViewInit, Component, input} from '@angular/core';
import {CompetitionResponseModel, TournamentRankingsResponseModel} from '../../shared/api-responses';
import {iso3toiso2} from '../../shared/country-codes';
import {DragScrollComponent} from 'ngx-drag-scroll';
import {FlagDirective} from '../../shared/directives/flag.directive';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-tournament-rankings-table',
  imports: [
    DragScrollComponent,
    FlagDirective,
    RouterLink
  ],
  template: `
    <drag-scroll [style.cursor]="'move'">
      @if (rankings().length) {
        <table class="ui small striped fixed result table">
          <thead>
          <tr>
            <th style="width: 50px;"></th>
            <th style="width: 200px;"></th>
            @for (comp of competitions(); track comp.id) {
              <th class="center aligned hill"
                  style="width: 50px; cursor: help; white-space: nowrap; text-overflow: ellipsis"
                  [attr.data-html]="getPopupContent(comp)">
                <i [appFlag]="comp.hillNation"></i><br/>
                <a [routerLink]="['../competitions', comp.id]">{{ comp.hillName }}</a>
                @if (comp.fileNumber > 1) {
                  [{{ comp.fileNumber }}]
                }
                @if (comp.ko) {
                  (KO)
                }
              </th>
            }
          </tr>
          </thead>
          <tbody>
            @for (fr of rankings(); track fr.jumperId) {
              <tr>
                <td>
                  @if ($first || fr.rank > rankings()[$index - 1].rank) {
                    {{ fr.rank }}.
                  }
                </td>
                <td>
                  <i [appFlag]="fr.jumperNation || fr.teamNation"></i>
                  @if (fr.jumperName) {
                    <a [routerLink]="['/jumpers', fr.jumperId]">{{ fr.jumperName }}</a>
                  }
                  @if (fr.teamNation) {
                    {{ fr.teamNation + ' ' + fr.teamRank }}
                  }
                </td>
                @for (comp of competitions(); track comp.id) {
                  <td class="center aligned">
                    {{ fr.competitionRanks && fr.competitionRanks[comp.id.toString()] ? fr.competitionRanks[comp.id.toString()] + '.' : '-' }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <p>There is no data available.</p>
      }
    </drag-scroll>
  `
})
export class TournamentRankingsTableComponent implements AfterViewInit {
  competitions = input.required<CompetitionResponseModel[]>();
  rankings = input.required<TournamentRankingsResponseModel[]>();

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
