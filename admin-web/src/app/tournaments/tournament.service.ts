import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {TournamentTypeWithCountResponseModel, TournamentResponseModel} from './tournament-models';
import {PagedResponse} from '../common/models';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class TournamentService {
  private http = inject(HttpClient);

  getTournamentTypes(): Observable<TournamentTypeWithCountResponseModel[]> {
    return this.http
      .get<TournamentTypeWithCountResponseModel[]>(`${environment.apiUrl}/tournaments/typeswithcount`);
  }

  getTournaments(page: number, pageSize: number, sort: string): Observable<PagedResponse<TournamentResponseModel>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sort', sort);

    return this.http
      .get<PagedResponse<TournamentResponseModel>>(`${environment.apiUrl}/tournaments`, {params});
  }

  deleteTournament(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/tournaments/${id}`);
  }
}
