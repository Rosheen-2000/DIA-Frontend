import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SitemessageService {

  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  public getUnreadNum(): Observable<{ num: number }> {
    return this.http.get<{ num: number }> ( this.baseUrl + 'message/unreadnum/');
  }

  public getMyMessages(): Observable<{ 
    mid: string, msgtype: number, isread: boolean, content: string, teamid: string, docid: string, createtime: string
  }[]> {
    return this.http.get<{ 
      mid: string, msgtype: number, isread: boolean, content: string, teamid: string, docid: string, createtime: string
    }[]> (
      this.baseUrl + 'message/getall/'
    );
  }

  public getRealTimeMessage(): Observable<{ 
    basicmsg: number, mid: string, msgtype: number, content: string, 
    teamid: string, docid: string, createtime: string,
  }> {
    console.log('拉取实时信息');   
    return this.http.get<{
      basicmsg: number, mid: string, msgtype: number, content: string, 
      teamid: string, docid: string, createtime: string,
    }>(environment.baseUrl + 'message/online-message/');
  }

  public getOfflineMsgNum(): Observable<{ basicmsg: number, num: number }> {
    console.log('拉取下线期间消息数');    
    return this.http.get<{ basicmsg: number, num: number }>(environment.baseUrl + 'message/offline-message/');
  }

}
