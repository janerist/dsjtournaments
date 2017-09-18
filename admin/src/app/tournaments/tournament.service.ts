import {Injectable} from '@angular/core';
import {ApiBaseService} from '../common/services/api-base.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {TournamentTypeWithCountResponseModel, TournamentResponseModel} from './tournament-models';
import {Http, URLSearchParams} from '@angular/http';
import {PagedResponse} from '../common/models';

@Injectable()
export class TournamentService extends ApiBaseService {
  constructor(http: Http) {
    super(http);
  }

  getTournamentTypes(): Observable<TournamentTypeWithCountResponseModel[]> {
    return this.http
      .get(`${environment.apiUrl}/tournaments/typeswithcount`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getTournaments(page: number, pageSize: number, sort: string): Observable<PagedResponse<TournamentResponseModel>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    params.append('sort', sort);

    return this.http
      .get(`${environment.apiUrl}/tournaments`, {search: params})
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteTournament(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/tournaments/${id}`)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
