import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesktopService {

  constructor(
    private http: HttpClient
  ) { }

  public getDesktopFile(): Observable<{ id: string, name: string, starred: string }[]> {
    return this.http.get<{ id: string, name: string, starred: string }[]>(environment.baseUrl + 'doc/desktop/file');
  }

  public getDesktopFolder(spaceId: string): Observable<{ name: string, id: string}[]> {
    return this.http.get<{ name: string, id: string}[]>(environment.baseUrl + 'doc/desktop/folder');
  }
}
