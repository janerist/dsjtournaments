import {
  Component, ElementRef, Input, EventEmitter, Output,
  OnInit
} from '@angular/core';
import {environment} from '../../environments/environment';
import {JumperService} from './jumper.service';
import {PagedResponse} from '../common/models';
import {JumperResponseModel} from './jumper-models';

@Component({
  selector: 'dsjt-jumper-searchbox',
  template: `
  <select class="col-sm-4">    
  </select>
  `
})
export class JumperSearchboxComponent implements OnInit {
  @Input() pageSize = 40;
  @Input() minimumInputLength = 1;
  @Input() delay = 250;
  @Input() autoOpen = false;
  @Input() ignore: JumperResponseModel[] = [];
  @Input() placeholder = 'Search for jumper';

  @Output() select = new EventEmitter<any>();

  constructor(
    private el: ElementRef,
    private jumperService: JumperService
  ) {
  }

  ngOnInit() {
    const $selectEl = $('select', this.el.nativeElement);

    $selectEl.select2({
      placeholder: this.placeholder,
      minimumInputLength: this.minimumInputLength,
      width: '100%',
      ajax: {
        url: `${environment.apiUrl}/jumpers`,
        dataType: 'json',
        delay: this.delay,
        cache: true,
        transport: <any>((params: JQueryAjaxSettings, success, failure) => {
          this.jumperService
            .getJumpers(params.data['q'], params.data['page'], params.data['pageSize'])
            .subscribe(
              jumpers => success(jumpers),
              err => failure(err)
            );
        }),
        data: (params: Select2QueryOptions) => {
          return {
            q: params.term,
            page: params.page || 1,
            pageSize: this.pageSize
          };
        },
        processResults: (data: PagedResponse<JumperResponseModel>, params: Select2QueryOptions) => {
          params.page = params.page || 1;
          return {
            results: data.data
              .filter(jumper => !this.ignore.find(j => j && j.id === jumper.id))
              .map(jumper => {
                return {id: jumper.id, text: jumper.name, jumper: jumper};
              }),
            pagination: {
              more: (params.page * this.pageSize) < data.totalCount
            }
          };
        }
      }
    });

    $selectEl.on('select2:select', e => {
      this.select.emit(e['params'].data.jumper);
      $selectEl.val(null).trigger('change');
    });
    if (this.autoOpen) {
      $selectEl.select2('open');
    }
  }
}
