import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamSettingService {

  constructor(
    private http: HttpClient,
  ) { }

  public getInfo(teamId: string): Observable<{
    teamname: string,
    creatorname: string,
    creatoravatar: string,
    createtime: string,
    member: { uid: string, uname: string, useravatar: string}[]
  }> {
    const params = new HttpParams().set('teamid', teamId);
    console.log('团队' + teamId);
    return this.http.get<any>(environment.baseUrl + 'team/getinfo', {params});
  }

  public destroyTeam(teamid: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('teamid', teamid);
    return this.http.post<any>(environment.baseUrl + 'team/disband/', form);
  }

  public search(username: string): Observable<{ username: string, avatar: string, userid: string }> {
    const params = new HttpParams().set('username', username);
    return this.http.get<{ username: string, avatar: string, userid: string }>(environment.baseUrl + 'user/getlistbyname', {params});
  }

  public addMember(teamid: string, uid: string): Observable<{msg: string}> {
    const form = new FormData();
    form.set('teamid', teamid);
    form.set('uid', uid);
    return this.http.post<any>(environment.baseUrl + 'team/invite', form);
  }

  public removeMember(teamid: string, uid: string): Observable<{msg: string}> {
    const form = new FormData();
    form.set('teamid', teamid);
    form.set('uid', uid);
    return this.http.post<any>(environment.baseUrl + 'team/removeuser', form);
  }
}
