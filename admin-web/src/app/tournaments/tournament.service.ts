import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {TournamentTypeResponseModel, TournamentResponseModel} from './tournament-models';
import {PagedResponse} from '../common/models';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class TournamentService {
  constructor(private http: HttpClient) {
  }

  getTournamentTypes(): Observable<TournamentTypeResponseModel[]> {
    return this.http
      .get<TournamentTypeResponseModel[]>(`${environment.apiUrl}/tournaments/types`);
  }

  getTournaments(page: number, pageSize: number, sort: string): Observable<PagedResponse<TournamentResponseModel>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sort', sort);

    return this.http
      .get<PagedResponse<TournamentResponseModel>>(`${environment.apiUrl}/tournaments`, {params: params});
  }

  deleteTournament(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/tournaments/${id}`);
  }
}
