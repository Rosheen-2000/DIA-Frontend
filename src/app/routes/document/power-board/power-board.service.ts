import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PowerBoardService {

  constructor(
    private http: HttpClient,
  ) { }

  public getCollaborators(docid: string): Observable<{
    level1: {username: string, avatar: string}[],
    level2: {username: string, avatar: string}[],
    level3: {username: string, avatar: string}[],
    level4: {username: string, avatar: string}[],
  }> {
    const params = new HttpParams().set('docid', docid);
    return this.http.get<{
      level1: {username: string, avatar: string}[],
      level2: {username: string, avatar: string}[],
      level3: {username: string, avatar: string}[],
      level4: {username: string, avatar: string}[],
    }>(environment.baseUrl + 'doc/get-power', {params});
  }

  public getPower(docid: string): Observable<{ userPower: number, shareProperty: number}> {
    const params = new HttpParams().set('docid', docid);
    return this.http.get<{ userPower: number, shareProperty: number}>(environment.baseUrl + 'doc/get-power', {params});
  }

  public setShareOption(docid: string, shareOption: number): Observable<any> {
    const form = new FormData();
    form.set( 'dodid', docid);
    form.set('shareOption', shareOption + '');
    return this.http.post(environment.baseUrl + 'doc/set-share-option', form);
  }

  public setPower(docid: string, username: string, power: number): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('username', username);
    form.set('docid', docid);
    form.set('power', power + '');
    return this.http.post<{ msg: string }>(environment.baseUrl + 'doc/set-power', form);
  }
}
