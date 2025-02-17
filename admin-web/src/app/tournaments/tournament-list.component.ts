import {Component, inject, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {TournamentResponseModel} from './tournament-models';
import {TournamentService} from './tournament.service';
import {ActivatedRoute, convertToParamMap, ParamMap, RouterLink} from '@angular/router';
import {ToastService} from '../common/services/toast.service';
import {merge} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {PagerComponent} from '../common/components/pager.component';
import {AsyncPipe} from '@angular/common';
import {FormatPipeModule} from 'ngx-date-fns';

@Component({
  selector: 'dsjt-tournament-list',
  imports: [
    PagerComponent,
    RouterLink,
    AsyncPipe,
    FormatPipeModule
  ],
  template: `
    <div class="row">
      <div class="col-4 ml-auto">
        <div class="float-right">
          @if (totalCount > 0) {
            <dsjt-pager [page]="page"
                        [pageSize]="pageSize"
                        [totalCount]="totalCount"
                        [getQueryParams]="createGetQueryParams()">
            </dsjt-pager>
          }
        </div>
      </div>
    </div>

    <table class="table table-sm">
      @if (totalCount > 0) {
        <thead class="thead-default">
        <tr>
          <th>
            <a routerLink="./"
               [queryParams]="assignQueryParams({sortBy: 'type', sortOrder: sortOrder*-1})">
              Type
            </a>
          </th>
          <th>
            <a routerLink="./"
               [queryParams]="assignQueryParams({sortBy: 'date', sortOrder: sortOrder*-1})">
              Date
            </a>
          </th>
          <th>
            <a routerLink="./"
               [queryParams]="assignQueryParams({sortBy: 'hillCount', sortOrder: sortOrder*-1})">
              Hill count
            </a>
          </th>
          <th>
            <a routerLink="./"
               [queryParams]="assignQueryParams({sortBy: 'participants', sortOrder: sortOrder*-1})">
              Participants
            </a>
          </th>
          <th></th>
        </tr>
        </thead>
      }
      <tbody>
      @for (tournament of tournaments$ | async; track tournament.id) {
        <tr>
          <td>
            <span class="badge badge-secondary badge-dsj{{tournament.gameVersion}} me-1">DSJ{{ tournament.gameVersion }}</span>
            <a href="http://dsjtournaments.com/tournaments/{{tournament.id}}" target="_blank">{{ tournament.type }}</a>
          </td>
          <td>{{ tournament.date | dfnsFormat: 'MMM do, y' }}</td>
          <td>{{ tournament.hillCount || '?' }}</td>
          <td>{{ tournament.participantCount || '?' }}</td>
          <td class="text-end">
            <button type="button" class="btn btn-sm btn-outline-danger" (click)="deleteTournament(tournament)">Delete</button>
          </td>
        </tr>
      }
      </tbody>
    </table>
  `
})
export class TournamentListComponent implements OnInit {
  private tournamentService = inject(TournamentService);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  paramsSource = new Subject<ParamMap>();
  tournaments$: Observable<TournamentResponseModel[]>;

  q: string;

  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: number;

  totalCount: number;

  ngOnInit() {
    this.tournaments$ = merge(this.route.queryParamMap, this.paramsSource.asObservable())
      .pipe(
        switchMap(params => {
          this.page = +params.get('page') || 1;
          this.pageSize = +params.get('pageSize') || 20;
          this.sortBy = params.get('sortBy') || 'date';
          this.sortOrder = +params.get('sortOrder') || -1;

          return this.tournamentService
            .getTournaments(this.page, this.pageSize, `${this.sortBy}${this.sortOrder === 1 ? 'asc' : 'desc'}`)
            .pipe(
              tap(m => this.totalCount = m.totalCount),
              map(m => m.data)
            );
        })
      );
  }

  assignQueryParams(source: any) {
    return Object.assign({
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    }, source);
  }

  createGetQueryParams() {
    return (page: number) => this.assignQueryParams({page});
  }

  deleteTournament(tournament: TournamentResponseModel) {
    if (confirm('Do you want to delete this tournament? This operation cannot be undone.')) {
      this.tournamentService
        .deleteTournament(tournament.id)
        .subscribe({
          complete: () => {
            this.toastService.success('Tournament was deleted');
            this.paramsSource.next(convertToParamMap(this.assignQueryParams({})));
          },
          error: () => {
            alert('Failed to delete tournament, try again later.');
          }
        });
    }
  }
}
