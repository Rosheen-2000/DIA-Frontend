import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(
    private http: HttpClient,
  ) { }

  public getMessageNum(): Observable<{ num: number }> {
    return this.http.get<any>(environment.baseUrl + 'message/unreadnum');
  }
}
