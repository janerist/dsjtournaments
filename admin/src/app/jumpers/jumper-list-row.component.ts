import {Component, Input, Output, EventEmitter} from '@angular/core';
import {JumperResponseModel} from './jumper-models';
import {JumperService} from './jumper.service';

@Component({
  selector: '[dsjt-jumper-list-row]',
  templateUrl: './jumper-list-row.component.html'
})
export class JumperListRowComponent {
  @Input() model: JumperResponseModel;

  @Output() mergeButtonClicked = new EventEmitter<JumperResponseModel>();

  isSaving = false;
  showSaveFeedback = false;
  countryCodeIsValid = true;

  constructor(private jumperService: JumperService) {
  }

  handleCountryCodeChanged(newValue: string) {
    if (newValue.length === 3) {
      this.isSaving = true;

      this.jumperService
        .updateJumper(this.model.id, {nation: newValue})
        .subscribe(() => {
          this.isSaving = false;
          this.showSaveFeedback = true;
          this.countryCodeIsValid = true;

          setTimeout(() => this.showSaveFeedback = false, 2000);
        }, () => {
          this.isSaving = false;
          this.countryCodeIsValid = false;
        });
    } else {
      this.countryCodeIsValid = false;
    }
  }
}
