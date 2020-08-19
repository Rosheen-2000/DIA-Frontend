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
    console.log('getting message');
    return this.http.get<any>(environment.baseUrl + 'message/getall/');
  }

  public changeStatus(mid: string, isread: boolean): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('mid', mid);
    form.set('isread', isread.toString());
    return this.http.post<{ msg: string }> (environment.baseUrl + 'message/changestatus/', form)
  }
}
