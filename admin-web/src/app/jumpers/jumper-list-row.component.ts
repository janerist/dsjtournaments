import {Component, Input, Output, EventEmitter, OnInit, inject} from '@angular/core';
import {JumperResponseModel} from './jumper-models';
import {JumperService} from './jumper.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {debounceTime, filter} from 'rxjs/operators';
import {FlagDirective} from '../common/directives/flag.directive';
import {NgIf} from '@angular/common';
import {FormatPipeModule} from 'ngx-date-fns';

@Component({
  selector: '[dsjt-jumper-list-row]',
  imports: [
    ReactiveFormsModule,
    FlagDirective,
    FormatPipeModule
  ],
  template: `
    <ng-container [formGroup]="form">
      <td>
        <span [dsjtFlag]="model.nation"></span>
        @if (model.gravatarHash) {
          <img alt="gravatar" class="rounded" [src]="'https://www.gravatar.com/avatar/' + model.gravatarHash + '?s=20'">
        }
        <a href="http://dsjtournaments.com/jumpers/{{model.id}}" target="_blank">{{ model.name }}</a>
      </td>
      <td>
        <input type="text"
               name="nation"
               class="form-control form-control-sm"
               [class.is-invalid]="!form.get('nation').valid"
               formControlName="nation"
               maxlength="3"
               style="width: 4em;">
      </td>
      <td>
        <input type="text"
               name="gravatarEmail"
               class="form-control form-control-sm"
               formControlName="gravatarEmail"
               [class.is-invalid]="!form.get('gravatarEmail').valid">
      </td>
      <td>
        {{ model.participations }}
      </td>
      <td>
        {{ model.lastActive | dfnsFormat: 'MMM do, y' }}
      </td>
      <td class="text-end">
        <button type="button"
                class="btn btn-sm btn-outline-primary"
                (click)="mergeButtonClicked.emit(model)">
          <i class="fa fa-compress"></i>
          Merge into...
        </button>
      </td>
    </ng-container>
  `
})
export class JumperListRowComponent implements OnInit {
  private jumperService = inject(JumperService);
  private fb = inject(FormBuilder);

  @Input() model: JumperResponseModel;
  @Output() mergeButtonClicked = new EventEmitter<JumperResponseModel>();

  form: FormGroup;

  ngOnInit() {
    const emailOrEmpty = (control: AbstractControl) => control.value ? Validators.email(control) : null;
    this.form = this.fb.group({
      nation: [this.model.nation, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)])],

      gravatarEmail: [this.model.gravatarEmail, emailOrEmpty]
    });

    this.form
      .valueChanges
      .pipe(
        debounceTime(500),
        filter(() => this.form.valid)
      )
      .subscribe(() => this.save(this.form.value));
  }

  save({nation, gravatarEmail}: {nation: string, gravatarEmail: string}) {
    this.jumperService
      .updateJumper(this.model.id, { nation, gravatarEmail: gravatarEmail || null})
      .subscribe((jumper: JumperResponseModel) => {
        this.model = jumper;
      });
  }
}
