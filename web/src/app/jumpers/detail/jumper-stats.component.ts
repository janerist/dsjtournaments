import {Component, input} from '@angular/core';
import { httpResource} from '@angular/common/http';
import {JumperAllStatsResponseModel} from '../../shared/api-responses';
import {JumperStatsTableComponent} from './jumper-stats-table.component';

@Component({
  selector: 'app-jumper-stats',
  imports: [
    JumperStatsTableComponent
  ],
  template: `
    @if (stats.value(); as stats) {
      <h4>Total</h4>
      <table class="ui compact small table">
        <thead>
        <tr>
          <th class="right aligned">Participations</th>
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
        <tr>
          <td class="right aligned">{{ stats.total.participations }}</td>
          <td class="right aligned">{{ stats.total.bestRank && stats.total.bestRank + '.' || '-' }}</td>
          <td class="right aligned">{{ stats.total.avgRank && stats.total.avgRank + '.' || '-' }}</td>
          <td class="right aligned">{{ stats.total.bestRating || '-' }}</td>
          <td class="right aligned">{{ stats.total.worstRating || '-' }}</td>
          <td class="right aligned">{{ stats.total.avgRating || '-' }}</td>
          <td class="right aligned">{{ stats.total.bestPoints || '-' }}</td>
          <td class="right aligned">{{ stats.total.avgPoints || '-' }}</td>
        </tr>
        </tbody>
      </table>
      <h4>Per type</h4>
      <app-jumper-stats-table [stats]="stats.perType"></app-jumper-stats-table>
    }
  `
})
export class JumperStatsComponent {
  id = input<number>();
  stats = httpResource<JumperAllStatsResponseModel>(() => `/jumpers/${this.id()}/stats`);
}
