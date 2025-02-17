import {Component, Input, OnInit, EventEmitter, Output, inject} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {CupResponseModel, CupRequestModel} from './cup-models';
import {FormService} from '../common/services/form.service';
import {TournamentTypeWithCountResponseModel} from '../tournaments/tournament-models';
import {formatISO} from 'date-fns';
import {CupScheduleComponent} from './cup-schedule.component';

@Component({
  selector: 'dsjt-cup-form',
  imports: [
    ReactiveFormsModule,
    CupScheduleComponent
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <div class="row">
        <div class="col-sm-4">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" id="name" class="form-control" formControlName="name" [class.is-invalid]="name.touched && !name.valid">
            @if (name.touched && name.hasError('required')) {
              <div class="invalid-feedback">
                Can't be blank.
              </div>
            }

          </div>

          <div class="mb-3">
            <label for="rank-method" class="form-label">Rank method</label>
            <select id="rank-method" class="form-control" formControlName="rankMethod" [class.is-invalid]="rankMethod.touched && !rankMethod.valid">
              <option value="cup_points">Cup points</option>
              <option value="jump_points">Jump points</option>
            </select>
            @if (rankMethod.touched && rankMethod.hasError('required')) {
              <div class="invalid-feedback">
                Can't be blank.
              </div>
            }

          </div>

          <div class="mb-3">
            <label for="game-version" class="form-label">Game version</label>
            <select id="game-version" class="form-control" formControlName="gameVersion" [class.is-invalid]="gameVersion.touched && !gameVersion.valid">
              <option value="4">DSJ4</option>
              <option value="3">DSJ3</option>
            </select>
            @if (gameVersion.touched && gameVersion.hasError('required')) {
              <div class="invalid-feedback">
                Can't be blank.
              </div>
            }
          </div>

          <div>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </div>
        <div class="col-sm-8">
          <dsjt-cup-schedule
            [form]="form"
            [numMonths]="6"
            [cupDates]="cup ? cup.dates : []"
            [types]="types"
            [gameVersion]="gameVersion">
          </dsjt-cup-schedule>
        </div>
      </div>
    </form>
  `
})
export class CupFormComponent implements OnInit {
  private formService = inject(FormService);

  @Input() cup: CupResponseModel;
  @Input() types: TournamentTypeWithCountResponseModel[];

  @Output() save = new EventEmitter<CupRequestModel>();

  form: UntypedFormGroup;
  name: UntypedFormControl;
  rankMethod: UntypedFormControl;
  gameVersion: UntypedFormControl;

  ngOnInit() {
    this.form = new UntypedFormGroup({
      name: (this.name = new UntypedFormControl(this.cup ? this.cup.name : '', Validators.required)),
      rankMethod: (this.rankMethod = new UntypedFormControl(this.cup ? this.cup.rankMethod : 'cup_points', Validators.required)),
      gameVersion: (this.gameVersion = new UntypedFormControl(this.cup ? this.cup.gameVersion : '4', Validators.required))
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
      cupDates: cupDates.map(cd => ({...cd, date: formatISO(cd.date, {representation: 'date'}), typeId: +cd.typeId || null}))
    });
  }
}
