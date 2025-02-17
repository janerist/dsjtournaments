import {Component, inject, OnInit} from '@angular/core';
import {CupStandingResponseModel, PagedResponse} from '../../shared/api-responses';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {CupStandingsTableTextComponent} from './cup-standings-table-text.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-cup-standings-text',
  imports: [
    CupStandingsTableTextComponent,
    AsyncPipe
  ],
  template: `
    @if (standings$ | async; as standings) {
      <app-cup-standings-table-text [standings]="standings"></app-cup-standings-table-text>
    }
  `
})
export class CupStandingsTextComponent {
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  standings$ = this.route.parent!.paramMap.pipe(
    switchMap(params =>
      this.httpClient.get<PagedResponse<CupStandingResponseModel>>(`${environment.apiUrl}/cups/${params.get('id')}/standings?pageSize=10000`)),
    map(pagedResponse => pagedResponse.data)
  );
}
