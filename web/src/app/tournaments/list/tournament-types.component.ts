import {Component, Input, OnInit} from '@angular/core';
import {TournamentTypeWithCount} from '../../shared/api-responses';
import {Observable} from 'rxjs';
import {map, share} from 'rxjs/operators';

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
  @Input() types!: Observable<TournamentTypeWithCount[]>;

  dsj3Types?: Observable<TournamentTypeWithCount[]>;
  dsj4Types?: Observable<TournamentTypeWithCount[]>;
  totalCount?: Observable<number>;

  ngOnInit() {
    const shared = this.types.pipe(share());

    this.dsj3Types = shared.pipe(map(types => types.filter(t => t.gameVersion === 3)));
    this.dsj4Types = shared.pipe(map(types => types.filter(t => t.gameVersion === 4)));
    this.totalCount = shared.pipe(map(types => types.reduce((sum, {count: count}) => sum + count, 0)));
  }
}
