import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {JumperResponseModel, JumperUpdateModel, JumperMergeRequestModel} from './jumper-models';
import {Observable} from 'rxjs';
import {PagedResponse} from '../common/models';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class JumperService {

  constructor(private httpClient: HttpClient) {
  }

  getJumpers(q: string, page: number, pageSize: number, sort?: string): Observable<PagedResponse<JumperResponseModel>> {
    let params = new HttpParams();
    if (q) {
      params = params.append('q', q);
    }
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());

    if (sort) {
      params = params.append('sort', sort);
    }

    return this.httpClient
      .get<PagedResponse<JumperResponseModel>>(`${environment.apiUrl}/jumpers`, { params });
  }

  updateJumper(id: number, model: JumperUpdateModel): Observable<JumperResponseModel> {
    return this.httpClient
      .put<JumperResponseModel>(`${environment.apiUrl}/jumpers/${id}`, model);
  }

  mergeJumpers(model: JumperMergeRequestModel): Observable<JumperResponseModel> {
    return this.httpClient
      .post<JumperResponseModel>(`${environment.apiUrl}/jumpers/merge`, model);
  }
}
