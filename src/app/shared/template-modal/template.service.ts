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

  public getAllTemplate(): Observable<{ name: string, id: string }[]> {
    return this.http.get<{ name: string, id: string }[]>(environment.baseUrl + 'template/getall');
  }

  public newDoc(title: string, template: string): Observable<{ msg: string, docid: string }> {
    const form = new FormData();
    form.set('title', title);
    form.set('template', template);
    return this.http.post<{ msg: string, docid: string }>(environment.baseUrl + 'doc/newdoc/', form);
  }
}
