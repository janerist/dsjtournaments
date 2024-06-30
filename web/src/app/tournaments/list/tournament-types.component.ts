import {Component, Input, OnInit} from '@angular/core';
import {TournamentTypeWithCount} from '../../shared/api-responses';

@Component({
  selector: 'app-tournament-types',
  template: `
    <h4>Type:</h4>
    <ul class="ui list">
      <li>
        <a routerLink="./" [queryParams]="{page: 1, type: ''}" queryParamsHandling="merge">
          All ({{totalCount}})
        </a>
      </li>
      <li>DSJ4
        <ul>
          <li *ngFor="let type of dsj4Types">
            <a routerLink="./" [queryParams]="{page: 1, type: type.id}" queryParamsHandling="merge">
              {{type.name}} ({{type.count}})
            </a>
          </li>
          <li *ngIf="dsj4AnniversaryTypes">
            <a routerLink="./" [queryParams]="{page: 1, type: dsj4AnniversaryTypes.typeIds}" queryParamsHandling="merge">
              Anniversary tournaments ({{dsj4AnniversaryTypes.count}})
            </a>
          </li>
        </ul>

      </li>
      <li>DSJ3
        <ul>
          <li *ngFor="let type of dsj3Types">
            <a routerLink="./" [queryParams]="{page: 1, type: type.id}" queryParamsHandling="merge">
              {{type.name}} ({{type.count}})
            </a>
          </li>
          <li *ngIf="dsj3AnniversaryTypes">
            <a routerLink="./" [queryParams]="{page: 1, type: dsj3AnniversaryTypes.typeIds}" queryParamsHandling="merge">
              Anniversary tournaments ({{dsj3AnniversaryTypes.count}})
            </a>
          </li>
        </ul>
      </li>
    </ul>
  `
})
export class TournamentTypesComponent implements OnInit {
  @Input() types!: TournamentTypeWithCount[];

  dsj3Types?: TournamentTypeWithCount[];
  dsj3AnniversaryTypes?: {typeIds: number[], count: number}
  dsj4Types?: TournamentTypeWithCount[];
  dsj4AnniversaryTypes?: {typeIds: number[], count: number}
  totalCount?: number;

  ngOnInit() {
    this.dsj3Types = this.types
      .filter(t => t.gameVersion === 3 && !t.name.includes('Anniversary'));

    this.dsj3AnniversaryTypes = this.types
      .filter(t => t.gameVersion === 3 && t.name.includes('Anniversary'))
      .reduce((acc: {typeIds: number[], count: number}, t: TournamentTypeWithCount) => {
        acc.typeIds.push(t.id);
        acc.count += t.count;
        return acc;
      }, {typeIds: [], count: 0});

    this.dsj4Types = this.types
      .filter(t => t.gameVersion === 4 && !t.name.includes('Anniversary'));

    this.dsj4AnniversaryTypes = this.types
        .filter(t => t.gameVersion === 4 && t.name.includes('Anniversary'))
      .reduce((acc: {typeIds: number[], count: number}, t: TournamentTypeWithCount) => {
        acc.typeIds.push(t.id);
        acc.count += t.count;
        return acc;
      }, {typeIds: [], count: 0});

    this.totalCount = this.types.reduce((sum, {count: count}) => sum + count, 0);
  }
}
