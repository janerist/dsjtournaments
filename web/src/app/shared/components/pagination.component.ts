import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [
    RouterLink
  ],
  styles: [`
    * {
      font-size: 90%;
    }
  `],
  template: `@if (totalCount > pageSize) {
    <div class="ui pagination menu" style="margin: 1rem 0;">
      <div class="item">
        Showing {{ 1 + (page - 1) * pageSize }} - {{ min(totalCount, page * pageSize) }} of {{ totalCount }}
      </div>
      @if (!compact) {
        @for (p of pagination(); track $index) {
          @if (p > 0) {
            <a class="item"
               [class.active]="p === page"
               routerLink="./"
               [queryParams]="{page: p}"
               queryParamsHandling="merge">
              {{ p }}
            </a>
          } @else {
            <div class="disabled item">...</div>
          }
        }
      }
      @if (hasPrev) {
        <a class="item"
           routerLink="./"
           [queryParams]="{page: page - 1}"
           queryParamsHandling="merge"
           title="Previous">
          <i class="caret left icon"></i>
        </a>
      } @else {
        <div class="disabled item"><i class="caret left icon"></i></div>
      }

      @if (hasNext) {
        <a class="item"
           routerLink="./"
           [queryParams]="{page: page + 1}"
           queryParamsHandling="merge"
           title="Next">
          <i class="caret right icon"></i>
        </a>
      } @else {
        <div class="disabled item"><i class="caret right icon"></i></div>
      }
    </div>
  }
  `
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
