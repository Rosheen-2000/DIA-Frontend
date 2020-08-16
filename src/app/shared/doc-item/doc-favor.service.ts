import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocFavorService {

  constructor(
    private http: HttpClient,
  ) { }

  public favorDoc(did: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('did', did);
    return this.http.post<{ msg: string }>(environment.baseUrl + 'doc/favordoc/', form);
  }

  public unFavorDoc(did: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('did', did);
    return this.http.post<{ msg: string }>(environment.baseUrl + 'doc/unfavordoc/', form);
  }
}
