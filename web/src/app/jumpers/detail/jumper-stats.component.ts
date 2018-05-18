import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {JumperAllStatsResponseModel} from '../../shared/api-responses';
import {environment} from '../../../environments/environment';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-jumper-stats',
  template: `
    <div *ngIf="stats$ | async, let stats">
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
          <td class="right aligned">{{stats.total.participations}}</td>
          <td class="right aligned">{{stats.total.bestRank && stats.total.bestRank + '.' || '-'}}</td>
          <td class="right aligned">{{stats.total.avgRank && stats.total.avgRank + '.' || '-'}}</td>
          <td class="right aligned">{{stats.total.bestRating || '-'}}</td>
          <td class="right aligned">{{stats.total.worstRating || '-'}}</td>
          <td class="right aligned">{{stats.total.avgRating || '-'}}</td>
          <td class="right aligned">{{stats.total.bestPoints || '-'}}</td>
          <td class="right aligned">{{stats.total.avgPoints || '-'}}</td>
        </tr>
        </tbody>
      </table>
      <h4>Per type</h4>
      <app-jumper-stats-table [stats]="stats.perType"></app-jumper-stats-table>
    </div>
  `
})
export class JumperStatsComponent implements OnInit {
  stats$: Observable<JumperAllStatsResponseModel>;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.stats$ = this.route.parent.params
      .pipe(
        switchMap(params => this.httpClient
          .get<JumperAllStatsResponseModel>(`${environment.apiUrl}/jumpers/${params['id']}/stats`))
      );
  }
}
