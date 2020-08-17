import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DocService {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  public getDocument(docId: string): Observable<{ Title: string, Content: string, starred: boolean, isTeamDoc: boolean}> {
    const form = new FormData();
    form.set('_docid', docId);
    // const params = new HttpParams().set('_docid', docId);
    return this.http.post<{ Title: string, Content: string , starred: boolean, isTeamDoc: boolean}> (
      this.baseUrl + 'doc/getdoccontent/', form);
    // return {
    //   Title: docId + 'Title',
    //   Content: '<h1>标题一</h1>'
    // };
  }

  public modifyTitle(docid: string, title: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('docid', docid);
    form.set('title', title);
    return this.http.post<{ msg: string }> (
      this.baseUrl + 'doc/modifydoctitle/', form);
  }

  public modifyContent(docid: string, content: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('did', docid);
    form.set('content', content);
    return this.http.post<{ msg: string }> (
      this.baseUrl + 'doc/modifydoccontent/', form);
  }

  public deleteDoc(docid: string): Observable<{ msg: string }> {
    const form = new FormData();
    form.set('did', docid);
    return this.http.post<{ msg: string }> (
      this.baseUrl + 'doc/deletedoc/', form);
  }

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
