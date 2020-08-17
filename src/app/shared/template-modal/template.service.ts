import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpClient) {
  }

  public getAllTemplate(): Observable<{templates: { name: string, id: string }[]}> {
    return this.http.get<any>(environment.baseUrl + 'template/getall/');
  }

  public newDoc(title: string, template: string, foldId: string, spaceId: string): Observable<{ msg: string, docid: string }> {
    const form = new FormData();
    form.set('title', title);
    form.set('template', template);
    form.set('foldId', foldId);
    form.set('spaceId', spaceId);
    return this.http.post<{ msg: string, docid: string }>(environment.baseUrl + 'doc/newdoc/', form);
  }
}
