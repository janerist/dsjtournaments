import {Component, inject, OnInit} from '@angular/core';
import {CupRequestModel} from './cup-models';
import {CupService} from './cup.service';
import {Router} from '@angular/router';
import {TournamentService} from '../tournaments/tournament.service';
import {TournamentTypeWithCountResponseModel} from '../tournaments/tournament-models';
import {ToastService} from '../common/services/toast.service';
import {CupFormComponent} from './cup-form.component';

@Component({
  imports: [
    CupFormComponent
  ],
  template: `
    <h3>Create new cup</h3>
    <dsjt-cup-form [types]="types" (save)="onSave($event)"></dsjt-cup-form>
  `
})
export class CupCreateComponent implements OnInit {
  private cupService = inject(CupService);
  private router = inject(Router);
  private tournamentService = inject(TournamentService);
  private toastService = inject(ToastService);

  types: TournamentTypeWithCountResponseModel[];

  ngOnInit() {
    this.tournamentService
      .getTournamentTypes()
      .subscribe(types => this.types = types);
  }

  onSave(cup: CupRequestModel) {
    this.cupService
      .createCup(cup)
      .subscribe(() => {
        this.toastService.success('Cup created');
        void this.router.navigate(['../']);
      });
  }
}
