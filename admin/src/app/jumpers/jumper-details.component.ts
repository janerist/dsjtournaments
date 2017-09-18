import {Component, Input, EventEmitter, Output} from '@angular/core';
import {JumperResponseModel} from './jumper-models';

@Component({
  selector: 'dsjt-jumper-details',
  template: `
    <div class="card" *ngIf="model">
      <div class="card-block">
        <h6 class="card-title">
          <span [dsjtFlag]="model.nation"></span>
          <strong>{{ model.name }}</strong>
          <button type="button"
                  class="close"
                  aria-label="Remove"
                  title="Remove"
                  (click)="dismissClicked.emit(model)">
            <span aria-hidden="true">&times;</span>
          </button>
        </h6>
        Last active: {{model.lastActive | date}}<br/>
        Participations: {{model.participations}}
      </div>
    </div>
  `
})
export class JumperDetailsComponent {
  @Input() model: JumperResponseModel;
  @Output() dismissClicked = new EventEmitter<JumperResponseModel>();
}
