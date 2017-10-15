import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import * as moment from 'moment';
import {FormArray, FormGroup, FormControl, Validators} from '@angular/forms';
import {CupDateResponseModel} from './cup-models';
import {TournamentTypeResponseModel} from '../tournaments/tournament-models';
import {CustomValidators} from '../common/custom-validators';

@Component({
  selector: 'dsjt-cup-schedule',
  templateUrl: 'cup-schedule.component.html'
})
export class CupScheduleComponent implements OnInit, AfterViewInit {
  @Input() form: FormGroup;
  @Input() numMonths = 6;
  @Input() cupDates: CupDateResponseModel[];
  @Input() types: TournamentTypeResponseModel[];
  @Input() gameVersion: FormControl;

  _rawDates = {};
  dates: FormArray;
  monthGroups: Array<any>;
  moment = moment;

  ngOnInit() {
    this.dates = new FormArray([], CustomValidators.formArrayMinLength(1));
    this.form.addControl('cupDates', this.dates);
    this.cupDates.forEach(cupDate => this.addCupDate(cupDate));
    this.monthGroups = this.groupDatesByMonth();
  }

  ngAfterViewInit() {
    const $el = $('#schedule');
    const $row = $('<div />').addClass('row').appendTo($el);

    const startDate = (this.cupDates.length ? moment(this.cupDates[0].date) : moment()).startOf('month');
    const endDate = (this.cupDates.length ? moment(this.cupDates[0].date) : moment()).endOf('month');

    for (let i = 0; i < this.numMonths; i++) {
      const datepicker = $('<div />')
        .datepicker({
          maxViewMode: 'days',
          format: 'yyyy-mm-dd',
          weekStart: 1,
          multidate: true,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
        })
        .addClass('col-lg-4 col-md-6')
        .appendTo($row);

      const datesToSet = this.cupDates
        .filter(cd => moment(cd.date).isBetween(startDate, endDate, null, '[]'))
        .map(cd => moment(cd.date).format('YYYY-MM-DD'));

      if (datesToSet.length) {
        this._rawDates[i] = datesToSet;
        datepicker.datepicker('setDates', datesToSet);
      }

      datepicker.on('changeDate', e => {
        const dates = e.dates.map(d => moment(d).format('YYYY-MM-DD'));
        this.addOrRemoveDates(i, dates);
      });

      startDate.add(1, 'months');
      endDate.add(1, 'months').endOf('month');
    }
  }

  get typesForGameVersion() {
    return this.types.filter(t => t.gameVersion === +this.gameVersion.value);
  }

  private addOrRemoveDates(index: number, dates: string[]) {
    const dateWasRemoved = this._rawDates[index] && this._rawDates[index].length > dates.length;

    if (dateWasRemoved) {
      const removedDate = this._rawDates[index].find(d => dates.indexOf(d) === -1);
      this.removeCupDate(removedDate);
    } else {
      const addedDate = dates.length === 1
        ? dates[0]
        : dates.find(d => this._rawDates[index].indexOf(d) === -1);

      this.addCupDate({date: addedDate + ' ' + this.getHours(addedDate)});
    }

    this._rawDates[index] = dates;
    this.monthGroups = this.groupDatesByMonth();
    this.dates.markAsTouched();
  }

  private addCupDate({id, date, tournamentTypeId}: {id?: number, date: string, tournamentTypeId?: number}) {
    const dateOnly = moment(date).format('YYYY-MM-DD');
    const timeOnly = moment(date).format('HH:mm');
    const index = this.dates.controls.findIndex(c => c.get('date').value === dateOnly);
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

  private removeCupDate(date: string) {
    const index = this.dates.controls.findIndex(c => c.get('date').value === date);

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
        const month = moment(cupDate.get('date').value).startOf('month');
        let group = groups.find(g => g.month.unix() === month.unix());
        if (!group) {
          group = {month: month, dates: []};
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

  private getHours(date: string) {
    switch (moment(date).format('dddd')) {
      case 'Wednesday':
        return '19:00';

      default:
        return '20:00';
    }
  }
}
