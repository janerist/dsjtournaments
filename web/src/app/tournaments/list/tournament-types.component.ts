import {Component, Input, OnInit} from '@angular/core';
import {TournamentTypeWithCount} from '../../shared/api-responses';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/share';

@Component({
  selector: 'app-tournament-types',
  template: `
    <h4>Type:</h4>
    <ul class="ui list">
      <li>
        <a routerLink="./" [queryParams]="{page: 1, type: ''}" queryParamsHandling="merge">
          All ({{totalCount | async}})
        </a>
      </li>
      <li>DSJ4
        <ul>
          <li *ngFor="let type of dsj4Types | async">
            <a routerLink="./" [queryParams]="{page: 1, type: type.id}" queryParamsHandling="merge">
              {{type.name}} ({{type.count}})
            </a>
          </li>
        </ul>
      </li>
      <li>DSJ3
        <ul>
          <li *ngFor="let type of dsj3Types | async">
            <a routerLink="./" [queryParams]="{page: 1, type: type.id}" queryParamsHandling="merge">
              {{type.name}} ({{type.count}})
            </a>
          </li>
        </ul>
      </li>
    </ul>
  `
})
export class TournamentTypesComponent implements OnInit {
  @Input() types: Observable<TournamentTypeWithCount[]>;

  dsj3Types: Observable<TournamentTypeWithCount[]>;
  dsj4Types: Observable<TournamentTypeWithCount[]>;
  totalCount: Observable<number>;

  ngOnInit() {
    const share = this.types.share();

    this.dsj3Types = share.map(types => types.filter(t => t.gameVersion === 3));
    this.dsj4Types = share.map(types => types.filter(t => t.gameVersion === 4));
    this.totalCount = share.map(types => types.reduce((sum, {count: count}) => sum + count, 0));
  }
}
