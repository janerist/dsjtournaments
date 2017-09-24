import {Component, Input} from '@angular/core';

@Component({
  selector: 'dsjt-pager',
  template: `
<nav aria-label="Pagination">
  <ul class="pagination">
    <li class="page-item disabled">
      <a class="page-link" href="#">
        {{((page-1)*pageSize)+1}} - {{Math.min(totalCount, page*pageSize)}} of {{totalCount}}
      </a>
    </li>
    <li class="page-item" [class.disabled]="page <= 1">
      <a class="page-link"
         *ngIf="page > 1"
         [routerLink]="routeCommands"
         [queryParams]="getQueryParams(page - 1)">
        <i class="fa fa-caret-left"></i>&nbsp;
      </a>
      <a class="page-link" *ngIf="page <= 1" href="#">
        <i class="fa fa-caret-left"></i>&nbsp;
      </a>
    </li>
    <li class="page-item" [class.disabled]="page >= totalPages">
      <a class="page-link"
         *ngIf="page < totalPages"
         [routerLink]="routeCommands"
         [queryParams]="getQueryParams(page + 1)">
        <i class="fa fa-caret-right"></i>&nbsp;
      </a>
      <a class="page-link" *ngIf="page >= totalPages" href="#">
        <i class="fa fa-caret-right"></i>&nbsp;
      </a>
    </li>
  </ul>
</nav>`
})
export class PagerComponent {
  @Input() page: number;
  @Input() pageSize: number;
  @Input() totalCount: number;
  @Input() routeCommands: string;
  @Input() getQueryParams: (page: number) => any;

  Math = Math;

  get totalPages() {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
