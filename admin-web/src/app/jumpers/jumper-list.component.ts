import {Component, OnInit} from '@angular/core';
import {JumperService} from './jumper.service';
import {JumperResponseModel, JumperMergeRequestModel} from './jumper-models';
import {ActivatedRoute, Router, ParamMap, convertToParamMap} from '@angular/router';
import {ToastService} from '../common/services/toast.service';
import {Subject, Observable} from 'rxjs';
import {merge} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'dsjt-jumper-list',
  templateUrl: './jumper-list.component.html'
})
export class JumperListComponent implements OnInit {
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

  constructor(
    private jumperService: JumperService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService) {
  }

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
    this.router.navigate(['./'], {queryParams, relativeTo: this.route});
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
      .subscribe(
        () => {
          this.toastService.success('Jumpers merged successfully.');
          this.showJumperMergeModal = false;
          this.paramsSource.next(convertToParamMap(this.assignQueryParams({})));
        },
        err => this.toastService.error('Something went wrong. Try again later or contact the administrator!')
      );
  }
}
