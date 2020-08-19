import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfoModalService {

  constructor(
    private http: HttpClient,
  ) { }

  public getAllInfo(userid: string): Observable<{msg: string, uname: string, avatar: string, mail: string, phoneno: string }> {
    const form = new FormData();
    form.set('userId', userid);
    return this.http.post<any>(environment.baseUrl + 'userinfo/get-all/', form);
  }
}
