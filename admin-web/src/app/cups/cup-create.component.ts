import {Component, OnInit} from '@angular/core';
import {CupRequestModel} from './cup-models';
import {CupService} from './cup.service';
import {Router} from '@angular/router';
import {TournamentService} from '../tournaments/tournament.service';
import {TournamentTypeResponseModel} from '../tournaments/tournament-models';
import {ToastService} from '../common/services/toast.service';

@Component({
  templateUrl: './cup-create.component.html'
})
export class CupCreateComponent implements OnInit {
  types: TournamentTypeResponseModel[];

  constructor(
    private cupService: CupService,
    private tournamentService: TournamentService,
    private router: Router,
    private toastService: ToastService
  ) {
  }

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
        this.router.navigate(['/cups']);
      });
  }
}
