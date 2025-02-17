import {Component, Input, EventEmitter, Output} from '@angular/core';
import {JumperResponseModel} from './jumper-models';
import {FlagDirective} from '../common/directives/flag.directive';
import {FormatPipeModule} from 'ngx-date-fns';

@Component({
  selector: 'dsjt-jumper-details',
  imports: [
    FlagDirective,
    FormatPipeModule
  ],
  template: `
    @if (model) {
      <div class="card">
        <div class="card-body">
          <h6 class="card-title">
            <span [dsjtFlag]="model.nation"></span>
            <strong>{{ model.name }}</strong>
            <button type="button"
                    class="btn-close float-end"
                    aria-label="Remove"
                    (click)="dismissClicked.emit(model)">
            </button>
          </h6>

          Last active: {{ model.lastActive | dfnsFormat: 'MMM do, y' }}<br/>
          Participations: {{ model.participations }}
        </div>
      </div>
    }

  `
})
export class JumperDetailsComponent {
  @Input() model: JumperResponseModel;
  @Output() dismissClicked = new EventEmitter<JumperResponseModel>();
}
