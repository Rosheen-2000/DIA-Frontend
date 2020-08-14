import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DocItemService {

  constructor(
    private http: HttpClient
  ) { }

  public rename(docid: string, title: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('docid', docid);
    form.set('title', title);
    return this.http.post<{ msg: string }>(environment.baseUrl + 'doc/modifydoctitle/', form);
  }
  public deleteDoc(did: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('did', did);
    return this.http.post<{ msg: string }>(environment.baseUrl + 'doc/deletedoc/', form);
  }

  public recoveryDoc(did: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('did', did);
    return this.http.post<{ msg: string }>(environment.baseUrl + 'doc/recoverdoc/', form);
  }

  public confirmDeleteDoc(did: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('did', did);
    return this.http.post<{ msg: string }>(environment.baseUrl + 'doc/deletedocconfirm/', form);
  }
}
