import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpClient,
  ) {
  }

  public getMessage(): Observable<{
    msgs: {
      mid: string,
      msgtype: number,
      isread: boolean,
      content: string,
      teamid: string,
      docid: string,
      createtime: string,
    }[]
  }> {
    return this.http.get<any>(environment.baseUrl + 'message/getall');
  }
}
