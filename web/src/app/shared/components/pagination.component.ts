import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <div *ngIf="totalCount > pageSize" class="ui pagination menu" style="margin: 1rem 0;">
      <div class="item">
        Showing {{1+(page-1)*pageSize}} - {{min(totalCount, page*pageSize)}} of {{totalCount}}
      </div>
      <ng-container *ngIf="!compact">
        <ng-container *ngFor="let p of pagination()">
          <a *ngIf="p > 0"
             class="item"
             [class.active]="p === page"
             routerLink="./"
             [queryParams]="{page: p}"
             queryParamsHandling="merge">
            {{p}}
          </a>
          <div *ngIf="p === 0" class="disabled item">...</div>
        </ng-container>
      </ng-container>
      <a *ngIf="hasPrev"
         class="item"
         routerLink="./"
         [queryParams]="{page: page - 1}"
         queryParamsHandling="merge"
         title="Previous">
        <i class="caret left icon"></i>
      </a>
      <div *ngIf="!hasPrev" class="disabled item"><i class="caret left icon"></i></div>
      <a *ngIf="hasNext"
         class="item"
         routerLink="./"
         [queryParams]="{page: page + 1}"
         queryParamsHandling="merge"
         title="Next">
        <i class="caret right icon"></i>
      </a>
      <div *ngIf="!hasNext" class="disabled item"><i class="caret right icon"></i></div>
    </div>
  `,
  styles: [`
    * { font-size: 90%;}
  `]
})
export class PaginationComponent {
  @Input() compact = false;
  @Input() page = 1;
  @Input() pageSize = 1;
  @Input() totalCount = 0;

  min = Math.min;

  get pages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get hasPrev(): boolean {
    return this.page > 1;
  }

  get hasNext(): boolean {
    return this.page < this.pages;
  }

  pagination(leftEdge = 2, leftCurrent = 2, rightCurrent = 4, rightEdge = 2): number[] {
    const pages = [];
    let last = 0;

    for (let num = 1; num <= this.pages; num++) {
      if (num <= leftEdge
        || (num > this.page - leftCurrent - 1 &&
            num < this.page + rightCurrent)
        || num > this.pages - rightEdge) {
        if (last + 1 !== num) {
          pages.push(0);
        }
        pages.push(num);
        last = num;
      }
    }

    return pages;
  }
}
