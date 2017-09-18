import {AfterViewInit, Component, Input} from '@angular/core';
import {JumperAllStatsResponseModel, JumperStatsResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-jumper-stats-table',
  template: `
    <table class="ui sortable compact small stats table">
      <thead>
      <tr>
        <th class="three wide no-sort">Type</th>
        <th class="right aligned default-sort">Participations</th>
        <th class="right aligned">Best rank</th>
        <th class="right aligned">Average rank</th>
        <th class="right aligned">Highest seen rating</th>
        <th class="right aligned">Lowest seen rating</th>
        <th class="right aligned">Average rating</th>
        <th class="right aligned">Highest points</th>
        <th class="right aligned">Average points</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let typeStats of stats">
        <td>
          <span class="ui dsj{{typeStats.gameVersion}} tiny label">DSJ{{typeStats.gameVersion}}</span>
          {{typeStats.type}}
        </td>
        <td class="right aligned">{{typeStats.participations}}</td>
        <td class="right aligned">{{typeStats.bestRank && typeStats.bestRank + '.' || '-'}}</td>
        <td class="right aligned">{{typeStats.avgRank && typeStats.avgRank + '.' || '-'}}</td>
        <td class="right aligned">{{typeStats.bestRating || '-'}}</td>
        <td class="right aligned">{{typeStats.worstRating || '-'}}</td>
        <td class="right aligned">{{typeStats.avgRating || '-'}}</td>
        <td class="right aligned">{{typeStats.bestPoints || '-'}}</td>
        <td class="right aligned">{{typeStats.avgPoints || '-'}}</td>
      </tr>      
      </tbody>
    </table>
  `
})
export class JumperStatsTableComponent implements AfterViewInit {
  @Input() stats: JumperStatsResponseModel[];

  ngAfterViewInit() {
    (<any>$('.stats.table')).tablesort({
      compare: (a, b) => {
        const aNumber = +a;
        const bNumber = +b;

        if (aNumber < bNumber) {
          return -1;		// `a` is less than `b` by some ordering criterion
        }
        if (aNumber > bNumber) {
          return 1;			// `a` is greater than `b` by the ordering criterion
        }

        return 0;
      }
    })
    .data('tablesort')
    .sort($('th.default-sort'), 'desc');
  }
}
