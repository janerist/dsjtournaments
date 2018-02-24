import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {JumperResponseModel} from './jumper-models';
import {JumperService} from './jumper.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';

@Component({
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
      'nation': [this.model.nation, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)])],

      'gravatarEmail': [this.model.gravatarEmail, emailOrEmpty]
    });

    this.form
      .valueChanges
      .debounceTime(500)
      .filter(() => this.form.valid)
      .subscribe(newValue => this.save(this.form.value));
  }

  save({nation, gravatarEmail}: {nation: string, gravatarEmail: string}) {
    this.jumperService
      .updateJumper(this.model.id, { nation: nation, gravatarEmail: gravatarEmail || null})
      .subscribe((jumper: JumperResponseModel) => {
        this.model = jumper;
      });
  }
}
