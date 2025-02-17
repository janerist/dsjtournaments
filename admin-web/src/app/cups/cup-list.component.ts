import {Component, inject} from '@angular/core';
import {CupService} from './cup.service';
import {map} from 'rxjs/operators';
import {RankMethodPipe} from '../common/pipes/rank-method.pipe';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FormatPipeModule} from 'ngx-date-fns';

@Component({
  imports: [
    RankMethodPipe,
    AsyncPipe,
    RouterLink,
    FormatPipeModule
  ],
  template: `
    <div>
      <p class="text-end">
        <i class="fa fa-plus"></i> <a class="ms-1" routerLink="create">New cup</a>
      </p>
    </div>

    @if (cups$ | async; as cups) {
      <table class="table table-sm">
        <thead>
          <th>Name</th>
          <th class="text-end">Rank method</th>
          <th class="text-end">Starts</th>
          <th class="text-end">Ends</th>
        </thead>
        <tbody>
        @for (cup of cups; track cup.id) {
          <tr>
            <td>
              <span class="badge badge-dsj{{cup.gameVersion}} me-1">DSJ{{ cup.gameVersion }}</span>
              <a [routerLink]="[cup.id]">{{ cup.name }}</a>&nbsp;
              <span class="badge text-bg-secondary">{{ cup.tournamentCount }}</span>
            </td>
            <td class="text-end">
              {{ cup.rankMethod | dsjtRankMethod }}
            </td>
            <td class="text-end">
              {{ cup.startDate | dfnsFormat: 'MMM do, y' }}
            </td>
            <td class="text-end">
              {{ cup.endDate | dfnsFormat: 'MMM do, y' }}
            </td>
          </tr>
        }
        </tbody>
      </table>
    }
  `
})
export class CupListComponent {
  private cupService = inject(CupService);
  cups$ = this.cupService.getCups().pipe(map(pagedResponse => pagedResponse.data));
}
