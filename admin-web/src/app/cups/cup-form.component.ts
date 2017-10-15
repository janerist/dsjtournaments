import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {CupResponseModel, CupRequestModel} from './cup-models';
import {FormService} from '../common/services/form.service';
import {TournamentTypeResponseModel} from '../tournaments/tournament-models';

@Component({
  selector: 'dsjt-cup-form',
  templateUrl: './cup-form.component.html'
})
export class CupFormComponent implements OnInit {
  @Input() cup: CupResponseModel;
  @Input() types: TournamentTypeResponseModel[];

  @Output() save = new EventEmitter<CupRequestModel>();

  form: FormGroup;
  name: FormControl;
  rankMethod: FormControl;
  gameVersion: FormControl;

  constructor(private formService: FormService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: (this.name = new FormControl(this.cup ? this.cup.name : '', Validators.required)),
      rankMethod: (this.rankMethod = new FormControl(this.cup ? this.cup.rankMethod : 'cup_points', Validators.required)),
      gameVersion: (this.gameVersion = new FormControl(this.cup ? this.cup.gameVersion : '4', Validators.required))
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.formService.markAsTouched(this.form);
      return;
    }

    this.save.emit(this.form.value);
  }
}
