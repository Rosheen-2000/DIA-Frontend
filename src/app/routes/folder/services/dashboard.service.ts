import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

  public getFiles(rootType: string): Observable<{ id: string, name: string }[]> {
    return this.http.get<{ id: string, name: string }[]>(environment.baseUrl + 'doc/' + rootType + '/file/');
  }
}
