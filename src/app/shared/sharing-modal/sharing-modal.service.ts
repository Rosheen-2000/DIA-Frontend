import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharingModalService {

  constructor(
    private http: HttpClient,
  ) { }

  public getPower(docid: string): Observable<{ userPower: number, shareProperty: number }> {
    const params = new HttpParams().set('docid', docid);
    return this.http.get<any>(environment.baseUrl + 'doc/get-power', {params});
  }
}
