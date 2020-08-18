import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {

  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  public getBasicInfo(uid: string): Observable<{ msg: string, uname: string, avatar: string }> {
    const form = new FormData();
    form.set('uid', uid);
    return this.http.post<{
      msg: string, uname: string, avatar: string
    }>(this.baseUrl + 'userinfo/basic/', form);
  }

  public getUserInfo(uid: string): Observable<{
    msg: string; uname: string, avatar: string; mail: string; phoneno: string
  }> {
    const form = new FormData();
    form.set('uid', uid);
    return this.http.post<{
      msg: string; uname: string, avatar: string; mail: string; phoneno: string
    }> (this.baseUrl + 'userinfo/all/', form);
  }

  public checkOwn(uid: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('uid', uid);
    return this.http.post<{ msg: string }> (this.baseUrl + 'userinfo/checkown/', form);
  }

  // ? 待确认是否需要
  // public getMyId(): Observable<{ msg:string, userid: string }> {
  //   return this.
  // }

  public changePwd(currentpwd: string, newpwd: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('currentpwd', currentpwd);
    form.set('newpwd', newpwd);
    return this.http.post<{ msg: string }> (this.baseUrl + 'userinfo/changepwd/', form);
  }

  public changeAvatar(newavatar: string): Observable<{ msg:string }> {
    console.log(newavatar);
    const form = new FormData();
    form.set('newavatar', newavatar);
    return this.http.post<{ msg: string }> (this.baseUrl + 'userinfo/changeavatar/', form);
  }

  public changeMail(newmail: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('newmail', newmail);
    return this.http.post<{ msg: string }> (this.baseUrl + 'userinfo/changemail/', form);
  }

  public changePhoneNo(newphoneno: string): Observable<{ msg: string }> {
    const form = new FormData();
    console.log(newphoneno);
    form.set('newphoneno', newphoneno);
    return this.http.post<{ msg: string }> (this.baseUrl + 'userinfo/changephoneno/', form);
  }

}
