import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {CupResponseModel, CupRequestModel} from './cup-models';
import {FormService} from '../common/services/form.service';
import {TournamentTypeWithCountResponseModel} from '../tournaments/tournament-models';

@Component({
  selector: 'dsjt-cup-form',
  templateUrl: './cup-form.component.html'
})
export class CupFormComponent implements OnInit {
  @Input() cup: CupResponseModel;
  @Input() types: TournamentTypeWithCountResponseModel[];

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

    const {gameVersion, cupDates} = this.form.value;
    this.save.emit({
      ...this.form.value,
      gameVersion: +gameVersion,
      cupDates: cupDates.map(cd => ({...cd, typeId: +cd.typeId || null}))
    });
  }
}
