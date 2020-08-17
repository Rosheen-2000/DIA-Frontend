import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  public newTeam(teamname: string, initmember: string[]): Observable<{ msg: string, teamid: string }> {
    const form = new FormData();
    form.set('teamname', teamname);
    form.set('initmember', initmember.toString());
    return this.http.post<{
      msg: string, teamid: string
    }>(this.baseUrl + 'team/create/', form);
  }

  public disbandTeam(teamid: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('teamid', teamid);
    return this.http.post<{
      msg: string
    }>(this.baseUrl + 'team/disband/', form);
  }

  public getTeamList(): Observable<{ teamid: string, teamname: string }[]> {
    return this.http.get<{ teamid: string, teamname: string }[]>(environment.baseUrl + 'team/getlist/');
  }

  public getTeamInfo(teamid: string): Observable<{
    teamname: string, creatorname: string, creatoravatar: string, createtime: string, 
    member: {uid: string, uname: string, useravatar: string}[] 
  }> {
    const params = new HttpParams().set('teamid', teamid);
    return this.http.get<{
      teamname: string, creatorname: string, creatoravatar: string, createtime: string, 
      member: {uid: string, uname: string, useravatar: string}[] 
    }>(this.baseUrl + 'team/getinfo/', { params });
  }

  public getTeamListByName(keyword: string): Observable<{
    teamid: string, teamname: string, creatorname: string, creatoravatar: string
  }[]> {
    const params = new HttpParams().set('teamname', keyword);
    return this.http.get<{
      teamid: string, teamname: string, creatorname: string, creatoravatar: string
    }[]>(this.baseUrl + 'team/getlistbyname/', { params });
  }

  public applyToJoin(teamid: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('teamid', teamid);
    return this.http.post<{
      msg: string
    }>(this.baseUrl + 'team/apply/', form);
  }

  // TODO 处理入队申请的实现
  // public handleApply(): Observable<{}> {

  // }

  public getUserByName(username: string): Observable<{ username: string, avatar: string, userid: string }> {
    const params = new HttpParams().set('username', username);
    return this.http.get<{
      username: string, avatar: string, userid: string
    }>(this.baseUrl + 'user/getlistbyname/', { params });
  }

  public inviteUser(teamid: string, uid: string[]): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('teamid', teamid);
    form.set('uid', uid.toString());
    return this.http.post<{
      msg: string
    }>(this.baseUrl + 'team/invite/', form);
  }

  // TODO 处理入队邀请的实现
  // public handleInvite(): Observable<> {

  // }

  public removeMember(teamid: string, uid: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('teamid', teamid);
    form.set('uid', uid);
    return this.http.post<{
      msg: string
    }>(this.baseUrl + 'team/removeuser/', form);
  }

}
