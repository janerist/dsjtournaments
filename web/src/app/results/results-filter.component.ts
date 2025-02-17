import {AfterViewInit, Component, ElementRef, EventEmitter, inject, input, OnInit, Output} from '@angular/core';
import {TournamentTypeWithCount} from '../shared/api-responses';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {endOfMonth, endOfYear, format, startOfMonth, startOfYear} from 'date-fns';

@Component({
  selector: 'app-results-filter',
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <div class="ui segment" style="margin-bottom: 10px;">
      <form class="ui form" [formGroup]="form" (ngSubmit)="filter.emit(form.value)">
        <div class="three equal width fields">
          <div class="three wide field">
            <label>Type</label>
            <div class="inline fields">
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" name="gameVersion" tabindex="0" class="hidden" value=""
                         formControlName="gameVersion">
                  <label>Any version</label>
                </div>
              </div>
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" name="gameVersion" tabindex="0" class="hidden" value="4"
                         formControlName="gameVersion">
                  <label>DSJ4</label>
                </div>
              </div>
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" name="gameVersion" tabindex="0" class="hidden" value="3"
                         formControlName="gameVersion">
                  <label>DSJ3</label>
                </div>
              </div>
            </div>
            <select formControlName="type">
              <option value="" [ngValue]="null">
                @if (form.get('gameVersion')?.value; as version) {
                  All DSJ{{ version }} types
                } @else {
                  All types
                }
              </option>
              @for (type of typesOfVersion(form.get('gameVersion')?.value); track type.id) {
                <option [value]="type.id">
                  {{ type.name }}
                  @if (!form.get('gameVersion')?.value) {
                    (DSJ{{ type.gameVersion }})
                  }
                </option>
              }

            </select>
          </div>

          <div class="grouped fields">
            <label for="date">Date</label>
            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" name="date" tabindex="0" class="hidden" [value]="null"
                       [formControl]="dateSelection">
                <label>All time</label>
              </div>
            </div>
            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" name="date" tabindex="0" class="hidden" value="month" [formControl]="dateSelection">
                <label>This month</label>
              </div>
            </div>
            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" name="date" tabindex="0" class="hidden" value="year" [formControl]="dateSelection">
                <label>This year</label>
              </div>
            </div>
            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" name="date" tabindex="0" class="hidden" value="custom"
                       [formControl]="dateSelection">
                <label>Custom</label>
              </div>
            </div>
            <div class="inline fields" [class.disabled]="dateSelection.value !== 'custom'">
              <div class="field">
                <input type="date" formControlName="dateFrom">
              </div>
              <div class="field">to</div>
              <div class="field">
                <input type="date" formControlName="dateTo">
              </div>
            </div>
          </div>

          <div class="grouped fields">
            <label for="version">Rank method</label>
            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" name="rankMethod" checked="" tabindex="0" class="hidden" value="jump_points"
                       formControlName="rankMethod">
                <label>Jump points</label>
              </div>
            </div>
            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" name="rankMethod" tabindex="0" class="hidden" value="cup_points"
                       formControlName="rankMethod">
                <label>Cup Points</label>
              </div>
            </div>
          </div>
        </div>

        <button class="ui submit button" type="submit">
          Show results
        </button>
      </form>
    </div>
  `
})
export class ResultsFilterComponent implements OnInit, AfterViewInit {
  private el = inject(ElementRef);

  types = input.required<TournamentTypeWithCount[]>();
  @Output() filter = new EventEmitter<any>();

  form = new FormGroup({
    gameVersion: new FormControl(''),
    type: new FormControl(''),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    rankMethod: new FormControl('jump_points')
  });
  dateSelection = new FormControl()

  ngOnInit() {
    this.dateSelection.valueChanges.subscribe(value => {
      switch (value) {
        case 'month':
          this.form!.patchValue({
            dateFrom: format(startOfMonth(new Date()), 'y-MM-dd'),
            dateTo: format(endOfMonth(new Date()), 'y-MM-dd')
          });
          break;

        case 'year':
          this.form!.patchValue({
            dateFrom: format(startOfYear(new Date()), 'y-MM-dd'),
            dateTo: format(endOfYear(new Date()), 'y-MM-dd')
          });
          break;

        default:
          this.form!.patchValue({
            dateFrom: '',
            dateTo: ''
          });
      }
    });
  }

  ngAfterViewInit() {
    $('.ui.radio.checkbox', this.el.nativeElement).checkbox();
  }

  typesOfVersion(version: string) {
    return this.types()
      .filter(type => version ? type.gameVersion === +version : true)
      .filter(type => type.name !== 'Team Cup');
  }
}
