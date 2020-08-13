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
    }>(this.baseUrl + 'checkuserinfo/basic/', form);
  }

  

}
