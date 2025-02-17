import {Component, inject, OnInit} from '@angular/core';
import {JumperService} from './jumper.service';
import {JumperResponseModel, JumperMergeRequestModel} from './jumper-models';
import {ActivatedRoute, Router, ParamMap, convertToParamMap, RouterLink} from '@angular/router';
import {ToastService} from '../common/services/toast.service';
import {Subject, Observable} from 'rxjs';
import {merge} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {FormsModule} from '@angular/forms';
import {PagerComponent} from '../common/components/pager.component';
import {AsyncPipe} from '@angular/common';
import {JumperListRowComponent} from './jumper-list-row.component';
import {JumperMergeModalComponent} from './jumper-merge-modal.component';

@Component({
  selector: 'dsjt-jumper-list',
  imports: [
    FormsModule,
    PagerComponent,
    RouterLink,
    AsyncPipe,
    JumperListRowComponent,
    JumperMergeModalComponent
  ],
  template: `
    <div class="row">
      <div class="col-4">
        <div class="input-group">
          <input #s type="search"
                 class="form-control"
                 placeholder="Search for jumper"
                 [(ngModel)]="q"
                 (keyup.enter)="search()">
          <button class="btn btn-secondary" type="button" (click)="search()">
            <i class="fa fa-search"></i>
            Search
          </button>
        </div>
      </div>
      <div class="col-4 ml-auto">
        <div class="float-right">
          @if (totalCount > 0) {
            <dsjt-pager [page]="page"
                        [pageSize]="pageSize"
                        [totalCount]="totalCount"
                        [getQueryParams]="createGetQueryParams()">
            </dsjt-pager>
          } @else {
            <span>No jumpers found.</span>
          }
        </div>
      </div>
    </div>

    <table class="table table-sm">
      @if (totalCount > 0) {
        <thead>
          <tr>
            <th>
              <a routerLink="./"
                 [queryParams]="assignQueryParams({sortBy: 'name', sortOrder: sortOrder*-1})">
                Name
              </a>
            </th>
            <th>
              <a routerLink="./"
                 [queryParams]="assignQueryParams({sortBy: 'nation', sortOrder: sortOrder*-1})">
                Nation
              </a>
            </th>
            <th>
              E-mail for gravatar
            </th>
            <th>
              <a routerLink="./"
                 [queryParams]="assignQueryParams({sortBy: 'participations', sortOrder: sortOrder*-1})">
                Participations
              </a>
            </th>
            <th>
              <a routerLink="./"
                 [queryParams]="assignQueryParams({sortBy: 'lastActive', sortOrder: sortOrder*-1})">
                Last active
              </a>
            </th>
            <th></th>
          </tr>
        </thead>
      }
      <tbody>
        @for (jumper of jumpers$ | async; track jumper.id) {
          <tr dsjt-jumper-list-row
              [model]="jumper"
              (mergeButtonClicked)="openJumperMergeModal($event)">
          </tr>
        }
      </tbody>
    </table>

    <dsjt-jumper-merge-modal
      [show]="showJumperMergeModal"
      [sourceJumpers]="selectedJumperForMerge ? [selectedJumperForMerge] : []"
      (modalClosed)="showJumperMergeModal = false"
      (mergeConfirmed)="mergeJumpers($event)">
    </dsjt-jumper-merge-modal>
  `
})
export class JumperListComponent implements OnInit {
  private jumperService = inject(JumperService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  paramsSource = new Subject<ParamMap>();
  jumpers$: Observable<JumperResponseModel[]>;

  q: string;

  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: number;

  totalCount: number;

  showJumperMergeModal = false;
  selectedJumperForMerge: JumperResponseModel;

  ngOnInit() {
    this.jumpers$ = merge(this.route.queryParamMap, this.paramsSource.asObservable())
      .pipe(
        switchMap(params => {
          this.q = params.get('q');
          this.page = +params.get('page') || 1;
          this.pageSize = +params.get('pageSize') || 20;
          this.sortBy = params.get('sortBy') || 'participations';
          this.sortOrder = +params.get('sortOrder') || -1;

          return this.jumperService
            .getJumpers(this.q, this.page, this.pageSize, `${this.sortBy}${this.sortOrder === 1 ? 'asc' : 'desc'}`)
            .pipe(
              tap(m => this.totalCount = m.totalCount),
              map(m => m.data)
            );
        })
      );
  }

  assignQueryParams(source: any) {
    const target = {
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      q: this.q
    };

    if (!target.q) {
      delete target.q;
    }

    return Object.assign(target, source);
  }

  search() {
    const queryParams = this.assignQueryParams({page: 1});
    void this.router.navigate(['./'], {queryParams, relativeTo: this.route});
  }

  createGetQueryParams() {
    return (page: number) => this.assignQueryParams({page});
  }

  openJumperMergeModal(jumper: JumperResponseModel) {
    this.selectedJumperForMerge = jumper;
    this.showJumperMergeModal = true;
  }

  mergeJumpers(model: JumperMergeRequestModel) {
    this.jumperService
      .mergeJumpers(model)
      .subscribe({
        complete: () => {
          this.toastService.success('Jumpers merged successfully.');
          this.showJumperMergeModal = false;
          this.paramsSource.next(convertToParamMap(this.assignQueryParams({})));
        },
        error: () => this.toastService.error('Something went wrong. Try again later or contact the administrator!')
      });
  }
}
