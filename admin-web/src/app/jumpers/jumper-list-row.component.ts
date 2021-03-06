import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {JumperResponseModel} from './jumper-models';
import {JumperService} from './jumper.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {debounceTime, filter} from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[dsjt-jumper-list-row]',
  templateUrl: './jumper-list-row.component.html'
})
export class JumperListRowComponent implements OnInit {
  @Input() model: JumperResponseModel;

  @Output() mergeButtonClicked = new EventEmitter<JumperResponseModel>();

  form: FormGroup;

  constructor(private jumperService: JumperService, private fb: FormBuilder) {
  }

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
