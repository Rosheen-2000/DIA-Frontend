import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpacesService {
  constructor(
    private http: HttpClient,
  ) { }

  public getSpaces(): Observable<{ teamlist: {teamid: string, teamname: string}[]}> {
    return this.http.post<{ teamlist: {teamid: string, teamname: string}[]}>(environment.baseUrl + 'team/getlist/', null);
  }

  public createTeam(teamname: string): Observable<{ msg: string, teamid: string }> {
    const form = new FormData();
    form.set('teamname', teamname);
    return this.http.post<{ msg: string, teamid: string }>(environment.baseUrl + 'team/create/', form);
  }
}
