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

  public getDocument(docId: string): Observable<{ Title: string, Content: string }> {
    const params = new HttpParams().set('_docid', docId);
    return this.http.get<{ Title: string, Content: string }> (
      this.baseUrl + 'doc/getdoccontent', { params });
    // return {
    //   Title: docId + 'Title',
    //   Content: '<h1>标题一</h1>'
    // };
  }

  public newDocument(uid: string, title: string, content: string): Observable<{ msg: string, docid: string }> {
    return this.http.post<{ msg: string, docid: string }> (
      this.baseUrl + 'doc/newdoc/', {
        uid,
        title,
        content
      });
  }

  public modifyTitle(uid: string, docid: string, title: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }> (
      this.baseUrl + 'doc/modifydoctitle/', {
        uid,
        docid,
        title
      });
  }

  public modifyContent(uid: string, docid: string, content: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }> (
      this.baseUrl + 'doc/modifydoccontent/', {
        uid,
        docid,
        content
      });
  }

  public deleteDoc(uid: string, docid: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }> (
      this.baseUrl + 'doc/deletedoc/', {
        uid,
        docid
      }
    );
  }

  public



}
