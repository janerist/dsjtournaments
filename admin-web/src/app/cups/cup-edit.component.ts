import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CupService} from './cup.service';
import {CupResponseModel, CupRequestModel} from './cup-models';
import {TournamentService} from '../tournaments/tournament.service';
import {TournamentTypeWithCountResponseModel} from '../tournaments/tournament-models';
import {ToastService} from '../common/services/toast.service';

@Component({
  templateUrl: './cup-edit.component.html'
})
export class CupEditComponent implements OnInit {
  cup: CupResponseModel;
  types: TournamentTypeWithCountResponseModel[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cupService: CupService,
    private tournamentService: TournamentService,
    private toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.loadTypes();

    this.route.paramMap.subscribe(params => {
      this.loadCup(+params.get('id'));
    });
  }

  onSave(cup: CupRequestModel) {
    this.cupService
      .updateCup(this.cup.id, cup)
      .subscribe(() => {
        this.toastService.success('Cup saved');
        const id = this.cup.id;
        this.cup = null;
        this.loadCup(id);
      });
  }

  deleteCup() {
    if (confirm('Really delete this cup?')) {
      this.cupService
        .deleteCup(this.cup.id)
        .subscribe(() => {
          this.toastService.success('Cup deleted');
          this.router.navigate(['../']);
        });
    }
  }

  private loadCup(id: number) {
    this.cupService
      .getCup(id)
      .subscribe(cup => this.cup = cup);
  }

  private loadTypes() {
    this.tournamentService
      .getTournamentTypes()
      .subscribe(types => this.types = types);
  }
}
