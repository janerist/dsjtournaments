import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {TournamentResponseModel} from './tournament-models';
import {TournamentService} from './tournament.service';
import {ActivatedRoute, Params} from '@angular/router';
import {ToastService} from '../common/services/toast.service';
import {merge} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'dsjt-tournament-list',
  templateUrl: './tournament-list.component.html'
})
export class TournamentListComponent implements OnInit {
  paramsSource = new Subject<Params>();
  tournaments$: Observable<TournamentResponseModel[]>;

  q: string;

  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: number;

  totalCount: number;

  constructor(
    private tournamentService: TournamentService,
    private route: ActivatedRoute,
    private toastService: ToastService) {
  }

  ngOnInit() {
    this.tournaments$ = merge(this.route.queryParams, this.paramsSource.asObservable())
      .pipe(
        switchMap(params => {
          this.page = +params['page'] || 1;
          this.pageSize = +params['pageSize'] || 20;
          this.sortBy = params['sortBy'] || 'date';
          this.sortOrder = +params['sortOrder'] || -1;

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
    return (page: number) => this.assignQueryParams({page: page});
  }

  deleteTournament(tournament: TournamentResponseModel) {
    if (confirm('Do you want to delete this tournament? This operation cannot be undone.')) {
      this.tournamentService
        .deleteTournament(tournament.id)
        .subscribe(() => {
          this.toastService.success('Tournament was deleted');
          this.paramsSource.next(this.assignQueryParams({}));
        }, err => {
          alert('Failed to delete tournament, try again later.');
        });
    }
  }
}
