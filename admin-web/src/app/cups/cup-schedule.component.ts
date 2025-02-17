import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormArray
} from '@angular/forms';
import {CupDateResponseModel} from './cup-models';
import {TournamentTypeWithCountResponseModel} from '../tournaments/tournament-models';
import {CustomValidators} from '../common/custom-validators';
import {add, addMonths, endOfMonth, format, getISODay, startOfDay, startOfMonth} from 'date-fns';
import {FormatPipeModule} from 'ngx-date-fns';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'dsjt-cup-schedule',
  imports: [
    ReactiveFormsModule,
    FormatPipeModule,
    NgForOf,
    NgIf
  ],
  template: `
    <div id="schedule"></div>

    <div class="mb-3">
      <input type="hidden" class="form-control" [class.is-invalid]="dates.hasError('minlength') && dates.touched">
      <div class="invalid-feedback">
        The schedule can't be empty.
      </div>
    </div>

    <div *ngFor="let group of monthGroups">
      <h5>{{ group.month | dfnsFormat: 'MMMM y' }}</h5>
      <ul class="list-unstyled">
        <li *ngFor="let cupDate of group.dates" [formGroup]="cupDate">
          <div class="row">
            <div class="col-sm-5">
              {{ cupDate.get('date').value | dfnsFormat: 'EEEE, MMM do' }}
            </div>
            <div class="col-sm-2">
              <div class="mb-2" [class.has-danger]="cupDate.get('time').touched && !cupDate.get('time').valid">
                <input type="text" class="form-control form-control-sm" formControlName="time">
                <div class="form-control-feedback" *ngIf="cupDate.get('time').touched && cupDate.get('time').hasError('required')">
                  Can't be blank.
                </div>
                <div class="form-control-feedback" *ngIf="cupDate.get('time').touched && cupDate.get('time').hasError('pattern')">
                  Must be in format HH:MM.
                </div>
              </div>
            </div>
            <div class="col-sm-5">
              <select class="form-control form-control-sm" *ngIf="types" formControlName="typeId">
                <option value=""></option>
                <option *ngFor="let type of typesForGameVersion" [value]="type.id">{{ type.name }}</option>
              </select>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `
})
export class CupScheduleComponent implements OnInit, AfterViewInit {
  @Input() form: FormGroup;
  @Input() numMonths = 6;
  @Input() cupDates: CupDateResponseModel[];
  @Input() types: TournamentTypeWithCountResponseModel[];
  @Input() gameVersion: FormControl;

  rawDates = {};
  dates: FormArray;
  monthGroups: Array<any>;

  ngOnInit() {
    this.dates = new FormArray([], CustomValidators.formArrayMinLength(1));
    this.form.addControl('cupDates', this.dates);
    this.cupDates.forEach(cupDate =>
      this.addCupDate({date: new Date(cupDate.date), id: cupDate.id, tournamentTypeId: cupDate.tournamentTypeId}));
    this.monthGroups = this.groupDatesByMonth();
  }

  ngAfterViewInit() {
    const $el = $('#schedule');
    const $row = $('<div />').addClass('row').appendTo($el);

    const date = (this.cupDates.length ? new Date(this.cupDates[0].date) : new Date());
    let startDate = startOfMonth(date);
    let endDate = endOfMonth(date);

    for (let i = 0; i < this.numMonths; i++) {
      const datepicker = $('<div />')
        .datepicker({
          maxViewMode: 'days',
          weekStart: 1,
          multidate: true,
          startDate,
          endDate
        })
        .addClass('col-lg-4 col-md-6')
        .appendTo($row);

      const datesToSet = this.cupDates
        .map(cd => startOfDay(new Date(cd.date)))
        .filter(cd => cd >= startDate && cd <= endDate);

      if (datesToSet.length) {
        this.rawDates[i] = datesToSet;
        datepicker.datepicker('setDates', datesToSet);
      }

      datepicker.on('changeDate', e => {
        this.addOrRemoveDates(i, e.dates);
      });

      startDate = addMonths(startDate, 1);
      endDate = endOfMonth(startDate);
    }
  }

  get typesForGameVersion() {
    return this.types.filter(t => t.gameVersion === +this.gameVersion.value);
  }

  private addOrRemoveDates(index: number, dates: Date[]) {
    const dateWasRemoved = this.rawDates[index] && this.rawDates[index].length > dates.length;

    if (dateWasRemoved) {
      const removedDate = this.rawDates[index].find(d => dates.map(x => x.getTime()).indexOf(d.getTime()) === -1);
      this.removeCupDate(removedDate);
    } else {
      const addedDate = dates.length === 1
        ? dates[0]
        : dates.find(d => this.rawDates[index].map(x => x.getTime()).indexOf(d.getTime()) === -1);

      this.addCupDate({date: this.getHours(addedDate)});
    }

    this.rawDates[index] = dates;
    this.monthGroups = this.groupDatesByMonth();
    this.dates.markAsTouched();
  }

  private addCupDate({id, date, tournamentTypeId}: {id?: number, date: Date, tournamentTypeId?: number}) {
    const dateOnly = startOfDay(date);
    const timeOnly = format(date, 'HH:mm');

    const index = this.dates.controls.findIndex(c => c.get('date').value.getTime() === dateOnly.getTime());
    if (index !== -1) {
      this.dates.controls[index].get('destroy').setValue(false);
    } else {
      this.dates.push(new FormGroup({
        id: new FormControl(id),
        date: new FormControl(dateOnly),
        time: new FormControl(timeOnly, Validators.compose([Validators.required, Validators.pattern('\\d{2}:\\d{2}')])),
        typeId: new FormControl(tournamentTypeId),
        destroy: new FormControl(false)
      }));
    }
  }

  private removeCupDate(date: Date) {
    const index = this.dates.controls.findIndex(c => c.get('date').value.getTime() === date.getTime());

    if (this.dates.controls[index].get('id').value) {
      this.dates.controls[index].get('destroy').setValue(true);
    } else {
      this.dates.removeAt(index);
    }
  }

  private groupDatesByMonth() {
    return this.dates.controls
      .filter(c => !c.get('destroy').value)
      .reduce((groups, cupDate) => {
        const month = startOfMonth(cupDate.get('date').value);
        let group = groups.find(g => g.month.getMonth() === month.getMonth());
        if (!group) {
          group = {month, dates: []};
          groups.push(group);
          groups.sort((a, b) => {
            if (a.month < b.month) {
              return -1;
            } else if (a.month > b.month) {
              return 1;
            }

            return 0;
          });
        }
        group.dates.push(cupDate);
        group.dates.sort((a, b) => {
          const dateA = a.get('date').value;
          const dateB = b.get('date').value;

          if (dateA < dateB) {
            return -1;
          } else if (dateA > dateB) {
            return 1;
          }

          return 0;
        });
        return groups;
      }, []);
  }

  private getHours(date: Date): Date {
    switch (getISODay(date)) {
      case 3:
        // Wednesday tournaments start at 19:00
        return add(date, {hours: 19});

      default:
        return add(date, {hours: 20});
    }
  }
}
